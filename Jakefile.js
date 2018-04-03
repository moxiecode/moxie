var fs = require('fs');
var path = require('path');

var utils = require('./build/utils');
var mkjs = require('./build/mkjs');
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


task("default", ["mkjs", "docs"], function (params) {});


desc("Build release package");
task("release", ["default", "package"], function (params) {});


desc("Runs JSHint on source files");
task("jshint", [], function (params) {
	jshint("src", {
		curly: true
	});
});


desc("Generate documentation using YUIDoc");
task("docs", [], function (params) {
	var baseDir = "src/javascript";
	tools.yuidoc(baseDir, "docs");
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


desc("Publish NuGet package from last tag.");
task('mknuget', [], function(apiKey) {
	var mknuget = require('./build/mknuget');
	var info = require('./package.json');
	var endPoint = 'https://staging.nuget.org/api/v2/package';

	if (!apiKey) {
		console.info("Error: Provide NuGet ApiKey: jake mknuget[apiKey]");
		process.exit(1);
	}

	mknuget.publish(info, endPoint, apiKey, function(err) {
		if (err) {
			console.info(err);
			process.exit(1);
		}
		console.info("NuGet package has been published.");
		complete();
	});
}, true);


