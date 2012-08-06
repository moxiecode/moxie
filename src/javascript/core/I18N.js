/**
 * i18n.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

// JSLint defined globals
/*global window:false, escape:false */

// i18n support
;(function(window, document, o, undefined) {
	
var i18n = {};

o.extend(o, {
	
	/**
	 * Extends the language pack object with new items.
	 *
	 * @param {Object} pack Language pack items to add.
	 * @return {Object} Extended language pack object.
	 */
	addI18n : function(pack) {
		return o.extend(i18n, pack);
	},

	/**
	 * Translates the specified string by checking for the english string in the language pack lookup.
	 *
	 * @param {String} str String to look for.
	 * @return {String} Translated string or the input string if it wasn't found.
	 */
	translate : function(str) {
		return i18n[str] || str;
	},
	
	/**
	 * Shortcut for translate function
	 *
	 * @param {String} str String to look for.
	 * @return {String} Translated string or the input string if it wasn't found.
	 */
	_ : function(str) {
		return o.translate(str);	
	}
});

		
}(window, document, mOxie));