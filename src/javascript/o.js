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
/*global define:true */

/**
Globally exposed namespace with the most frequently used public classes and handy methods.

@class o
@static
@private
*/
define('o', [
	"moxie/core/utils/Basic",
	"moxie/core/utils/Dom",
	"moxie/core/I18n"	
], function(Basic, Dom, I18n) {

	var o = {};

	// directly add some public classes 
	// (we do it dynamically here, since for custom builds we cannot know beforehand what modules were included)
	Basic.each(exposedModules, function(id) {
		var className = id.replace(/^[\s\S]+?\/([^\/]+)$/, '$1');
		if (modules[id]) {
			o[className] = modules[id];
		}
	});

	// add basic handy methods
	Basic.extend(o, Basic, Dom, I18n);

	// expose globally
	window.mOxie = o;
	if (!window.o) {
		window.o = o;
	}
	return o;
});