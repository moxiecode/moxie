/**
 * BlobRef.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

import { typeOf, guid } from 'utils/Basic';

const blobpool: any = {};

/**
@class moxie/file/BlobRef
@constructor
@param {Object} blob Object "Native" blob object, as it is represented in the runtime
*/

export default class BlobRef {

	/**
	Unique id of the component

	@property uid
	@type {String}
	*/
	uid: string;

	/**
	Size of blob

	@property size
	@type {Number}
	@default 0
	*/
	size: number;

	/**
	Mime type of blob

	@property type
	@type {String}
	@default ''
	*/
	type: string;


	constructor(protected _blob: any, legacyBlob?) {
		// originally the first argument was runtime uid, but then we got rid of runtimes
		// however lets better retain backward compatibility here
		if (typeOf(_blob) !== 'object' && typeOf(legacyBlob) !== 'undefined') {
			_blob = legacyBlob;
		}

		if (!_blob) {
			_blob = {};
		}

		this.uid =  _blob.uid || guid('uid_');
		this.size =  _blob.size || 0;
		this.type =  _blob.type || '';

		blobpool[this.uid] = _blob;
	}

	/**
	@method slice
	@param {Number} [start=0]
	@param {Number} [end=blob.size]
	@param {String} [type] Content Mime type
	*/
	slice() {
		return new BlobRef(this._blob.slice.apply(this._blob, arguments));
	}

	/**
	Returns "native" blob object (as it is represented in connected runtime) or null if not found

	@method getSource
	@return {BlobRef} Returns "native" blob object or null if not found
	*/
	getSource() {
		if (!blobpool[this.uid]) {
			return null;
		}
		return blobpool[this.uid];
	}

	/**
	Destroy BlobRef and free any resources it was using

	@method destroy
	*/
	destroy() {
		delete blobpool[this.uid];
	}

}