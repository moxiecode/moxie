/**
 * XMLHttpRequest.js
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
@class moxie/runtime/silverlight/xhr/XMLHttpRequest
@private
*/
define("moxie/runtime/silverlight/xhr/XMLHttpRequest", [
	"moxie/runtime/silverlight/Runtime",
	"moxie/core/utils/Basic",
	"moxie/runtime/flash/xhr/XMLHttpRequest"
], function(extensions, Basic, FlashXMLHttpRequest) {

	var XMLHttpRequest = Basic.extend({}, FlashXMLHttpRequest, {
	    send: function(meta, data) {
    		var I = this.getRuntime();
    		meta.transport = I.can('send_browser_cookies') ? 'browser' : 'client';
    		FlashXMLHttpRequest.send.call(this, meta, data);
    	}
	});

	return (extensions.XMLHttpRequest = XMLHttpRequest);
});