/**
 * Runtime.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */
/*global define:true, File:true */

/**
Defines constructor for HTML4 runtime.

@class moxie/runtime/html4/Runtime
@private
*/
define("moxie/runtime/html4/Runtime", [
	"moxie/core/utils/Basic",
	"moxie/core/Exceptions",
	"moxie/runtime/Runtime",
	"moxie/core/utils/Env"
], function(Basic, x, Runtime, Env) {
	var type = 'html4', extensions = {};

	Runtime.addConstructor(type, (function() {
		
		function Html4Runtime(options) {
			var I = this, shim, defaults = {};

			options = typeof(options) === 'object' ? Basic.extend(defaults, options) : defaults;

			Runtime.apply(this, [options, arguments[1] || type]);

			Basic.extend(this, {
				init : function() {
					I.trigger("Init");
				},

				getShim: function() {
					return shim;
				},

				shimExec: function(component, action) {
					var args = [].slice.call(arguments, 2);
					return I.getShim().exec.call(this, this.uid, component, action, args);
				}
			});

			shim = Basic.extend((function() {
				var objpool = {};

				return {
					exec: function(uid, comp, fn, args) {
						var obj;

						if (!shim[comp]) {
							throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
						}

						obj = objpool[uid];
						if (!obj) {
							obj = objpool[uid] = new shim[comp]();
						}

						if (!obj[fn]) {
							throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
						}

						return obj[fn].apply(this, args);
					}
				};
			}()), extensions);
		}

		Html4Runtime.can = (function() {
			var caps = Basic.extend({}, Runtime.caps, {
					access_binary: !!(window.FileReader || window.File && File.getAsDataURL),
					access_image_binary: false,
					display_media: extensions.Image && (Env.can('create_canvas') || Env.can('use_data_uri_over32kb')),
					drag_and_drop: false,
					receive_response_type: function(responseType) {
						return !!~Basic.inArray(responseType, ['json', 'text', 'document', '']);
					},
					resize_image: function() {
						return extensions.Image && can('access_binary') && Env.can('create_canvas');
					},
					report_upload_progress: false,
					return_response_headers: false,
					select_multiple: false,
					send_binary_string: false,
					send_custom_headers: false,
					send_multipart: true,
					slice_blob: false,
					stream_upload: true,
					summon_file_dialog: (function() { // yeah... some dirty sniffing here...
						return  (Env.browser === 'Firefox' && Env.version >= 4)	||
								(Env.browser === 'Opera' && Env.version >= 12)	||
								!!~Basic.inArray(Env.browser, ['Chrome', 'Safari']);
					}()),
					upload_filesize: true
				});

			function can() {
				var args = [].slice.call(arguments);
				args.unshift(caps);
				return Runtime.can.apply(this, args);
			}
			return can;
		}());

		return Html4Runtime;
	}()));

	return extensions;
});
