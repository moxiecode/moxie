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
	"moxie/core/utils/Basic"
], function(Basic) {
	
	return function() {
		this.read = function(op, blob) {
			var target = this, fr = new window.FileReader();

			(function() {
				var events = ['loadstart', 'progress', 'load', 'abort', 'error', 'loadend'];

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
	};
});
