/**
 * FileInput.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/test/file/FileInput
@private
*/
define("moxie/runtime/test/file/FileInput", [
	"moxie/runtime/test/Runtime",
	"moxie/core/utils/Basic"
], function(extensions, Basic) {
	
	function FileInput() {
		var _files = [];

		Basic.extend(this, {
			init: function() {
				// ready event is perfectly asynchronous
				this.trigger({
					type: 'ready',
					async: true
				});
			},

			getFiles: function() {
				return _files;
			},

			destroy: function() {
				_files = null;
			}
		});
	}

	return (extensions.FileInput = FileInput);
});