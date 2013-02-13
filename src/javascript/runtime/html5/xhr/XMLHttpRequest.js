/**
 * XMLHttpRequest.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true, laxcomma:true */
/*global define:true, unescape:true */

/**
@class moxie/runtime/html5/xhr/XMLHttpRequest
@private
*/
define("moxie/runtime/html5/xhr/XMLHttpRequest", [
	"moxie/runtime/html5/Runtime",
	"moxie/core/utils/Basic",
	"moxie/file/File",
	"moxie/file/Blob",
	"moxie/xhr/FormData",
	"moxie/core/Exceptions",
	"moxie/core/utils/Env",
	"moxie/core/JSON"
], function(extensions, Basic, File, Blob, FormData, x, Env, parseJSON) {
	
	function XMLHttpRequest() {
		var _xhr2, filename;

		Basic.extend(this, {
			send: function(meta, data) {
				var target = this
				, mustSendAsBinary = false
				, fd
				;

				_xhr2 = new window.XMLHttpRequest();

				// extract file name
				filename = meta.url.replace(/^.+?\/([\w\-\.]+)$/, '$1').toLowerCase();

				_xhr2.open(meta.method, meta.url, meta.async, meta.user, meta.password);

				// set request headers
				if (!Basic.isEmptyObj(meta.headers)) {
					Basic.each(meta.headers, function(value, header) {
						_xhr2.setRequestHeader(header, value);
					});
				}

				// prepare data to be sent and convert if required
				if (data instanceof Blob) {
					if (data.isDetached()) {
						mustSendAsBinary = true;
					}
					data = data.getSource();
				} else if (data instanceof FormData) {
					if (data.hasBlob() && data.getBlob().isDetached()) {
						// ... and here too
						data = _prepareMultipart.call(target, data);
						mustSendAsBinary = true;
					} else {
						fd = new window.FormData();

						data.each(function(value, name) {
							if (value instanceof Blob) {
								fd.append(name, value.getSource());
							} else {
								fd.append(name, value);
							}
						});
						data = fd;
					}
				}

				if ("" !== meta.responseType) {
					if ('json' === meta.responseType && !Env.can('receive_response_type', 'json')) { // we can fake this one
						_xhr2.responseType = 'text';
					} else {
						_xhr2.responseType = meta.responseType;
					}
				}

				// attach event handlers
				(function() {
					var events = ['loadstart', 'progress', 'abort', 'error', 'load', 'timeout'];

					function reDispatch(e) {
						target.trigger(e);
					}

					function dispatchUploadProgress(e) {
						target.trigger({
							type: 'UploadProgress',
							loaded: e.loaded,
							total: e.total
						});
					}

					function removeEventListeners() {
						Basic.each(events, function(name) {
							_xhr2.removeEventListener(name, reDispatch);
						});

						_xhr2.removeEventListener('loadend', removeEventListeners);

						if (_xhr2.upload) {
							_xhr2.upload.removeEventListener('progress', dispatchUploadProgress);
						}
					}

					Basic.each(events, function(name) {
						_xhr2.addEventListener(name, reDispatch);
					});

					if (_xhr2.upload) {
						_xhr2.upload.addEventListener('progress', dispatchUploadProgress);
					}

					_xhr2.addEventListener('loadend', removeEventListeners);
				}());


				// send ...
				if (!mustSendAsBinary) {
					_xhr2.send(data);
				} else {
					if (_xhr2.sendAsBinary) { // Gecko
						_xhr2.sendAsBinary(data);
					} else { // other browsers having support for typed arrays
						(function() {
							// mimic Gecko's sendAsBinary
							var ui8a = new Uint8Array(data.length);
							for (var i = 0; i < data.length; i++) {
								ui8a[i] = (data.charCodeAt(i) & 0xff);
							}
							_xhr2.send(ui8a.buffer);
						}());
					}
				}
			},

			getStatus: function() {
				try {
					if (_xhr2) {
						return _xhr2.status;
					}
				} catch(ex) {}
			},

			getResponse: function(responseType) {
				var I = this.getRuntime();

				try {
					if (_xhr2) {
						if ('blob' === responseType) {
							var file = new File(I.uid, _xhr2.response);
							file.name = filename;
							return file;
						} else if ('json' === responseType && !Env.can('receive_response_type', 'json')) {
							return parseJSON(_xhr2.response);
						} else {
							return _xhr2.response;
						}
					}
				} catch(ex) {}
			},

			abort: function() {
				if (_xhr2) {
					_xhr2.abort();
				}
			}
		});

		function _prepareMultipart(fd) {
			var boundary = '----moxieboundary' + new Date().getTime()
			, dashdash = '--'
			, crlf = '\r\n'
			, multipart = ''
			, I = this.getRuntime()
			;

			if (!I.can('send_binary_string')) {
				throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
			}

			_xhr2.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

			// append multipart parameters
			fd.each(function(value, name) {
				if (value instanceof Blob) {
					// Build RFC2388 blob
					multipart += dashdash + boundary + crlf +
						'Content-Disposition: form-data; name="' + name + '"; filename="' + unescape(encodeURIComponent(value.name || 'blob')) + '"' + crlf +
						'Content-Type: ' + value.type + crlf + crlf +
						value.getSource() + crlf;
				} else {
					multipart += dashdash + boundary + crlf +
						'Content-Disposition: form-data; name="' + name + '"' + crlf + crlf +
						unescape(encodeURIComponent(value)) + crlf;
				}
			});

			multipart += dashdash + boundary + dashdash + crlf;

			return multipart;
		}
	}

	return (extensions.XMLHttpRequest = XMLHttpRequest);
});