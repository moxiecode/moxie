/**
 * Image.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true, laxcomma:true */
/*global define:true */

define("moxie/image/Image", [
		"moxie/core/utils/Basic",
		"moxie/core/utils/Dom",
		"moxie/core/Exceptions",
		"moxie/file/FileReaderSync",
		"moxie/xhr/XMLHttpRequest",
		"moxie/runtime/RuntimeClient",
		"moxie/runtime/Transporter",
		"moxie/core/utils/Env",
		"moxie/core/EventTarget",
		"moxie/file/Blob",
		"moxie/core/utils/Url",
		"moxie/core/utils/Encode",
		"moxie/core/JSON"
], function(Basic, Dom, x, FileReaderSync, XMLHttpRequest, RuntimeClient, Transporter, Env, EventTarget, Blob, Url, Encode, parseJSON) {
	/**
	Image preloading and manipulation utility. Additionally it provides access to image meta info (Exif, GPS) and raw binary data.

	@class Image
	@constructor
	@extends EventTarget
	*/
	var dispatches = [
		'loadstart',
		'progress',

		/**
		Dispatched when loading is complete.

		@event load
		@param {Object} event
		*/
		'load',

		'error',

		'loadend',

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
		var self = this;
			
		RuntimeClient.call(this);
		
		Basic.extend(this, {
			/**
			Unique id of the component

			@property uid
			@type {String}
			*/
			uid: Basic.guid('uid_'),

			/**
			Unique id of the connected runtime, if any.

			@property ruid
			@type {String}
			*/
			ruid: null,
			
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
			Alias for load method, that takes another mOxie.Image object as a source (see load).

			@method clone
			@param {Image} src Source for the image
			@param {Boolean} [exact=false] Whether to activate in-depth clone mode
			*/
			clone: function() {
				this.load.apply(this, arguments);
			},

			/**
			Loads image from various sources. Currently the source for new image can be: mOxie.Image, mOxie.Blob/mOxie.File or URL.
			Depending on the type of the source, arguments - differ.

			When source is:
			  - mOxie.Image: Loads image from another existing mOxie.Image object (clones it). Might be fast by default (surface clone),
				or a bit slower, if launched in exact mode (in-depth clone). Only exact mode (enabled by passing second argument
				as - true) will copy over meta info, like Exif, GPS, IPTC data, etc.
			  - mOxie.Blob/mOxie.File: Loads image from mOxie.File or mOxie.Blob object.
			  - URL: Image will be downloaded from remote destination and loaded in memory.

			When source is URL, Image will be downloaded from remote destination and loaded in memory.

			@example
				var img = new mOxie.Image();
				img.onload = function() {
					var blob = img.getAsBlob();
					
					var formData = new mOxie.FormData();
					formData.append('file', blob);

					var xhr = new mOxie.XMLHttpRequest();
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
			load: function(src) {
				var el, args = [].slice.call(arguments);

				this.bind('Load', function(e, info) {
					_updateInfo.call(this, info);
				}, 999);

				this.convertEventPropsToHandlers(dispatches);

				try {
					// if source is Image
					if (src instanceof Image) {
						if (!src.size) { // only preloaded image objects can be used as source
							throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
						}
						_loadFromImage.apply(this, args);
					}
					// if source is Blob/File
					else if (src instanceof Blob) {
						if (!~Basic.inArray(src.type, ['image/jpeg', 'image/png'])) {
							throw new x.ImageError(x.ImageError.WRONG_FORMAT);
						}
						_loadFromBlob.apply(this, args);
					}
					// if source looks like Url
					else if (Basic.typeOf(src) === 'string' && /^http:\/\//.test(src)) {
						_loadFromUrl.apply(this, args);
					}
					// if source seems to be an img node
					else if ((el = Dom.get(src)) && el.nodeName === 'img') {
						args.unshift(Url.resolveUrl(el.src));
						_loadFromUrl.apply(this, args);
					}
					else {
						throw new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);
					}
				} catch(ex) {
					// for now simply trigger error event
					self.trigger('error');
				}
			},

			/**
			Resizes the image to fit the specified width/height. If crop is supplied, image will be cropped to exact dimensions.

			@method resize
			@param {Number} width Resulting width
			@param {Number} [height=width] Resulting height (optional, if not supplied will default to width)
			@param {Boolean} [crop=false] Whether to crop the image to exact dimensions
			@param {Boolean} [preserveHeaders=true] Whether to preserve meta headers (on JPEGs after resize)
			*/
			resize: function(width, height, crop, preserveHeaders) {
				var runtime;

				if (!this.size) { // only preloaded image objects can be used as source
					throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
				}

				if (!width) {
					throw new x.DOMException(x.DOMException.SYNTAX_ERR);
				}

				if (!height) {
					height = width;
				}

				crop = (crop === undefined ? false : !!crop);
				preserveHeaders = (preserveHeaders === undefined ? true : !!preserveHeaders);

				runtime = this.connectRuntime(this.ruid);
				self.bind('Resize', function(e, info) {
					_updateInfo.call(this, info);
				}, 999);
				runtime.exec.call(self, 'Image', 'resize', width, height, crop, preserveHeaders);
			},

			/**
			Alias for resize(width, height, true). (see resize)
			
			@method crop
			@param {Number} width Resulting width
			@param {Number} [height=width] Resulting height (optional, if not supplied will default to width)
			@param {Boolean} [preserveHeaders=true] Whether to preserve meta headers (on JPEGs after resize)
			*/
			crop: function(width, height, preserveHeaders) {
				this.resize(width, height, true, preserveHeaders);
			},

			getAsCanvas: function() {
				if (!Env.can('create_canvas')) {
					throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
				}

				var runtime = this.connectRuntime(this.ruid);
				return runtime.exec.call(self, 'Image', 'getAsCanvas');
			},

			getAsImage: function() {
				var runtime = this.connectRuntime(this.ruid);
				return runtime.exec.call(self, 'Image', 'getAsImage');
			},

			/**
			Retrieves image in it's current state as mOxie.Blob object. Cannot be run on empty or image in progress (throws
			DOMException.INVALID_STATE_ERR).

			@method getAsBlob
			@param {String} [type="image/jpeg"] Mime type of resulting blob. Can either be image/jpeg or image/png
			@param {Number} [quality=90] Applicable only together with mime type image/jpeg
			@return {Blob} Image as Blob
			*/
			getAsBlob: function(type, quality) {
				if (!this.size) {
					throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
				}

				if (!type) {
					type = 'image/jpeg';
				}

				if (type === 'image/jpeg' && !quality) {
					quality = 90;
				}

				return this.connectRuntime(this.ruid).exec.call(self, 'Image', 'getAsBlob', type, quality);
			},

			/**
			Retrieves image in it's current state as dataURL string. Cannot be run on empty or image in progress (throws
			DOMException.INVALID_STATE_ERR).

			@method getAsDataURL
			@param {String} [type="image/jpeg"] Mime type of resulting blob. Can either be image/jpeg or image/png
			@param {Number} [quality=90] Applicable only together with mime type image/jpeg
			@return {String} Image as dataURL string
			*/
			getAsDataURL: function(type, quality) {
				if (!this.size) {
					throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
				}
				return this.connectRuntime(this.ruid).exec.call(self, 'Image', 'getAsDataURL', type, quality);
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
				var blob, frs;
				blob = this.getAsBlob(type, quality);
				frs = new FileReaderSync();
				return frs.readAsBinaryString(blob);
			},

			/**
			Embeds the image, or better to say, it's visual representation into the specified node. Depending on the runtime
			in use, might be a canvas, or image (actual ) element or shim object (Flash or SilverLight - very rare, used for
			legacy browsers that do not have canvas or proper dataURI support).

			@method embed
			@param {DOMElement} el DOM element to insert the image object into
			@param {Object} options Set of key/value pairs controlling the mime type, dimensions and cropping factor of resulting
			representation
			*/
			embed: function(el) {
				var image, type, quality, dimensions
				, options = arguments[1] || {}
				, width = this.width
				, height = this.height
				, runtime // this has to be outside of all the closures to contain proper runtime
				;

				function onResize() {
					var dataUrl, type = type || this.type || 'image/jpeg';

					// if possible, embed a canvas element directly
					if (Env.can('create_canvas')) {
						var canvas = image.getAsCanvas();
						if (canvas) {
							el.appendChild(canvas);
							canvas = null;
							image.destroy();
							self.trigger('embedded');
							return;
						}
					}

					dataUrl = image.getAsDataURL(type, quality);
					if (!dataUrl) {
						throw new x.ImageError(x.ImageError.WRONG_FORMAT);
					}

					if (Env.can('use_data_uri_of', image.size)) {
						el.innerHTML = '<img src="' + dataUrl + '" width="' + image.width + '" height="' + image.height + '" />';
						image.destroy();
						self.trigger('embedded');
					} else {
						var tr = new Transporter();

						tr.bind("TransportingComplete", function() {
							runtime = self.connectRuntime(this.result.ruid);
						
							self.bind("Embedded", function() {
								// position and size properly
								Basic.extend(runtime.getShimContainer().style, {
									//position: 'relative',
									top: '0px',
									left: '0px',
									width: image.width + 'px',
									height: image.height + 'px'
								});

								// some shims (Flash/SilverLight) reinitialize, if parent element is hidden, reordered or it's
								// position type changes (in Gecko), but since we basically need this only in IEs 6/7 and
								// sometimes 8 and they do not have this problem, we can comment this for now
								/*tr.bind("RuntimeInit", function(e, runtime) {
									tr.destroy();
									runtime.destroy();
									onResize.call(self); // re-feed our image data
								});*/
							}, 999);

							runtime.exec.call(self, "ImageView", "display", this.result.getSource().id, width, height);
							image.destroy();
						});

						tr.transport(Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7)), type, Basic.extend({}, options, {
							required_caps: {
								display_media: true
							},
							container: el
						}));
					}
				}

				if (!(el = Dom.get(el))) {
					throw new x.DOMException(x.DOMException.INVALID_NODE_TYPE_ERR);
				}

				if (!this.size) { // only preloaded image objects can be used as source
					throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
				}


				type = options.type;
				quality = options.quality || 90;
				var crop = options.crop !== undefined ? options.crop : false;

				// figure out dimensions for the thumb
				if (options.width) {
					width = options.width;
					height = options.height || width;
				} else {
					// if container element has > 0 dimensions, take them
					dimensions = Dom.getSize(el);
					if (dimensions.w && dimensions.h) { // both should be > 0
						width = dimensions.w;
						height = dimensions.h;
					}
				}
				
				image = new Image();

				image.bind("Resize", function() {
					onResize.call(self);
				});

				image.bind("Load", function() {
					image.resize(width, height, crop, false);
				});

				image.clone(this, false);

				return image;
			},

			/**
			Properly destroys the image and frees resources in use. If any. Recommended way to dispose mOxie.Image object.

			@method destroy
			*/
			destroy: function() {
				if (this.ruid) {
					var runtime = this.connectRuntime(this.ruid);
					runtime.exec.call(self, 'Image', 'destroy');
				}
				this.unbindAll();
			}
		});

		this.bind('load', function(e, info) {
			_updateInfo.call(this, info);
		}, 999);

		function _updateInfo(info) {
			if (!info) {
				info = this.connectRuntime(this.ruid).exec.call(this, 'Image', 'getInfo');
			}

			if (info) {
				if (Basic.typeOf(info.meta) === 'string') { // might be a JSON string
					try {
						this.meta = parseJSON(info.meta);
					} catch(ex) {}
				} else {
					this.meta = info.meta;
				}
			}

			Basic.extend(this, { // info object might be non-enumerable (as returned from SilverLight for example)
				size: parseInt(info.size, 10),
				width: parseInt(info.width, 10),
				height: parseInt(info.height, 10),
				type: info.type
			});

			// update file name, only if empty
			if (this.name === '') {
				this.name = info.name;
			}
		}


		function _loadFromImage(img, exact) {
			var runtime = this.connectRuntime(img.ruid);
			this.ruid = runtime.uid;
			runtime.exec.call(self, 'Image', 'loadFromImage', img, (exact === undefined ? true : exact));
		}


		function _loadFromBlob(blob, asBinary) {

			self.name = blob.name || '';

			function exec(runtime) {
				self.ruid = runtime.uid;
				runtime.exec.call(self, 'Image', 'loadFromBlob', blob, asBinary);
			}

			if (blob.isDetached()) {
				this.bind('RuntimeInit', function(e, runtime) {
					exec(runtime);
				});
				this.connectRuntime({
					required_caps: {
						access_image_binary: true,
						resize_image: true
					}
				});
			} else {
				exec(this.connectRuntime(blob.ruid));
			}
		}

		function _loadFromUrl(url, options) {
			var xhr;

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
				self.trigger('onloadend');
				xhr.unbindAll();
			};

			self.trigger('loadstart');
			xhr.send(null, options);
		}
	}
	
	Image.prototype = EventTarget.instance;

	return Image;
});
