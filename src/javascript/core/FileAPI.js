/**
 * FileAPI.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

;(function(window, document, o, undefined) {
	
var x = o.Exceptions;	
	
(function() { 
	var blobpool = {};

	/**
	Blob

	@class Blob
	@constructor
	@param {String} ruid Unique id of the runtime, to which this blob belongs to
	@param {Object} blob Object "Native" blob object, as it is represented in the runtime
	*/
	o.Blob = (function() {
		
		function Blob(ruid, blob) {
			if (!blob) {
				blob = {};
			}

			o.extend(this, {
				
				/**
				Unique id of the component

				@property uid
				@type String
				*/
				uid: o.guid('uid_'),
				
				/**
				Unique id of the connected runtime, if falsy, then runtime will have to be initialized 
				before this Blob can be used, modified or sent

				@property ruid
				@type String
				*/
				ruid: ruid,
		
				/**
				Size of blob

				@property size
				@type Number
				@default 0
				*/
				size: blob.size || 0,
				
				/**
				Mime type of blob

				@property size
				@type String
				@default ''
				*/
				type: blob.type || '',
				
				/**
				@method slice
				@param {Number} [start=0]
				*/
				slice: function(start, end, type) {		
					var runtime = _getRuntime.call(this);
					return runtime.exec.call(this, 'Blob', 'slice', this.getSource(), start, end, type);
				},

				/**
				Returns "native" blob object (as it is represented in connected runtime) or null if not found

				@method getSource
				@return {Blob} Returns "native" blob object or null if not found
				*/
				getSource: function() {
					if (!blobpool[this.uid]) {
						return null;	
					}
					
					return blobpool[this.uid];
				},

				/** 
				Detaches blob from any runtime that it depends on and initialize with standalone value

				@method detach
				@protected
				@param {DOMString} [data=''] Standalone value
				*/
				detach: function(data) {
					if (this.ruid) {
						_getRuntime.call(this).exec.call(this, 'Blob', 'destroy', blobpool[this.uid]);
						this.ruid = null;
					}

					blobpool[this.uid] = data || '';
				},

				/**
				Checks if blob is standalone (detached of any runtime)
				
				@method isDetached
				@protected
				@return {Boolean}
				*/
				isDetached: function() {
					return !this.ruid && o.typeOf(blobpool[this.uid]) === 'string';
				},
				
				/** 
				Destroy Blob and free any resources it was using

				@method destroy
				*/
				destroy: function() {
					this.detach();
					delete blobpool[this.uid];
				},

				constructor: o.Blob
			});

			
			if (blob.data) {
				this.detach(blob.data); // auto-detach if payload has been passed
			} else {
				blobpool[this.uid] = blob;	
			}


			function _getRuntime() {
				if (o.typeOf(o.connectRuntime) !== 'function') {		
					o.RuntimeClient.call(this);
				}
				return this.connectRuntime(this.ruid);
			}
		}
		
		return Blob;
	}());
		

	o.File = (function() {
		
		function File(ruid, file) {
			var name, ext, type;

			if (!file) { // avoid extra errors in case we overlooked something
				file = {};
			}

			// extract extension
			ext = file.name && file.name.match(/[^\.]+$/);

			// figure out the type
			if (!file.type) {
				type = ext && o.mimes[ext[0]] || 'application/octet-stream';
			}

			// sanitize file name or generate new one
			if (file.name) {
				name = file.name.replace(/\\/g, '/');
				name = name.substr(name.lastIndexOf('/') + 1);
			} else if (file.type && o.extensions[file.type]) {
				ext = o.extensions[file.type][0];
				name = o.guid(file.type.split('/')[0] + '_' || 'file_') + '.' + ext;
			}

			o.Blob.apply(this, arguments);
			
			o.extend(this, {

				type: file.type || type,

				name: name || '',
				
				lastModifiedDate: file.lastModifiedDate || (new Date()).toLocaleString(), // Thu Aug 23 2012 19:40:00 GMT+0400 (GET)
				
				constructor: o.File
			});	
		}

		File.prototype = o.Blob.prototype;
	 		
		return File;
	}());

}());
	


o.BlobBuilder = (function() {
	
	function BlobBuilder() {
		var sources = [];
		
		function _getData() {
			var blob, data = '';

			o.each(sources, function(src) {
				if (o.typeOf(src) === 'string') {
					data += src;
				} else if (src instanceof o.Blob) {
					var frs = new o.FileReaderSync;
					data += frs.readAsBinaryString(src);
				}
			});	
			return data;
		}
		
		o.extend(this, {
			
			uid: o.guid('uid_'),
						
			append: function(data) {
				if (o.typeOf(data) !== 'string' || !(data instanceof o.Blob)) {
					throw new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);
				}
				sources.push(data);
			},
			
			getBlob: function(type) {
				var data = _getData(), blob;

				blob = new o.Blob(null, {
					size: data.length,
					type: type
				});

				blob.detach(data);
				return blob;
			},
			
			getFile: function(type, name) {
				var data = _getData(), blob;

				blob = new o.File(null, {
					size: data.length,
					type: type,
					name: name
				});

				blob.detach(data);
				return blob;
			},

			destroy: function() {
				sources = [];
			},

			constructor: o.BlobBuilder
		});
	}
	
	return BlobBuilder;
}());
	


