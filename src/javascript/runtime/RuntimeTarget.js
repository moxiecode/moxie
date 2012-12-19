/**
 * RuntimeTarget.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define('runtime/RuntimeClient', ['o', 'runtime/RuntimeClient'], function(o, RuntimeClient) {

	/**
	Instance of this class can be used as a target for the events dispatched by shims,
	when allowing them onto components is for either reason inappropriate

	@class RuntimeTarget
	@constructor
	@protected
	@extends EventTarget
	*/
	function RuntimeTarget() {
		this.uid = o.guid('uid_');	
		RuntimeClient.call(this);
	}
		
	RuntimeTarget.prototype = o.eventTarget;
		
	return RuntimeTarget;		
});