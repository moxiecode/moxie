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
@class moxie/runtime/googledrive/utils/Loader
@private
*/
define("moxie/runtime/googledrive/utils/Loader", [], function() {

	var loadScript = function(url, cb) {
		var head, script, cbCalled = false;

		head = document.getElementsByTagName('head')[0];
		script = document.createElement('script');
		script.type = 'text/javascript';

		script.onreadystatechange = function () {
			if (this.readyState == 'complete' && !cbCalled) {
				cbCalled = true;
				cb();
			}
		}
		
		script.onload = function() {
			if (!cbCalled) {
				cbCalled = true;
				cb();
			}
		};

		script.src = url;
		head.appendChild(script);
		return script;
	};

	
	return {
		loadScript: loadScript
	};
});