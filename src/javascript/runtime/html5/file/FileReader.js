/**
 * FileReader.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

define("runtime/html5/file/FileReader", ["o"], function(o) {

	return function() {

		this.read = function(op, blob) {
			var target = this, fr = new window.FileReader();

			(function() {
				var events = ['loadstart', 'progress', 'load', 'abort', 'error', 'loadend'];

				function reDispatch(e) {
					if (!!~o.inArray(e.type, ['progress', 'load'])) {
						target.result = fr.result;
					}
					target.trigger(e);
				}

				function removeEventListeners() {
					o.each(events, function(name) {
						fr.removeEventListener(name, reDispatch);
					});

					fr.removeEventListener('loadend', removeEventListeners);
				}

				o.each(events, function(name) {
					fr.addEventListener(name, reDispatch);
				});

				fr.addEventListener('loadend', removeEventListeners);
			}());

			if (o.typeOf(fr[op]) === 'function') {
				fr[op](blob.getSource());
			}
		};
	};
});
