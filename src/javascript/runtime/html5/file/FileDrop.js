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
@class moxie/runtime/html5/file/FileDrop
@private
*/
define("moxie/runtime/html5/file/FileDrop", [
	"moxie/core/utils/Basic",
	"moxie/core/utils/Dom",
	"moxie/core/utils/Events"
], function(Basic, Dom, Events) {
	
	return function() {
		var _files = [];

		Basic.extend(this, {
			init: function(options) {
				var comp = this, dropZone = options.container;

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