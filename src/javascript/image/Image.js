define("image/Image", [
		"o", 
		"runtime/RuntimeClient"
	], function(o, RuntimeClient) {

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
		
		o.extend(this, {
			
			/**
			Unique id of the component

			@property uid
			@type {String}
			*/
			uid: o.guid('uid_'),

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
			Alias for load method, that takes another o.Image object as a source (see load).

			@method clone
			@param {Image} src Source for the image
			@param {Boolean} [exact=false] Whether to activate in-depth clone mode
			*/
			clone: function() {
				this.load.apply(this, arguments);
			},

			/**
			Loads image from various sources. Currently the source for new image can be: o.Image, o.Blob/o.File or URL. 
			Depending on the type of the source, arguments - differ.

			When source is:
			  - o.Image: Loads image from another existing o.Image object (clones it). Might be fast by default (surface clone), 
				or a bit slower, if launched in exact mode (in-depth clone). Only exact mode (enabled by passing second argument
				as - true) will copy over meta info, like Exif, GPS, IPTC data, etc.
			  - o.Blob/o.File: Loads image from o.File or o.Blob object.
			  - URL: Image will be downloaded from remote destination and loaded in memory.

			When source is URL, Image will be downloaded from remote destination and loaded in memory.

			@example
			var img = new o.Image();
			img.onload = function() {
				var blob = img.getAsBlob('image/png'); // convert to png and retrieve as blob, ready to be uploaded
				
				var formData = new o.FormData();
				formData.append('file', blob);

				var xhr = new o.XMLHttpRequest();
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
				var el, url, urlp;

				this.convertEventPropsToHandlers(dispatches);	

				if (src instanceof o.Image) {
					if (!src.size) { // only preloaded image objects can be used as source
						throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);	
					}
					_loadFromImage.apply(this, arguments);
				} 
				else if (src instanceof o.File || src instanceof o.Blob) {
					if (!~o.inArray(src.type, ['image/jpeg', 'image/png'])) {
						throw new x.ImageError(x.ImageError.WRONG_FORMAT);
					}
					_loadFromBlob.apply(this, arguments);
				} 
				else if (o.typeOf(src) === 'string' && /^http:\/\//.test(src)) {
					_loadFromUrl.apply(this, arguments);
				} 
				else if (el = o(src) && el.nodeName === 'img') {
					urlp = o.parseUrl(el.src); // src can be relative

					// manually resolve the url
					url = urlp.scheme + '://' + urlp.host + (urlp.port !== 80 ? ':' + urlp.port : '') + urlp.path;

					_loadFromUrl.apply(this, arguments);
				} 
				else {
					throw new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);	
				}
			},

			/**
			Resizes the image to fit the specified width/height. If crop is supplied, image will be cropped to exact dimensions.

			@method resize
			@param {Number} width Resulting width
			@param {Number} [height=width] Resulting height (optional, if not supplied will default to width)
			@param {Boolean} [crop=false] Whether to crop the image to exact dimensions
			*/
			resize: function(width, height, crop) {
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

				runtime = this.connectRuntime(this.ruid);
				self.bind('Resize', function(e, info) {
					_updateInfo.call(this, info);
				}, 999);
				runtime.exec.call(self, 'Image', 'resize', width, height, (crop === undefined ? false : crop));
			},

			/**
			Alias for resize(width, height, true). (see resize)
			
			@method crop
			@param {Number} width Resulting width
			@param {Number} [height=width] Resulting height (optional, if not supplied will default to width)
			*/
			crop: function(width, height) {
				this.resize(width, height, true);
			},

			getAsCanvas: function() {
				if (!o.ua.can('create_canvas')) {
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
			Retrieves image in it's current state as o.Blob object. Cannot be run on empty or image in progress (throws 
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
				frs = new o.FileReaderSync;
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
					if (o.ua.can('create_canvas')) {
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

					if (o.ua.can('use_data_uri_of', image.size)) {
						el.innerHTML = '<img src="' + dataUrl + '" width="' + image.width + '" height="' + image.height + '" />';
						image.destroy();
						self.trigger('embedded');
					} else {
						var tr = new o.Transporter;

						tr.bind("TransportingComplete", function() {
							runtime = self.connectRuntime(this.result.ruid);
						
							self.bind("Embedded", function() {
								// position and size properly
								o.extend(runtime.getShimContainer().style, {
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

						tr.transport(o.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7)), type, o.extend({}, options, {
							required_caps: {
								display_media: true
							},
							container: el
						}));
					}
				}

				if (!(el = o(el))) {
					throw new x.DOMException(x.DOMException.INVALID_NODE_TYPE_ERR);	
				}

				if (!this.size) { // only preloaded image objects can be used as source
					throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);	
				}


				type = options.type;
				quality = options.quality || 90;
				crop = options.crop !== undefined ? options.crop : false;

				// figure out dimensions for the thumb
				if (options.width) {
					width = options.width;
					height = options.height || width;
				} else {
					// if container element has > 0 dimensions, take them
					dimensions = o.getSize(el);
					if (dimensions.w && dimensions.h) { // both should be > 0
						width = dimensions.w;
						height = dimensions.h;
					}
				}
				
				image = new o.Image;

				image.bind("Resize", function() {
					onResize.call(self);
				});

				image.bind("Load", function() {
					image.resize(width, height, crop);
				});

				image.clone(this, false);					

				return image;	
			},

			/**
			Properly destroys the image and frees resources in use. If any. Recommended way to dispose o.Image object.

			@method destroy
			*/
			destroy: function() {
				if (this.ruid) {
					var runtime = this.connectRuntime(this.ruid);
					runtime.exec.call(self, 'Image', 'destroy');
				}
				this.unbindAll();
			},
			
			constructor: o.Image
		});


		o.defineProperty(this, 'src', {
			configurable: false,

			set: function(src) {
				this.load(src);
			}
		});

		
		this.bind('load', function(e, info) {
			_updateInfo.call(this, info);
		}, 999);


		function _updateInfo(info) {
			if (!info) {
				info = this.connectRuntime(this.ruid).runtime.exec.call(this, 'Image', 'getInfo');
			}

			if (info) {
				if (o.typeOf(info.meta) === 'string') { // might be a JSON string
					try {
						this.meta = o.JSON.parse(info.meta);
					} catch(ex) {}
				}
			}

			o.extend(this, { // info object might be non-enumerable (as returned from SilverLight for example)
				size: info.size,
				width: info.width,
				height: info.height,
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

			xhr = new o.XMLHttpRequest;

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
	
	Image.prototype = o.eventTarget;
	
	return Image;
});
