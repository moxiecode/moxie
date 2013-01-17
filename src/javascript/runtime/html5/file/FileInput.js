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

define("runtime/html5/file/FileInput", ["o", "core/utils/dom", "core/utils/events"], function(o, dom, events) {

	return function() {
		var _files = [];

		o.extend(this, {
			init: function(options) {
				var comp = this, I = comp.getRuntime(), input, shimContainer, mimes;

				_files = [];

				// figure out accept string
				mimes = options.accept.mimes || o.extList2mimes(options.accept);

				shimContainer = I.getShimContainer();

				shimContainer.innerHTML = '<input id="' + I.uid +'" type="file" style="font-size:999px;opacity:0;"' +
										(options.multiple ? 'multiple="multiple"' : '') + ' accept="' + mimes.join(',') + '" />';

				input = o(I.uid);

				// prepare file input to be placed underneath the browse_button element
				o.extend(input.style, {
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%'
				});

				(function() {
					var browseButton, zIndex, top;

					browseButton  = o(options.browse_button);

					// Route click event to the input[type=file] element for browsers that support such behavior
					if (I.can('summon_file_dialog')) {

						if (dom.getStyle(browseButton, 'position') === 'static') {
							browseButton.style.position = 'relative';
						}

						zIndex = parseInt(dom.getStyle(browseButton, 'z-index'), 10) || 1;

						browseButton.style.zIndex = zIndex;
						shimContainer.style.zIndex = zIndex - 1;

						events.addEvent(browseButton, 'click', function(e) {
							if (input && !input.disabled) { // for some reason FF (up to 8.0.1 so far) lets to click disabled input[type=file]
								input.click();
							}
							e.preventDefault();
						}, comp.uid);
					}

					/* Since we have to place input[type=file] on top of the browse_button for some browsers,
					browse_button loses interactivity, so we restore it here */
					top = I.can('summon_file_dialog') ? browseButton : shimContainer;

					events.addEvent(top, 'mouseover', function() {
						comp.trigger('mouseenter');
					}, comp.uid);

					events.addEvent(top, 'mouseout', function() {
						comp.trigger('mouseleave');
					}, comp.uid);

					events.addEvent(top, 'mousedown', function() {
						comp.trigger('mousedown');
					}, comp.uid);

					events.addEvent(o(options.container), 'mouseup', function() {
						comp.trigger('mouseup');
					}, comp.uid);

				}());


				input.onchange = function() { // there should be only one handler for this
					_files = [].slice.call(this.files);
					// Clearing the value enables the user to select the same file again if they want to
					this.value = '';
					comp.trigger('change');
				};

			},

			getFiles: function() {
				return _files;
			},

			disable: function(state) {
				var I = this.getRuntime(), input;
				if ((input = o(I.uid))) {
					input.disabled = !!state;
				}
			}
		});
	};
});