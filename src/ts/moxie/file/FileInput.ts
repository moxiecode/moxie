/**
 * FileInput.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

import { Basic, Mime, Env, Dom, Events, I18n } from 'utils';
import EventTarget from 'EventTarget';
import FileRef from 'file/FileRef'

/**
Provides a convenient way to turn any DOM element into a file-picker.

@class moxie/file/FileInput
@constructor
@extends EventTarget
@uses RuntimeClient
@param {Object|String|DOMElement} options If options is string or node, argument is considered as _browse\_button_.
	@param {String|DOMElement} options.browse_button DOM Element to turn into file picker.
	@param {Array} [options.accept] Array of mime types to accept. By default accepts all.
	@param {Boolean} [options.multiple=false] Enable selection of multiple files.
	@param {Boolean} [options.directory=false] Turn file input into the folder input (cannot be both at the same time).
	@param {String|DOMElement} [options.container] DOM Element to use as a container for file-picker. Defaults to parentNode
	for _browse\_button_.

@example
	<div id="container">
		<a id="file-picker" href="javascript:;">Browse...</a>
	</div>

	<script>
		let fileInput = new moxie.file.FileInput({
			browse_button: 'file-picker', // or document.getElementById('file-picker')
			container: 'container',
			accept: [
				{title: "Image files", extensions: "jpg,gif,png"} // accept only images
			],
			multiple: true // allow multiple file selection
		});

		fileInput.onchange = function (e) {
			// do something to files array
			console.info(e.target.files); // or this.files or fileInput.files
		};

		fileInput.init(); // initialize
	</script>
*/
const dispatches = [
	/**
	Dispatched when runtime is connected and file-picker is ready to be used.

	@event ready
	@param {Object} event
	*/
	'ready',

	/**
	Dispatched right after [ready](#event_ready) event, and whenever [refresh()](#method_refresh) is invoked.
	Check [corresponding documentation entry](#method_refresh) for more info.

	@event refresh
	@param {Object} event
	*/
	'refresh',

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
	Dispatched when selection of files in the dialog is complete.

	@event change
	@param {Object} event
	@param {Array} fileRefs Array of selected file references
	*/
	'change',

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
	'mouseup',

	/**
	Dispatched when component is destroyed (just before all events are unbined).

	@event destroy
	@param {Object} event
	*/
	'destroy'
];

export default class FileInput extends EventTarget {
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
	private _browseButtonPosition;
	private _browseButtonZindex;


