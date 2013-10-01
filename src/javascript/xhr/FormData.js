/**
 * FormData.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

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
		var _blobField, _fields = {}, _name = "";

		Basic.extend(this, {
			/**
			Append another key-value pair to the FormData object

			@method append
			@param {String} name Name for the new field
			@param {String|Blob|Array|Object} value Value for the field
			*/
			append: function(name, value) {
				var self = this, valueType = Basic.typeOf(value);

				if (value instanceof Blob) {
					if (_blobField) { 
						delete _fields[_blobField];
					}
					_blobField = name; 
					_fields[name] = [value]; // unfortunately we can only send single Blob in one FormData
				} else if ('array' === valueType) {
					name += '[]';

					Basic.each(value, function(value) {
						self.append.call(self, name, value);
					});
				} else if ('object' === valueType) {
					Basic.each(value, function(value, key) {
						self.append.call(self, name + '[' + key + ']', value);
					});
				} else {
					value = (value || false).toString(); // according to specs value might be either Blob or String

					if (!_fields[name]) {
						_fields[name] = [];
					} 
					_fields[name].push(value);
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

			@method getBlob
			@return {Object} Either Blob if found or null
			*/
			getBlob: function() {
				return _fields[_blobField] && _fields[_blobField][0] || null;
			},

			/**
			Retrieves blob field name.

			@method getBlobName
			@return {String} Either Blob field name or null
			*/
			getBlobName: function() {
				return _blobField || null;
			},

			/**
			Loop over the fields in FormData and invoke the callback for each of them.

			@method each
			@param {Function} cb Callback to call for each field
			*/
			each: function(cb) {
				Basic.each(_fields, function(value, name) {
					Basic.each(value, function(value) {
						cb(value, name);
					});
				});
			},

			destroy: function() {
				_blobField = null;
				_name = "";
				_fields = {};
			}
		});
	}

	return FormData;
});
