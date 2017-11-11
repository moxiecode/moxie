/**
 * Encode.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/core/utils/Encode
@public
@static
*/

define('moxie/core/utils/Encode', [], function() {

	/**
	Encode string with UTF-8

	@method utf8Encode
	@static
	@param {String} str String to encode
	@return {String} UTF-8 encoded string
	*/
	var utf8Encode = function(str) {
		return unescape(encodeURIComponent(str));
	};

	/**
	Decode UTF-8 encoded string

	@method utf8Decode
	@static
	@param {String} str String to decode
	@return {String} Decoded string
	*/
	var utf8Decode = function(str_data) {
		return decodeURIComponent(escape(str_data));
	};

	/**
	Decode Base64 encoded string

	@method atob
	@static
	@param {String} data String to decode
	@return {String} Decoded string
	*/
	var atob = function(data, utf8) {
		return utf8 ? utf8Decode(window.atob(data)) : window.atob(data);
	};

	/**
	Base64 encode string

	@method btoa
	@static
	@param {String} data String to encode
	@return {String} Base64 encoded string
	*/
	var btoa = function(data, utf8) {
		return window.btoa(utf8 ? utf8Encode(data) : data);
	};

	return {
		utf8Encode: utf8Encode,
		utf8Decode: utf8Decode,
		atob: atob,
		btoa: btoa
	};
});
