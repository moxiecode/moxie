/**
 * Mime.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */
/*global define:true */

define("moxie/core/utils/Mime", [
	"moxie/core/utils/Basic",
	"moxie/core/I18n"
], function(Basic, I18n) {
	var mimes = {}, extensions = {};

	// Parses the default mime types string into a mimes and extensions lookup maps
	(function(mime_data) {
		var items = mime_data.split(/,/), i, ii, ext;

		for (i = 0; i < items.length; i += 2) {
			ext = items[i + 1].split(/ /);

			// extension to mime lookup
			for (ii = 0; ii < ext.length; ii++) {
				mimes[ext[ii]] = items[i];
			}

			// mime to extension lookup
			extensions[items[i]] = ext;
		}
	})(
		"application/msword,doc dot," +
		"application/pdf,pdf," +
		"application/pgp-signature,pgp," +
		"application/postscript,ps ai eps," +
		"application/rtf,rtf," +
		"application/vnd.ms-excel,xls xlb," +
		"application/vnd.ms-powerpoint,ppt pps pot," +
		"application/zip,zip," +
		"application/x-shockwave-flash,swf swfl," +
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx," +
		"application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx," +
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx," +
		"application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx," +
		"application/vnd.openxmlformats-officedocument.presentationml.template,potx," +
		"application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx," +
		"application/x-javascript,js," +
		"application/json,json," +
		"audio/mpeg,mpga mpega mp2 mp3," +
		"audio/x-wav,wav," +
		"audio/mp4,m4a," +
		"image/bmp,bmp," +
		"image/gif,gif," +
		"image/jpeg,jpeg jpg jpe," +
		"image/photoshop,psd," +
		"image/png,png," +
		"image/svg+xml,svg svgz," +
		"image/tiff,tiff tif," +
		"text/plain,asc txt text diff log," +
		"text/html,htm html xhtml," +
		"text/css,css," +
		"text/csv,csv," +
		"text/rtf,rtf," +
		"video/mpeg,mpeg mpg mpe m2v," +
		"video/quicktime,qt mov," +
		"video/mp4,mp4," +
		"video/x-m4v,m4v," +
		"video/x-flv,flv," +
		"video/x-ms-wmv,wmv," +
		"video/avi,avi," +
		"video/webm,webm," +
		"video/3gpp,3gp," +
		"video/3gpp2,3g2," +
		"video/vnd.rn-realvideo,rv," +
		"application/vnd.oasis.opendocument.formula-template,otf," +
		"application/octet-stream,exe"
	);

	function extList2mimes(filters) {
		var ext, i, ii, type, mimes = [];

		// Convert extensions to mime types list
		no_type_restriction:
		for (i = 0; i < filters.length; i++) {
			ext = filters[i].extensions.split(/\s*,\s*/);

			for (ii = 0; ii < ext.length; ii++) {
				
				// If there's an asterisk in the list, then accept attribute is not required
				if (ext[ii] === '*') {
					mimes = [];
					break no_type_restriction;
				}
				
				type = mimes[ext[ii]];

				if (type && !~Basic.inArray(type, mimes)) {
					mimes.push(type);
				}
			}
		}
		
		return mimes;
	}

	function mimes2extList(mimes) {
		var exts = '', accept = [];

		mimes = Basic.trim(mimes);

		if (mimes !== '*') {
			Basic.each(mimes.split(/\s*,\s*/), function(mime) {
				if (extensions[mime]) {
					exts += extensions[mime].join(',');
				}
			});
		} else {
			exts = mimes;
		}

		accept.push({
			title: I18n.translate('Files'),
			extensions: exts
		});

		// save original mimes string
		accept.mimes = mimes;
						
		return accept;
	}

	return {
		mimes: mimes,
		extensions: extensions,
		extList2mimes: extList2mimes,
		mimes2extList: mimes2extList
	};
});
