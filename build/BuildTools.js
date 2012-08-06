var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;

function extend(a, b) {
	if (b) {
		var props = Object.getOwnPropertyNames(b);

		props.forEach(function(name) {
			var destination = Object.getOwnPropertyDescriptor(b, name);
			Object.defineProperty(a, name, destination);
		});
	}

	return a;
}

var color = function(s,c){return (color[c].toLowerCase()||'')+ s + color.reset;};
color.reset = '\033[39m';
color.red = '\033[31m';
color.yellow = '\033[33m';
color.green = '\033[32m';

exports.uglify = function (sourceFiles, outputFile, options) {
	var jsp = require("uglify-js").parser;
	var pro = require("uglify-js").uglify;
	var code = "";

	options = extend({
		mangle       : true,
		toplevel     : false,
		no_functions : false
	}, options);

	// Combine JS files
	if (sourceFiles instanceof Array) {
		sourceFiles.forEach(function(filePath) {
			if (options.sourceBase) {
				filePath = path.join(options.sourceBase, filePath);
			}

			code += fs.readFileSync(filePath);
		});
	}


	// Compress
	var ast = jsp.parse(code);

	// Write combined, but not minified version (just strip off the comments)
	fs.writeFileSync(outputFile.replace(/\.min\./, '.full.'), pro.gen_code(ast, {
		beautify: true
	}));

	ast = pro.ast_mangle(ast, options);
	ast = pro.ast_squeeze(ast);
	code = pro.gen_code(ast);

	fs.writeFileSync(outputFile, code);
};

exports.mkswf = function(params, cb) {
	var defaults = {
		exe: "mxmlc",
		target: "10.1.0",
		extra: "-static-link-runtime-shared-libraries=true"
	};
	var cmd = "<exe> -target-player=<target> -compiler.source-path=<src> -output=<output> <extra> <input>";

	params = extend(defaults, params);

	if (params.libs) {
		if (typeof params.libs === 'string') {
			params.libs = [params.libs];
		}
		params.extra += " -library-path+=" + params.libs.join(',');
	}	

	cmd = cmd.replace(/(<(target|output|input|src|exe|libs|extra)>)/g, function($0, $1, $2) {
		return params[$2] || '';
	});

	exec(cmd, function(error, stdout, stderr) {
		if (error) {
			console.log(stderr);
		}
		cb();
	});
}

exports.less = function (sourceFile, outputFile, options) {
	var less = require('less');

	options = extend({
		compress: true,
		yuicompress: true,
		optimization: 1,
		silent: false,
		paths: [],
		color: true,
		strictImports: false
	}, options);

	var parser = new less.Parser({
		paths: [path.dirname(sourceFile)],
		filename: path.basename(sourceFile),
        optimization: options.optimization,
        filename: sourceFile,
        strictImports: options.strictImports
	});

	// Patch over BOM bug
	// Todo: Remove this when they fix the bug
	less.Parser.importer = function (file, paths, callback, env) {
		var pathname;

		paths.unshift('.');

		for (var i = 0; i < paths.length; i++) {
			try {
				pathname = path.join(paths[i], file);
				fs.statSync(pathname);
				break;
			} catch (e) {
				pathname = null;
			}
		}

		if (pathname) {
			fs.readFile(pathname, 'utf-8', function(e, data) {
				if (e) return callback(e);

				data = data.replace(/^\uFEFF/, '');

				new(less.Parser)({
					paths: [path.dirname(pathname)].concat(paths),
					filename: pathname
				}).parse(data, function (e, root) {
					callback(e, root, data);
				});
			});
		} else {
			if (typeof(env.errback) === "function") {
				env.errback(file, paths, callback);
			} else {
				callback({ type: 'File', message: "'" + file + "' wasn't found.\n" });
			}
		}
	}

	parser.parse(fs.readFileSync(sourceFile).toString(), function (err, tree) {
		if (err) {
			less.writeError(err, options);
			return;
		}

		fs.writeFileSync(outputFile, tree.toCSS({
			compress: options.compress,
			yuicompress: options.yuicompress
		}));
	});
}

exports.yuidoc = function (sourceDir, outputDir, options) {
	var Y = require('yuidocjs');

	if (!(sourceDir instanceof Array)) {
		sourceDir = [sourceDir];
	}

	options = extend({
		paths: sourceDir,
		outdir: outputDir,
		time: false
	}, options);

	var starttime = new Date().getTime();
	var json = (new Y.YUIDoc(options)).run();

	var builder = new Y.DocBuilder(options, json);
	builder.compile(function() {
		var endtime = new Date().getTime();

		if (options.time) {
			Y.log('Completed in ' + ((endtime - starttime) / 1000) + ' seconds' , 'info', 'yuidoc');
		}
	});
}

exports.jshint = function (sourceDir, options) {
	var jshint = require('jshint').JSHINT;

	function process(filePath) {
		var stat = fs.statSync(filePath);

		if (stat.isFile()) {
			if (!jshint(fs.readFileSync(filePath).toString(), options)) {
				// Print the errors
				console.log(color('Errors in file ' + filePath, 'red'));
				var out = jshint.data(),
				errors = out.errors;
				Object.keys(errors).forEach(function(error){
					error = errors[error];

					console.log('line: ' + error.line + ':' + error.character+ ' -> ' + error.reason );
					console.log(color(error.evidence,'yellow'));
				});
			}
		} else if (stat.isDirectory()) {
			fs.readdirSync(filePath).forEach(function(fileName) {
				process(path.join(filePath, fileName));
			});
		}
	}

	options = extend({
		boss: true,
		forin: false,
		curly: true,
		smarttabs: true
	}, options);

	process(sourceDir);
}

exports.zip = function (sourceFiles, zipFile, options) {
	var zip = require("node-native-zip");
	var archive = new zip();

	function process(filePath, zipFilePath) {
		var stat = fs.statSync(filePath);

		zipFilePath = zipFilePath || filePath;

		if (stat.isFile()) {
			archive.add(zipFilePath, fs.readFileSync(filePath));
		} else if (stat.isDirectory()) {
			fs.readdirSync(filePath).forEach(function(fileName) {
				process(path.join(filePath, fileName), path.join(zipFilePath, fileName));
			});
		}
	}

	options = extend({
	}, options);

	sourceFiles.forEach(function(filePath) {
		if (filePath instanceof Array) {
			process(filePath[0], filePath[1]);
		} else {
			process(filePath);			
		}
	});

	fs.writeFileSync(zipFile, archive.toBuffer());
}