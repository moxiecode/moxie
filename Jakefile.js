var uglify = require('./build/BuildTools').uglify;
var less = require('./build/BuildTools').less;
var yuidoc = require('./build/BuildTools').yuidoc;
var jshint = require('./build/BuildTools').jshint;
var zip = require('./build/BuildTools').zip;
var mkswf = require('./build/BuildTools').mkswf;

desc("Default build task");
task("default", ["minifyjs", "yuidoc", "jshint"], function (params) {});

desc("Build release package");
task("release", ["default", "package"], function (params) {});

desc("Build libs for external usage");
task("lib", ["mkswf", "minifyjs"]);

desc("Minify JS files");
task("minifyjs", [], function (params) {
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
	});
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
});

desc("Runs JSHint on source files");
task("jshint", [], function (params) {
	jshint("src", {
		curly: true
	});
});

desc("Package library");
task("package", [], function (params) {
	zip([
		"src",
		"js",
		["readme.md", "readme.txt"]
	], "test.zip");
});
