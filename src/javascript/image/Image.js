/**
 * Image.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define("moxie/image/Image", [
	"moxie/core/utils/Basic",
	"moxie/core/utils/Dom",
	"moxie/core/utils/Env",
	"moxie/core/EventTarget",
	"moxie/file/BlobRef",
	"moxie/file/FileRef",
	"moxie/core/utils/Encode",
	"moxie/image/ImageInfo",
	"moxie/image/ResizerCanvas"
], function(Basic, Dom, Env, EventTarget, BlobRef, FileRef, Encode, ImageInfo, ResizerCanvas) {
	/**
	Image preloading and manipulation utility. Additionally it provides access to image meta info (Exif, GPS) and raw binary data.

	@class moxie/image/Image
	@constructor
	@extends EventTarget
	*/
	var dispatches = [
		'progress',

		/**
		Dispatched when loading is complete.

		@event load
		@param {Object} event
		*/
		'load',

		'error',

		/**
		Dispatched when resize operation is complete.

		@event resize
		@param {Object} event
		*/
		'resize',

		/**
		Dispatched when visual representation of the image is successfully embedded
		into the corresponsing container.

		@event embedded
		@param {Object} event
		*/
		'embedded'
	];

	function Image() {
		var _img, _imgInfo, _canvas, _binStr, _blob;
		var _modified = false; // is set true whenever image is modified
		var _preserveHeaders = true;

		Basic.extend(this, {
			/**
			Unique id of the component

			@property uid
			@type {String}
			*/
			uid: Basic.guid('uid_'),

			/**
			Name of the file, that was used to create an image, if available. If not equals to empty string.

			@property name
			@type {String}
			@default ""
			*/
			name: "",

			/**
			Size of the image in bytes. Actual value is set only after image is preloaded.

			@property size
			@type {Number}
			@default 0
			*/
			size: 0,

			/**
			Width of the image. Actual value is set only after image is preloaded.

			@property width
			@type {Number}
			@default 0
			*/
			width: 0,

			/**
			Height of the image. Actual value is set only after image is preloaded.

			@property height
			@type {Number}
			@default 0
			*/
			height: 0,

			/**
			Mime type of the image. Currently only image/jpeg and image/png are supported. Actual value is set only after image is preloaded.

			@property type
			@type {String}
			@default ""
			*/
			type: "",

			/**
			Holds meta info (Exif, GPS). Is populated only for image/jpeg. Actual value is set only after image is preloaded.

			@property meta
			@type {Object}
			@default {}
			*/
			meta: {},

			/**
			Alias for load method, that takes another moxie.image.Image object as a source (see load).

			@method clone
			@param {Image} src Source for the image
			@param {Boolean} [exact=false] Whether to activate in-depth clone mode
			*/
			clone: function() {
				this.load.apply(this, arguments);
			},

			/**
			Loads image from various sources. Currently the source for new image can be: moxie.image.Image,
			moxie.file.BlobRef/moxie.file.FileRef, native Blob/File, dataUrl or URL. Depending on the type of the
			source, arguments - differ. When source is URL, Image will be downloaded from remote destination
			and loaded in memory.

			@example
				var img = new moxie.image.Image();
				img.onload = function() {
					var blob = img.getAsBlob();

					var formData = new moxie.xhr.FormData();
					formData.append('file', blob);

					var xhr = new moxie.xhr.XMLHttpRequest();
					xhr.onload = function() {
						// upload complete
					};
					xhr.open('post', 'upload.php');
					xhr.send(formData);
				};
				img.load("http://www.moxiecode.com/images/mox-logo.jpg"); // notice file extension (.jpg)


			@method load
			@param {Image|Blob|File|String} src Source for the image
			@param {Boolean|Object} [mixed]
			*/
			load: function() {
				_load.apply(this, arguments);
			},


			/**
			Resizes the image to fit the specified width/height. If crop is specified, image will also be
			cropped to the exact dimensions.

			@method resize
			@since 3.0
			@param {Object} options
				@param {Number} options.width Resulting width
				@param {Number} [options.height=width] Resulting height (optional, if not supplied will default to width)
				@param {String} [options.type='image/jpeg'] MIME type of the resulting image
				@param {Number} [options.quality=90] In the case of JPEG, controls the quality of resulting image
				@param {Boolean} [options.crop='cc'] If not falsy, image will be cropped, by default from center
				@param {Boolean} [options.fit=true] Whether to upscale the image to fit the exact dimensions
				@param {Boolean} [options.preserveHeaders=true] Whether to preserve meta headers (on JPEGs after resize)
				@param {String} [options.resample='default'] Resampling algorithm to use during resize
				@param {Boolean} [options.multipass=true] Whether to scale the image in steps (results in better quality)
			*/
			resize: function(options) {
				var self = this;
				var orientation;
				var scale;

				var srcRect = {
					x: 0,
					y: 0,
					width: self.width,
					height: self.height
				};

				var opts = Basic.extendIf({
					width: self.width,
					height: self.height,
					type: self.type || 'image/jpeg',
					quality: 90,
					crop: false,
					fit: true,
					preserveHeaders: true,
					resample: 'default',
					multipass: true
				}, options);

				try {
					if (!self.size) { // only preloaded image objects can be used as source
						throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
					}

					// no way to reliably intercept the crash due to high resolution, so we simply avoid it
					if (self.width > Image.MAX_RESIZE_WIDTH || self.height > Image.MAX_RESIZE_HEIGHT) {
						throw new x.ImageError(x.ImageError.MAX_RESOLUTION_ERR);
					}

					// take into account orientation tag
					orientation = (self.meta && self.meta.tiff && self.meta.tiff.Orientation) || 1;

					if (Basic.inArray(orientation, [5,6,7,8]) !== -1) { // values that require 90 degree rotation
						var tmp = opts.width;
						opts.width = opts.height;
						opts.height = tmp;
					}

					if (opts.crop) {
						scale = Math.max(opts.width/self.width, opts.height/self.height);

						if (options.fit) {
							// first scale it up or down to fit the original image
							srcRect.width = Math.min(Math.ceil(opts.width/scale), self.width);
							srcRect.height = Math.min(Math.ceil(opts.height/scale), self.height);

							// recalculate the scale for adapted dimensions
							scale = opts.width/srcRect.width;
						} else {
							srcRect.width = Math.min(opts.width, self.width);
							srcRect.height = Math.min(opts.height, self.height);

							// now we do not need to scale it any further
							scale = 1;
						}

						if (typeof(opts.crop) === 'boolean') {
							opts.crop = 'cc';
						}

						switch (opts.crop.toLowerCase().replace(/_/, '-')) {
							case 'rb':
							case 'right-bottom':
								srcRect.x = self.width - srcRect.width;
								srcRect.y = self.height - srcRect.height;
								break;

							case 'cb':
							case 'center-bottom':
								srcRect.x = Math.floor((self.width - srcRect.width) / 2);
								srcRect.y = self.height - srcRect.height;
								break;

							case 'lb':
							case 'left-bottom':
								srcRect.x = 0;
								srcRect.y = self.height - srcRect.height;
								break;

							case 'lt':
							case 'left-top':
								srcRect.x = 0;
								srcRect.y = 0;
								break;

							case 'ct':
							case 'center-top':
								srcRect.x = Math.floor((self.width - srcRect.width) / 2);
								srcRect.y = 0;
								break;

							case 'rt':
							case 'right-top':
								srcRect.x = self.width - srcRect.width;
								srcRect.y = 0;
								break;

							case 'rc':
							case 'right-center':
							case 'right-middle':
								srcRect.x = self.width - srcRect.width;
								srcRect.y = Math.floor((self.height - srcRect.height) / 2);
								break;


							case 'lc':
							case 'left-center':
							case 'left-middle':
								srcRect.x = 0;
								srcRect.y = Math.floor((self.height - srcRect.height) / 2);
								break;

							case 'cc':
							case 'center-center':
							case 'center-middle':
							default:
								srcRect.x = Math.floor((self.width - srcRect.width) / 2);
								srcRect.y = Math.floor((self.height - srcRect.height) / 2);
						}

						// original image might be smaller than requested crop, so - avoid negative values
						srcRect.x = Math.max(srcRect.x, 0);
						srcRect.y = Math.max(srcRect.y, 0);
					} else {
						scale = Math.min(opts.width/self.width, opts.height/self.height);

						// do not upscale if we were asked to not fit it
						if (scale > 1 && !opts.fit) {
							scale = 1;
						}
					}

					_resize.call(self, srcRect, scale, opts);
				} catch(ex) {
					// for now simply trigger error event
					self.trigger('error', ex.code);
				}
			},

			/**
			Downsizes the image to fit the specified width/height. If crop is supplied, image will be cropped to exact dimensions.

			@method downsize
			@deprecated use resize()
			*/
			downsize: function(options) {
				var defaults = {
					width: this.width,
					height: this.height,
					type: this.type || 'image/jpeg',
					quality: 90,
					crop: false,
					fit: false,
					preserveHeaders: true,
					resample: 'default'
				}, opts;

				if (typeof(options) === 'object') {
					opts = Basic.extend(defaults, options);
				} else {
					// for backward compatibility
					opts = Basic.extend(defaults, {
						width: arguments[0],
						height: arguments[1],
						crop: arguments[2],
						preserveHeaders: arguments[3]
					});
				}

				this.resize(opts);
			},

			/**
			Alias for downsize(width, height, true). (see downsize)

			@method crop
			@param {Number} width Resulting width
			@param {Number} [height=width] Resulting height (optional, if not supplied will default to width)
			@param {Boolean} [preserveHeaders=true] Whether to preserve meta headers (on JPEGs after resize)
			*/
			crop: function(width, height, preserveHeaders) {
				this.downsize(width, height, true, preserveHeaders);
			},

			getAsCanvas: function() {
				if (!_canvas) {
					_canvas = _getCanvas();
				}
				_canvas.id = this.uid + '_canvas';
				return _canvas;
			},

			/**
			Retrieves image in it's current state as moxie.file.Blob object. Cannot be run on empty or image in progress (throws
			DOMException.INVALID_STATE_ERR).

			@method getAsBlob
			@param {String} [type="image/jpeg"] Mime type of resulting blob. Can either be image/jpeg or image/png
			@param {Number} [quality=90] Applicable only together with mime type image/jpeg
			@return {Blob} Image as Blob
			*/
			getAsBlob: function(type, quality) {
				if (type !== this.type) {
					_modified = true; // reconsider the state
					return new FileRef(null, {
						name: _blob.name || '',
						type: type,
						data: this.getAsDataURL(type, quality)
					});
				}
				return new FileRef(null, {
					name: _blob.name || '',
					type: type,
					data: this.getAsBinaryString(type, quality)
				});
			},

			/**
			Retrieves image in it's current state as dataURL string. Cannot be run on empty or image in progress (throws
			DOMException.INVALID_STATE_ERR).

			@method getAsDataURL
			@param {String} [type="image/jpeg"] Mime type of resulting blob. Can either be image/jpeg or image/png
			@param {Number} [quality=90] Applicable only together with mime type image/jpeg
			@return {String} Image as dataURL string
			*/
			getAsDataURL: function(type) {
				var quality = arguments[1] || 90;

				// if image has not been modified, return the source right away
				if (!_modified) {
					return _img.src;
				}

				// make sure we have a canvas to work with
				_getCanvas();

				if ('image/jpeg' !== type) {
					return _canvas.toDataURL('image/png');
				} else {
					try {
						// older Geckos used to result in an exception on quality argument
						return _canvas.toDataURL('image/jpeg', quality/100);
					} catch (ex) {
						return _canvas.toDataURL('image/jpeg');
					}
				}
			},

			/**
			Retrieves image in it's current state as binary string. Cannot be run on empty or image in progress (throws
			DOMException.INVALID_STATE_ERR).

			@method getAsBinaryString
			@param {String} [type="image/jpeg"] Mime type of resulting blob. Can either be image/jpeg or image/png
			@param {Number} [quality=90] Applicable only together with mime type image/jpeg
			@return {String} Image as binary string
			*/
			getAsBinaryString: function(type, quality) {
				// if image has not been modified, return the source right away
				if (!_modified) {
					// if image was not loaded from binary string
					if (!_binStr) {
						_binStr = _toBinary(me.getAsDataURL(type, quality));
					}
					return _binStr;
				}

				if ('image/jpeg' !== type) {
					_binStr = _toBinary(this.getAsDataURL(type, quality));
				} else {
					var dataUrl;

					// if jpeg
					if (!quality) {
						quality = 90;
					}

					// make sure we have a canvas to work with
					_getCanvas();

					try {
						// older Geckos used to result in an exception on quality argument
						dataUrl = _canvas.toDataURL('image/jpeg', quality/100);
					} catch (ex) {
						dataUrl = _canvas.toDataURL('image/jpeg');
					}

					_binStr = _toBinary(dataUrl);

					if (_imgInfo) {
						_binStr = _imgInfo.stripHeaders(_binStr);

						if (_preserveHeaders) {
							// update dimensions info in exif
							if (_imgInfo.meta && _imgInfo.meta.exif) {
								_imgInfo.setExif({
									PixelXDimension: this.width,
									PixelYDimension: this.height
								});
							}

							// re-inject the headers
							_binStr = _imgInfo.writeHeaders(_binStr);
						}

						// will be re-created from fresh on next getInfo call
						_imgInfo.purge();
						_imgInfo = null;
					}
				}

				_modified = false;

				return _binStr;
			},

			/**
			Embeds a visual representation of the image into the specified node.

			@method embed
			@param {DOMElement} el DOM element to insert the image object into
			@param {Object} [options]
				@param {Number} [options.width] The width of an embed (defaults to the image width)
				@param {Number} [options.height] The height of an embed (defaults to the image height)
				@param {String} [options.type="image/jpeg"] Mime type
				@param {Number} [options.quality=90] Quality of an embed, if mime type is image/jpeg
				@param {Boolean} [options.crop=false] Whether to crop an embed to the specified dimensions
				@param {Boolean} [options.fit=true] By default thumbs will be up- or downscaled as necessary to fit the dimensions
			*/
			embed: function(el, options) {
				var self = this;

				var opts = Basic.extend({
					width: this.width,
					height: this.height,
					type: this.type || 'image/jpeg',
					quality: 90,
					fit: true,
					resample: 'nearest'
				}, options);


				function render(type, quality) {
					var img = this;

					// if possible, embed a canvas element directly
					if (Env.can('create_canvas')) {
						var canvas = img.getAsCanvas();
						if (canvas) {
							el.appendChild(canvas);
							canvas = null;
							img.destroy();
							self.trigger('embedded');
							return;
						}
					}

					var dataUrl = img.getAsDataURL(type, quality);
					if (!dataUrl) {
						throw new x.ImageError(x.ImageError.WRONG_FORMAT);
					}

					el.innerHTML = '<img src="' + dataUrl + '" width="' + img.width + '" height="' + img.height + '" alt="" />';
					img.destroy();
					self.trigger('embedded');
				}

				try {
					if (!(el = Dom.get(el))) {
						throw new Error('Embed container cannot be found in the DOM.');
					}

					if (!this.size) { // only preloaded image objects can be used as source
						throw new Error('Image should be preloaded, before it is emedded.');
					}

					var imgCopy = new Image();

					imgCopy.bind("Resize", function() {
						render.call(this, opts.type, opts.quality);
					});

					imgCopy.bind("Load", function() {
						this.downsize(opts);
					});

					// if embedded thumb data is available and dimensions are big enough, use it
					if (this.meta.thumb && this.meta.thumb.width >= opts.width && this.meta.thumb.height >= opts.height) {
						imgCopy.load(this.meta.thumb.data);
					} else {
						imgCopy.clone(this, false);
					}

					return imgCopy;
				} catch(ex) {
					// for now simply trigger error event
					this.trigger('error', ex.message);
				}
			},

			/**
			Properly destroys the image and frees resources in use. If any. Recommended way to dispose
			moxie.image.Image object.

			@method destroy
			*/
			destroy: function() {
				_purge.call(this);

				if (this.meta && this.meta.thumb) {
					// thumb is blob, make sure we destroy it first
					this.meta.thumb.data.destroy();
				}
				this.unbindAll();
			}
		});


		// this is here, because in order to bind properly, we need uid, which is created above
		this.handleEventProps(dispatches);

		this.bind('Load Resize', function() {
			return _updateInfo.call(this); // if operation fails (e.g. image is neither PNG nor JPEG) cancel all pending events
		}, 999);


		function _updateInfo(info) {
			try {
				if (!info) {
					info = this.exec('Image', 'getInfo');
				}

				this.size = info.size;
				this.width = info.width;
				this.height = info.height;
				this.type = info.type;
				this.meta = info.meta;

				// update file name, only if empty
				if (this.name === '') {
					this.name = info.name;
				}

				return true;
			} catch(ex) {
				this.trigger('error', ex.code);
				return false;
			}
		}


		function _load(src) {
			var srcType = Basic.typeOf(src);

			try {
				// if source is Image
				if (src instanceof Image) {
					if (!src.size) { // only preloaded image objects can be used as source
						throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
					}
					_loadFromImage.apply(this, arguments);
				}
				// if source is o.Blob/o.File
				else if (src instanceof BlobRef) {
					if (!~Basic.inArray(src.type, ['image/jpeg', 'image/png'])) {
						throw new Error("At the moment only image/jpeg and image/png are accepted.");
					}
					_loadFromBlob.apply(this, arguments);
				}
				// if native blob/file
				else if (Basic.inArray(srcType, ['blob', 'file']) !== -1) {
					_load.call(this, new File(null, src), arguments[1]);
				}
				// if String
				else if (srcType === 'string') {
					// if dataUrl String
					if (src.substr(0, 5) === 'data:') {
						_load.call(this, new Blob(null, { data: src }), arguments[1]); // TODO: require something like ImageResult here
					}
					// else assume Url, either relative or absolute
					else {
						_loadFromUrl.apply(this, arguments);
					}
				}
				// if source seems to be an img node
				else if (srcType === 'node' && src.nodeName.toLowerCase() === 'img') {
					_load.call(this, src.src, arguments[1]);
				}
				else {
					throw new Error("Incompatible source for the image supplied to Image.load().")
				}
			} catch(ex) {
				// for now simply trigger error event
				this.trigger('error', ex.message);
			}
		}


		function _loadFromBlob(blob) {
			var asBinary = arguments.length > 1 ? arguments[1] : true;

			_blob = blob;

			_readAsDataUrl.call(this, blob.getSource(), function(dataUrl) {
				if (asBinary) {
					_binStr = _toBinary(dataUrl);
				}
				_preload.call(this, dataUrl);
			});
		}

		function _loadFromImage(img) {
			this.meta = img.meta;

			_blob = new FileRef(null, {
				name: img.name,
				size: img.size,
				type: img.type
			});

			_preload.call(this, exact ? (_binStr = img.getAsBinaryString()) : img.getAsDataURL());
		}

		function _loadFromUrl(url, options) {
			var self = this, xhr;

			xhr = new XMLHttpRequest();

			xhr.open('get', url);
			xhr.responseType = 'blob';

			xhr.onprogress = function(e) {
				self.trigger(e);
			};

			xhr.onload = function() {
				_loadFromBlob.call(self, xhr.response, true);
			};

			xhr.onerror = function(e) {
				self.trigger(e);
			};

			xhr.onloadend = function() {
				xhr.destroy();
			};

			xhr.bind('RuntimeError', function(e, err) {
				self.trigger('RuntimeError', err);
			});

			xhr.send(null, options);
		}

		function _resize(rect, ratio, options) {
			var canvas = document.createElement('canvas');
			canvas.width = rect.width;
			canvas.height = rect.height;

			canvas.getContext("2d").drawImage(_getImg(), rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height);

			_canvas = ResizerCanvas.scale(canvas, ratio);

			_preserveHeaders = options.preserveHeaders;

			// rotate if required, according to orientation tag
			if (!_preserveHeaders) {
				var orientation = (this.meta && this.meta.tiff && this.meta.tiff.Orientation) || 1;
				_canvas = _rotateToOrientaion(_canvas, orientation);
			}

			this.width = _canvas.width;
			this.height = _canvas.height;

			_modified = true;

			this.trigger('Resize');
		}

		function _getImg() {
			if (!_canvas && !_img) {
				throw new x.ImageError(x.DOMException.INVALID_STATE_ERR);
			}
			return _canvas || _img;
		}


		function _getCanvas() {
			var canvas = _getImg();
			if (canvas.nodeName.toLowerCase() == 'canvas') {
				return canvas;
			}
			_canvas = document.createElement('canvas');
			_canvas.width = canvas.width;
			_canvas.height = canvas.height;
			_canvas.getContext("2d").drawImage(canvas, 0, 0);
			return _canvas;
		}


		function _toBinary(str) {
			return Encode.atob(str.substring(str.indexOf('base64,') + 7));
		}


		function _toDataUrl(str, type) {
			return 'data:' + (type || '') + ';base64,' + Encode.btoa(str);
		}


		function _preload(str) {
			var comp = this;

			_img = new Image();
			_img.onerror = function() {
				_purge.call(this);
				comp.trigger('error', x.ImageError.WRONG_FORMAT);
			};
			_img.onload = function() {
				comp.trigger('load');
			};

			_img.src = str.substr(0, 5) == 'data:' ? str : _toDataUrl(str, _blob.type);
		}


		function _readAsDataUrl(file, callback) {
			var comp = this, fr;

			// use FileReader if it's available
			if (window.FileReader) {
				fr = new FileReader();
				fr.onload = function() {
					callback.call(comp, this.result);
				};
				fr.onerror = function() {
					comp.trigger('error', x.ImageError.WRONG_FORMAT);
				};
				fr.readAsDataURL(file);
			} else {
				return callback.call(this, file.getAsDataURL());
			}
		}

		/**
		* Transform canvas coordination according to specified frame size and orientation
		* Orientation value is from EXIF tag
		* @author Shinichi Tomita <shinichi.tomita@gmail.com>
		*/
		function _rotateToOrientaion(img, orientation) {
			var RADIANS = Math.PI/180;
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			var width = img.width;
			var height = img.height;

			if (Basic.inArray(orientation, [5,6,7,8]) > -1) {
				canvas.width = height;
				canvas.height = width;
			} else {
				canvas.width = width;
				canvas.height = height;
			}

			/**
			1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
			2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
			3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
			4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
			5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
			6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
			7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
			8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
			*/
			switch (orientation) {
				case 2:
					// horizontal flip
					ctx.translate(width, 0);
					ctx.scale(-1, 1);
					break;
				case 3:
					// 180 rotate left
					ctx.translate(width, height);
					ctx.rotate(180 * RADIANS);
					break;
				case 4:
					// vertical flip
					ctx.translate(0, height);
					ctx.scale(1, -1);
					break;
				case 5:
					// vertical flip + 90 rotate right
					ctx.rotate(90 * RADIANS);
					ctx.scale(1, -1);
					break;
				case 6:
					// 90 rotate right
					ctx.rotate(90 * RADIANS);
					ctx.translate(0, -height);
					break;
				case 7:
					// horizontal flip + 90 rotate right
					ctx.rotate(90 * RADIANS);
					ctx.translate(width, -height);
					ctx.scale(-1, 1);
					break;
				case 8:
					// 90 rotate left
					ctx.rotate(-90 * RADIANS);
					ctx.translate(-width, 0);
					break;
			}

			ctx.drawImage(img, 0, 0, width, height);
			return canvas;
		}


		function _purge() {
			if (_imgInfo) {
				_imgInfo.purge();
				_imgInfo = null;
			}

			_binStr = _img = _canvas = _blob = null;
			_modified = false;
		}
	}

	Image.prototype = EventTarget.instance;

	return Image;
});
