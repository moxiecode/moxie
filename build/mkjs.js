var fs = require("fs");

var resolveModules = (function() {
	var resolved = []; // cache

	return function(modules, baseDir) {
		// there is no need to reparse if we already did this once
		if (resolved.length) {
			return resolved;
		}

		var amdlc = require('amdlc');

		// if arguments array was passed directly, make sure we are working on real array
		modules = Array.prototype.slice.call(modules);

		if (!modules.length) {
			modules = ["file/FileInput", "xhr/XMLHttpRequest", "image/Image"];
		}

		// check if our template for runtime extensions file exists
		var extTplPath = baseDir + '/runtime/extensions.js';
		if (!fs.existsSync(extTplPath)) {
			console.info(extTplPath + ' cannot be found.');
			process.exit(1);
		}
		var extTpl = fs.readFileSync(extTplPath).toString();

		// get complete array of all involved modules
		modules = amdlc.parseModules({
		    from: modules,
		    expose: ["o", "mOxie"],
		    baseDir: baseDir
		});

		// come up with the list of runtime modules to get included
		var overrides = {};
		var runtimes = (process.env.runtimes || 'html5,flash,silverlight,html4').split(/,/);

		if (runtimes.length) {
			runtimes.forEach(function(type) {
				var id = 'runtime/' + type + '/extensions';
				if (overrides[id]) {
					return; // continue
				}	

				var runtimeModules = [];
				modules.forEach(function(module) {
					if (fs.existsSync(baseDir + '/runtime/' + type + '/' + module.id + '.js')) {
						runtimeModules.push(module.id);
					}
				});

				var source = extTpl.replace(/@([^@]+)@/g, function($0, $1) {
					switch ($1) { 
						case 'type': 
							return type;
						case 'modules':
							return '"' + runtimeModules.join('","')  +'"';
					}
				});

				overrides[id] = {
					source: source,
					filePath: id + '.js'
				};
			});

			// add runtimes and their modules
			Array.prototype.push.apply(modules, amdlc.parseModules({
				from: runtimes.map(function(type) { return 'runtime/' + type + '/Runtime.js'; }),
				baseDir: baseDir,
				expose: ["o", "mOxie"],
				moduleOverrides: overrides
			}));

			return (resolved = modules);
		}
	}
}());

module.exports = {
	resolveModules: resolveModules
};