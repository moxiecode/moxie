/**
 * _source.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.calui.com/license
 * Contributing: http://www.calui.com/contributing
 */

// JSLint options
/*jslint evil: true */

/**
 * This file loads all components. This file should only be used for development purposes.
 */
(function() {
	var html = '', i, files, scripts, src, base;

	// Files to load
	files = [
		// Core
		'core/mOxie.js',
		'core/Utils.js',
		'core/Exceptions.js',
		'core/I18N.js',
		'core/EventTarget.js',
		'core/Runtime.js',
		'core/Transporter.js',
		'core/FileAPI.js',
		'extra/ImageInfo.js',
		'core/Image.js',
		'core/XMLHttpRequest.js',

		// Runtimes
		'flash.js',
		'silverlight.js',
		'html5.js',
		'html4.js'
	];

	// Find base URL
	/*scripts = document.getElementsByTagName('script');
	for (i = 0; i < scripts.length; i++) {
		src = scripts[i].src;

		if (src && src.indexOf("source.js") != -1) {
			base = src.substring(0, src.lastIndexOf('/')) + '/';
		}
	}*/

	base = '../src/javascript/';

	// Load minified version
	if (document.location.search.indexOf('min=true') > 0) {
		files = ['../../js/moxie.min.js'];
	}

	// Load coverage version
	//if (top.jscoverage_init) {
	//	base = base + '../../jscoverage/';
	//}

	// Load the files
	for (i = 0; i < files.length; i++) {
		html += '<script src="' + base + files[i] + '"></script>';
	}

	document.write(html);
})();