o.FileReader = (function() {
	var dispatches = ['loadstart', 'progress', 'load', 'abort', 'error', 'loadend'];
	
	function FileReader() {
		var self = this, _runtime;	
				
		o.RuntimeClient.call(self);
	
		o.extend(self, {
			
			uid: o.guid('uid_'),
			
			readyState: FileReader.EMPTY,	
			
			result: null,
			
			error: null,
			
			readAsBinaryString: function(blob) {
				this.result = '';
				_read.call(this, 'readAsBinaryString', blob); 		 
			},
			
			readAsDataURL: function(blob) {
				_read.call(this, 'readAsDataURL', blob);
			},
			
			readAsArrayBuffer: function(blob) {
				_read.call(this, 'readAsArrayBuffer', blob);
			},
			
			readAsText: function(blob) {
	 			_read.call(this, 'readAsText', blob);
			},
			
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
			},
			
			constructor: FileReader
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
	
	FileReader.EMPTY = 0;
	FileReader.LOADING = 1;
	FileReader.DONE = 2;
	
	FileReader.prototype = o.eventTarget;
		
	return FileReader;
	
}());

/* something like this is available in WebWorkers environment, here it can be used to read only preloaded blobs/files
and only below certain size (not yet sure what that'd be, but probably < 1mb) */
o.FileReaderSync = (function() {

	function FileReaderSync() {

		o.RuntimeClient.call(this);

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
	}

	return FileReaderSync;
}());



o.FileInput = (function() {	
	var dispatches = ['ready', 'change', 'mouseenter', 'mouseleave', 'mousedown', 'mouseup'];

	function FileInput(options) {
		var self = this, 
			container, browseButton, defaults; 
	
		// if flat argument passed it should be browse_button id	
		if (typeof(options) === 'string') {
			options = { browse_button : options };
		}
			
		// this will help us to find proper default container
		browseButton = o(options.browse_button);
		if (!browseButton) {
			// browse button is required
			throw new x.DOMException(x.DOMException.NOT_FOUND_ERR);	
		}	
		
		// figure out the options	
		defaults = {
			accept: [{
				title: o.translate('All Files'),	
				extensions: '*'
			}],
			name: 'file',
			multiple: false,
			required_caps: false,
			container: browseButton.parentNode || document.body
		};
		
		options = typeof(options) === 'object' ? o.extend({}, defaults, options) : defaults;
					
		// normalize accept option (could be list of mime types or array of title/extensions pairs)
		if (typeof(options.accept) === 'string') {
			options.accept = mimes2extList(options.accept);
		}
					
		// make container relative, if they're not
		container = o(options.container);
		if (o.getStyle(container, 'position') === 'static') {
			container.style.position = 'relative';
		}
		container = browseButton = null; // IE
						
		o.RuntimeClient.call(self);
		
		o.extend(self, {
			
			uid: o.guid('uid_'),
			
			ruid: null,
			
			files: null,

			init: function() {
	
				self.convertEventPropsToHandlers(dispatches);	
		
				self.bind('RuntimeInit', function(e, runtime) {		
				
					self.ruid = runtime.uid;	

					self.bind("Change", function(e) {	
						var files = runtime.exec.call(self, 'FileInput', 'getFiles');

						self.files = [];

						o.each(files, function(file) {	
							self.files.push(new o.File(self.ruid, file));
						});						
					}, 999);	
					
					runtime.exec.call(self, 'FileInput', 'init', options);

					// re-position and resize shim container
					self.bind('Refresh', function() {
						var pos, size, browseButton;
						
						browseButton = o(options.browse_button);

						if (browseButton) {
							pos = o.getPos(browseButton, o(options.container));
							size = o.getSize(browseButton);
												
							o.extend(runtime.getShimContainer().style, {
								top 	: pos.y + 'px',
								left 	: pos.x + 'px',
								width 	: size.w + 'px',
								height 	: size.h + 'px'
							});	
							browseButton = null;
						}
					});
					self.trigger('Refresh');
								
					self.dispatchEvent('ready');
				});
							
				// runtime needs: options.required_features, options.runtime_order and options.container
				self.connectRuntime(options); // throws RuntimeError
			},

			constructor: FileInput
		});
	}
	
	FileInput.prototype = o.eventTarget;
			
	return FileInput;
}());
	
}(window, document, mOxie));










