/**
 * JPEG.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/image/JPEG
@private
*/
define("moxie/runtime/html5/image/JPEG", [
	"moxie/core/utils/Basic",
	"moxie/core/Exceptions",
	"moxie/runtime/html5/image/JPEGHeaders",
	"moxie/runtime/html5/utils/BinaryReader",
	"moxie/runtime/html5/image/ExifParser"
], function(Basic, x, JPEGHeaders, BinaryReader, ExifParser) {
	
	function JPEG(binstr) {
		var _binstr, _br, _hm, _ep, _info, hasExif;

		_binstr = binstr;

		_br = new BinaryReader();
		_br.init(_binstr);

		// check if it is jpeg
		if (_br.SHORT(0) !== 0xFFD8) {
			throw new x.ImageError(x.ImageError.WRONG_FORMAT);
		}

		// backup headers
		_hm = new JPEGHeaders(binstr);

		// extract exif info
		_ep = new ExifParser();
		hasExif = !!_ep.init(_hm.get('app1')[0]);

		// get dimensions
		_info = _getDimensions.call(this);

		Basic.extend(this, {
			type: 'image/jpeg',

			size: _binstr.length,

			width: _info && _info.width || 0,

			height: _info && _info.height || 0,

			setExif: function(tag, value) {
				if (!hasExif) {
					return false; // or throw an exception
				}

				if (Basic.typeOf(tag) === 'object') {
					Basic.each(tag, function(value, tag) {
						_ep.setExif(tag, value);
					});
				} else {
					_ep.setExif(tag, value);
				}

				// update internal headers
				_hm.set('app1', _ep.getBinary());
			},

			writeHeaders: function() {
				if (!arguments.length) {
					// if no arguments passed, update headers internally
					return (_binstr = _hm.restore(_binstr));
				}
				return _hm.restore(arguments[0]);
			},

			stripHeaders: function(binstr) {
				return _hm.strip(binstr);
			},

			purge: function() {
				_purge.call(this);
			}
		});

		if (hasExif) {
			this.meta = {
				tiff: _ep.TIFF(),
				exif: _ep.EXIF(),
				gps: _ep.GPS(),
				thumb: _getThumb()
			};
		}


		function _getDimensions(br) {
			var idx = 0
			, marker
			, length
			;

			if (!br) {
				br = _br;
			}

			// examine all through the end, since some images might have very large APP segments
			while (idx <= br.length()) {
				marker = br.SHORT(idx += 2);

				if (marker >= 0xFFC0 && marker <= 0xFFC3) { // SOFn
					idx += 5; // marker (2 bytes) + length (2 bytes) + Sample precision (1 byte)
					return {
						height: br.SHORT(idx),
						width: br.SHORT(idx += 2)
					};
				}
				length = br.SHORT(idx += 2);
				idx += length - 2;
			}
			return null;
		}


		function _getThumb() {
			var binstr =  _ep.thumb()
			, br = new BinaryReader()
			, info
			;

			if (binstr) {
				br.init(binstr);
				info = _getDimensions(br);
				br.init(null);

				if (info) {
					info.data = binstr;
					return info;
				}
			}
			return null;
		}


		function _purge() {
			if (!_ep || !_hm || !_br) { 
				return; // ignore any repeating purge requests
			}
			_ep.purge();
			_hm.purge();
			_br.init(null);
			_binstr = _info = _hm = _ep = _br = null;
		}
	}

	return JPEG;
});
