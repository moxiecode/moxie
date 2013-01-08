var fs = require("fs");
var sys = require('sys');
var path = require("path");
var tools = require("./build/BuildTools");
var uglify = tools.uglify;
var less = tools.less;
var yuidoc = tools.yuidoc;
var jshint = tools.jshint;
var zip = tools.zip;

var amdlc = require("amdlc");

var utils = require("./build/utils");
var mkjs = require("./build/mkjs");
var mkswf = require("./build/mkswf");
var mkxap = require("./build/mkxap");
var wiki = require("./build/wiki");


var isImageLogicRequired = function(modules) {
	var result = false;
	utils.each(mkjs.resolveModules(modules), function(module) {
		if (module.id == "image/Image") {
			result = true;
			return false;
		}
	});
	return result;
};


desc("Runs JSHint on source files");
task("jshint", [], function (params) {
	jshint("src", {
		curly: true
	});
});


desc("Compile JS");
task("mkjs", [], function () {
	var modules = mkjs.resolveModules(arguments, "src/javascript");
	var targetDir = "bin/js";

	// start fresh
	if (fs.existsSync(targetDir)) {
		jake.rmRf(targetDir);
	}
	jake.mkdirP(targetDir);

	var options = {
	    compress: true,
	    excludeRootNamespaceFromPath: true,
	    verbose: true,
	    outputSource: targetDir + "/moxie.js",
	    outputMinified: targetDir + "/moxie.min.js",
	    outputDev: targetDir + "/moxie.dev.js"
	};

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
				output: targetDir + "/Moxie.plus.swf",
				extra: "-define=BUILD::IMAGE,true"
			}, cb);
		},
		function(cb) {
			mkswf({
				src: "./src/flash/src",
				libs: ["./src/flash/blooddy_crypto.swc"],
				input: "./src/flash/src/Moxie.as",
				output: targetDir + "/Moxie.swf",
				extra: "-define=BUILD::IMAGE,false"
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
				input: ".\\src\\silverlight\\Moxie.cproj",
				output: "/p:BUILD=IMAGE,XapFilename=Moxie.plus.xap,OutputDir=..\\..\\" + targetDir
			}, cb);
		},
		function(cb) {
			mkxap({
				input: ".\\src\\silverlight\\Moxie.cproj",
				output: "/p:XapFilename=Moxie.xap,OutputDir=..\\..\\" + targetDir
			}, cb);
		}
	], complete);
});


desc("Generate documentation using YUIDoc");
task("docs", [], function (params) {
	yuidoc("src/javascript/core", "docs");
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
