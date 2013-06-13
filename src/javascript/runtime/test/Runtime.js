/**
 * Runtime.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
Defines constructor for the fake runtime that we use in testing.

@class moxie/runtime/test/Runtime
@private
*/
define("moxie/runtime/test/Runtime", [
	"moxie/core/utils/Basic",
	"moxie/core/Exceptions",
	"moxie/runtime/Runtime"
], function(Basic, x, Runtime) {
	
	var type = "test", extensions = {};
	
	function TestRuntime(options) {
		var I = this
		, True = Runtime.capTrue
		, False = Runtime.capFalse
		;

		Runtime.call(this, options, type, {
			access_binary: False,
			access_image_binary: False,
			display_media: False,
			do_cors: True,
			drag_and_drop: False,
			return_response_headers: True,
			return_response_type: True,
			report_upload_progress: True,
			resize_image: False,
			select_folder: False,
			select_multiple: True,
			send_binary_string: True,
			send_custom_headers: True,
			send_multipart: True,
			slice_blob: True,
			stream_upload: True,
			summon_file_dialog: False,
			upload_filesize: True
		});

		Basic.extend(this, {

			init : function() {
				this.trigger("Init");
			},

			destroy: (function(destroy) { // extend default destroy method
				return function() {
					destroy.call(I);
					destroy = I = null;
				};
			}(this.destroy))
		});

		Basic.extend(this.getShim(), extensions);
	}

	Runtime.addConstructor(type, TestRuntime);

	return extensions;
});
