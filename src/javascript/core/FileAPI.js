/**
 * FileAPI.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

;(function(window, document, o, undefined) {
	
var x = o.Exceptions;	
	



o.BlobBuilder = (function() {
	
	function BlobBuilder() {
		var sources = [];
		
		function _getData() {
			var blob, data = '';

			o.each(sources, function(src) {
				if (o.typeOf(src) === 'string') {
					data += src;
				} else if (src instanceof o.Blob) {
					var frs = new o.FileReaderSync;
					data += frs.readAsBinaryString(src);
				}
			});	
			return data;
		}
		
		o.extend(this, {
			
			uid: o.guid('uid_'),
						
			append: function(data) {
				if (o.typeOf(data) !== 'string' || !(data instanceof o.Blob)) {
					throw new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);
				}
				sources.push(data);
			},
			
			getBlob: function(type) {
				var data = _getData(), blob;

				blob = new o.Blob(null, {
					size: data.length,
					type: type
				});

				blob.detach(data);
				return blob;
			},
			
			getFile: function(type, name) {
				var data = _getData(), blob;

				blob = new o.File(null, {
					size: data.length,
					type: type,
					name: name
				});

				blob.detach(data);
				return blob;
			},

			destroy: function() {
				sources = [];
			},

			constructor: o.BlobBuilder
		});
	}
	
	return BlobBuilder;
}());
	

	
}(window, document, mOxie));










