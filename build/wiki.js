/*jshint evil:true, unused:false */
/*global jake:true, require:true, module:true, process:true */

var fs = require("fs");
var Handlebars = require("handlebars");
var exec = require("child_process").exec;
var util = require("./utils");

var source = {
	toc: Handlebars.compile([
		'### Table of Contents\n',
		'{{#each classes}}',
			'* [[{{.}}|{{.}}]]\n',
		'{{/each}}',
	''].join('')),

	page: Handlebars.compile([
		'### Table of Contents\n',
		'* [Constructor](#{{class}}-method)\n',
		'{{#if property}}',
			'* [Properties](#properties)\n',
			'{{#each property}}',
			'	* [{{name}}](#{{name}}-property) {{#if static}}`static`{{/if}}\n',
			'{{/each}}',
		'{{/if}}',
		'{{#if method}}',
			'* [Methods](#methods)\n',
			'{{#each method}}',
			'	* [{{name}}({{{formatSignature params}}})](#{{name}}-{{formatAnchorSuffix params}}-method) {{#if static}}`static`{{/if}}\n',
			'{{/each}}',
		'{{/if}}',
		'{{#if event}}',
			'* [Events](#events)\n',
			'{{#each event}}',
			'	* [{{name}}](#{{name}}-event)\n',
			'{{/each}}',
		'{{/if}}\n',

		'{{{formatConstructor .}}}',

		'{{#if property}}',
			'<a name="properties" />\n',
			'## Properties\n\n',

			'{{#each property}}',
				'<a name="{{name}}-property" />\n',
				'### [{{name}}]({{srcUrl}} "Defined at: {{file}}:{{line}}") {{#if static}}`static`{{/if}}\n\n',

				'{{{description}}}\n\n',

				'{{#if example}}',
					'__Example__\n',
					'{{#each example}}',
					'	{{formatExample .}}\n',
					'{{/each}}',
				'{{/if}}',
			'{{/each}}\n',
		'{{/if}}',

		'{{#if method}}',
			'<a name="methods" />\n',
			'## Methods\n\n',

			'{{#each method}}',
				'{{> method}}',
			'{{/each}}\n',
		'{{/if}}',

		'{{#if event}}',
			'<a name="events" />\n',
			'## Events\n',
			'{{#each event}}',
				'<a name="{{name}}-event" />\n',
				'### {{name}}\n\n',

				'{{{description}}}\n\n',

				'{{#if example}}',
					'__Example__\n',
					'{{#each example}}',
					'	{{{formatExample .}}}\n',
					'{{/each}}',
				'{{/if}}',
			'{{/each}}\n',
		'{{/if}}',
	''].join('')),

	constructor: Handlebars.compile([
		'## Constructor\n',
		'{{> method}}',
	''].join('')),

	method: Handlebars.compile([
		'<a name="{{name}}-{{formatAnchorSuffix params}}-method" />\n',
		'### [{{name}}({{{formatSignature params}}})]({{srcUrl}} "Defined at: {{file}}:{{line}}") {{#if static}}`static`{{/if}}\n\n',

		'{{{description}}}\n\n',

		'{{#if params}}',
			'__Arguments__\n\n',
			'{{#each params}}',
				'{{> argument}}',
			'{{/each}}\n',
		'{{/if}}',

		'{{#if example}}',
			'__Example__\n',
			'{{#each example}}',
			'	{{{formatExample .}}}\n',
			'{{/each}}\n',
		'{{/if}}',
	''].join('')),

	argument: Handlebars.compile([
		'{{#if type}}',
			'* **{{#if optional}}',
				'{{#if optdefault}}',
					'[{{name}}={{{optdefault}}}]',
				'{{else}}',
					'[{{name}}]',
				'{{/if}}',
			'{{else}}',
				'{{name}}',
			'{{/if}}** `{{type}}`  \n',
			'{{{formatArgDescription .}}}\n',
			'{{#if props}}',
				'{{#each props}}',
					'{{indent level}}{{> argument}}',
				'{{/each}}',
			'{{/if}}',
		'{{/if}}',
	''].join(''))
};


