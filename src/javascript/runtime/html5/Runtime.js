/**
 * Runtime.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

define("runtime/html5/Runtime", ["o", "runtime/Runtime", "runtime/html5/extensions"], function(o, R, extensions) {
	var x = o.Exceptions;
	var type = 'html5';

	R.addConstructor(type, (function() {

		function Runtime(options) {
			var I = this,
			// allow to extend this runtime

			// figure out the options
			defaults = {

			};
			options = typeof(options) === 'object' ? o.extend(defaults, options) : defaults;

			R.apply(this, [options, arguments[1] || type]);

			o.extend(this, {

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

			shim = o.extend((function() {
				var objpool = {};

				return {
					exec: function(uid, comp, fn, args) {
						var obj;

						if (!shim[comp]) {
							throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
						}

						obj = objpool[uid];
						if (!obj) {
							obj = objpool[uid] = new shim[comp];
						}

						if (!obj[fn]) {
							throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
						}

						return obj[fn].apply(this, args);
					}
				};
			}()), extensions);
		}


		Runtime.can = (function() {
			var caps = o.extend({}, R.caps, {
					access_binary: !!(window.FileReader || window.File && File.getAsDataURL),
					access_image_binary: function() {
						return can('access_binary') && !!o.ImageInfo;
					},
					display_media: o.ua.can('create_canvas') || o.ua.can('use_data_uri_over32kb'),
					drag_and_drop: (function() {
						// this comes directly from Modernizr: http://www.modernizr.com/
						var div = document.createElement('div');
						return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
					}()),
					receive_response_type: function(responseType) {
						if (responseType === 'json') {
							return true; // we can fake this one even if it's not supported
						} else {
							return o.ua.can('receive_response_type', responseType);
						}
					},
					report_upload_progress: function() {
						return !!(window.XMLHttpRequest && (new XMLHttpRequest).upload);
					},
					resize_image: function() {
						return can('access_binary') && o.ua.can('create_canvas');
					},
					select_multiple: !(o.ua.browser === 'Safari' && o.ua.os === 'Windows'),
					send_binary_string:
						!!(window.XMLHttpRequest && ((new XMLHttpRequest).sendAsBinary || (window.Uint8Array && window.ArrayBuffer))),
					send_custom_headers: !!window.XMLHttpRequest,
					send_multipart: function() {
						return !!(window.XMLHttpRequest && (new XMLHttpRequest).upload && window.FormData) || can('send_binary_string');
					},
					slice_blob: !!(window.File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)),
					stream_upload: function() {
						return can('slice_blob') && can('send_multipart');
					},
					summon_file_dialog: (function() { // yeah... some dirty sniffing here...
						return  (o.ua.browser === 'Firefox' && o.ua.version >= 4)	||
								(o.ua.browser === 'Opera' && o.ua.version >= 12)	||
								!!~o.inArray(o.ua.browser, ['Chrome', 'Safari']);
					}()),
					upload_filesize: true
				});

			function can() {
				var args = [].slice.call(arguments);
				args.unshift(caps);
				return R.can.apply(this, args);
			}
			return can;
		}());

		return Runtime;
	}()));

});
