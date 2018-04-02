/**
 * FileDrop.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

import { Basic, Mime, Dom, Events, I18n } from 'utils';
import EventTarget from 'EventTarget';
import FileRef from 'file/FileRef'

/**
Turn arbitrary DOM element to a drop zone accepting files.

@example
	<div id="drop_zone">
		Drop files here
	</div>
	<br />
	<div id="filelist"></div>

	<script type="text/javascript">
		let fileDrop = new moxie.file.FileDrop('drop_zone'), fileList = moxie.utils.Dom.get('filelist');

		fileDrop.ondrop = function () {
			moxie.utils.Basic.each(this.files, function (file) {
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
*/
const dispatches = [
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

export default class FileDrop extends EventTarget {
	/**
	Unique id of the component

	@property uid
	@protected
	@readOnly
	@type {String}
	@default UID
	*/
	uid: string;

	/**
	Unique id of the runtime container. Useful to get hold of it for various manipulations.

	@property shimid
	@protected
	@type {String}
	*/
	shimid: string;

	/**
	Array of selected File objects

	@property files
	@type {Array}
	@default null
	*/
	files: FileRef[] = [];

	private _disabled: boolean = true;
	private _options;

	private _containerPosition;

	constructor(options) {
		super();

		let self = this;
		let _uid = Basic.guid('mxi_');
		let _options;

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

		self._options = _options;
		self.uid = _uid;
		self.shimid = _uid + '_container';
	}

	/**
	Initializes the component and dispatches event ready when done.

	@method init
	*/
	init() {
		let self = this;
		let _options = self._options;
		let _uid = self.uid;

		let dropZone = Dom.get(_options.drop_zone) || document.body;

		if (dropZone.id) {
			self.shimid = dropZone.id;
		} else {
			dropZone.id = self.shimid;
		}

		// make container relative, if it is not
		self._containerPosition = Dom.getStyle(dropZone, 'position');
		if (self._containerPosition === 'static') {
			_options.drop_zone.style.position = 'relative';
		}

		Events.addEvent(dropZone, 'dragover', function (e) {
			if (!self._hasFiles(e)) {
				return;
			}
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
		}, _uid);

		Events.addEvent(dropZone, 'drop', function (e) {
			e.preventDefault();

			if (!self._hasFiles(e) || self._disabled) {
				return;
			}

			self.files.length = 0;

			// Chrome 21+ accepts folders via Drag'n'Drop
			if (e.dataTransfer.items && e.dataTransfer.items[0].webkitGetAsEntry) {
				self._readItems(e.dataTransfer.items, function () {
					self.trigger("drop");
				});
			} else {
				Basic.each(e.dataTransfer.files, function (file) {
					self._addFile(file);
				});
				self.trigger("drop", self.files);
			}
		}, _uid);

		Events.addEvent(dropZone, 'dragenter', function (e) {
			self.trigger("dragenter");
		}, _uid);

		Events.addEvent(dropZone, 'dragleave', function (e) {
			self.trigger("dragleave");
		}, _uid);


		self.handleEventProps(dispatches);

		self.disable(false);

		// ready event is perfectly asynchronous
		self.trigger({ type: 'ready', async: true });
	}

	/**
	Returns container for the runtime as DOM element

	@method getShimContainer
	@return {DOMElement}
	*/
	getShimContainer() {
		return Dom.get(this.shimid);
	}

	/**
	 * Get current option value by its name
	 *
	 * @method getOption
	 * @param name
	 * @return {Mixed}
	 */
	getOption(name) {
		return this._options[name];
	}


	/**
	 * Sets a new value for the option specified by name
	 *
	 * @method setOption
	 * @param name
	 * @param value
	 */
	setOption(name, value) {
		let _options = this._options;
		if (!_options.hasOwnProperty(name)) {
			return;
		}

		let oldValue = _options[name];
		_options[name] = value;

		this.trigger('OptionChanged', name, value, oldValue);
	}

	/**
	Disables component, so that it doesn't accept files.

	@method disable
	@param {Boolean} [state=true] Disable component if - true, enable if - false
	*/
	disable(state) {
		this._disabled = (state === undefined ? true : state);
	}

	/**
	Destroy component.

	@method destroy
	*/
	destroy() {
		let self = this;
		let _fileRefs = self.files;
		let _uid = self.uid;
		let _options = self._options;
		let dropZone = Dom.get(_options.drop_zone) || document.body;

		Events.removeAllEvents(dropZone, _uid);
		dropZone.style.position = self._containerPosition;

		if (Basic.typeOf(_fileRefs) === 'array') {
			// no sense in leaving associated files behind
			Basic.each(_fileRefs, function (file) {
				file.destroy();
			});
		}

		_options = null;
		_fileRefs.length = 0;

		self.trigger('Destroy');
		self.unbindAll();
	}


	private _hasFiles(e) {
		if (!e.dataTransfer || !e.dataTransfer.types) { // e.dataTransfer.files is not available in Gecko during dragover
			return false;
		}

		let types = Basic.toArray(e.dataTransfer.types || []);

		return Basic.inArray("Files", types) !== -1 ||
			Basic.inArray("public.file-url", types) !== -1 || // Safari < 5
			Basic.inArray("application/x-moz-file", types) !== -1 // Gecko < 1.9.2 (< Firefox 3.6)
			;
	}

	private _addFile(file, relativePath = '') {
		let self = this;
		if (self._isAcceptable(file)) {
			let fileObj = new FileRef(null, file);
			fileObj.relativePath = relativePath; // (!) currently this is the only reason to have a FileRef wrapper around native File
			self.files.push(fileObj);
		}
	}

	private _extractExts(accept) {
		let exts = [];
		for (let i = 0; i < accept.length; i++) {
			[].push.apply(exts, accept[i].extensions.split(/\s*,\s*/));
		}
		return Basic.inArray('*', exts) === -1 ? exts : [];
	}

	private _isAcceptable(file) {
		let self = this;
		let allowedExts = self._extractExts(self._options.accept);

		if (!allowedExts.length) {
			return true;
		}
		let ext = Mime.getFileExtension(file.name);
		return !ext || Basic.inArray(ext, allowedExts) !== -1;
	}

	private _readItems(items, cb) {
		let self = this;
		let entries = [];
		Basic.each(items, function (item) {
			let entry = item.webkitGetAsEntry();
			// Address #998 (https://code.google.com/p/chromium/issues/detail?id=332579)
			if (entry) {
				// file() fails on OSX when the filename contains a special character (e.g. umlaut): see #61
				if (entry.isFile) {
					self._addFile(item.getAsFile(), entry.fullPath);
				} else {
					entries.push(entry);
				}
			}
		});

		if (entries.length) {
			self._readEntries(entries, cb);
		} else {
			cb();
		}
	}

	private _readEntries(entries, cb) {
		let self = this;
		let queue = [];
		Basic.each(entries, function (entry) {
			queue.push(function (cbcb) {
				self._readEntry(entry, cbcb);
			});
		});
		Basic.inSeries(queue, function () {
			cb();
		});
	}

	private _readEntry(entry, cb) {
		let self = this;
		if (entry.isFile) {
			entry.file(function (file) {
				self._addFile(file, entry.fullPath);
				cb();
			}, function () {
				// fire an error event maybe
				cb();
			});
		} else if (entry.isDirectory) {
			self._readDirEntry(entry, cb);
		} else {
			cb(); // not file, not directory? what then?..
		}
	}

	private _readDirEntry(dirEntry, cb) {
		let self = this;
		let entries = [], dirReader = dirEntry.createReader();

		// keep quering recursively till no more entries
		function getEntries(cbcb) {
			dirReader.readEntries(function (moreEntries) {
				if (moreEntries.length) {
					[].push.apply(entries, moreEntries);
					getEntries(cbcb);
				} else {
					cbcb();
				}
			}, cbcb);
		}

		// ...and you thought FileReader was crazy...
		getEntries(function () {
			self._readEntries(entries, cb);
		});
	}
}
