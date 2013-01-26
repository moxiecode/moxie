var fs = require("fs");
var sys = require('sys');
var path = require("path");
var tools = require("./build/BuildTools");
var uglify = tools.uglify;
var less = tools.less;
var yuidoc = tools.yuidoc;
var jshint = tools.jshint;
var zip = tools.zip;

var compileAmd = require('./build/BuildTools').compileAmd;

var utils = require("./build/utils");
var mkjs = require("./build/mkjs");
var mkswf = require("./build/mkswf");
var mkxap = require("./build/mkxap");
var wiki = require("./build/wiki");

var isImageLogicRequired = function(modules) {
	var result = false;
	utils.each(mkjs.resolveModules(modules), function(module) {
		if (module.id == "moxie/image/Image") {
			result = true;
			return false;
		}
	});
	return result;
};

task("default", ["jshint", "mkjs"], function (params) {});

desc("Runs JSHint on source files");
task("jshint", [], function (params) {
	jshint("src", {
		curly: true
	});
});


desc("Compile JS");
task("mkjs", [], function () {
	var amdlc = require('amdlc');

	var targetDir = "bin/js";

	var options = {
		compress: true,
		baseDir: 'src/javascript',
		rootNS: "moxie",
		expose: "public",
		verbose: true,
		outputSource: targetDir + "/moxie.js",
		outputMinified: targetDir + "/moxie.min.js",
		outputDev: targetDir + "/moxie.dev.js"
	};

	var modules = [].slice.call(arguments);
	if (!modules.length) {
		modules = ["file/FileInput", "xhr/XMLHttpRequest", "image/Image"];
	}

	// resolve dependencies
	modules = mkjs.resolveModules(modules, options);	

	// make sure we got entry point
	[].push.apply(modules, amdlc.parseModules(utils.extend({}, options, {
		from: ["o"]
	})));

	// start fresh
	if (fs.existsSync(targetDir)) {
		jake.rmRf(targetDir);
	}
	jake.mkdirP(targetDir);

	amdlc.compileMinified(modules, options);
	amdlc.compileSource(modules, options);
	amdlc.compileDevelopment(modules, options);
});


desc("Compile SWF");
task("mkswf", [], function() {
	var targetDir = "bin/flash";

	// start fresh
	if (fs.existsSync(targetDir)) {
		jake.rmRf(targetDir);
	}
	jake.mkdirP(targetDir);

	// compile both
	utils.inSeries([
		function(cb) {
			mkswf({
				src: "./src/flash/src",
				libs: ["./src/flash/blooddy_crypto.swc"],
				input: "./src/flash/src/Moxie.as",
				output: targetDir + "/Moxie.swf",
				extra: "-define=BUILD::IMAGE,true -debug=false -optimize=true"
			}, cb);
		},
		function(cb) {
			mkswf({
				src: "./src/flash/src",
				libs: ["./src/flash/blooddy_crypto.swc"],
				input: "./src/flash/src/Moxie.as",
				output: targetDir + "/Moxie.min.swf",
				extra: "-define=BUILD::IMAGE,false -debug=false -optimize=true"
			}, cb);
		}
	], complete);
}, true);


desc("Compile XAP");
task("mkxap", [], function() {
	var targetDir = "bin\\silverlight\\";

	// start fresh
	if (fs.existsSync(targetDir)) {
		jake.rmRf(targetDir);
	}
	jake.mkdirP(targetDir);

	// compile both
	utils.inSeries([
		function(cb) {
			mkxap({
				input: ".\\src\\silverlight\\Moxie.csproj",
				output: "/p:BUILD=IMAGE,XapFilename=Moxie.xap,OutputDir=..\\..\\" + targetDir
			}, cb);
		},
		function(cb) {
			mkxap({
				input: ".\\src\\silverlight\\Moxie.csproj",
				output: "/p:XapFilename=Moxie.min.xap,OutputDir=..\\..\\" + targetDir
			}, cb);
		}
	], complete);
});


desc("Generate documentation using YUIDoc");
task("docs", [], function (params) {
	var baseDir = "src/javascript"
	, exclude = [
		"runtime/tpl",
		"runtime/flash",
		"runtime/silverlight",
		"runtime/html5",
		"runtime/html4"
	];

	yuidoc(baseDir, "docs", {
		exclude: exclude.map(function(filePath) { return baseDir + "/" + filePath; }).join(",")
	});
}, true);


desc("Generate wiki pages");
task("wiki", ["docs"], function() {
	wiki("git@github.com:moxiecode/moxie.wiki.git", "wiki", "docs");
});


desc("");
task("package", [], function() {
	var args = isImageLogicRequired(arguments) ? ['image'] : [];

	if (!fs.existsSync("./bin")) {
		jake.mkdirP("./bin");
	}

	jake.Task["mksfw"].execute.apply(mkswf, args);

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
