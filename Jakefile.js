var fs = require("fs");
var path = require("path");
var tools = require('./build/BuildTools');
var uglify = tools.uglify;
var less = tools.less;
var yuidoc = tools.yuidoc;
var jshint = tools.jshint;
var zip = tools.zip;
var mkswf = tools.mkswf;
var wiki = tools.wiki;

desc("Default build task");
task("default", ["minifyjs", "yuidoc"], function (params) {});

desc("Build release package");
task("release", ["default", "package"], function (params) {});

desc("Build libs for external usage");
task("lib", ["mkswf", "minifyjs", "package"]);

desc("Minify JS files");
task("minifyjs", [], function (params) {

	if (!fs.existsSync("js")) {
		jake.mkdirP("js");
	}

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
		'html4.js',
		'flash.js',
		'silverlight.js'
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
