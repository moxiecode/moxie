/**
 * FileReaderSync.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

define('moxie/file/FileReaderSync', [
	'o',
	'moxie/runtime/RuntimeClient'
], function(o, RuntimeClient) {

	/**
	Synchronous FileReader implementation. Something like this is available in WebWorkers environment, here 
	it can be used to read only preloaded blobs/files and only below certain size (not yet sure what that'd be, 
	but probably < 1mb). Not meant to be used directly by user. 

	@class FileReaderSync
	@private
	@constructor
	*/
	return function() {

		RuntimeClient.call(this);

		o.extend(this, {

			uid: o.guid('uid_'),

			readAsBinaryString: function(blob) {
				return _read.call(this, 'readAsBinaryString', blob); 		 
			},
			
			readAsDataURL: function(blob) {
				return _read.call(this, 'readAsDataURL', blob);
			},
			
			/*readAsArrayBuffer: function(blob) {
				return _read.call(this, 'readAsArrayBuffer', blob);
			},*/
			
			readAsText: function(blob) {
	 			return _read.call(this, 'readAsText', blob);
			}
		});

		function _read(op, blob) {
			if (blob.isDetached()) {
				var src = blob.getSource();
				switch (op) {
					case 'readAsBinaryString':
						return src;
					case 'readAsDataURL':
						return 'data:' + blob.type + ';base64,' + o.btoa(src);
					case 'readAsText':
						var txt = '';
						for (var i = 0, length = src.length; i < length; i++) {
							txt += String.fromCharCode(src[i]);
						}
						return txt;
				}
			} else {
				try { // runtime is not required to have this method
					return this.connectRuntime(blob.ruid).exec.call(this, 'FileReaderSync', 'read', op, blob);
				} catch(ex) {}
			}
		}
	};
});