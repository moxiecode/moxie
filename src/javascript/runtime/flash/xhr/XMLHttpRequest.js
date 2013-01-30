/**
 * XMLHttpRequest.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */
/*global define:true */

/**
@class moxie/runtime/flash/xhr/XMLHttpRequest
@private
*/
define("moxie/runtime/flash/xhr/XMLHttpRequest", [
	"moxie/core/utils/Basic",
	"moxie/file/Blob",
	"moxie/file/File",
	"moxie/file/FileReaderSync",
	"moxie/xhr/FormData",
	"moxie/runtime/Transporter",
	"moxie/core/JSON"
], function(Basic, Blob, File, FileReaderSync, FormData, Transporter, JSON) {
	return {
		send: function(meta, data) {
			var target = this, self = target.getRuntime();

			function send() {
				self.shimExec.call(target, 'XMLHttpRequest', 'send', meta, data);
			}

			function appendBlob(name, blob) {
				self.shimExec.call(target, 'XMLHttpRequest', 'appendBlob', name, blob.getSource().id);
				data = null;
				send();
			}

			function attachBlob(name, blob) {
				var tr = new Transporter();

				tr.bind("TransportingComplete", function() {
					appendBlob(name, this.result);
				});

				tr.transport(blob.getSource(), blob.type, {
					ruid: self.uid
				});
			}

			// copy over the headers if any
			if (!Basic.isEmptyObj(meta.headers)) {
				Basic.each(meta.headers, function(value, header) {
					self.shimExec.call(target, 'XMLHttpRequest', 'setRequestHeader', name, value.toString()); // Silverlight doesn't accept integers into the arguments of type object
				});
			}

			// transfer over multipart params and blob itself
			if (data instanceof FormData) {
				Basic.each(data._fields, function(value, name) {
					if (!(value instanceof Blob)) {
						self.shimExec.call(target, 'XMLHttpRequest', 'append', name, value.toString());
					}
				});

				if (!data._blob) {
					data = null;
					send();
				} else {
					var blob = data._fields[data._blob];
					if (blob.isDetached()) {
						attachBlob(data._blob, blob);
					} else {
						appendBlob(data._blob, blob);
					}
				}
			} else if (data instanceof Blob) {
				data = data.uid; // something wrong here
			} else {
				send();
			}
		},

		getResponse: function(responseType) {
			var frs, blob, self = this.getRuntime();

			blob = self.shimExec.call(this, 'XMLHttpRequest', 'getResponseAsBlob');

			if (blob) {
				blob = new File(self.uid, blob);

				if ('blob' === responseType) {
					return blob;
				} else if (!!~Basic.inArray(responseType, ["", "text"])) {
					frs = new FileReaderSync();
					return frs.readAsText(blob);
				} else if ('arraybuffer' === responseType) {

					// do something

				} else if ('json' === responseType) {
					frs = new FileReaderSync();

					this.bind('Exception', function(e, err) {
						// throw JSON parse error
						// console.info(err);
					});

					return JSON.parse(frs.readAsText(blob));
				}
			}

			return null;
		},

		abort: function(upload_complete_flag) {
			var self = this.getRuntime();

			self.shimExec.call(this, 'XMLHttpRequest', 'abort');

			this.dispatchEvent('readystatechange');
			// this.dispatchEvent('progress');
			this.dispatchEvent('abort');

			if (!upload_complete_flag) {
				// this.dispatchEvent('uploadprogress');
			}
		}
	};
});