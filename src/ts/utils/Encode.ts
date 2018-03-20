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
@class moxie/utils/Encode
@public
@static
*/

/**
Encode string with UTF-8

@method utf8Encode
@static
@param {String} str String to encode
@return {String} UTF-8 encoded string
*/
const utf8Encode = function (str) {
	return unescape(encodeURIComponent(str));
};

/**
Decode UTF-8 encoded string

@method utf8Decode
@static
@param {String} str String to decode
@return {String} Decoded string
*/
const utf8Decode = function (str_data) {
	return decodeURIComponent(escape(str_data));
};

/**
Decode Base64 encoded string

@method atob
@static
@param {String} data String to decode
@return {String} Decoded string
*/
const atob = function (data, utf8) {
	return utf8 ? utf8Decode(window.atob(data)) : window.atob(data);
};

/**
Base64 encode string

@method btoa
@static
@param {String} data String to encode
@return {String} Base64 encoded string
*/
const btoa = function (data, utf8) {
	return window.btoa(utf8 ? utf8Encode(data) : data);
};

export default {
	utf8Encode,
	utf8Decode,
	atob,
	btoa
};
