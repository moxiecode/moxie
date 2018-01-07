/**
 * FileRef.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

import { Basic, Mime } from '../utils';
import BlobRef from './BlobRef';

/**
@class moxie/file/FileRef
@extends BlobRef
@constructor
@param {Object} file Object "Native" file object, as it is represented in the runtime
*/
export default class FileRef extends BlobRef {

	/**
	FileRef name

	@property name
	@type {String}
	@default UID
	*/
	public name: string;

	/**
	Relative path to the file inside a directory
	(in fact this property currently is the whole reason for this wrapper to exist)

	@property relativePath
	@type {String}
	@default ''
	*/
	public relativePath: string = '';

	/**
	Date of last modification

	@property lastModifiedDate
	@type {String}
	@default now
	*/
	public lastModifiedDate: string;


	constructor(file, legacyBlob?) {
		super(file, legacyBlob);

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
		this.name =  name;
		this.lastModifiedDate =  file.lastModifiedDate || (new Date()).toLocaleString(); // Thu Aug 23 2012 19:40:00 GMT+0400 (GET)
	}
}