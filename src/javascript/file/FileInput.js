/**
 * FileInput.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

define('moxie/file/FileInput', [
	'moxie/core/utils/Basic',
	'moxie/core/utils/Mime',
	'moxie/core/utils/Dom',
	'moxie/core/Exceptions',
	'moxie/core/EventTarget',
	'moxie/core/I18n',
	'moxie/file/File',
	'moxie/runtime/RuntimeClient'
], function(Basic, Mime, Dom, x, EventTarget, I18n, File, RuntimeClient) {
	/**
	Provides a convenient way to create cross-browser file-picker. Generates file selection dialog on click,
	converts selected files to mOxie.File objects, to be used in conjunction with _mOxie.Image_, preloaded in memory
	with _mOxie.FileReader_ or uploaded to a server through _mOxie.XMLHttpRequest_.

	@class FileInput
	@constructor
	@extends EventTarget
	@uses RuntimeClient
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
		var fileInput = new mOxie.FileInput({
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
		browseButton = Dom.get(options.browse_button);
		if (!browseButton) {
			// browse button is required
			throw new x.DOMException(x.DOMException.NOT_FOUND_ERR);
		}

		// figure out the options
		defaults = {
			accept: [{
				title: I18n.translate('All Files'),
				extensions: '*'
			}],
			name: 'file',
			multiple: false,
			required_caps: false,
			container: browseButton.parentNode || document.body
		};
		
		options = typeof(options) === 'object' ? Basic.extend({}, defaults, options) : defaults;
					
		// normalize accept option (could be list of mime types or array of title/extensions pairs)
		if (typeof(options.accept) === 'string') {
			options.accept = Mime.mimes2extList(options.accept);
		}

		container = Dom.get(options.container);
		// make sure we have container
		if (!container) {
			container = document.body;
		}

		// make container relative, if it's not
		if (Dom.getStyle(container, 'position') === 'static') {
			container.style.position = 'relative';
		}

		container = browseButton = null; // IE
						
		RuntimeClient.call(self);
		
		Basic.extend(self, {
			/**
			Unique id of the component

			@property uid
			@protected
			@readOnly
			@type {String}
			@default UID
			*/
			uid: Basic.guid('uid_'),
			
			/**
			Unique id of the connected runtime, if any.

			@property ruid
			@protected
			@type {String}
			*/
			ruid: null,
			
			/**
			Array of selected mOxie.File objects

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

					self.bind("Change", function() {
						var files = runtime.exec.call(self, 'FileInput', 'getFiles');

						self.files = [];

						Basic.each(files, function(file) {
							self.files.push(new File(self.ruid, file));
						});
					}, 999);
					
					runtime.exec.call(self, 'FileInput', 'init', {
						name: options.name,
						accept: options.accept,
						multiple: options.multiple
					});

					// re-position and resize shim container
					self.bind('Refresh', function() {
						var pos, size, browseButton;
						
						browseButton = Dom.get(options.browse_button);

						if (browseButton) {
							pos = Dom.getPos(browseButton, Dom.get(options.container));
							size = Dom.getSize(browseButton);

							Basic.extend(runtime.getShimContainer().style, {
								top     : pos.y + 'px',
								left    : pos.x + 'px',
								width   : size.w + 'px',
								height  : size.h + 'px'
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
			}
		});
	}

	FileInput.prototype = EventTarget.instance;

	return FileInput;
});
