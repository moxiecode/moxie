/**
 * I18n.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

import Basic from './Basic';

var i18n = {};

/**
@class moxie/utils/I18n
*/
/**
 * Extends the language pack object with new items.
 *
 * @param {Object} pack Language pack items to add.
 * @return {Object} Extended language pack object.
 */
var addI18n = function (pack) {
	return Basic.extend(i18n, pack);
}

/**
 * Translates the specified string by checking for the english string in the language pack lookup.
 *
 * @param {String} str String to look for.
 * @return {String} Translated string or the input string if it wasn't found.
 */
var translate = function (str) {
	return i18n[str] || str;
}

/**
 * Shortcut for translate function
 *
 * @param {String} str String to look for.
 * @return {String} Translated string or the input string if it wasn't found.
 */
var _ = function (str) {
	return this.translate(str);
}


export default <any> {
	addI18n,
	translate,
	_,
	sprintf: Basic.sprintf
};