	constructor(options) {
		super();

		let self = this;
		let _uid = Basic.guid('mxi_');
		let _options;

		// if flat argument passed it should be browse_button id
		if (Basic.inArray(Basic.typeOf(options), ['string', 'node']) !== -1) {
			_options = { browse_button : options };
		}

		if (!Dom.get(options.browse_button)) {
			// browse button is required
			throw new Error("browse_button must be present in the DOM, prior to FileInput instantiation.");
		}

		_options = Basic.extend({
			accept: [{
				title: I18n.translate('All Files'),
				extensions: '*'
			}],
			multiple: false
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
		let _uid = self.uid;
		let _options = self._options;
		let container = Dom.get(_options.container) || document.body;
		let browseButton = Dom.get(_options.browse_button);
		let shimContainer = self.createShimContainer();
		let input = self.createInput();
		let top;

		// we will be altering some initial styles, so lets save them to restore later
		self._containerPosition = Dom.getStyle(container, 'position');
		self._browseButtonPosition = Dom.getStyle(browseButton, 'position');
		self._browseButtonZindex = Dom.getStyle(browseButton, 'z-index') || 'auto';

		// it shouldn't be possible to tab into the hidden element
		(Env.can('summon_file_dialog') ? input : browseButton).setAttribute('tabindex', -1);

		/* Since we have to place input[type=file] on top of the browse_button for some browsers,
		browse_button loses interactivity, so we restore it here */
		top = Env.can('summon_file_dialog') ? browseButton : shimContainer;

		Events.addEvent(top, 'mouseover', function () {
			self.trigger('mouseenter');
		}, _uid);

		Events.addEvent(top, 'mouseout', function () {
			self.trigger('mouseleave');
		}, _uid);

		Events.addEvent(top, 'mousedown', function () {
			self.trigger('mousedown');
		}, _uid);

		Events.addEvent(container, 'mouseup', function () {
			self.trigger('mouseup');
		}, _uid);

		// Route click event to the input[type=file] element for browsers that support such behavior
		if (Env.can('summon_file_dialog')) {
			if (self._browseButtonPosition === 'static') {
				browseButton.style.position = 'relative';
			}

			Events.addEvent(browseButton, 'click', function (e) {
				if (!self._disabled) {
					input.click();
				}
				e.preventDefault();
			}, _uid);
		}

		// make container relative, if it's not (TODO: maybe save initial state to restore it later)
		if (self._containerPosition === 'static') {
			container.style.position = 'relative';
		}

		shimContainer.appendChild(input);
		container.appendChild(shimContainer);

		self.handleEventProps(dispatches);

		self.disable(false);
		self.refresh();

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
		let _uid = this.uid;

		if (!_options.hasOwnProperty(name)) {
			return;
		}

		let oldValue = _options[name];
		let input = Dom.get(_uid);

		switch (name) {
			case 'accept':
				if (value) {
					let mimes = Mime.extList2mimes(value, Env.can('filter_by_extension'));
					input.setAttribute('accept', mimes.join(','));
				} else {
					input.removeAttribute('accept');
				}
				break;

			case 'directory':
				if (value && Env.can('select_folder')) {
					input.setAttribute('directory', '');
					input.setAttribute('webkitdirectory', '');
				} else {
					input.removeAttribute('directory');
					input.removeAttribute('webkitdirectory');
				}
				break;

			case 'multiple':
				if (value && Env.can('select_multiple')) {
					input.setAttribute('multiple', '');
				} else {
					input.removeAttribute('multiple');
				}
				break;

			case 'container':
				throw new Error("container option cannot be altered.");
		}

		_options[name] = value;

		this.trigger('OptionChanged', name, value, oldValue);
	}

	/**
	Disables file-picker element, so that it doesn't react to mouse clicks.

	@method disable
	@param {Boolean} [state=true] Disable component if - true, enable if - false
	*/
	disable(state) {
		let input = Dom.get(this.uid);
		if (input) {
			input.disabled = (this._disabled = state === undefined ? true : state);
		}
	}

	/**
	Reposition and resize dialog trigger to match the position and size of browse_button element.

	@method refresh
	*/
	refresh() {
		let self = this;
		let container = Dom.get(this._options.container) || document.body;
		let browseButton = Dom.get(this._options.browse_button);
		let shimContainer = self.getShimContainer();
		let zIndex = parseInt(Dom.getStyle(browseButton, 'z-index'), 10) || 0;

		if (browseButton) {
			let pos = Dom.getPos(browseButton, container);
			let size = Dom.getSize(browseButton);

			if (Env.can('summon_file_dialog')) {
				browseButton.style.zIndex = zIndex + 1;
			}

			if (shimContainer) {
				Basic.extend(shimContainer.style, {
					top: pos.y + 'px',
					left: pos.x + 'px',
					width: size.w + 'px',
					height: size.h + 'px',
					zIndex
				});
			}
		}

		self.trigger("Refresh");
	}

	/**
	Destroy component.

	@method destroy
	*/
	destroy() {
		let self = this;
		let shimContainer = self.getShimContainer();
		let container = Dom.get(self._options.container);
		let browseButton = Dom.get(self._options.browse_button);

		if (container) {
			Events.removeAllEvents(container, self.uid);
			container.style.position = self._containerPosition;
		}

		if (browseButton) {
			Events.removeAllEvents(browseButton, self.uid);
			Basic.extend(browseButton.style, {
				position: self._browseButtonPosition,
				zIndex: self._browseButtonZindex
			});
		}

		if (shimContainer) {
			Events.removeAllEvents(shimContainer, self.uid);
		}

		if (Basic.typeOf(self.files) === 'array') {
			// no sense in leaving associated files behind
			Basic.each(self.files, function (file) {
				file.destroy();
			});
		}

		self._options = null;
		self.files.length = 0;

		self.trigger('Destroy');
		self.unbindAll();
	}


	private createInput() {
		let self = this;
		let _options = self._options;
		let _uid = self.uid;

		// figure out accept string
		let mimes = Mime.extList2mimes(_options.accept, Env.can('filter_by_extension'));
		let input = <HTMLInputElement> document.createElement('input');

		input.id = _uid;
		input.setAttribute('type', 'file');
		input.disabled = true;

		if (_options.multiple && Env.can('select_multiple')) {
			input.multiple = true;
		}

		if (_options.directory && Env.can('select_folder')) {
			input.setAttribute('directory', 'directory');
			input.setAttribute('webkitdirectory', 'webkitdirectory');
		}

		if (mimes) {
			input.setAttribute('accept', mimes.join(','));
		}

		// prepare file input to be placed underneath the browse_button element
		Basic.extend(input.style, {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			fontSize: '999px',
			opacity: 0,
			cursor: 'pointer'
		});

		input.onchange = function onChange() { // there should be only one handler for this
			self.files.length = 0;

			Basic.each(input.files, function (file) {
				if (_options.directory) {
					// folders are represented by dots, filter them out (Chrome 11+)
					if (file.name === ".") {
						// if it looks like a folder...
						return true;
					}
				}

				let fileRef = new FileRef(null, file);
				fileRef.relativePath = file.webkitRelativePath ? '/' + file.webkitRelativePath.replace(/^\//, '') : '';

				self.files.push(fileRef);
			});

			// clearing the value enables the user to select the same file again if they want to
			if (Env.browser !== 'IE' && Env.browser !== 'IEMobile') {
				input.value = '';
			} else {
				// in IE input[type="file"] is read-only so the only way to reset it is to re-insert it
				let clone = <HTMLInputElement> input.cloneNode(true);
				this.parentNode.replaceChild(clone, this);
				clone.onchange = onChange;
			}

			if (self.files.length) {
				self.trigger('change', self.files);
			}
		};

		return input;
	}

	private createShimContainer() {
		let shimContainer;

		// create shim container and insert it at an absolute position into the outer container
		shimContainer = document.createElement('div');
		shimContainer.id = this.shimid;
		shimContainer.className = 'mxi-shim';

		Basic.extend(shimContainer.style, {
			position: 'absolute',
			top: '0px',
			left: '0px',
			width: '1px',
			height: '1px',
			overflow: 'hidden'
		});

		return shimContainer;
	}
}
