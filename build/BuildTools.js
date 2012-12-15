var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;

function extend(target) {
	each(arguments, function(arg, i) {
		if (i > 0) {
			each(arg, function(value, key) {
				if (value !== undefined) {
					if (typeof(target[key]) === 'object' && typeof(value) === 'object') { // arrays also count
						extend(target[key], value);
					} else {
						target[key] = value;
					}
				}
			});
		}
	});
	return target;
}

function each(obj, callback) {
	var length, key, i;

	if (obj) {
		try {
			length = obj.length;
		} catch(ex) {
			length = undefined;
		}

		if (length === undefined) {
			// Loop object items
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (callback(obj[key], key) === false) {
						return;
					}
				}
			}
		} else {
			// Loop array items
			for (i = 0; i < length; i++) {
				if (callback(obj[i], i) === false) {
					return;
				}
			}
		}
	}
}

var color = function(s,c){return (color[c].toLowerCase()||'')+ s + color.reset;};
color.reset = '\033[39m';
color.red = '\033[31m';
color.yellow = '\033[33m';
color.green = '\033[32m';

var uglify = function (sourceFiles, outputFile, options) {
	var jsp = require("uglify-js").parser;
	var pro = require("uglify-js").uglify;
	var code = "";
	var copyright;

	options = extend({
		mangle       : true,
		toplevel     : false,
		no_functions : false,
	}, options);

	// Combine JS files
	if (sourceFiles instanceof Array) {
		sourceFiles.forEach(function(filePath) {
			if (options.sourceBase) {
				filePath = path.join(options.sourceBase, filePath);
			}

			code += fs.readFileSync(filePath).toString();
		});
	}


	// Compress
	var ast = jsp.parse(code);

	// Write combined, but not minified version (just strip off the comments)
	/*fs.writeFileSync(outputFile.replace(/\.min\./, '.full.'), pro.gen_code(ast, {
		beautify: true
	}));*/

	ast = pro.ast_mangle(ast, options);
	ast = pro.ast_squeeze(ast);
	code = pro.gen_code(ast);

	fs.writeFileSync(outputFile, ";" + code + ";");
};

var mkswf = function(params, cb) {
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

var less = function (sourceFile, outputFile, options) {
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

var yuidoc = function (sourceDir, outputDir, options) {
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

		complete();
	});
}

var wiki = function(githubRepo, dir, YUIDocDir) {

	function parseYUIDoc() {
		var types = {
			method: "## Methods\n\n",
			property: "## Properties\n\n",
			event: "## Events\n\n"
		};

		var formatArguments = function(args, level) {
			var result = !level ? "\n__Arguments__\n\n" : "";
			
			level = level || 0;

			each(args, function(param) {
				var name;
				if (param.type) {
					if (param.optional) {
						name = param.optdefault ? "[" + param.name + "=" + param.optdefault + "]" : "[" + param.name + "]";
					} else {
						name = param.name;
					}
					// indent level times
					for (var i = 0; i < level; i++) {
						result += "\t";
					}
					// put it together finally
					result += "* **" + name + "** _(" + param.type.replace(/\|/g, '/') + ")_ " + param.description + "\n";

					// if param has sub-properties
					if (param.props) {
						result += formatArguments(param.props, level + 1);
					}
				}
			});
			return result;
		};


		var formatItem = function(item) {
			var delimiter = '\n---------------------------------------\n\n'
			, codeUrl = "/" + githubRepo.replace(/^[\s\S]+?github\.com[:\/]([\s\S]+?)\.wiki[\s\S]+$/, '$1') + "/blob/master/"
			, title = item.is_constructor ? '# '+item.name : '<a name="'+item.name+'" />\n### '+item.name
			, line = '_Defined at: ['+item.file+':'+item.line+']('+codeUrl+item.file+'#L'+item.line+')_\n\n\n'
			, description = item.description + "\n"
			;

			// add arguments listing if item is method
			if (('method' === item.itemtype || item.is_constructor) && item.params) {
				var titleArgs = [];
				var args = "\n__Arguments__\n\n";
				each(item.params, function(param) {
					var name;
					if (param.type) {
						if (param.optional) {
							name = param.optdefault ? "[" + param.name + "=" + param.optdefault + "]" : "[" + param.name + "]";
						} else {
							name = param.name;
						}
						titleArgs.push(name);
						args += "* **" + name + "** _(" + param.type.replace(/\|/g, '/') + ")_ " + param.description + "\n";

						// append sub-properties if any
						if (param.props) {
							args += formatArguments(param.props, 1);
						}
					}
				});
				// add arguments
				title += "(" + (titleArgs.length ? titleArgs.join(", ") : "") + ")";
				description += args;
			}

			// add example
			if (item.example) {
				description += "\n__Examples__\n\n"
				each(item.example, function(example) {
					var type = /<\w+>/.test(example) ? 'html' : 'javascript';
					description += "```" + type + example.replace(/^\xA0+/, '') + "\n```\n";
				});
			}

			return title + "\n" + line + description + (!item.is_constructor ? delimiter : '\n');
		};

		if (!path.existsSync(dir) || !path.existsSync(YUIDocDir + "/data.json")) {
			process.exit(1);
		}	

		// Clear previous versions
		var apiDir = dir + "/API";
		if (path.existsSync(apiDir)) {
			rmDir(apiDir);
		}
		fs.mkdirSync(apiDir, 0755);

		// read YUIDoc exported data in json
		var data = eval("("+fs.readFileSync(YUIDocDir + "/data.json").toString()+")");

		// generate TOC page
		var toc = '## Table of Contents\n\n';
		each(data.classes, function(item) {
			if (!item.access || item.access == 'public') {
				toc += "* [[" + item.name + "|" + item.name + "]]\n";
			}
		});
		fs.writeFileSync(apiDir + "/" + "API.md", toc);

		// generate pages
		var pages = {};		
		each(data.classitems, function(item) {
			var className, page;

			// bypass private and protected
			if (item.access && item.access != 'public') {
				return true;
			}

			if (!~['method', 'property', 'event'].indexOf(item.itemtype)) {
				return true;
			}

			className = item.class;

			if (!pages[className]) {
				pages[className] = extend({}, data.classes[className], {
					toc: {
						property: "",
						method: "",
						event: ""
					},
					content: {
						property: "",
						method: "",
						event: ""
					}
				});
			}
			page = pages[className];

			// put a link in the TOC
			page.toc[item.itemtype] += "* [%name%](#%name%)".replace(/%name%/g, item.name) + "\n";

			page.content[item.itemtype] += formatItem(item);
		});

		each(pages, function(page, name) {
			var toc = "", body = "", header = "";

			header += formatItem(page);

			each(["property", "method", "event"], function(type) {
				if (page.toc[type] != "") {
					toc += types[type] + page.toc[type] + "\n";
				}

				if (page.content[type] != "") {
					body += types[type] + page.content[type] + "\n";
				}
			});

			fs.writeFileSync(apiDir + "/" + name + ".md", header + toc + body);
		});
	}

	if (!path.existsSync(dir)) {
		exec("git clone " + githubRepo + " ./" + dir, function(error, stdout, stderr) {
			parseYUIDoc();
		});
	} else {
		parseYUIDoc();
	}
}

