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
@class moxie/runtime/test/xhr/XMLHttpRequest
@private
*/
define("moxie/runtime/test/xhr/XMLHttpRequest", [
	"moxie/runtime/test/Runtime",
	"moxie/core/utils/Basic",
	"moxie/core/utils/Url",
	"moxie/file/File",
	"moxie/file/Blob",
	"moxie/xhr/FormData",
	"moxie/core/Exceptions",
	"moxie/core/utils/Env"
], function(extensions, Basic, Url, File, Blob, FormData, x, Env) {
	
	function XMLHttpRequest() {
		var _state = XMLHttpRequest.OPENED;

		Basic.extend(this, {
			send: function(meta, data) {
				var target = this
				, upSpeed = 200 // kb/s
				, downSpeed = 100
				, upSize = 100 * 1024
				, downSize = 10 * 1024
				, uploaded = 0
				, downloaded = 0
				, interval = 50 // ms
				, upDelta = upSpeed / 1000 * interval
				, downDelta = downSpeed / 1000 * interval
				;

				if (data instanceof Blob) {
					upSize = data.size;
				} else if (data instanceof FormData && data.hasBlob()) {
					upSize = data.getBlob().size;
				}

				function updateUpProgress() {
					if (_state === XMLHttpRequest.DONE) {
						return;
					}

					uploaded += Math.floor(upDelta);

					if (uploaded < upSize) {
						target.trigger({
							type: 'UploadProgress',
							loaded: uploaded,
							total: upSize
						});
						setTimeout(updateUpProgress, interval);
					} else {
						target.trigger({
							type: 'UploadProgress',
							loaded: upSize,
							total: upSize
						});
						updateDownProgress();
					}
				}

				function updateDownProgress() {
					if (_state === XMLHttpRequest.DONE) {
						return;
					}

					downloaded += Math.floor(downDelta);

					if (downloaded < downSize) {
						target.trigger({
							type: 'Progress',
							loaded: downloaded,
							total: downSize
						});
						setTimeout(updateDownProgress, interval);
					} else {
						target.trigger({
							type: 'Progress',
							loaded: downSize,
							total: downSize
						});
						_state = XMLHttpRequest.DONE;
						target.trigger('Load');
					}
				}

				target.trigger('LoadStart');
				_state = XMLHttpRequest.LOADING;
				updateUpProgress();
			},

			getStatus: function() {
				return _state > XMLHttpRequest.OPENED ? 200 : 0;
			},

			getResponse: function(responseType) {
				var response = '{"jsonrpc" : "2.0", "result" : null, "id" : "id"}';

				if (_state !== XMLHttpRequest.DONE) {
					return Basic.inArray(responseType, ["", "text"]) !== -1 ? '' : null;
				}
				return responseType === 'json' && !!window.JSON ? JSON.parse(response) : response;
			},

			getAllResponseHeaders: function() {
				var now = new Date()
				, headers = [
					"Cache-Control:no-store, no-cache, must-revalidate",
					"Cache-Control:post-check=0, pre-check=0",
					"Connection:Keep-Alive",
					"Content-Length:49",
					"Content-Type:text/html",
					"Date:" + now.toUTCString(),
					"Expires:Mon, 26 Jul 1997 05:00:00 GMT",
					"Keep-Alive:timeout=15, max=96",
					"Last-Modified:" + now.toUTCString(),
					"Pragma:no-cache",
					"Server:Apache/2.0.64 (Unix) PHP/5.3.5 DAV/2",
					"X-Powered-By:PHP/5.3.5"
				];


				if (_state > XMLHttpRequest.OPENED) {
					return headers.join('\r\n');
				}
				return '';
			},

			abort: function() {
				_state = XMLHttpRequest.DONE;
				this.trigger('Abort');
			},

			destroy: function() {
				
			}
		});


		XMLHttpRequest.UNSENT = 0;
		XMLHttpRequest.OPENED = 1;
		XMLHttpRequest.HEADERS_RECEIVED = 2;
		XMLHttpRequest.LOADING = 3;
		XMLHttpRequest.DONE = 4;

	}

	return (extensions.XMLHttpRequest = XMLHttpRequest);
});
