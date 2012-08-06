var uglify = require('./build/BuildTools').uglify;
var less = require('./build/BuildTools').less;
var yuidoc = require('./build/BuildTools').yuidoc;
var jshint = require('./build/BuildTools').jshint;
var zip = require('./build/BuildTools').zip;
var mkswf = require('./build/BuildTools').mkswf;

desc("Default build task");
task("default", ["minifyjs", "compileless", "yuidoc", "jshint"], function (params) {});

desc("Build release package");
task("release", ["default", "package"], function (params) {});

desc("Minify JS files");
task("minifyjs", [], function (params) {
	uglify([
		'core/mOxie.js',
		'core/Utils.js',
		'core/Exceptions.js',
		'core/i18n.js',
		'core/EventTarget.js',
		'core/Transporter.js',
		'core/FileAPI.js',
		'core/Image.js',
		'extra/ImageInfo.js',
		'core/XMLHttpRequest.js',
		'html5.js',
		'flash.js'
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

desc("Compile LESS CSS files");
task("compileless", [], function (params) {
	less("css/skin.less", "css/skin.min.css");
});

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
