/**
 * Image.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

/**
@class moxie/runtime/silverlight/image/Image
@private
*/
define("moxie/runtime/silverlight/image/Image", [
	"moxie/runtime/silverlight/Runtime",
	"moxie/core/utils/Basic",
	"moxie/runtime/flash/image/Image"
], function(extensions, Basic, Image) {
	return (extensions.Image = Basic.extend({}, Image));
});