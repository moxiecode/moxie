/**
 * File.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

define('moxie/file/File', [
	'moxie/core/utils/Basic',
	'moxie/core/utils/Mime',
	'moxie/file/Blob'
], function(Basic, Mime, Blob) {
	/**
	@class File
	@extends Blob
	@constructor
	@param {String} ruid Unique id of the runtime, to which this blob belongs to
	@param {Object} file Object "Native" file object, as it is represented in the runtime
	*/
	function File(ruid, file) {
		var name, ext, type;

		if (!file) { // avoid extra errors in case we overlooked something
			file = {};
		}

		// extract extension
		ext = file.name && file.name.match(/[^\.]+$/);

		// figure out the type
		if (!file.type) {
			type = ext && Mime.mimes[ext[0].toLowerCase()] || 'application/octet-stream';
		}

		// sanitize file name or generate new one
		if (file.name) {
			name = file.name.replace(/\\/g, '/');
			name = name.substr(name.lastIndexOf('/') + 1);
		} else if (file.type && Mime.extensions[file.type]) {
			ext = Mime.extensions[file.type][0];
			name = Basic.guid(file.type.split('/')[0] + '_' || 'file_') + '.' + ext;
		}

		Blob.apply(this, arguments);
		
		Basic.extend(this, {
			type: file.type || type,

			/**
			File name

			@property name
			@type {String}
			@default ''
			*/
			name: name || '',
			
			/**
			Date of last modification

			@property name
			@type {String}
			@default now
			*/
			lastModifiedDate: file.lastModifiedDate || (new Date()).toLocaleString() // Thu Aug 23 2012 19:40:00 GMT+0400 (GET)
		});
	}

	File.prototype = Blob.prototype;

	return File;
});