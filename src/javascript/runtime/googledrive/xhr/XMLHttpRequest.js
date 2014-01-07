/**
 * XMLHttpRequest.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/googledrive/xhr/XMLHttpRequest
@private
*/
define("moxie/runtime/googledrive/xhr/XMLHttpRequest", [
	"moxie/runtime/googledrive/Runtime",
	"moxie/runtime/html5/xhr/XMLHttpRequest",
	"moxie/file/File",
	"moxie/file/FileReader",
	"moxie/runtime/googledrive/file/FileReader",
	"moxie/xhr/FormData",
	"moxie/core/utils/Basic",
	"moxie/core/Exceptions"
], function(extensions, Html5XHR, File, FileReader, GoogleDriveFileReader, FormData, Basic, x) {
	
	function XMLHttpRequest() {
		var self = this;

		Html5XHR.call(this);

		var Html5Send = this.send;

		Basic.extend(this, {
			send: function(meta, data) {
				var target = this, file, fr;

				if (data instanceof FormData && data.hasBlob()) {
					file = data.getBlob();

					fr = new FileReader();

					fr.onload = function() {
						data.append(data.getBlobName(), new File(null, {
							name: file.name || '',
							type: file.type,
							size: file.size,
							lastModifiedDate: file.lastModifiedDate,
							data: this.result
						}));

						file.destroy();

						Html5Send.call(target, meta, data);
					};

					fr.readAsBinaryString(file);
				}

			}
		});
	}

	return (extensions.XMLHttpRequest = XMLHttpRequest);
});


