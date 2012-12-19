/**
 * BlobBuilder.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define('file/BlobBuilder', ['o', 'file/Blob', 'file/File', 'file/FileReaderSync'], function(o, Blob, File, FileReaderSync) {	

	var x = o.Exceptions;

	function BlobBuilder() {
		var sources = [];
		
		function _getData() {
			var blob, data = '';

			o.each(sources, function(src) {
				if (o.typeOf(src) === 'string') {
					data += src;
				} else if (src instanceof Blob) {
					var frs = new FileReaderSync;
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

				blob = new Blob(null, {
					size: data.length,
					type: type
				});

				blob.detach(data);
				return blob;
			},
			
			getFile: function(type, name) {
				var data = _getData(), blob;

				blob = new File(null, {
					size: data.length,
					type: type,
					name: name
				});

				blob.detach(data);
				return blob;
			},

			destroy: function() {
				sources = [];
			}
		});
	}
	
	return BlobBuilder;
});