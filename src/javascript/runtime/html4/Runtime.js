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

	function Html4Runtime(options) {
		var I = this, shim;

		Runtime.call(this, type, options, {
			access_binary: !!(window.FileReader || window.File && File.getAsDataURL),
			access_image_binary: false,
			display_media: extensions.Image && (Env.can('create_canvas') || Env.can('use_data_uri_over32kb')),
			drag_and_drop: false,
			resize_image: function() {
				return extensions.Image && can('access_binary') && Env.can('create_canvas');
			},
			report_upload_progress: false,
			return_response_headers: false,
			return_response_type: function(responseType) {
				return !!~Basic.inArray(responseType, ['json', 'text', 'document', '']);
			},
			return_status_code: function(code) {
				return !Basic.arrayDiff(code, [200, 404]);
			},
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
			upload_filesize: true,
			use_http_method: function(methods) {
				return !Basic.arrayDiff(methods, ['GET', 'POST']);
			}
		});

		Basic.extend(this, {

			init : function() {
				if (!Env.can('use_fileinput')) { // minimal requirement
					this.trigger("Error", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
					return;
				}
				this.trigger("Init");
			},

			getShim: function() {
				return shim;
			},

			shimExec: function(component, action) {
				var args = [].slice.call(arguments, 2);
				return I.getShim().exec.call(this, this.uid, component, action, args);
			},

			destroy: (function(destroy) { // extend default destroy method
				return function() {
					if (shim) {
						shim.removeAllInstances(I);
					}
					destroy.call(I);
					destroy = shim = I = null;
				};
			}(this.destroy))
		});

		shim = Basic.extend((function() {
			var objpool = {};

			return {
				exec: function(uid, comp, fn, args) {
					if (shim[comp]) {
						if (!objpool[uid]) {
							objpool[uid] = {
								context: this,
								instance: new shim[comp]()
							}
						}

						if (objpool[uid].instance[fn]) {
							return objpool[uid].instance[fn].apply(this, args);
						}
					}
				},

				removeInstance: function(uid) {
					delete objpool[uid];
				},

				removeAllInstances: function() {
					var self = this;
					
					Basic.each(objpool, function(obj, uid) {
						if (Basic.typeOf(obj.instance.destroy) === 'function') {
							obj.instance.destroy.call(obj.context);
						}
						self.removeInstance(uid);
					});
				}
			};
		}()), extensions);
	}

	Runtime.addConstructor(type, Html4Runtime);

	return extensions;
});
