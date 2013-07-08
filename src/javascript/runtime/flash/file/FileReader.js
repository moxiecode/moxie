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
@class moxie/runtime/flash/file/FileReader
@private
*/
define("moxie/runtime/flash/file/FileReader", [
	"moxie/runtime/flash/Runtime",
	"moxie/core/utils/Encode"
], function(extensions, Encode) {

	var _result = '';

	function _formatData(data, op) {
		switch (op) {
			case 'readAsText':
				return Encode.atob(data, 'utf8');
			case 'readAsBinaryString':
				return Encode.atob(data);
			case 'readAsDataURL':
				return data;
		}
		return null;
	}

	var FileReader = {
		read: function(op, blob) {
			var target = this, self = target.getRuntime();

			// special prefix for DataURL read mode
			if (op === 'readAsDataURL') {
				_result = 'data:' + (blob.type || '') + ';base64,';
			}

			target.bind('Progress', function(e, data) {
				if (data) {
					_result += _formatData(data, op);
				}
			});

			return self.shimExec.call(this, 'FileReader', 'readAsBase64', blob.uid);
		},

		getResult: function() {
			return _result;
		},

		destroy: function() {
			_result = null;
		}
	};

	return (extensions.FileReader = FileReader);
});