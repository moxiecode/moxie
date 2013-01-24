/**
 * FileDrop.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

/**
@class moxie/runtime/html5/file/FileInput
@private
*/
define("moxie/runtime/html5/file/FileInput", [
	"moxie/core/utils/Basic",
	"moxie/core/utils/Dom",
	"moxie/core/utils/Events",
	"moxie/core/utils/Env"
], function(Basic, Dom, Events, Env) {
	
	return function() {
		var _files = [];

		Basic.extend(this, {
			init: function(options) {
				var comp = this, I = this.getRuntime(), dropZone = options.container;

				// Safari on Windows has drag/drop problems, so we fake it by moving a input type file
				// in front of the mouse pointer when we drag into the drop zone
				// TODO: Remove this logic once Safari has proper drag/drop support
				if (Env.browser === "Safari" && Env.OS === "Windows" && Env.version < 5.2) {
					if (Dom.getStyle(dropZone, 'position') === 'static') {
						Basic.extend(dropZone.style, {
							position : 'relative'
						});
					}

					Events.addEvent(dropZone, 'dragenter', function(e) {
						var dropInput = Dom.get(I.uid + "_drop");

						e.preventDefault();
						e.stopPropagation();

						if (!dropInput) {
							dropInput = document.createElement("input");
							dropInput.setAttribute('type', "file");
							dropInput.setAttribute('id', I.uid + "_drop");
							dropInput.setAttribute('multiple', 'multiple');
							dropZone.appendChild(dropInput);
						}

						// add the selected files from file input
						dropInput.onchange = function() {
							var fileNames = {};

							_files = [];
							// there used to be a strange bug in Safari for Windows, when multiple files were dropped
							// onto input[type=file] and they all basically resulted into the same file
							Basic.each(this.files, function(file) {
								if (!fileNames[file.name]) {
									_files.push(file);
									fileNames[file.name] = true; // remember file name
								}
							});

							// remove input element
							dropInput.parentNode.removeChild(dropInput);

							comp.trigger("drop");
						};

						Basic.extend(dropInput.style, {
							position : 'absolute',
							display : 'block',
							top : 0,
							left : 0,
							right: 0,
							bottom: 0,
							opacity : 0
						});

						comp.trigger("dragenter");
					}, comp.uid);


					Events.addEvent(dropZone, 'dragleave', function(e) {
						var dropInput = Dom.get(I.uid + "_drop");
						if (!dropInput) {
							dropInput.parentNode.removeChild(dropInput);
						}

						e.preventDefault();
						e.stopPropagation();

						comp.trigger("dragleave");
					}, comp.uid);

					return; // do not proceed farther
				}

				Events.addEvent(dropZone, 'dragover', function(e) {
					e.preventDefault();
					e.stopPropagation();
					e.dataTransfer.dropEffect = 'copy';
				}, comp.uid);

				Events.addEvent(dropZone, 'drop', function(e) {
					e.preventDefault();
					e.stopPropagation();
					_files = e.dataTransfer.files;
					comp.trigger("drop");
				}, comp.uid);

				Events.addEvent(dropZone, 'dragenter', function(e) {
					e.preventDefault();
					e.stopPropagation();
					comp.trigger("dragenter");
				}, comp.uid);

				Events.addEvent(dropZone, 'dragleave', function(e) {
					e.preventDefault();
					e.stopPropagation();
					comp.trigger("dragleave");
				}, comp.uid);
			},

			getFiles: function() {
				return _files;
			}
		});
	};
});