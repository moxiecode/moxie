/**
 * FileReader.js
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
@class moxie/runtime/html5/file/FileReader
@private
*/
define("moxie/runtime/html5/file/FileReader", [
	"moxie/runtime/html5/Runtime",
	"moxie/core/utils/Basic"
], function(extensions, Basic) {
	
	function FileReader() {
		
		this.read = function(op, blob) {
			var target = this, fr = new window.FileReader();

			(function() {
				var events = ['loadstart', 'progress', 'load', 'abort', 'error'];

				function reDispatch(e) {
					if (!!~Basic.inArray(e.type, ['progress', 'load'])) {
						target.result = fr.result;
					}
					target.trigger(e);
				}

				function removeEventListeners() {
					Basic.each(events, function(name) {
						fr.removeEventListener(name, reDispatch);
					});
					fr.removeEventListener('loadend', removeEventListeners);
				}

				Basic.each(events, function(name) {
					fr.addEventListener(name, reDispatch);
				});
				fr.addEventListener('loadend', removeEventListeners);
			}());

			if (Basic.typeOf(fr[op]) === 'function') {
				fr[op](blob.getSource());
			}
		};
	}

	return (extensions.FileReader = FileReader);
});
