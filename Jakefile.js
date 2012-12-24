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

desc("Parse modules");
task("parse", [], function() {
	var baseDir = 'src/javascript';
	var modules = amdlc.parseModules({
	    from: baseDir + "/o.js",
	    baseDir: baseDir,
	    moduleOverrides: {

	    }
	});
	console.info(modules);
});

desc("Minify JS files");
task("minifyjs", [], function (modules) {
	var baseDir = 'src/javascript';
	var tmpDir = "tmp/o_" + (new Date()).getTime();
	
	// check if our template for runtime extensions file exists
	var extTplPath = baseDir + '/runtime/extensions.js';
	if (!fs.existsSync(extTplPath)) {
		console.info(extTplPath + ' cannot be found.');
		process.exit(1);
	}
	var extTpl = fs.readFileSync(extTplPath).toString();

	// parse requested modules and resolve all dependencies
	modules = amdlc.parseModules({
	    from: baseDir + "/o.js",
	    baseDir: baseDir,
	    moduleOverrides: {

	    }
	});


	var overrides = {};
	var runtimes = (process.env.runtimes || 'html5,flash,silverlight,html4').split(/,/);
	runtimes.forEach(function(type) {
		var modules = [];
		jake.mkdirP(tmpDir + '/' + runtime);

		modules.forEach(function(module) {
			if (!fs.existsSync(baseDir + '/runtime/' + type + '/' + module)) {
				modules.push(module);
			}
		});

		fs.writeFileSync(tmpDir + '/' + runtime + '/extensions.js', extTpl.replace(/@([^@]+)@/g, function($0, $1) {
			switch ($1) { 
				case 'type': 
					return type;
				case 'modules':
					return '"' + modules.join('","')  +'"';
			}
		}));

		overrides['runtime/' + type + '/extensions'] = tmpDir + '/' + runtime + '/extensions.js';
	});

	amdlc.compile({
	    from: "src/**/*.js",
	    baseDir: "src",
	    compress: true,
	    expose: "public",
	    excludeRootNamespaceFromPath: true,
	    verbose: true,
	    outputSource: "out/lib.js",
	    outputMinified: "out/lib.min.js",
	    outputDev: "out/lib.dev.js"
	});

	jake.rmRf(tmpDir);

	console.info(arguments);
	console.info(process.env.runtimes);

	/*
	// Remove old file if it's there
	try {
		fs.unlinkSync("js/moxie.min.js");
	} catch(ex) {}

	console.info(params);

	uglify([
		'core/mOxie.js',
		'core/Utils.js',
		'core/Exceptions.js',
		'core/I18N.js',
		'core/EventTarget.js',
		'core/Runtime.js',
		'core/Transporter.js',
		'core/FileAPI.js',
		'core/Image.js',
		'extra/ImageInfo.js',
		'core/XMLHttpRequest.js',
		'html5.js',
		'flash.js',
		'html4.js'
	], "js/moxie.min.js", {
		sourceBase: 'src/javascript/'
	});*/
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
