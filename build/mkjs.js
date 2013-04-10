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

		// get complete array of all involved modules
		modules = amdlc.parseModules(utils.extend({}, options, {
			from: modules.map(function(module) { return module.replace(/\.js$/, '') + '.js'; })
		}));

		// come up with the list of runtime modules to get included
		var runtimes = (process.env.runtimes || 'html5,flash,silverlight,html4').split(/,/);

		var runtimeModules = [];
		if (runtimes.length) {
			runtimes.forEach(function(type) {
				modules.forEach(function(module) {
					var id = 'runtime/' + type + '/' + resolveId(module.id);
					if (fs.existsSync(options.baseDir + "/" + id + '.js')) {
						runtimeModules.push(id + '.js');
					}
				});
			});

			// add runtimes and their modules
			Array.prototype.push.apply(modules, amdlc.parseModules(utils.extend({}, options, {
				from: runtimeModules
			})));

			return (resolved = modules);
		}
	}
}());

module.exports = {
	resolveModules: resolveModules
};