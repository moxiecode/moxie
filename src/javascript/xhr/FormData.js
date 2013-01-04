/**
 * FormData.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */
define("xhr/FormData", ["o", "file/Blob", "file/File"], function(o, Blob, File) {

	var x = o.Exceptions;

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

	return (o.FormData = FormData);	
});