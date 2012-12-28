var fs = require("fs");
var sys = require('sys');
var path = require("path");
var tools = require('./build/BuildTools');
var uglify = tools.uglify;
var less = tools.less;
var yuidoc = tools.yuidoc;
var jshint = tools.jshint;
var zip = tools.zip;
var mkswf = tools.mkswf;
var wiki = tools.wiki;
var amdlc = require('amdlc');

desc("Default build task");
task("default", ["minifyjs", "yuidoc"], function (params) {});

desc("Build release package");
task("release", ["default", "package"], function (params) {});

desc("Build libs for external usage");
task("lib", ["mkswf", "minifyjs", "package"]);

desc("Minify JS files");
task("minifyjs", [], function () {
	var modules = Array.prototype.slice.call(arguments);
	var baseDir = 'src/javascript';
	var tmpDir = "tmp/o_" + (new Date()).getTime();

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
	}

	// remove old files if they're there
	try {
		fs.unlinkSync("js/moxie.min.js");
		fs.unlinkSync("js/moxie.dev.js");
		fs.unlinkSync("js/moxie.js");
	} catch(ex) {}

	var options = {
	    compress: true,
	    excludeRootNamespaceFromPath: true,
	    verbose: true,
	    outputSource: "js/moxie.js",
	    outputMinified: "js/moxie.min.js",
	    outputDev: "js/moxie.dev.js"
	};

	amdlc.compileMinified(modules, options);
	amdlc.compileSource(modules, options);
	amdlc.compileDevelopment(modules, options);
});


desc("Compile Flash component");
task("mkswf", [], function(params) {
	mkswf({
		src: "./src/flash/src",
		libs: ["./src/flash/blooddy_crypto.swc"],
		input: "./src/flash/src/Moxie.as",
		output: "./js/Moxie.swf"
	}, complete);
}, true);

desc("Generate documentation using YUIDoc");
task("yuidoc", [], function (params) {
	yuidoc("src/javascript/core", "docs");
}, true);


desc("Generate wiki pages");
task("wiki", ["yuidoc"], function() {
	wiki("git@github.com:moxiecode/moxie.wiki.git", "wiki", "docs");
});


desc("Runs JSHint on source files");
task("jshint", [], function (params) {
	jshint("src", {
		curly: true
	});
});

desc("Package library");
task("package", [], function (params) {
	var releaseInfo = tools.getReleaseInfo("./changelog.txt");
	tools.addReleaseDetailsTo("./js", releaseInfo);

	var tmpDir = "./tmp";
	if (path.existsSync(tmpDir)) {
		tools.rmDir(tmpDir);
	}
	fs.mkdirSync(tmpDir, 0755);

	// User package
	zip([
		"js",
		["readme.md", "readme.txt"],
		"changelog.txt",
		"license.txt"
	], path.join(tmpDir, "moxie_" + releaseInfo.fileVersion + ".zip"));

	// Development package
	zip([
		"src",
		"js",
		"tests",
		"build",
		"Jakefile.js",		
		["readme.md", "readme.txt"],
		"changelog.txt",
		"license.txt"
	], path.join(tmpDir, "moxie_" + releaseInfo.fileVersion + "_dev.zip"));
});
