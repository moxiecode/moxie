/**
 * FormData.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */
/*global define:true */

define("xhr/FormData", [
	"moxie/core/Exceptions",
	"moxie/core/utils/Basic",
	"file/Blob",
	"file/File"
], function(x, o, Blob, File) {
	/**
	FormData

	@class FormData
	@constructor
	*/
	function FormData() {
		o.extend(this, {
			_blob: null,

			_fields: {},

			/**
			Append another key-value pair to the FormData object

			@method append
			@param {String} name Name for the new field
			@param {Mixed} value Value for the field, can be String, Number, File
			*/
			append: function(name, value) {
				if (value instanceof Blob || value instanceof File) {
					if (this._blob) {
						throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
					} else {
						this._blob = name;
					}
				}

				this._fields[name] = value;
			}
		});
	}

	return FormData;
});