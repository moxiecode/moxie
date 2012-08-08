// maybe depends on mOxie.js, Utils.js

;(function(window, document, o, undefined) {

var JPEG, PNG;
var x = o.Exceptions;


o.ImageInfo = function(binstr) {
	var _cs = [JPEG, PNG], _img;

	// figure out the format, throw: ImageError.WRONG_FORMAT if not supported
	_img = (function() {
		for (var i = 0; i < _cs.length; i++) {
			try {
				return new _cs[i](binstr);
			} catch (ex) {
				// console.info(ex);
			}
		}
		throw new x.ImageError(x.ImageError.WRONG_FORMAT);
	}());

	o.extend(this, {
		type: '',
		size: 0,
		width: 0,
		height: 0,
		setExif: function() {},
		writeHeaders: function(data) {
			return data;
		},
		purge: function() {}
	});

	o.extend(this, _img);

	this.purge = _img.purge;
};



JPEG = (function() {

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
		_ep = new ExifParser;		
		hasExif = !!_ep.init(_hm.get('exif')[0]);

		// get dimensions
		_info = _getDimensions.call(this);


		o.extend(this, {

			type: 'image/jpeg',

			size: _binstr.length,

			width: _info && _info.width || 0,

			height: _info && _info.height || 0,

			setExif: function(tag, value) {
				if (!hasExif) {
					return false; // or throw an exception
				}

				if (o.typeOf(tag) === 'object') {
					o.each(tag, function(value, tag) {
						_ep.setExif(tag, value);
					});
				} else {
					_ep.setExif(tag, value);
				}

				// update internal headers
				_hm.set('exif', _ep.getBinary());
			},

			writeHeaders: function() {
				if (!arguments.length) { 
					// if no arguments passed, update headers internally
					return _binstr = _hm.restore(_binstr);
				}
				return _hm.restore(arguments[0]);
			},

			purge: function() {
				_purge.call(this);
			}
		});

		if (hasExif) {
			this.meta = {
				exif: _ep.EXIF(),
				gps: _ep.GPS()
			};
		}

		function _getDimensions() {
			var idx = 0, marker, length;
			
			// examine all through the end, since some images might have very large APP segments
			while (idx <= _binstr.length) {
				marker = _br.SHORT(idx += 2);
				
				if (marker >= 0xFFC0 && marker <= 0xFFC3) { // SOFn
					idx += 5; // marker (2 bytes) + length (2 bytes) + Sample precision (1 byte)
					return {
						height: _br.SHORT(idx),
						width: _br.SHORT(idx += 2)
					};
				}
				length = _br.SHORT(idx += 2);
				idx += length - 2;			
			}		
			return null;
		}

		function _purge() {
			_ep.purge();
			_hm.purge();
			_br.init(null);
			_hm = _ep = _br = null;
		}
	}


	function JPEGHeaders(data) {	
		var markers = {
				0xFFE1: {
					app: 'EXIF',
					name: 'APP1',
					signature: "Exif\0" 
				},
				0xFFE2: {
					app: 'ICC',
					name: 'APP2',
					signature: "ICC_PROFILE\0" 
				},
				0xFFED: {
					app: 'IPTC',
					name: 'APP13',
					signature: "Photoshop 3.0\0" 
				}
			},
			headers = [], read, idx, marker, length = 0, limit;
			
		
		read = new BinaryReader();
		read.init(data);
				
		// Check if data is jpeg
		if (read.SHORT(0) !== 0xFFD8) {
			return;
		}
		
		idx = 2;
		limit = Math.min(1048576, data.length);	
			
		while (idx <= limit) {
			marker = read.SHORT(idx);
			
			// omit RST (restart) markers
			if (marker >= 0xFFD0 && marker <= 0xFFD7) {
				idx += 2;
				continue;
			}
			
			// no headers allowed after SOS marker
			if (marker === 0xFFDA || marker === 0xFFD9) {
				break;	
			}	
			
			length = read.SHORT(idx + 2) + 2;	
			
			if (markers[marker] && read.STRING(idx + 4, markers[marker].signature.length) === markers[marker].signature) {
				headers.push({ 
					hex: marker,
					app: markers[marker].app.toUpperCase(),
					name: markers[marker].name.toUpperCase(),
					start: idx,
					length: length,
					segment: read.SEGMENT(idx, length)
				});
			}
			idx += length;			
		}
					
		read.init(null); // free memory
						
		return {
			
			headers: headers,
			
			restore: function(data) {
				read.init(data);
				
				// Check if data is jpeg
				var jpegHeaders = new JPEGHeaders(data);
				
				if (!jpegHeaders['headers']) {
					return false;
				}	
				
				// Delete any existing headers that need to be replaced
				for (var i = jpegHeaders['headers'].length; i > 0; i--) {
					var hdr = jpegHeaders['headers'][i - 1];
					read.SEGMENT(hdr.start, hdr.length, '')
				}
				jpegHeaders.purge();
				
				idx = read.SHORT(2) == 0xFFE0 ? 4 + read.SHORT(4) : 2;
								
				for (var i = 0, max = headers.length; i < max; i++) {
					read.SEGMENT(idx, 0, headers[i].segment);						
					idx += headers[i].length;
				}
				
				data = read.SEGMENT();
				read.init(null);
				return data;
			},
			
			get: function(app) {
				var array = [];
								
				for (var i = 0, max = headers.length; i < max; i++) {
					if (headers[i].app === app.toUpperCase()) {
						array.push(headers[i].segment);
					}
				}
				return array;
			},
			
			set: function(app, segment) {
				var array = [];
				
				if (typeof(segment) === 'string') {
					array.push(segment);	
				} else {
					array = segment;	
				}
				
				for (var i = ii = 0, max = headers.length; i < max; i++) {
					if (headers[i].app === app.toUpperCase()) {
						headers[i].segment = array[ii];
						headers[i].length = array[ii].length;
						ii++;
					}
					if (ii >= array.length) break;
				}
			},
			
			purge: function() {
				headers = [];
				read.init(null);
			}
		};		
	}

	function ExifParser() {
		// Private ExifParser fields
		var data, tags, offsets = {}, tagDescs;

		data = new BinaryReader();

		tags = {
			tiff : {
				/*
				The image orientation viewed in terms of rows and columns.

				1 - The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
				2 - The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
				3 - The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
				4 - The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
				5 - The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
				6 - The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
				7 - The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
				8 - The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
				9 - The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
				*/
				0x0112: 'Orientation',
				0x8769: 'ExifIFDPointer',
				0x8825:	'GPSInfoIFDPointer'
			},
			exif : {
				0x9000: 'ExifVersion',
				0xA001: 'ColorSpace',
				0xA002: 'PixelXDimension',
				0xA003: 'PixelYDimension',
				0x9003: 'DateTimeOriginal',
				0x829A: 'ExposureTime',
				0x829D: 'FNumber',
				0x8827: 'ISOSpeedRatings',
				0x9201: 'ShutterSpeedValue',
				0x9202: 'ApertureValue'	,
				0x9207: 'MeteringMode',
				0x9208: 'LightSource',
				0x9209: 'Flash',
				0xA402: 'ExposureMode',
				0xA403: 'WhiteBalance',
				0xA406: 'SceneCaptureType',
				0xA404: 'DigitalZoomRatio',
				0xA408: 'Contrast',
				0xA409: 'Saturation',
				0xA40A: 'Sharpness'
			},
			gps : {
				0x0000: 'GPSVersionID',
				0x0001: 'GPSLatitudeRef',
				0x0002: 'GPSLatitude',
				0x0003: 'GPSLongitudeRef',
				0x0004: 'GPSLongitude'
			}
		};

		tagDescs = {
			'ColorSpace': {
				1: 'sRGB',
				0: 'Uncalibrated'
			},

			'MeteringMode': {
				0: 'Unknown',
				1: 'Average',
				2: 'CenterWeightedAverage',
				3: 'Spot',
				4: 'MultiSpot',
				5: 'Pattern',
				6: 'Partial',
				255: 'Other'
			},

			'LightSource': {
				1: 'Daylight',
				2: 'Fliorescent',
				3: 'Tungsten',
				4: 'Flash',
				9: 'Fine weather',
				10: 'Cloudy weather',
				11: 'Shade',
				12: 'Daylight fluorescent (D 5700 - 7100K)',
				13: 'Day white fluorescent (N 4600 -5400K)',
				14: 'Cool white fluorescent (W 3900 - 4500K)',
				15: 'White fluorescent (WW 3200 - 3700K)',
				17: 'Standard light A',
				18: 'Standard light B',
				19: 'Standard light C',
				20: 'D55',
				21: 'D65',
				22: 'D75',
				23: 'D50',
				24: 'ISO studio tungsten',
				255: 'Other'
			},

			'Flash': {
				0x0000: 'Flash did not fire.',
				0x0001: 'Flash fired.',
				0x0005: 'Strobe return light not detected.',
				0x0007: 'Strobe return light detected.',
				0x0009: 'Flash fired, compulsory flash mode',
				0x000D: 'Flash fired, compulsory flash mode, return light not detected',
				0x000F: 'Flash fired, compulsory flash mode, return light detected',
				0x0010: 'Flash did not fire, compulsory flash mode',
				0x0018: 'Flash did not fire, auto mode',
				0x0019: 'Flash fired, auto mode',
				0x001D: 'Flash fired, auto mode, return light not detected',
				0x001F: 'Flash fired, auto mode, return light detected',
				0x0020: 'No flash function',
				0x0041: 'Flash fired, red-eye reduction mode',
				0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
				0x0047: 'Flash fired, red-eye reduction mode, return light detected',
				0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
				0x004D: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
				0x004F: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
				0x0059: 'Flash fired, auto mode, red-eye reduction mode',
				0x005D: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
				0x005F: 'Flash fired, auto mode, return light detected, red-eye reduction mode'
			},

			'ExposureMode': {
				0: 'Auto exposure',
				1: 'Manual exposure',
				2: 'Auto bracket'
			},

			'WhiteBalance': {
				0: 'Auto white balance',
				1: 'Manual white balance'
			},

			'SceneCaptureType': {
				0: 'Standard',
				1: 'Landscape',
				2: 'Portrait',
				3: 'Night scene'
			},

			'Contrast': {
				0: 'Normal',
				1: 'Soft',
				2: 'Hard'
			},

			'Saturation': {
				0: 'Normal',
				1: 'Low saturation',
				2: 'High saturation'
			},

			'Sharpness': {
				0: 'Normal',
				1: 'Soft',
				2: 'Hard'
			},

			// GPS related
			'GPSLatitudeRef': {
				N: 'North latitude',
				S: 'South latitude'
			},

			'GPSLongitudeRef': {
				E: 'East longitude',
				W: 'West longitude'
			}
		};

		function extractTags(IFD_offset, tags2extract) {
			var length = data.SHORT(IFD_offset), i, ii,
				tag, type, count, tagOffset, offset, value, values = [], hash = {};

			for (i = 0; i < length; i++) {
				// Set binary reader pointer to beginning of the next tag
				offset = tagOffset = IFD_offset + 12 * i + 2;

				tag = tags2extract[data.SHORT(offset)];

				if (tag === undefined) {
					continue; // Not the tag we requested
				}

				type = data.SHORT(offset+=2);
				count = data.LONG(offset+=2);

				offset += 4;
				values = [];

				switch (type) {
					case 1: // BYTE
					case 7: // UNDEFINED
						if (count > 4) {
							offset = data.LONG(offset) + offsets.tiffHeader;
						}

						for (ii = 0; ii < count; ii++) {
							values[ii] = data.BYTE(offset + ii);
						}

						break;

					case 2: // STRING
						if (count > 4) {
							offset = data.LONG(offset) + offsets.tiffHeader;
						}

						hash[tag] = data.STRING(offset, count - 1);

						continue;

					case 3: // SHORT
						if (count > 2) {
							offset = data.LONG(offset) + offsets.tiffHeader;
						}

						for (ii = 0; ii < count; ii++) {
							values[ii] = data.SHORT(offset + ii*2);
						}

						break;

					case 4: // LONG
						if (count > 1) {
							offset = data.LONG(offset) + offsets.tiffHeader;
						}

						for (ii = 0; ii < count; ii++) {
							values[ii] = data.LONG(offset + ii*4);
						}

						break;

					case 5: // RATIONAL
						offset = data.LONG(offset) + offsets.tiffHeader;

						for (ii = 0; ii < count; ii++) {
							values[ii] = data.LONG(offset + ii*4) / data.LONG(offset + ii*4 + 4);
						}

						break;

					case 9: // SLONG
						offset = data.LONG(offset) + offsets.tiffHeader;

						for (ii = 0; ii < count; ii++) {
							values[ii] = data.SLONG(offset + ii*4);
						}

						break;

					case 10: // SRATIONAL
						offset = data.LONG(offset) + offsets.tiffHeader;

						for (ii = 0; ii < count; ii++) {
							values[ii] = data.SLONG(offset + ii*4) / data.SLONG(offset + ii*4 + 4);
						}

						break;

					default:
						continue;
				}

				value = (count == 1 ? values[0] : values);

				if (tagDescs.hasOwnProperty(tag) && typeof value != 'object') {
					hash[tag] = tagDescs[tag][value];
				} else {
					hash[tag] = value;
				}
			}

			return hash;
		}

		function getIFDOffsets() {
			var Tiff = undefined, idx = offsets.tiffHeader;

			// Set read order of multi-byte data
			data.II(data.SHORT(idx) == 0x4949);

			// Check if always present bytes are indeed present
			if (data.SHORT(idx+=2) !== 0x002A) {
				return false;
			}
		
			offsets['IFD0'] = offsets.tiffHeader + data.LONG(idx += 2);
			Tiff = extractTags(offsets['IFD0'], tags.tiff);

			if ('ExifIFDPointer' in Tiff) {
				offsets['exifIFD'] = offsets.tiffHeader + Tiff.ExifIFDPointer;
			}

			if ('GPSInfoIFDPointer' in Tiff) {
				offsets['gpsIFD'] = offsets.tiffHeader + Tiff.GPSInfoIFDPointer;
			}
			return true;
		}
		
		// At the moment only setting of simple (LONG) values, that do not require offset recalculation, is supported
		function setTag(ifd, tag, value) {
			var offset, length, tagOffset, valueOffset = 0;
			
			// If tag name passed translate into hex key
			if (typeof(tag) === 'string') {
				var tmpTags = tags[ifd.toLowerCase()];
				for (hex in tmpTags) {
					if (tmpTags[hex] === tag) {
						tag = hex;
						break;	
					}
				}
			}
			offset = offsets[ifd.toLowerCase() + 'IFD'];
			length = data.SHORT(offset);
						
			for (i = 0; i < length; i++) {
				tagOffset = offset + 12 * i + 2;

				if (data.SHORT(tagOffset) == tag) {
					valueOffset = tagOffset + 8;
					break;
				}
			}
			
			if (!valueOffset) return false;

			
			data.LONG(valueOffset, value);
			return true;
		}
		

		// Public functions
		return {
			init: function(segment) {
				// Reset internal data
				offsets = {
					tiffHeader: 10
				};
				
				if (segment === undefined || !segment.length) {
					return false;
				}

				data.init(segment);

				// Check if that's APP1 and that it has EXIF
				if (data.SHORT(0) === 0xFFE1 && data.STRING(4, 5).toUpperCase() === "EXIF\0") {
					return getIFDOffsets();
				}
				return false;
			},
			
			EXIF: function() {
				var Exif;
				
				// Populate EXIF hash
				Exif = extractTags(offsets.exifIFD, tags.exif);

				// Fix formatting of some tags
				if (Exif.ExifVersion && o.typeOf(Exif.ExifVersion) === 'array') {
					for (var i = 0, exifVersion = ''; i < Exif.ExifVersion.length; i++) {
						exifVersion += String.fromCharCode(Exif.ExifVersion[i]);	
					}
					Exif.ExifVersion = exifVersion;
				}

				return Exif;
			},

			GPS: function() {
				var GPS;
				
				GPS = extractTags(offsets.gpsIFD, tags.gps);
				
				// iOS devices (and probably some others) do not put in GPSVersionID tag (why?..)
				if (GPS.GPSVersionID && o.typeOf(GPS.GPSVersionID) === 'array') { 
					GPS.GPSVersionID = GPS.GPSVersionID.join('.');
				}

				return GPS;
			},
			
			setExif: function(tag, value) {
				// Right now only setting of width/height is possible
				if (tag !== 'PixelXDimension' && tag !== 'PixelYDimension') return false;
				
				return setTag('exif', tag, value);
			},


			getBinary: function() {
				return data.SEGMENT();
			},

			purge: function() {
				data.init(null);
			}
		};
	}	

	return JPEG;
}()); //> JPEG


PNG = (function() {

	function PNG(binstr) {
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
	}

	return PNG;
}()); //> PNG


function BinaryReader() {
	var II = false, bin;

	// Private functions
	function read(idx, size) {
		var mv = II ? 0 : -8 * (size - 1), sum = 0, i;

		for (i = 0; i < size; i++) {
			sum |= (bin.charCodeAt(idx + i) << Math.abs(mv + i*8));
		}

		return sum;
	}

	function putstr(segment, idx, length) {
		var length = arguments.length === 3 ? length : bin.length - idx - 1;
		
		bin = bin.substr(0, idx) + segment + bin.substr(length + idx);
	}

	function write(idx, num, size) {
		var str = '', mv = II ? 0 : -8 * (size - 1), i;

		for (i = 0; i < size; i++) {
			str += String.fromCharCode((num >> Math.abs(mv + i*8)) & 255);
		}

		putstr(str, idx, size);
	}

	// Public functions
	return {
		II: function(order) {
			if (order === undefined) {
				return II;
			} else {
				II = order;
			}
		},

		init: function(binData) {
			II = false;
			bin = binData;
		},

		SEGMENT: function(idx, length, segment) {				
			switch (arguments.length) {
				case 1: 
					return bin.substr(idx, bin.length - idx - 1);
				case 2: 
					return bin.substr(idx, length);
				case 3: 
					putstr(segment, idx, length);
					break;
				default: return bin;	
			}
		},

		BYTE: function(idx) {
			return read(idx, 1);
		},

		SHORT: function(idx) {
			return read(idx, 2);
		},

		LONG: function(idx, num) {
			if (num === undefined) {
				return read(idx, 4);
			} else {
				write(idx, num, 4);
			}
		},

		SLONG: function(idx) { // 2's complement notation
			var num = read(idx, 4);

			return (num > 2147483647 ? num - 4294967296 : num);
		},

		STRING: function(idx, size) {
			var str = '';

			for (size += idx; idx < size; idx++) {
				str += String.fromCharCode(read(idx, 1));
			}

			return str;
		}
	};
}

}(window, document, mOxie));