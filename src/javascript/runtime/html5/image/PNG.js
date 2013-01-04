define("runtime/html5/image/PNG", ["o", "runtime/html5/utils/BinaryReader"], function(o, BinaryReader) {

	var x = o.Exceptions;

	return function PNG(binstr) {
		var _binstr, _br, _hm, _ep, _info;

		_binstr = binstr;

		_br = new BinaryReader();
		_br.init(_binstr);

		// check if it's png
		(function() {
			var idx = i = 0,
			    signature = [0x8950, 0x4E47, 0x0D0A, 0x1A0A];
			
			for (var i = 0; i < signature.length; i++, idx += 2) {
				if (signature[i] != _br.SHORT(idx)) {
					throw new x.ImageError(x.ImageError.WRONG_FORMAT);
				}
			}
		}());

		_info = _getDimensions.call(this);

		
		o.extend(this, {
			type: 'image/png',

			size: _binstr.length,

			width: _info.width,

			height: _info.height,

			purge: function() {
				_purge.call(this);
			}
		});

		// for PNG we can safely trigger purge automatically, as we do not keep any data for later
		_purge.call(this); 


		function _getDimensions() {
			var chunk, idx;
			
			chunk = _getChunkAt.call(this, 8);
			
			if (chunk.type == 'IHDR') {
				idx = chunk.start;
				return {
					width: _br.LONG(idx),
					height: _br.LONG(idx += 4)
				};
			}
			return null;
		}
		
		function _getChunkAt(idx) {
			var length, type, start, CRC;
			
			length = _br.LONG(idx);
			type = _br.STRING(idx += 4, 4);
			start = idx += 4;	
			CRC = _br.LONG(idx + length);
			
			return {
				length: length,
				type: type,
				start: start,
				CRC: CRC
			};
		}

		function _purge() {
			_br.init(null);
			_hm = _ep = _br = null;
		}
	}; 
});