function generatePages(githubRepo, dir, YUIDocDir) {
	if (!fs.existsSync(dir) || !fs.existsSync(YUIDocDir + "/data.json")) {
		process.exit(1);
	}	

	// clear previous versions
	var apiDir = dir + "/API";
	if (fs.existsSync(apiDir)) {
		jake.rmRf(apiDir);
	}
	fs.mkdirSync(apiDir, 0755);

	// load YUIDoc exported data
	var data = eval("("+fs.readFileSync(YUIDocDir + "/data.json").toString()+")");

	// parse the data and generate the pages
	var srcUrl = "/" + githubRepo.replace(/^[\s\S]+?github\.com[:\/]([\s\S]+?)\.wiki[\s\S]+$/, '$1') + "/blob/master/";
	
	var defineArgIndentation = function(args, level) {			
		level = level || 0;
		util.each(args, function(arg) {
			arg.level = level;
			if (arg.props) {
				defineArgIndentation(arg.props, level + 1);
			}
		});
	};

	// prepare class items...
	util.each(data.classitems, function(item) {
		if (!data.classes[item.class]) { // class striped off as not required
			return true; 
		}

		// bypass private and protected
		if (data.classes[item.class].access && data.classes[item.class].access != 'public') {
			delete data.classes[item.class];
			return true;
		}

		if (item.access && item.access != 'public') {
			return true;
		}

		if (!~['method', 'property', 'event'].indexOf(item.itemtype)) {
			return true;
		}

		if (util.isArray(data.classes[item.class].classitems)) {
			data.classes[item.class].classitems = {
				property: [],
				method: [],
				event: []
			};
		}

		// define a link to an item's place in a source
		item.srcUrl = srcUrl + item.file + '#L' + item.line;

		// come up with argument indentation level
		if (typeof data.classes[item.class].level == 'undefined' && data.classes[item.class].params) {
			defineArgIndentation(data.classes[item.class].params);
		}
		
		if (item.itemtype === 'method' && item.params) {
			defineArgIndentation(item.params);
		}

		data.classes[item.class].classitems[item.itemtype].push(item);
	});


	// define Handlebars helpers
	Handlebars.registerHelper('formatConstructor', function(item) {
		var fn = data.classes[item.class];

		if (fn.is_constructor != 1) {
			return '';
		}

		fn.srcUrl = srcUrl + fn.file + '#L' + fn.line;
		return source.constructor(fn);
	});


	Handlebars.registerHelper('formatSignature', function(params) {
		var titleArgs = [];
		util.each(params, function(param) {
			var name;
			if (param.type) {
				if (param.optional) {
					name = param.optdefault ? "[" + param.name + "=" + param.optdefault + "]" : "[" + param.name + "]";
				} else {
					name = param.name;
				}
				titleArgs.push(name);
			}
		});
		return titleArgs.join(", ");
	});


	Handlebars.registerHelper('formatAnchorSuffix', function(params) {
		return Handlebars.helpers.formatSignature(params).replace(/\W+/g, '');
	});


	Handlebars.registerHelper('formatExample', function(example) {
		var type = /<\w+>/.test(example) ? 'html' : 'javascript';
		return "```" + type + "\n" + example.replace(/^\xA0+/, '') + "\n\t```\n";
	});


	Handlebars.registerHelper('formatArgDescription', function(arg) {
		var indent = Handlebars.helpers.indent(arg.level);
		var description = arg.description.replace(/(```[^`]+```)/g, function($0, $1) {
			return $1.replace(/\n/g, '\n' + indent);
		});
		return indent + description.replace(/\n\n/g, '\n\n' + indent);
	});


	Handlebars.registerHelper('formatType', function(type) {
		return type.replace(/\|/g, '\\');
	});


	Handlebars.registerHelper('indent', function(level) {
		var indent = '';
		while (level--) {
			indent += '\t';
		}
		return indent;
	}); 


	// define partials
	Handlebars.registerPartial('argument', source.argument);
	Handlebars.registerPartial('method', source.method);


	// generate TOC
	fs.writeFileSync(apiDir + "/" + "API.md", source.toc({
		classes: Object.keys(data.classes)
	}));


	// generate pages
	util.each(data.classes, function(item, className) {
		fs.writeFileSync(apiDir + "/" + className + ".md", source.page({
			class: className,
			property: item.classitems.property,
			method: item.classitems.method,
			event: item.classitems.event
		}));
	});
}


module.exports = function(githubRepo, dir, YUIDocDir) {
	var self = this, args = [].slice.call(arguments);
	// make sure we have the repo
	if (!fs.existsSync(dir)) {
		exec("git clone " + githubRepo + " ./" + dir, function() {
			generatePages.apply(self, args);
		});
	} else {
		generatePages.apply(self, args);
	}
};
