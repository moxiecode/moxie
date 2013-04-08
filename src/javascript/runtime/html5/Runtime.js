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
	
	function Html5Runtime(options) {
		var I = this, shim;

		Runtime.call(this, type, options, {
			access_binary: !!(window.FileReader || window.File && window.File.getAsDataURL),
			access_image_binary: function() {
				return I.can('access_binary') && !!extensions.Image;
			},
			display_media: Env.can('create_canvas') || Env.can('use_data_uri_over32kb'),
			drag_and_drop: (function() {
				// this comes directly from Modernizr: http://www.modernizr.com/
				var div = document.createElement('div');
				// IE has support for drag and drop since version 5, but doesn't support dropping files from desktop
				return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && (Env.browser !== 'IE' || Env.version > 9);
			}()),
			return_response_type: function(responseType) {
				if (responseType === 'json') {
					return true; // we can fake this one even if it's not supported
				} else {
					return Env.can('return_response_type', responseType);
				}
			},
			report_upload_progress: function() {
				return !!(window.XMLHttpRequest && new XMLHttpRequest().upload);
			},
			resize_image: function() {
				return I.can('access_binary') && Env.can('create_canvas');
			},
			select_folder: Env.browser === 'Chrome' && Env.version >= 21,
			select_multiple: !(Env.browser === 'Safari' && Env.OS === 'Windows'),
			send_binary_string:
				!!(window.XMLHttpRequest && (new XMLHttpRequest().sendAsBinary || (window.Uint8Array && window.ArrayBuffer))),
			send_custom_headers: !!window.XMLHttpRequest,
			send_multipart: function() {
				return !!(window.XMLHttpRequest && new XMLHttpRequest().upload && window.FormData) || can('send_binary_string');
			},
			slice_blob: !!(window.File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)),
			stream_upload: function() {
				return I.can('slice_blob') && I.can('send_multipart');
			},
			summon_file_dialog: (function() { // yeah... some dirty sniffing here...
				return  (Env.browser === 'Firefox' && Env.version >= 4)	||
						(Env.browser === 'Opera' && Env.version >= 12)	||
						!!~Basic.inArray(Env.browser, ['Chrome', 'Safari']);
			}()),
			upload_filesize: true
		});


		Basic.extend(this, {

			init : function() {
				if (!window.File || !Env.can('use_fileinput')) { // minimal requirement
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

	Runtime.addConstructor(type, Html5Runtime);

	return extensions;
});
