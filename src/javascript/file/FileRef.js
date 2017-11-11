/**
 * FileRef.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define('moxie/file/FileRef', [
	'moxie/core/utils/Basic',
	'moxie/core/utils/Mime',
	'moxie/file/BlobRef'
], function(Basic, Mime, BlobRef) {
	/**
	@class moxie/file/FileRef
	@extends BlobRef
	@constructor
	@param {Object} file Object "Native" file object, as it is represented in the runtime
	*/
	function FileRef(file) {
		// originally the first argument was runtime uid, but then we got rid of runtimes
		// however lets better retain backward compatibility here
		if (Basic.typeOf(file) !== 'object' && Basic.typeOf(arguments[1]) !== 'undefined') {
			file = arguments[1];
		}

		BlobRef.apply(this, arguments);

		// if type was not set by BlobRef constructor and we have a clue, try some
		if (!this.type) {
			this.type = Mime.getFileRefMime(file.name);
		}

		// sanitize file name or generate new one
		var name;
		if (file.name) {
			name = file.name.replace(/\\/g, '/'); // this is weird, but I think this was meant to extract the file name from the URL
			name = name.substr(name.lastIndexOf('/') + 1);
		} else if (this.type) {
			var prefix = this.type.split('/')[0];
			name = Basic.guid((prefix !== '' ? prefix : 'file') + '_');

			if (Mime.extensions[this.type]) {
				name += '.' + Mime.extensions[this.type][0]; // append proper extension if possible
			}
		}


		Basic.extend(this, {
			/**
			FileRef name

			@property name
			@type {String}
			@default UID
			*/
			name: name || Basic.guid('file_'),

			/**
			Relative path to the file inside a directory
			(in fact this property currently is the whole reason for this wrapper to exist)

			@property relativePath
			@type {String}
			@default ''
			*/
			relativePath: '',

			/**
			Date of last modification

			@property lastModifiedDate
			@type {String}
			@default now
			*/
			lastModifiedDate: file.lastModifiedDate || (new Date()).toLocaleString() // Thu Aug 23 2012 19:40:00 GMT+0400 (GET)
		});
	}

	Basic.inherit(FileRef, BlobRef);

	return FileRef;
});