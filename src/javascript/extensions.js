(function() {
	var type = "@type@";
	var modules = [@modules@];
	
	var extensions = ["o"];
	for (var i in modules) {
		extensions.push("runtime/" + type + "/" + modules[i]);
	}

	define("runtime/" + type + "/extensions", extensions, function() {
		var extObj = {};
		o.each(arguments.slice(1), function(ext, i) {
			var name = modules[i].replace(/^[\s\S]+?\/([^\/]+)$/, '$1');
			extObj[name] = ext;
		});
		return extObj;
	});
}());
