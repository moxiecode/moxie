/**
 * Extension.js
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
	var type = "@type@";
	var modules = [@modules@];

	var extensions = ["o"];
	for (var i in modules) {
		extensions.push("runtime/" + type + "/" + modules[i]);
	}

	define("runtime/" + type + "/extensions", extensions, function(o) {
		var extObj = {};
		o.each(Array.prototype.slice.call(arguments, 1), function(ext, i) {
			var name = modules[i].replace(/^[\s\S]+?\/([^\/]+)$/, '$1');
			extObj[name] = ext;
		});
		return extObj;
	});
}());