var jshint = function (sourceDir, options) {
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

var zip = function (sourceFiles, zipFile, options) {
	var zip = require("node-native-zip");
	var archive = new zip();

	var files = [];

	function process(filePath, zipFilePath) {
		var stat = fs.statSync(filePath);

		zipFilePath = zipFilePath || filePath;

		if (stat.isFile()) {
			files.push({ name: zipFilePath, path: filePath });
		} else if (stat.isDirectory()) {
			fs.readdirSync(filePath).forEach(function(fileName) {
				if (/^[^\.]/.test(fileName)) {
					process(path.join(filePath, fileName), path.join(zipFilePath, fileName));
				}
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

	archive.addFiles(files, function() {
		archive.toBuffer(function(buffer) {
			fs.writeFileSync(zipFile, buffer);
		});
	});
}

var copySync = function(from, to) {
	var stat = fs.statSync(from);

	function copyFile(from, to) {
		try {
			fs.createReadStream(from).pipe(fs.createWriteStream(to));
		} catch(ex) {
			console.info("Error: cannot copy " + from + " " + to);
			//process.exit(1);
		}
	}

	if (stat.isFile()) {
		copyFile(from, to);
	} else if (stat.isDirectory()) {
		/*fs.readdirSync(from).forEach(function(fileName) {
			copySync(from, to)
		});*/
		console.info("Error: " + from + " is directory");
	}
}

// recursively delete specified folder
var rmDir = function(dirPath) {
	try { var files = fs.readdirSync(dirPath); }
	catch(e) { return; }
	if (files.length > 0)
		for (var i = 0; i < files.length; i++) {
			var filePath = dirPath + '/' + files[i];
			if (fs.statSync(filePath).isFile())
				fs.unlinkSync(filePath);
			else
				this.rmDir(filePath);
		}
	fs.rmdirSync(dirPath);
}

// extract version details from chengelog.txt
var getReleaseInfo = function (srcPath) {
	if (!path.existsSync(srcPath)) {
		console.info(srcPath + " cannot be found.");
		process.exit(1);
	} 
	
	var src = fs.readFileSync(srcPath).toString();

	var info = src.match(/Version ([0-9xabrc\.]+)[^\(]+\(([^\)]+)\)/);
	if (!info) {
		console.info("Error: Version cannot be extracted.");
		process.exit(1);
	}

	// assume that very first file in array will have the copyright
	var copyright = (function() {
		var matches = fs.readFileSync(srcPath).toString().match(/^\/\*[\s\S]+?\*\//);
		return matches ? matches[0] : null;
	}());

	return {
		version: info[1],
		releaseDate: info[2],
		fileVersion: info[1].replace(/\./g, '_'),
		headNote: copyright
	}
}

// inject version details and copyright header if available to all js files in specified directory
var addReleaseDetailsTo = function (dir, info) {
	var contents, filePath; 

	if (path.existsSync(dir)) {
		fs.readdirSync(dir).forEach(function(fileName) {
			if (fileName && /\.js$/.test(fileName)) {
				filePath = path.join(dir + "/" + fileName);
				
				if (info.headNote) {
					contents = info.headNote + "\n" + fs.readFileSync(filePath).toString();
				}

				contents = contents.replace(/\@@([^@]+)@@/g, function($0, $1) {
					switch ($1) {
						case "version": return info.version;
						case "releasedate": return info.releaseDate;
					}
				});

				fs.writeFileSync(filePath, contents);
			}
		});
	}
}

extend(exports, {
	uglify: uglify,
	mkswf: mkswf,
	less: less,
	yuidoc: yuidoc,
	wiki: wiki,
	jshint: jshint,
	zip: zip,
	copySync: copySync,
	rmDir: rmDir,
	getReleaseInfo: getReleaseInfo,
	addReleaseDetailsTo: addReleaseDetailsTo
});