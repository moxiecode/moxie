/**
 * FileReader.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

define('moxie/file/FileReader', [
	'moxie/core/Exceptions',
	'moxie/runtime/RuntimeClient'
], function(x, RuntimeClient) {	
	/**
	Utility for preloading o.Blob/o.File objects in memory. By design closely follows [W3C FileReader](http://www.w3.org/TR/FileAPI/#dfn-filereader) 
	interface. Where possible uses native FileReader, where - not falls back to shims.

	@class FileReader
	@constructor FileReader
	@extends EventTarget
	@uses RuntimeClient
	*/
	var dispatches = ['loadstart', 'progress', 'load', 'abort', 'error', 'loadend'];
	
	function FileReader() {
		var self = this, _runtime;	
				
		RuntimeClient.call(self);
	
		o.extend(self, {
			
			uid: o.guid('uid_'),
			
			/**
			Contains current state of o.FileReader object. Can take values of o.FileReader.EMPTY, o.FileReader.LOADING 
			and o.FileReader.DONE.

			@property readyState
			@type {Number}
			@default FileReader.EMPTY
			*/
			readyState: FileReader.EMPTY,	
			
			result: null,
			
			error: null,
			
			/**
			Initiates reading of o.File/o.Blob object contents to binary string.

			@method readAsBinaryString
			@param {Blob|File} blob Object to preload
			*/
			readAsBinaryString: function(blob) {
				this.result = '';
				_read.call(this, 'readAsBinaryString', blob); 		 
			},
			
			/**
			Initiates reading of o.File/o.Blob object contents to dataURL string.

			@method readAsDataURL
			@param {Blob|File} blob Object to preload
			*/
			readAsDataURL: function(blob) {
				_read.call(this, 'readAsDataURL', blob);
			},
			
			readAsArrayBuffer: function(blob) {
				_read.call(this, 'readAsArrayBuffer', blob);
			},
			
			/**
			Initiates reading of o.File/o.Blob object contents to string.

			@method readAsText
			@param {Blob|File} blob Object to preload
			*/
			readAsText: function(blob) {
	 			_read.call(this, 'readAsText', blob);
			},
			
			/**
			Aborts preloading process.

			@method abort
			*/
			abort: function() {
				if (!_runtime) {
					return;	
				}
				
				this.result = null;
				
				if (!!~o.inArray(this.readyState, [FileReader.EMPTY, FileReader.DONE])) {
					return;	
				} else if (this.readyState === FileReader.LOADING) {
					this.readyState = FileReader.DONE;
				}
				
				self.bind('Abort', function() {
					self.trigger('loadend');
				});
				
				_runtime.exec('FileReader', 'abort');					
			}
		});
		
		
		function _read(op, blob) {			
			self.readyState = FileReader.EMPTY;
			self.error = null;
						
			if (self.readyState === FileReader.LOADING || !blob['ruid'] || !blob['uid']) {
				throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
			}	
			
			this.convertEventPropsToHandlers(dispatches);			
						
			_runtime = self.connectRuntime(blob.ruid);	
			
			self.bind('Error', function(e, error) {
				self.readyState = FileReader.DONE;
				self.result = null;
				self.error = error; 
				self.trigger('loadend');
			}, 999);
			
			
			self.bind('LoadStart', function() {
				self.readyState = FileReader.LOADING;
			}, 999);
			
			self.bind('Load', function(o) {
				self.readyState = FileReader.DONE;
				self.trigger('loadend');
			}, 999);
		
			_runtime.exec.call(self, 'FileReader', 'read', op, blob);							 
		}
	}
	
	/**
	Initial FileReader state 

	@property EMPTY
	@type {Number}
	@final
	@static
	@default 0
	*/
	FileReader.EMPTY = 0;

	/**
	FileReader switches to this state when it is preloading the source 

	@property LOADING
	@type {Number}
	@final
	@static
	@default 1
	*/
	FileReader.LOADING = 1;

	/**
	Preloading is complete, this is a final state

	@property DONE
	@type {Number}
	@final
	@static
	@default 2
	*/
	FileReader.DONE = 2;
	
	FileReader.prototype = o.eventTarget;
		
	return (o.FileReader = FileReader);
});