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

define("moxie/xhr/FormData", [
	"moxie/core/Exceptions",
	"moxie/core/utils/Basic",
	"moxie/file/Blob"
], function(x, Basic, Blob) {
	/**
	FormData

	@class FormData
	@constructor
	*/
	function FormData() {
		var _blobField, _fields = {};

		Basic.extend(this, {
			/**
			Append another key-value pair to the FormData object

			@method append
			@param {String} name Name for the new field
			@param {Mixed} value Value for the field, can be String, Number, File
			*/
			append: function(name, value) {
				if (value instanceof Blob) {
					if (_blobField) { // we can only send single Blob in one FormData
						delete _fields[_blobField];
					}
					_blobField = name; 
					_fields[name] = value;
				} else {
					value = value.toString(); // value should be either Blob or String

					if (/\[\]$/.test(name)) { // if array detected
						if (!_fields[name]) {
							_fields[name] = [];
						} 
						_fields[name].push(value);
					} else {
						_fields[name] = value;
					}
				}
			},

			/**
			Checks if FormData contains Blob.

			@method hasBlob
			@return {Boolean}
			*/
			hasBlob: function() {
				return !!_blobField;
			},

			/**
			Retrieves blob.

			@method geBlob
			@return {Object} Either Blob if found or null
			*/
			getBlob: function() {
				return _fields[_blobField] || null;
			},

			/**
			Loop over the fields in FormData and invoke the callback for each of them.

			@method each
			@param {Function} cb Callback to call for each field
			*/
			each: function() {
				var self = this
				, cb = arguments[arguments.length - 1]
				, key
				, fields
				;

				if (arguments.length === 1) {
					fields = _fields;
				} else {
					key = arguments[0];
					fields = arguments[1];
				}

				Basic.each(fields, function(value, name) {
					if (Basic.typeOf(value) === 'array') {
						self.each(name, value, cb);
					} else {
						cb(value, key || name);
					}
				});
			}
		});
	}

	return FormData;
});