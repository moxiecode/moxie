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
Defines constructor for HTML5 runtime.

@class moxie/runtime/html5/Runtime
@private
*/
define("moxie/runtime/html5/Runtime", [
	"moxie/core/utils/Basic",
	"moxie/core/Exceptions",
	"moxie/runtime/Runtime",
	"moxie/core/utils/Env"
], function(Basic, x, Runtime, Env) {
	var type = "html5", extensions = {};
	
	Runtime.addConstructor(type, (function() {
		
		function Html5Runtime(options) {
			var I = this, shim, defaults = {};

			options = typeof(options) === 'object' ? Basic.extend(defaults, options) : defaults;

			Runtime.apply(this, [options, arguments[1] || type]);

			Basic.extend(this, {

				init : function() {
					if (!window.File) { // minimal requirement
						I.destroy();
						throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);
					}
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
					},

					unregisterInstance: function(uid) {
						delete objpool[uid];
					}
				};
			}()), extensions);
		}

		Html5Runtime.can = (function() {
			var caps = Basic.extend({}, Runtime.caps, {
					access_binary: !!(window.FileReader || window.File && window.File.getAsDataURL),
					access_image_binary: function() {
						return can('access_binary') && !!extensions.Image;
					},
					display_media: Env.can('create_canvas') || Env.can('use_data_uri_over32kb'),
					drag_and_drop: (function() {
						// this comes directly from Modernizr: http://www.modernizr.com/
						var div = document.createElement('div');
						return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
					}()),
					receive_response_type: function(responseType) {
						if (responseType === 'json') {
							return true; // we can fake this one even if it's not supported
						} else {
							return Env.can('receive_response_type', responseType);
						}
					},
					report_upload_progress: function() {
						return !!(window.XMLHttpRequest && new XMLHttpRequest().upload);
					},
					resize_image: function() {
						return can('access_binary') && Env.can('create_canvas');
					},
					select_multiple: !(Env.browser === 'Safari' && Env.OS === 'Windows'),
					send_binary_string:
						!!(window.XMLHttpRequest && (new XMLHttpRequest().sendAsBinary || (window.Uint8Array && window.ArrayBuffer))),
					send_custom_headers: !!window.XMLHttpRequest,
					send_multipart: function() {
						return !!(window.XMLHttpRequest && new XMLHttpRequest().upload && window.FormData) || can('send_binary_string');
					},
					slice_blob: !!(window.File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)),
					stream_upload: function() {
						return can('slice_blob') && can('send_multipart');
					},
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

		return Html5Runtime;
	}()));

	return extensions;
});
