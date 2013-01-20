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
	var type = "@type@";
	var modules = [@modules@];

	// define dependecies for extensions hash
	var deps = ["Basic"];
	for (var i in modules) {
		deps.push("moxie/runtime/" + type + "/" + modules[i]);
	}

	define("runtime/" + type + "/extensions", deps, function(Basic) {
		// strip of Basic
		var modules = [].slice.call(arguments, 1);
		
		// generate extensions hash
		var extensions = {};
		Basic.each(, function(ext, i) {
			// extract class name
			var name = modules[i].replace(/^[\s\S]+?\/([^\/]+)$/, '$1');
			// class name / extension id
			extensions[name] = ext;
		});

		return extensions;
	});
}());
