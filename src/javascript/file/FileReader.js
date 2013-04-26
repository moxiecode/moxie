/**
 * FileReader.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define('moxie/file/FileReader', [
	'moxie/core/utils/Basic',
	'moxie/core/Exceptions',
	'moxie/core/EventTarget',
	'moxie/runtime/RuntimeClient'
], function(Basic, x, EventTarget, RuntimeClient) {
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
				
		RuntimeClient.call(this);

		Basic.extend(this, {
			uid: Basic.guid('uid_'),

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
				this.result = null;
				
				if (!!~Basic.inArray(this.readyState, [FileReader.EMPTY, FileReader.DONE])) {
					return;
				} else if (this.readyState === FileReader.LOADING) {
					this.readyState = FileReader.DONE;
				}

				var runtime = this.getRuntime();
				if (runtime) {
					runtime.exec.call(this, 'FileReader', 'abort');
				}
				
				this.bind('Abort', function() {
					this.trigger('loadend');
				});
			},

			/**
			Destroy component and release resources.

			@method destroy
			*/
			destroy: function() {
				this.abort();

				var runtime = this.getRuntime();
				if (runtime) {
					runtime.exec.call(this, 'FileReader', 'destroy');
					this.disconnectRuntime();
				}
			}
		});
		
		
		function _read(op, blob) {
			this.readyState = FileReader.EMPTY;
			this.error = null;

			if (this.readyState === FileReader.LOADING || !blob.ruid || !blob.uid) {
				throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
			}
			
			this.convertEventPropsToHandlers(dispatches);
						
			this.bind('Error', function(e, error) {
				this.readyState = FileReader.DONE;
				this.result = null;
				this.error = error;
				this.trigger('loadend');
			}, 999);
			
			
			this.bind('LoadStart', function() {
				this.readyState = FileReader.LOADING;
			}, 999);
			
			this.bind('Load', function() {
				this.readyState = FileReader.DONE;
				this.trigger('loadend');
			}, 999);

			this.connectRuntime(blob.ruid).exec.call(this, 'FileReader', 'read', op, blob);
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

	FileReader.prototype = EventTarget.instance;

	return FileReader;
});