/**
 * extensions.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

(function() {
	// when compiled dynamically @type@ and @modules@ will be replaced correspondingly with runtime type and modules to extend
	var type = "%type%";
	var modules = [%modules%];

	// define dependecies for extensions hash
	var depIds = ["moxie/core/utils/Basic"];
	for (var i in modules) {
		depIds.push("moxie/runtime/" + type + "/" + modules[i]);
	}

	/**
	@class moxie/runtime/%type%/extensions
	@private
	*/
	define("moxie/runtime/" + type + "/extensions", depIds, function(Basic) { 
		// strip of Basic
		var deps = [].slice.call(arguments, 1);
		
		// generate extensions hash
		var extensions = {};
		Basic.each(deps, function(dep, i) {
			// extract class name
			var name = modules[i].replace(/^[\s\S]+?\/([^\/]+)$/, '$1');
			// class name / extension
			extensions[name] = dep;
		});

		return extensions;
	});
}());
