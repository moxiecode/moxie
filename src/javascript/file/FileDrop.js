/**
 * FileDrop.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define('moxie/file/FileDrop', [
	'moxie/core/I18n',
	'moxie/core/utils/Dom',
	'moxie/core/Exceptions',
	'moxie/core/utils/Basic',
	'moxie/core/utils/Events',
	'moxie/core/utils/Env',
	'moxie/file/FileRef',
	'moxie/core/EventTarget',
	'moxie/core/utils/Mime'
], function(I18n, Dom, x, Basic, Events, Env, FileRef, EventTarget, Mime) {
	/**
	Turn arbitrary DOM element to a drop zone accepting files.

	@example
		<div id="drop_zone">
			Drop files here
		</div>
		<br />
		<div id="filelist"></div>

		<script type="text/javascript">
			var fileDrop = new moxie.file.FileDrop('drop_zone'), fileList = moxie.utils.Dom.get('filelist');

			fileDrop.ondrop = function() {
				moxie.utils.Basic.each(this.files, function(file) {
					fileList.innerHTML += '<div>' + file.name + '</div>';
				});
			};

			fileDrop.init();
		</script>

	@class moxie/file/FileDrop
	@constructor
	@extends EventTarget
	@uses RuntimeClient
	@param {Object|String} options If options has typeof string, argument is considered as options.drop_zone
		@param {String|DOMElement} options.drop_zone DOM Element to turn into a drop zone
		@param {Array} [options.accept] Array of mime types to accept. By default accepts all
		@param {Object|String} [options.required_caps] Set of required capabilities, that chosen runtime must support
	*/
	var dispatches = [
		/**
		Dispatched when runtime is connected and drop zone is ready to accept files.

		@event ready
		@param {Object} event
		*/
		'ready',

		/**
		Dispatched when option is getting changed (@see setOption)

		@event optionchange
		@param {Object} event
		@param {String} name
		@param {Mixed} value
		@param {Mixed} oldValue Previous value of the option
		*/
		'optionchange',

		/**
		Dispatched when dragging cursor enters the drop zone.

		@event dragenter
		@param {Object} event
		*/
		'dragenter',

		/**
		Dispatched when dragging cursor leaves the drop zone.

		@event dragleave
		@param {Object} event
		*/
		'dragleave',

		/**
		Dispatched when file is dropped onto the drop zone.

		@event drop
		@param {Object} event
		*/
		'drop',

		/**
		Dispatched if error occurs.

		@event error
		@param {Object} event
		*/
		'error',

		/**
		Dispatched when component is destroyed (just before all events are unbined).

		@event destroy
		@param {Object} event
		*/
		'destroy'
	];

	function FileDrop(options) {
		if (MXI_DEBUG) {
			Env.log("Instantiating FileDrop...");
		}

		var _uid = Basic.guid('mxi_');
		var _options;
		var _fileRefs = [];
		var _disabled = true;

		var _containerPosition;

		// if flat argument passed it should be drop_zone id
		if (typeof(options) === 'string') {
			_options = { drop_zone : options };
		}

		_options = Basic.extend({
			accept: [{
				title: I18n.translate('All Files'),
				extensions: '*'
			}]
		}, options);

		// normalize accept option (could be list of mime types or array of title/extensions pairs)
		if (typeof(_options.accept) === 'string') {
			_options.accept = Mime.mimes2extList(_options.accept);
		}


		Basic.extend(this, {
			/**
			Unique id of the component

			@property uid
			@protected
			@readOnly
			@type {String}
			@default UID
			*/
			uid: _uid,

			/**
			Unique id of the runtime container. Useful to get hold of it for various manipulations.

			@property shimid
			@protected
			@type {String}
			*/
			shimid: _uid + '_container',

			/**
			Array of selected File objects

			@property files
			@type {Array}
			@default null
			*/
			files: _fileRefs,

			/**
			Initializes the component and dispatches event ready when done.

			@method init
			*/
			init: function() {
				var self = this;
				var dropZone = Dom.get(_options.drop_zone) || document.body;

				if (dropZone.id) {
					self.shimid = dropZone.id;
				} else {
					dropZone.id = self.shimid;
				}

				// make container relative, if it is not
				_containerPosition = Dom.getStyle(dropZone, 'position');
				if (_containerPosition === 'static') {
					options.drop_zone.style.position = 'relative';
				}

				Events.addEvent(dropZone, 'dragover', function(e) {
					if (!_hasFiles(e)) {
						return;
					}
					e.preventDefault();
					e.dataTransfer.dropEffect = 'copy';
				}, _uid);

				Events.addEvent(dropZone, 'drop', function(e) {
					e.preventDefault();

					if (!_hasFiles(e) || _disabled) {
						return;
					}

					_fileRefs.length = 0;

					// Chrome 21+ accepts folders via Drag'n'Drop
					if (e.dataTransfer.items && e.dataTransfer.items[0].webkitGetAsEntry) {
						_readItems(e.dataTransfer.items, function() {
							self.trigger("drop");
						});
					} else {
						Basic.each(e.dataTransfer.files, function(file) {
							_addFile(file);
						});
						self.trigger("drop", _fileRefs);
					}
				}, _uid);

				Events.addEvent(dropZone, 'dragenter', function(e) {
					self.trigger("dragenter");
				}, _uid);

				Events.addEvent(dropZone, 'dragleave', function(e) {
					self.trigger("dragleave");
				}, _uid);


				self.handleEventProps(dispatches);

				self.disable(false);

				// ready event is perfectly asynchronous
				self.trigger({ type: 'ready', async: true });
			},

			/**
			Returns container for the runtime as DOM element

			@method getShimContainer
			@return {DOMElement}
			*/
			getShimContainer: function() {
				return Dom.get(this.shimid);
			},

			/**
			 * Get current option value by its name
			 *
			 * @method getOption
			 * @param name
			 * @return {Mixed}
			 */
			getOption: function(name) {
				return options[name];
			},


			/**
			 * Sets a new value for the option specified by name
			 *
			 * @method setOption
			 * @param name
			 * @param value
			 */
			setOption: function(name, value) {
				if (!_options.hasOwnProperty(name)) {
					return;
				}

				var oldValue = _options[name];
				_options[name] = value;

				this.trigger('OptionChanged', name, value, oldValue);
			},

			/**
			Disables component, so that it doesn't accept files.

			@method disable
			@param {Boolean} [state=true] Disable component if - true, enable if - false
			*/
			disable: function(state) {
				_disabled = (state === undefined ? true : state);
			},

			/**
			Destroy component.

			@method destroy
			*/
			destroy: function() {
				var dropZone = Dom.get(_options.drop_zone) || document.body;

				Events.removeAllEvents(dropZone, _uid);
				dropZone.style.position = _containerPosition;

				if (Basic.typeOf(_fileRefs) === 'array') {
					// no sense in leaving associated files behind
					Basic.each(_fileRefs, function (file) {
						file.destroy();
					});
				}

				_options = null;
				_fileRefs.length = 0;

				this.trigger('Destroy');
				this.unbindAll();
			}
		});


		function _hasFiles(e) {
			if (!e.dataTransfer || !e.dataTransfer.types) { // e.dataTransfer.files is not available in Gecko during dragover
				return false;
			}

			var types = Basic.toArray(e.dataTransfer.types || []);

			return Basic.inArray("Files", types) !== -1 ||
				Basic.inArray("public.file-url", types) !== -1 || // Safari < 5
				Basic.inArray("application/x-moz-file", types) !== -1 // Gecko < 1.9.2 (< Firefox 3.6)
				;
		}

		function _addFile(file, relativePath) {
			if (_isAcceptable(file)) {
				var fileObj = new FileRef(null, file);
				fileObj.relativePath = relativePath || ''; // (!) currently this is the only reason to have a FileRef wrapper around native File
				_fileRefs.push(fileObj);
			}
		}

		function _extractExts(accept) {
			var exts = [];
			for (var i = 0; i < accept.length; i++) {
				[].push.apply(exts, accept[i].extensions.split(/\s*,\s*/));
			}
			return Basic.inArray('*', exts) === -1 ? exts : [];
		}

		function _isAcceptable(file) {
			var allowedExts = _extractExts(_options.accept);

			if (!allowedExts.length) {
				return true;
			}
			var ext = Mime.getFileExtension(file.name);
			return !ext || Basic.inArray(ext, allowedExts) !== -1;
		}

		function _readItems(items, cb) {
			var entries = [];
			Basic.each(items, function(item) {
				var entry = item.webkitGetAsEntry();
				// Address #998 (https://code.google.com/p/chromium/issues/detail?id=332579)
				if (entry) {
					// file() fails on OSX when the filename contains a special character (e.g. umlaut): see #61
					if (entry.isFile) {
						_addFile(item.getAsFile(), entry.fullPath);
					} else {
						entries.push(entry);
					}
				}
			});

			if (entries.length) {
				_readEntries(entries, cb);
			} else {
				cb();
			}
		}

		function _readEntries(entries, cb) {
			var queue = [];
			Basic.each(entries, function(entry) {
				queue.push(function(cbcb) {
					_readEntry(entry, cbcb);
				});
			});
			Basic.inSeries(queue, function() {
				cb();
			});
		}

		function _readEntry(entry, cb) {
			if (entry.isFile) {
				entry.file(function(file) {
					_addFile(file, entry.fullPath);
					cb();
				}, function() {
					// fire an error event maybe
					cb();
				});
			} else if (entry.isDirectory) {
				_readDirEntry(entry, cb);
			} else {
				cb(); // not file, not directory? what then?..
			}
		}

		function _readDirEntry(dirEntry, cb) {
			var entries = [], dirReader = dirEntry.createReader();

			// keep quering recursively till no more entries
			function getEntries(cbcb) {
				dirReader.readEntries(function(moreEntries) {
					if (moreEntries.length) {
						[].push.apply(entries, moreEntries);
						getEntries(cbcb);
					} else {
						cbcb();
					}
				}, cbcb);
			}

			// ...and you thought FileReader was crazy...
			getEntries(function() {
				_readEntries(entries, cb);
			});
		}
	}

	FileDrop.prototype = EventTarget.instance;

	return FileDrop;
});
