var fs = require('fs');
var sys = require('sys');
var path = require('path');

var utils = require('./build/utils');
var mkjs = require('./build/mkjs');
var mkswf = require('./build/mkswf');
var mkxap = require('./build/mkxap');
var wiki = require('./build/wiki');
var tools = require('./build/tools');

var copyright = [
	"/**",
	" * mOxie - multi-runtime File API & XMLHttpRequest L2 Polyfill",
	" * v@@version@@",
	" *",
	" * Copyright 2013, Moxiecode Systems AB",
	" * Released under GPL License.",
	" *",
	" * License: http://www.plupload.com/license",
	" * Contributing: http://www.plupload.com/contributing",
	" *",
	" * Date: @@releasedate@@",
	" */"
].join("\n");


task("default", ["mkjs", "mkswf", "mkxap", "docs"], function (params) {});



desc("Build release package");
task("release", ["default", "package"], function (params) {});



desc("Runs JSHint on source files");
task("jshint", [], function (params) {
	jshint("src", {
		curly: true
	});
});



desc("Compile JS");
task("mkjs", [], function () {
	var amdlc = require('amdlc');
	var baseDir = "src/javascript", targetDir = "bin/js";

	var modules = [].slice.call(arguments);
	if (!modules.length) {
		modules = ["file/FileInput", "file/FileDrop", "file/FileReader", "xhr/XMLHttpRequest", "image/Image"];
	}

	var options = {
		from: modules.map(function(module) { return module + '.js'; }),
		compress: {
			unused: false,
			global_defs: {
				MXI_DEBUG: false
			}
		},
		baseDir: baseDir,
		rootNS: "moxie",
		expose: "public",
		verbose: true,
		outputSource: targetDir + "/moxie.js",
		outputMinified: targetDir + "/moxie.min.js",
		outputDev: false,
		outputCoverage: false
	};


	// include corresponding runtime extensions
	[].push.apply(options.from, mkjs.getExtensionPaths4(modules, {
		runtimes: process.env.runtimes,
		baseDir: ''
	}));

	// start fresh
	if (fs.existsSync(targetDir)) {
		jake.rmRf(targetDir);
	}
	jake.mkdirP(targetDir);


	amdlc.compile(options);

	// for dev and cov versions expose all modules to be able to test them properly
	amdlc.compile(utils.extend({}, options, {
		expose: 'all',
		force: true,
		outputSource: false,
		outputMinified: false,
		outputDev: targetDir + "/moxie.dev.js",
		outputCoverage: targetDir + "/moxie.cov.js"
	}));


	var info = require('./package.json');
	info.copyright = copyright;
	tools.addReleaseDetailsTo(targetDir, info);

	// add debug constant to dev source
	mkjs.addDebug(targetDir + "/moxie.js");
	mkjs.addDebug(targetDir + "/moxie.dev.js");
	mkjs.addDebug(targetDir + "/moxie.cov.js");

	// add compatibility
	if (process.env.compat !== 'no') {
		mkjs.addCompat({
			baseDir: baseDir,
			targetDir: targetDir
		});
	}
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
				input: "./src/flash/src/Moxie.as",
				output: targetDir + "/Moxie.swf",
				extra: "-define=MXI::IncludeImageLibs,true -define=MXI::EnableCSS,false -debug=false -optimize=true -swf-version=16"
			}, cb);
		},
		function(cb) {
			mkswf({
				src: "./src/flash/src",
				input: "./src/flash/src/Moxie.as",
				output: targetDir + "/Moxie.cdn.swf",
				extra: "-define=MXI::IncludeImageLibs,true -define=MXI::EnableCSS,true -debug=false -optimize=true -swf-version=16"
			}, cb);
		},
		function(cb) {
			// we do not require any fancy stuff in this one, so target FP 11.2 (last version supported by linux)
			mkswf({
				src: "./src/flash/src",
				input: "./src/flash/src/Moxie.as",
				output: targetDir + "/Moxie.min.swf",
				extra: "-define=MXI::IncludeImageLibs,false -define=MXI::EnableCSS,false -debug=false -optimize=true -swf-version=15"
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
				output: "/p:IncludeImageLibs=TRUE,XapFilename=Moxie.xap,OutputDir=..\\..\\" + targetDir
			}, cb);
		},
		function(cb) {
			mkxap({
				input: ".\\src\\silverlight\\Moxie.csproj",
				output: "/p:IncludeImageLibs=TRUE,EnableCSS=TRUE,XapFilename=Moxie.cdn.xap,OutputDir=..\\..\\" + targetDir
			}, cb);
		},
		function(cb) {
			mkxap({
				input: ".\\src\\silverlight\\Moxie.csproj",
				output: "/p:IncludeImageLibs=FALSE,XapFilename=Moxie.min.xap,OutputDir=..\\..\\" + targetDir
			}, cb);
		}
	], complete);
}, true);



desc("Generate documentation using YUIDoc");
task("docs", [], function (params) {
	var baseDir = "src/javascript"
	, exclude = [
		"runtime/flash",
		"runtime/silverlight",
		"runtime/html5",
		"runtime/html4"
	];

	tools.yuidoc(baseDir, "docs", {
		exclude: exclude.map(function(filePath) { return baseDir + "/" + filePath; }).join(",")
	});
}, true);



desc("Generate wiki pages");
task("wiki", ["docs"], function() {
	wiki("git@github.com:moxiecode/moxie.wiki.git", "wiki", "docs");
});



desc("Package library");
task("package", [], function (params) {
	var zip = tools.zip;
	var info = require("./package.json");

	var tmpDir = "./tmp";
	if (fs.existsSync(tmpDir)) {
		jake.rmRf(tmpDir);
	}
	fs.mkdirSync(tmpDir, 0755);

	var suffix = info.version.replace(/\./g, '_');
	if (/(?:beta|alpha)/.test(suffix)) {
		var dateFormat = require('dateformat');
		// If some public test build, append build number
		suffix += "." + dateFormat(new Date(), "yymmddHHMM", true);
	}

	zip([
		"bin/**/*",
		"README.md",
		"LICENSE.txt"
	], path.join(tmpDir, utils.format("moxie_%s.zip", suffix)), complete);
}, true);


desc("Run tests");
task("test", [], function() {
	var baseDir = 'tests/auto';
	var suite = eval('(' + fs.readFileSync(baseDir + '/tests.js').toString() + ')');
	var tests = suite.tests.map(function(test) {  return baseDir + '/' + test.url; });
	
	var config = {
		  hub: "http://localhost:9000"
		, farm: 'saucelabs'
		, saucelabs: {
			  user: process.env.SAUCE_USERNAME
			, pass: process.env.SAUCE_ACCESS_KEY
			, slots: 1
		}
		, args: tests
		, browsers: [
			  { id: 'ie', version: 10, osId: 'win' }
			, { id: 'chrome', version: 28, osId: 'mac' }
			//, { id: 'firefox', version: 16, osId: 'mac' }
		]

		, verbose: true
		, wait: true
	};

	require('./node_modules/bunyip/lib/bunyip').main(config);

}, true);


