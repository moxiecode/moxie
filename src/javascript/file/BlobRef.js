/**
 * BlobRef.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define('moxie/file/BlobRef', [
	'moxie/core/utils/Basic'
], function(Basic) {

	var blobpool = {};

	/**
	@class moxie/file/BlobRef
	@constructor
	@param {Object} blob Object "Native" blob object, as it is represented in the runtime
	*/
	function BlobRef(blob) {
		// originally the first argument was runtime uid, but then we got rid of runtimes
		// however lets better retain backward compatibility here
		if (Basic.typeOf(blob) !== 'object' && Basic.typeOf(arguments[1]) !== 'undefined') {
			blob = arguments[1];
		}

		if (!blob) {
			blob = {};
		}

		Basic.extend(this, {

			/**
			Unique id of the component

			@property uid
			@type {String}
			*/
			uid: blob.uid || Basic.guid('uid_'),

			/**
			Size of blob

			@property size
			@type {Number}
			@default 0
			*/
			size: blob.size || 0,

			/**
			Mime type of blob

			@property type
			@type {String}
			@default ''
			*/
			type: blob.type || '',

			/**
			@method slice
			@param {Number} [start=0]
			@param {Number} [end=blob.size]
			@param {String} [type] Content Mime type
			*/
			slice: function() {
				return new BlobRef(blob.slice.apply(blob, arguments));
			},

			/**
			Returns "native" blob object (as it is represented in connected runtime) or null if not found

			@method getSource
			@return {BlobRef} Returns "native" blob object or null if not found
			*/
			getSource: function() {
				if (!blobpool[this.uid]) {
					return null;
				}
				return blobpool[this.uid];
			},

			/**
			Destroy BlobRef and free any resources it was using

			@method destroy
			*/
			destroy: function() {
				delete blobpool[this.uid];
			}
		});


		blobpool[this.uid] = blob;
	}

	return BlobRef;
});