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
@class moxie/runtime/flash/file/FileInput
@private
*/
define("moxie/runtime/flash/file/FileInput", [
	"moxie/runtime/flash/Runtime"
], function(extensions) {
	
	var FileInput = {		
		init: function(options) {
			this.getRuntime().shimExec.call(this, 'FileInput', 'init', {
				name: options.name,
				accept: options.accept,
				multiple: options.multiple
			});
			this.trigger('ready');
		}
	};

	return (extensions.FileInput = FileInput);
});

