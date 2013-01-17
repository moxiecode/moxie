/**
 * JPEGHeaders.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

define("moxie/runtime/html5/image/JPEGHeaders", [
	"moxie/runtime/html5/utils/BinaryReader"
], function(BinaryReader) {
	return function JPEGHeaders(data) {
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

				var max, i;

				// Check if data is jpeg
				var jpegHeaders = new JPEGHeaders(data);

				if (!jpegHeaders['headers']) {
					return false;
				}

				// Delete any existing headers that need to be replaced
				for (i = jpegHeaders['headers'].length; i > 0; i--) {
					var hdr = jpegHeaders['headers'][i - 1];
					read.SEGMENT(hdr.start, hdr.length, '');
				}
				jpegHeaders.purge();

				idx = read.SHORT(2) == 0xFFE0 ? 4 + read.SHORT(4) : 2;

				for (i = 0, max = headers.length; i < max; i++) {
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
				var array = [], i, ii, max;

				if (typeof(segment) === 'string') {
					array.push(segment);
				} else {
					array = segment;
				}

				for (i = ii = 0, max = headers.length; i < max; i++) {
					if (headers[i].app === app.toUpperCase()) {
						headers[i].segment = array[ii];
						headers[i].length = array[ii].length;
						ii++;
					}
					if (ii >= array.length) {
						break;
					}
				}
			},

			purge: function() {
				headers = [];
				read.init(null);
			}
		};
	};
});
