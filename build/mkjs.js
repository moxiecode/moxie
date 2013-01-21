var fs = require("fs");
var utils = require("./utils");

var resolveModules = (function() {
	var resolved = []; // cache

	return function(modules, options) {

		function resolveId(id) {
			id = id.replace(/\./g, '/');

			if (options.rootNS) {
				id = id.replace(options.rootNS.replace(/\./g, '/').replace(/[\/]$/, '') + '/', '');
			}
			return id;
		}

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
		var extTplPath = options.baseDir + '/runtime/extensions.js';
		if (!fs.existsSync(extTplPath)) {
			console.info(extTplPath + ' cannot be found.');
			process.exit(1);
		}
		var extTpl = fs.readFileSync(extTplPath).toString();

		// get complete array of all involved modules
		modules = amdlc.parseModules(utils.extend({}, options, {
			from: modules
		}));

		// come up with the list of runtime modules to get included
		var overrides = {};
		var runtimes = (process.env.runtimes || 'html5,flash,silverlight,html4').split(/,/);

		if (runtimes.length) {
			runtimes.forEach(function(type) {
				var id = 'runtime/' + type + '/extensions';
				if (options.rootNS) {
					id = options.rootNS + '/' + id;
				}

				if (overrides[id]) {
					return; // continue
				}	

				var runtimeModules = [];
				modules.forEach(function(module) {
					if (fs.existsSync(options.baseDir + '/runtime/' + type + '/' + resolveId(module.id) + '.js')) {
						runtimeModules.push(resolveId(module.id));
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
					filePath: resolveId(id)
				};
			});

			// add runtimes and their modules
			Array.prototype.push.apply(modules, amdlc.parseModules(utils.extend({}, options, {
				from: runtimes.map(function(type) { return 'runtime/' + type + '/Runtime.js'; }),
				moduleOverrides: overrides
			})));

			return (resolved = modules);
		}
	}
}());

module.exports = {
	resolveModules: resolveModules
};