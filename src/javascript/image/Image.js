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
	"moxie/core/Exceptions",
	"moxie/file/FileReaderSync",
	"moxie/xhr/XMLHttpRequest",
	"moxie/runtime/Runtime",
	"moxie/runtime/RuntimeClient",
	"moxie/runtime/Transporter",
	"moxie/core/utils/Env",
	"moxie/core/EventTarget",
	"moxie/file/Blob",
	"moxie/file/File",
	"moxie/core/utils/Encode"
], function(Basic, Dom, x, FileReaderSync, XMLHttpRequest, Runtime, RuntimeClient, Transporter, Env, EventTarget, Blob, File, Encode) {
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
			Loads image from various sources. Currently the source for new image can be: mOxie.Image, mOxie.Blob/mOxie.File, 
			native Blob/File, dataUrl or URL. Depending on the type of the source, arguments - differ. When source is URL, 
			Image will be downloaded from remote destination and loaded in memory.

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
			load: function() {
				_load.apply(this, arguments);
			},

			/**
			Downsizes the image to fit the specified width/height. If crop is supplied, image will be cropped to exact dimensions.

			@method downsize
			@param {Object} opts
				@param {Number} opts.width Resulting width
				@param {Number} [opts.height=width] Resulting height (optional, if not supplied will default to width)
				@param {Boolean} [opts.crop=false] Whether to crop the image to exact dimensions
				@param {Boolean} [opts.preserveHeaders=true] Whether to preserve meta headers (on JPEGs after resize)
				@param {String} [opts.resample=false] Resampling algorithm to use for resizing
			*/
			downsize: function(opts) {
				var defaults = {
					width: this.width,
					height: this.height,
					type: this.type || 'image/jpeg',
					quality: 90,
					crop: false,
					preserveHeaders: true,
					resample: false
				};

				if (typeof(opts) === 'object') {
					opts = Basic.extend(defaults, opts);
				} else {
					// for backward compatibility
					opts = Basic.extend(defaults, {
						width: arguments[0],
						height: arguments[1],
						crop: arguments[2],
						preserveHeaders: arguments[3]
					});
				}

				try {
					if (!this.size) { // only preloaded image objects can be used as source
						throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
					}

					// no way to reliably intercept the crash due to high resolution, so we simply avoid it
					if (this.width > Image.MAX_RESIZE_WIDTH || this.height > Image.MAX_RESIZE_HEIGHT) {
						throw new x.ImageError(x.ImageError.MAX_RESOLUTION_ERR);
					}

					this.exec('Image', 'downsize', opts.width, opts.height, opts.crop, opts.preserveHeaders);
				} catch(ex) {
					// for now simply trigger error event
					this.trigger('error', ex.code);
				}
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
				if (!Env.can('create_canvas')) {
					throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
				}

				var runtime = this.connectRuntime(this.ruid);
				return runtime.exec.call(this, 'Image', 'getAsCanvas');
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
				return this.exec('Image', 'getAsBlob', type || 'image/jpeg', quality || 90);
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
				return this.exec('Image', 'getAsDataURL', type || 'image/jpeg', quality || 90);
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
				var dataUrl = this.getAsDataURL(type, quality);
				return Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7));
			},

			/**
			Embeds a visual representation of the image into the specified node. Depending on the runtime, 
			it might be a canvas, an img node or a thrid party shim object (Flash or SilverLight - very rare, 
			can be used in legacy browsers that do not have canvas or proper dataURI support).

			@method embed
			@param {DOMElement} el DOM element to insert the image object into
			@param {Object} [opts]
				@param {Number} [opts.width] The width of an embed (defaults to the image width)
				@param {Number} [opts.height] The height of an embed (defaults to the image height)
				@param {String} [type="image/jpeg"] Mime type
				@param {Number} [quality=90] Quality of an embed, if mime type is image/jpeg
				@param {Boolean} [crop=false] Whether to crop an embed to the specified dimensions
			*/
			embed: function(el, opts) {
				var self = this
				, runtime // this has to be outside of all the closures to contain proper runtime
				;

				opts = Basic.extend({
					width: this.width,
					height: this.height,
					type: this.type || 'image/jpeg',
					quality: 90
				}, opts || {});
				

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

					if (Env.can('use_data_uri_of', dataUrl.length)) {
						el.innerHTML = '<img src="' + dataUrl + '" width="' + img.width + '" height="' + img.height + '" />';
						img.destroy();
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
									width: img.width + 'px',
									height: img.height + 'px'
								});

								// some shims (Flash/SilverLight) reinitialize, if parent element is hidden, reordered or it's
								// position type changes (in Gecko), but since we basically need this only in IEs 6/7 and
								// sometimes 8 and they do not have this problem, we can comment this for now
								/*tr.bind("RuntimeInit", function(e, runtime) {
									tr.destroy();
									runtime.destroy();
									onResize.call(self); // re-feed our image data
								});*/

								runtime = null; // release
							}, 999);

							runtime.exec.call(self, "ImageView", "display", this.result.uid, width, height);
							img.destroy();
						});

						tr.transport(Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7)), type, {
							required_caps: {
								display_media: true
							},
							runtime_order: 'flash,silverlight',
							container: el
						});
					}
				}

				try {
					if (!(el = Dom.get(el))) {
						throw new x.DOMException(x.DOMException.INVALID_NODE_TYPE_ERR);
					}

					if (!this.size) { // only preloaded image objects can be used as source
						throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
					}
					
					// high-resolution images cannot be consistently handled across the runtimes
					if (this.width > Image.MAX_RESIZE_WIDTH || this.height > Image.MAX_RESIZE_HEIGHT) {
						//throw new x.ImageError(x.ImageError.MAX_RESOLUTION_ERR);
					}

					var imgCopy = new Image();

					imgCopy.bind("Resize", function() {
						render.call(this, opts.type, opts.quality);
					});

					imgCopy.bind("Load", function() {
						imgCopy.downsize(opts);
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
					this.trigger('error', ex.code);
				}
			},

			/**
			Properly destroys the image and frees resources in use. If any. Recommended way to dispose mOxie.Image object.

			@method destroy
			*/
			destroy: function() {
				if (this.ruid) {
					this.getRuntime().exec.call(this, 'Image', 'destroy');
					this.disconnectRuntime();
				}
				this.unbindAll();
			}
		});


		// this is here, because in order to bind properly, we need uid, which is created above
		this.handleEventProps(dispatches);

		this.bind('Load Resize', function() {
			_updateInfo.call(this);
		}, 999);


		function _updateInfo(info) {
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
				else if (src instanceof Blob) {
					if (!~Basic.inArray(src.type, ['image/jpeg', 'image/png'])) {
						throw new x.ImageError(x.ImageError.WRONG_FORMAT);
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
						_load.call(this, new Blob(null, { data: src }), arguments[1]);
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
					throw new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);
				}
			} catch(ex) {
				// for now simply trigger error event
				this.trigger('error', ex.code);
			}
		}


		function _loadFromImage(img, exact) {
			var runtime = this.connectRuntime(img.ruid);
			this.ruid = runtime.uid;
			runtime.exec.call(this, 'Image', 'loadFromImage', img, (Basic.typeOf(exact) === 'undefined' ? true : exact));
		}


		function _loadFromBlob(blob, options) {
			var self = this;

			self.name = blob.name || '';

			function exec(runtime) {
				self.ruid = runtime.uid;
				runtime.exec.call(self, 'Image', 'loadFromBlob', blob);
			}

			if (blob.isDetached()) {
				this.bind('RuntimeInit', function(e, runtime) {
					exec(runtime);
				});

				// convert to object representation
				if (options && typeof(options.required_caps) === 'string') {
					options.required_caps = Runtime.parseCaps(options.required_caps);
				}

				this.connectRuntime(Basic.extend({
					required_caps: {
						access_image_binary: true,
						resize_image: true
					}
				}, options));
			} else {
				exec(this.connectRuntime(blob.ruid));
			}
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
	}

	// virtual world will crash on you if image has a resolution higher than this:
	Image.MAX_RESIZE_WIDTH = 8192;
	Image.MAX_RESIZE_HEIGHT = 8192; 

	Image.prototype = EventTarget.instance;

	return Image;
});
