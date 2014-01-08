/**
 * FileReader.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/googledrive/file/FileReader
@private
*/
define("moxie/runtime/googledrive/file/FileReader", [
	"moxie/runtime/googledrive/Runtime",
	"moxie/core/utils/Encode",
	"moxie/core/utils/Basic"
], function(extensions, Encode, Basic) {
	
	function FileReader() {
		var self = this, _fr, _xhr, _convertToBinary = false;

		Basic.extend(this, {

			read: function(op, blob) {
				var target = this;

				blob = blob.getSource();

				_xhr = new window.XMLHttpRequest();
				_xhr.open('GET', blob.downloadUrl);
				
				if ('gapi' in window) {
					_xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
				}

				if (blob.range) {
					_xhr.setRequestHeader('Range', 'bytes=' + blob.range[0] + '-' + (blob.range[1] - 1));
				}

				_xhr.responseType = 'blob';
				
				_xhr.onprogress = function(e) {
					target.trigger(e);
				};

				_xhr.onload = function(e) {
					_fr = new window.FileReader();

					_fr.onload = function(e) {
						target.trigger(e);
					};

					_fr.onloadend = function() {
						self.destroy();
					};

					if (Basic.typeOf(_fr[op]) === 'function') {
						_convertToBinary = false;
						_fr[op](this.response);
					} else if (op === 'readAsBinaryString') { // readAsBinaryString is depricated in general and never existed in IE10+
						_convertToBinary = true;
						_fr.readAsDataURL(this.response);
					}
				};

				_xhr.onerror = function(e) {
					target.trigger(e);
				};

				_xhr.send();
			},

			getResult: function() {
				return _fr && _fr.result ? (_convertToBinary ? _toBinary(_fr.result) : _fr.result) : null;
			},

			abort: function() {
				if (_xhr) {
					_xhr.abort();
				}
			},

			destroy: function() {
				self = _xhr = _fr = null;
			}
		});

		function _toBinary(str) {
			return Encode.atob(str.substring(str.indexOf('base64,') + 7));
		}
	}

	return (extensions.FileReader = FileReader);
});
