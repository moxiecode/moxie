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

/**
@class moxie/runtime/html5/image/Image
@private
*/
define("moxie/runtime/html5/image/Image", [
	"moxie/runtime/html5/Runtime",
	"moxie/core/utils/Basic",
	"moxie/core/Exceptions",
	"moxie/core/utils/Encode",
	"moxie/file/Blob",
	"moxie/runtime/html5/image/ImageInfo",
	"moxie/runtime/html5/image/MegaPixel",
	"moxie/core/utils/Mime",
	"moxie/core/utils/Env"
], function(extensions, Basic, x, Encode, Blob, ImageInfo, MegaPixel, Mime, Env) {
	
	function HTML5Image() {
		var me = this
		, _img, _imgInfo, _canvas, _binStr, _srcBlob
		, _modified = false // is set true whenever image is modified
		, _preserveHeaders = true
		;

		Basic.extend(me, {
			loadFromBlob: function(blob, asBinary) {
				var comp = this, I = comp.getRuntime();

				if (Basic.typeOf(asBinary) === 'undefined') {
					asBinary = true;
				}

				if (!I.can('access_binary')) {
					throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
				}

				if (blob.isDetached()) {
					_srcBlob = {
						name: blob.name,
						size: blob.size,
						type: blob.type
					};
					_loadFromBinaryString.call(this, blob.getSource());
					return;
				} else {
					_srcBlob = blob.getSource();

					if (asBinary) { // this will let us to hack the file internals
						_readAsBinaryString(_srcBlob, function(data) {
							_loadFromBinaryString.call(comp, data);
						});
					} else { // ... but this is faster
						_readAsDataUrl(_srcBlob, function(data) {
							_loadFromDataUrl.call(comp, data);
						});
					}
				}
			},

			loadFromImage: function(img, exact) {
				this.meta = img.meta;

				_srcBlob = {
					name: img.name,
					size: img.size,
					type: img.type
				};

				if (exact) {
					_loadFromBinaryString.call(this, img.getAsBinaryString());
				} else {
					_img = img.getAsImage();
					this.trigger('load', me.getInfo.call(this));
				}
			},

			getInfo: function() {
				var I = this.getRuntime()
				, info = {
					width: _img && _img.width || 0,
					height: _img && _img.height || 0,
					type: (_srcBlob.type || _srcBlob.name && Mime.mimes[_srcBlob.name.replace(/^.+\.([^\.]+)$/, "$1").toLowerCase()]) || '',
					size: _binStr && _binStr.length || _srcBlob.size || 0,
					name: _srcBlob.name || '',
					meta: this.meta || {}
				};

				if (I.can('access_image_binary') && _binStr) {
					if (_imgInfo) {
						_imgInfo.purge();
					}
					_imgInfo = new ImageInfo(_binStr);
					Basic.extend(info, _imgInfo);
				}
				return info;
			},

			resize: function() {
				if (!_img) {
					throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
				}
				_resize.apply(this, arguments);
			},

			getAsImage: function() {
				if (!_img) {
					throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
				}
				_img.id = this.uid + '_img';
				return _img;
			},

			getAsCanvas: function() {
				if (_canvas) {
					_canvas.id = this.uid + '_canvas';
				}
				return _canvas;
			},

			getAsBlob: function(type, quality) {
				var blob, I = this.getRuntime();

				if (type !== this.type) {
					// if different mime type requested prepare image for conversion
					_resize.call(this, this.width, this.height, false);
				}

				if (!_modified && !!~Basic.inArray(Basic.typeOf(_srcBlob), ['blob', 'file'])) {
					blob = new Blob(I.uid, _srcBlob);
				} else {
					var data = me.getAsBinaryString.call(this, type, quality);
					blob = new Blob(null, { // standalone blob
						type: type,
						size: data.length
					});
					blob.detach(data);
				}
				return blob;
			},

			getAsDataURL: function(type, quality) {
				// if image has not been modified, return the source right away
				if (!_modified) {
					return _img.src;
				}

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

			getAsBinaryString: function(type, quality) {
				// if image has not been modified, return the source right away
				if (!_modified) {
					// if image was not loaded from binary string
					if (!_binStr) {
						_binStr = _convertToBinary(me.getAsDataURL(type, quality));
					}
					return _binStr;
				}

				if ('image/jpeg' !== type) {
					_binStr = _convertToBinary(me.getAsDataURL(type, quality));
				} else {
					var dataUrl;

					// if jpeg
					if (!quality) {
						quality = 90;
					}

					try {
						// older Geckos used to result in an exception on quality argument
						dataUrl = _canvas.toDataURL('image/jpeg', quality/100);
					} catch (ex) {
						dataUrl = _canvas.toDataURL('image/jpeg');
					}

					_binStr = _convertToBinary(dataUrl);

					if (_imgInfo && _preserveHeaders) {
						// update dimensions info in exif
						if (_imgInfo.meta && _imgInfo.meta.exif) {
							_imgInfo.setExif({
								PixelXDimension: this.width,
								PixelYDimension: this.height
							});
						}

						_binStr = _imgInfo.writeHeaders(_binStr);
					}
				}

				_modified = false;

				return _binStr;
			},

			destroy: function() {
				me = null;
				_purge.call(this);
				this.getRuntime().getShim().removeInstance(this.uid);
			}
		});


		function _convertToBinary(dataUrl) {
			return Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7));
		}


		function _loadFromBinaryString(binStr) {
			var comp = this;

			_purge.call(this);

			_img = new Image();
			_img.onerror = function() {
				_purge.call(this);
				throw new x.ImageError(x.ImageError.WRONG_FORMAT);
			};
			_img.onload = function() {
				_binStr = binStr;
				comp.trigger('load', me.getInfo.call(comp));
			};

			_img.src = 'data:' + (_srcBlob.type || '') + ';base64,' + Encode.btoa(binStr);
		}

		function _loadFromDataUrl(dataUrl) {
			var comp = this;

			_img = new Image();
			_img.onerror = function() {
				_purge.call(this);
				throw new x.ImageError(x.ImageError.WRONG_FORMAT);
			};
			_img.onload = function() {
				comp.trigger('load', me.getInfo.call(comp));
			};
			_img.src = dataUrl;
		}

		function _readAsBinaryString(file, callback) {
			var fr;

			// use FileReader if it's available
			if (window.FileReader) {
				fr = new FileReader();
				fr.onload = function() {
					callback(this.result);
				};
				fr.readAsBinaryString(file);
			} else {
				return callback(file.getAsBinary());
			}
		}

		function _readAsDataUrl(file, callback) {
			var fr;

			// use FileReader if it's available
			if (window.FileReader) {
				fr = new FileReader();
				fr.onload = function() {
					callback(this.result);
				};
				fr.readAsDataURL(file);
			} else {
				return callback(file.getAsDataURL());
			}
		}

		function _resize(width, height, crop, preserveHeaders) {
			var ctx, scale, mathFn, x, y, imgWidth, imgHeight, orientation;

			_preserveHeaders = preserveHeaders; // we will need to check this on export

			// take into account orientation tag
			orientation = (this.meta && this.meta.tiff && this.meta.tiff.Orientation) || 1;

			if (Basic.inArray(orientation, [5,6,7,8]) !== -1) { // values that require 90 degree rotation
				// swap dimensions
				var mem = width;
				width = height;
				height = mem;
			}

			// unify dimensions
			mathFn = !crop ? Math.min : Math.max;
			scale = mathFn(width/_img.width, height/_img.height);
		
			// we only downsize here
			if (scale > 1 && (!crop || preserveHeaders)) { // when cropping one of dimensions may still exceed max, so process it anyway
				this.trigger('Resize');
				return;
			}

			imgWidth = Math.round(_img.width * scale);
			imgHeight = Math.round(_img.height * scale);

			// prepare canvas if necessary
			if (!_canvas) {
				_canvas = document.createElement("canvas");
			}

			ctx = _canvas.getContext('2d');

			// scale image and canvas
			if (crop) {
				_canvas.width = width;
				_canvas.height = height;
			} else {
				_canvas.width = imgWidth;
				_canvas.height = imgHeight;
			}

			// if dimensions of the resulting image still larger than canvas, center it
			x = imgWidth > _canvas.width ? Math.round((imgWidth - _canvas.width) / 2)  : 0;
			y = imgHeight > _canvas.height ? Math.round((imgHeight - _canvas.height) / 2) : 0;

			if (!_preserveHeaders) {
				_rotateToOrientaion(_canvas.width, _canvas.height, orientation);
			} else {
				this.width = _canvas.width;
				this.height = _canvas.height;
			}

			_drawToCanvas.call(this, _img, _canvas, -x, -y, imgWidth, imgHeight);

			_modified = true;
			this.trigger('Resize');
		}


		function _drawToCanvas(img, canvas, x, y, w, h) {
			if (Env.OS === 'iOS' || Env.OS === 'Android') { 
				// avoid squish bug in iOS6
				MegaPixel.renderTo(img, canvas, { width: w, height: h, x: x, y: y });
			} else {
				var ctx = canvas.getContext('2d');
				ctx.drawImage(img, x, y, w, h);
			}
		}


		/**
		* Transform canvas coordination according to specified frame size and orientation
		* Orientation value is from EXIF tag
		* @author Shinichi Tomita <shinichi.tomita@gmail.com>
		*/
		function _rotateToOrientaion(width, height, orientation) {
			switch (orientation) {
				case 5:
				case 6:
				case 7:
				case 8:
					_canvas.width = height;
					_canvas.height = width;
					break;
				default:
					_canvas.width = width;
					_canvas.height = height;
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

			var ctx = _canvas.getContext('2d');
			switch (orientation) {
				case 2:
					// horizontal flip
					ctx.translate(width, 0);
					ctx.scale(-1, 1);
					break;
				case 3:
					// 180 rotate left
					ctx.translate(width, height);
					ctx.rotate(Math.PI);
					break;
				case 4:
					// vertical flip
					ctx.translate(0, height);
					ctx.scale(1, -1);
					break;
				case 5:
					// vertical flip + 90 rotate right
					ctx.rotate(0.5 * Math.PI);
					ctx.scale(1, -1);
					break;
				case 6:
					// 90 rotate right
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(0, -height);
					break;
				case 7:
					// horizontal flip + 90 rotate right
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(width, -height);
					ctx.scale(-1, 1);
					break;
				case 8:
					// 90 rotate left
					ctx.rotate(-0.5 * Math.PI);
					ctx.translate(-width, 0);
					break;
			}
		}


		function _purge() {
			if (_imgInfo) {
				_imgInfo.purge();
				_imgInfo = null;
			}
			_binStr = _img = _canvas = null;
			_modified = false;
		}
	}

	return (extensions.Image = HTML5Image);
});
