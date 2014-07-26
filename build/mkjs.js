var fs = require('fs');
var utils = require('./utils');
var tools = require('./tools');

var resolveModules = (function() {
	var resolved = []; // cache

	return function(modules, options) {

		function getAvailbleRuntimes() {
			var runtimesDir = options.baseDir + '/runtime';

			// each runtime is represented by a directory inside runtime/ dir
			var files = fs.readdirSync(runtimesDir)
			, runtimes = []
			;
			files.forEach(function(file) {
				if (fs.lstatSync(runtimesDir + '/' + file).isDirectory()) {
					runtimes.push(file);
				}
			});
			return runtimes;
		}


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
		var runtimes;
		if (process.env.runtimes == 'all') {
			runtimes = getAvailbleRuntimes();
		} else {
			runtimes = (process.env.runtimes || 'html5,flash,silverlight,html4').split(/,/);
		}		


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

var addCompat = function(options) {
	var buffer = fs.readFileSync(options.baseDir + '/o.js');

	// add normal
	if (fs.existsSync(options.targetDir + "/moxie.js")) {
		fs.appendFileSync(options.targetDir + "/moxie.js", buffer);
	}

	// ... minified
	if (fs.existsSync(options.targetDir + "/moxie.min.js")) {
		fs.appendFileSync(options.targetDir + "/moxie.min.js", tools.uglify(options.baseDir + '/o.js', null, {
			sourceBase: options.baseDir
		}));
	}

	// .. dev/cov
	['dev', 'cov'].forEach(function(suffix) {
		var fileName = "moxie." + suffix + ".js";
		if (fs.existsSync(options.targetDir + "/" + fileName)) {
			fs.appendFileSync(options.targetDir + "/" + fileName, 
				"\n(function() {\n" +
				"	var baseDir = '';\n" +
				"	var scripts = document.getElementsByTagName('script');\n" +
				"	for (var i = 0; i < scripts.length; i++) {\n" +
				"		var src = scripts[i].src;\n" +
				"		if (src.indexOf('/" + fileName + "') != -1) {\n" +
				"			baseDir = src.substring(0, src.lastIndexOf('/'));\n" +
				"		}\n" +
				"	}\n" +
				"	document.write('<script type=\"text/javascript\" src=\"' + baseDir + '/../../" + options.baseDir + "/o.js\"></script>');\n" +
				"})();\n"
			);
		}
	});
};

module.exports = {
	resolveModules: resolveModules,
	addCompat: addCompat
};