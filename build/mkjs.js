var fs = require('fs');
var utils = require('./utils');
var tools = require('./tools');


function getAvailbleRuntimes(baseDir) {
	var runtimesDir = baseDir + '/runtime';

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


/**
@param {Array} paths Array of module path that can be extended with runtimes
@param {Object} options
	@param {String} options.baseDir
	@param {String|Array} [options.runtimes=all]
@return {Array} Array of paths to extensions
*/
function getExtensionPaths4(paths, options) {
	var runtimes = options.runtimes;
	var resolvedPaths = [];

	if (runtimes == 'all') {
		runtimes = getAvailbleRuntimes(options.baseDir);
	} else {
		runtimes = (process.env.runtimes || 'html5,flash,silverlight,html4').split(/,/);
	}

	if (runtimes.length) {
		runtimes.forEach(function(type) {
			paths.forEach(function(path) {
				path = options.baseDir + '/runtime/' + type + '/' + path.replace(/(^\/|\.js$)/, '') + '.js';
				if (fs.existsSync(path)) {
					resolvedPaths.push(path);
				}
			});
		});
	}

	return resolvedPaths;
}



var resolveModules = (function() {
	var resolved = []; // cache

	return function(modules, options) {

		


		

		// there is no need to reparse if we already did this once
		if (resolved.length && !options.force) {
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
		fs.appendFileSync(options.targetDir + "/moxie.js", "\n" + buffer);
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
				"\n\n(function() {\n" +
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

var addDebug = function(srcPath, enable) {
	enable = enable === undefined ? true : enable;

	if (fs.existsSync(srcPath)) {
		var buffer = fs.readFileSync(srcPath);
		fs.writeFileSync(srcPath, ";var MXI_DEBUG = "+enable+";\n" + buffer);
	}
};


module.exports = {
	resolveModules: resolveModules,
	getExtensionPaths4: getExtensionPaths4,
	addCompat: addCompat,
	addDebug: addDebug
};


