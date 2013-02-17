/**
 * o.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global window:true */

/**
Globally exposed namespace with the most frequently used public classes and handy methods.

@class o
@static
@private
*/
(function() {
	var o = {};

	// directly add some public classes
	// (we do it dynamically here, since for custom builds we cannot know beforehand what modules were included)
	(function addAlias(ns) {
		for (name in ns) {
			var itemType = typeof(ns[name]);
			if (itemType === 'object') {
				addAlias(ns[name]);
			} else if (itemType === 'function') {
				o[name] = ns[name];
			}
		}
	})(window.moxie);

	// add Env manually
	o.Env = window.moxie.core.utils.Env;

	// expose globally
	window.mOxie = o;
	if (!window.o) {
		window.o = o;
	}
	return o;
})();
