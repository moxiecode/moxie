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
				@type {String}
				*/
				uid: o.guid('uid_'),
				
				/**
				Unique id of the connected runtime, if falsy, then runtime will have to be initialized 
				before this Blob can be used, modified or sent

				@property ruid
				@type {String}
				*/
				ruid: ruid,
		
				/**
				Size of blob

				@property size
				@type {Number}
				@default 0
				*/
				size: blob.size || 0,
				
				/**
				Mime type of blob

				@property type
				@type {String}
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
		
	/**
	@class File
	@extends Blob
	@constructor
	@param {String} ruid Unique id of the runtime, to which this blob belongs to
	@param {Object} file Object "Native" file object, as it is represented in the runtime
	*/
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
				type = ext && o.mimes[ext[0].toLowerCase()] || 'application/octet-stream';
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

				/**
				File name

				@property name
				@type {String}
				@default ''
				*/
				name: name || '',
				
				/**
				Date of last modification

				@property name
				@type {String}
				@default now
				*/
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
	

/**
Utility for preloading o.Blob/o.File objects in memory. By design closely follows [W3C FileReader](http://www.w3.org/TR/FileAPI/#dfn-filereader) 
interface. Where possible uses native FileReader, where - not falls back to shims.

@class FileReader
@constructor FileReader
@extends EventTarget
@extends RuntimeClient
*/
o.FileReader = (function() {
	var dispatches = ['loadstart', 'progress', 'load', 'abort', 'error', 'loadend'];
	
	function FileReader() {
		var self = this, _runtime;	
				
		o.RuntimeClient.call(self);
	
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
		
	return FileReader;
	
}());

/**
Synchronous FileReader implementation. Something like this is available in WebWorkers environment, here 
it can be used to read only preloaded blobs/files and only below certain size (not yet sure what that'd be, 
but probably < 1mb). Not meant to be used directly by user. 

@class FileReaderSync
@private
@constructor
*/
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


/**
Provides a convenient way to create cross-browser file-picker. Generates file selection dialog on click,
converts selected files to o.File objects, to be used in conjunction with _o.Image_, preloaded in memory
with _o.FileReader_ or uploaded to a server through _o.XMLHttpRequest_.

@class FileInput
@constructor
@param {Object|String} options If options has typeof string, argument is considered as options.browse_button
@param {String|DOMElement} options.browse_button DOM Element to turn into file picker
@param {Array} [options.accept] Array of mime types to accept. By default accepts all
@param {String} [options.file='file'] Name of the file field (not the filename)
@param {Boolean} [options.multiple=false] Enable selection of multiple files
@param {String|DOMElement} [options.container] DOM Element to use as acontainer for file-picker. Defaults to parentNode for options.browse_button 
@param {Object|String} [options.required_caps] Set of required capabilities, that chosen runtime must support

@example 
	<div id="container">
		<a id="file-picker" href="javascript:;">Browse...</a>
	</div>

	<script>
		var fileInput = new o.FileInput({
			browse_button: 'file-picker', // or document.getElementById('file-picker')
			container: 'container'
			accept: [
				{title: "Image files", extensions: "jpg,gif,png"} // accept only images
			],
			multiple: true // allow multiple file selection
		});

		fileInput.onchange = function(e) {
			// do something to files array
			console.info(e.target.files); // or this.files or fileInput.files
		};

		fileInput.init(); // initialize
	</script>
*/
o.FileInput = (function() {	
	var dispatches = [
		/**
		Dispatched when runtime is connected and file-picker is ready to be used.

		@event ready
		@param {Object} event
		*/
		'ready', 

		/**
		Dispatched when selection of files in the dialog is complete.

		@event change
		@param {Object} event
		*/
		'change', 

		'cancel', // TODO: might be useful

		/**
		Dispatched when mouse cursor enters file-picker area. Can be used to style element
		accordingly.

		@event mouseenter
		@param {Object} event
		*/
		'mouseenter', 

		/**
		Dispatched when mouse cursor leaves file-picker area. Can be used to style element
		accordingly.

		@event mouseleave
		@param {Object} event
		*/
		'mouseleave', 

		/**
		Dispatched when functional mouse button is pressed on top of file-picker area. 

		@event mousedown
		@param {Object} event
		*/
		'mousedown', 

		/**
		Dispatched when functional mouse button is released on top of file-picker area. 

		@event mouseup
		@param {Object} event
		*/
		'mouseup'
	];

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
			
			/**
			Unique id of the component

			@property uid
			@protected
			@readOnly
			@type {String}
			@default UID
			*/
			uid: o.guid('uid_'),
			
			/**
			Unique id of the connected runtime, if any.

			@property ruid
			@protected
			@type {String}
			*/
			ruid: null,
			
			/**
			Array of selected o.File objects

			@property files
			@type {Array}
			@default null
			*/
			files: null,

			/**
			Initializes the file-picker, connects it to runtime and dispatches event ready when done.

			@method init
			*/
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

			/**
			Disables file-picker element, so that it doesn't react to mouse clicks.

			@method disable
			@param {Boolean} [state=true] Disable component if - true, enable if - false
			*/
			disable: function(state) {
				var runtime = this.getRuntime();
				if (runtime) {
					runtime.exec.call(this, 'FileInput', 'disable', state === undefined ? true : state);
				}
			},

			constructor: FileInput
		});
	}
	
	FileInput.prototype = o.eventTarget;
			
	return FileInput;
}());


o.FileDrop = (function() {	
	var dispatches = ['ready', 'dragleave', 'dragenter', 'drop', 'error'];

	function FileDrop(options) {
		var self = this, defaults; 
	
		// if flat argument passed it should be drop_zone id	
		if (typeof(options) === 'string') {
			options = { drop_zone : options };
		}

		// figure out the options	
		defaults = {
			accept: [{
				title: o.translate('All Files'),	
				extensions: '*'
			}],
			required_caps: {
				drag_and_drop: true
			}
		};
		
		options = typeof(options) === 'object' ? o.extend({}, defaults, options) : defaults;

		// this will help us to find proper default container
		options.container = o(options.drop_zone) || document.body;

		// make container relative, if they're not
		if (o.getStyle(options.container, 'position') === 'static') {
			options.container.style.position = 'relative';
		}
					
		// normalize accept option (could be list of mime types or array of title/extensions pairs)
		if (typeof(options.accept) === 'string') {
			options.accept = mimes2extList(options.accept);
		}
						
		o.RuntimeClient.call(self);
		
		o.extend(self, {
			
			uid: o.guid('uid_'),
			
			ruid: null,
			
			files: null,

			init: function() {
	
				self.convertEventPropsToHandlers(dispatches);	
		
				self.bind('RuntimeInit', function(e, runtime) {	
					self.ruid = runtime.uid;	

					self.bind("Drop", function(e) {	
						var files = runtime.exec.call(self, 'FileDrop', 'getFiles');

						self.files = [];

						o.each(files, function(file) {	
							self.files.push(new o.File(self.ruid, file));
						});						
					}, 999);	
					
					runtime.exec.call(self, 'FileDrop', 'init');
								
					self.dispatchEvent('ready');
				});
							
				// runtime needs: options.required_features, options.runtime_order and options.container
				self.connectRuntime(options); // throws RuntimeError
			},

			constructor: FileDrop
		});
	}
	
	FileDrop.prototype = o.eventTarget;
			
	return FileDrop;
}());
	
}(window, document, mOxie));










