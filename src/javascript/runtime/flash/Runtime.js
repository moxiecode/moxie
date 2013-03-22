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
/*global define:true, escape:true, ActiveXObject:true */

/**
Defines constructor for Flash runtime.

@class moxie/runtime/flash/Runtime
@private
*/
define("moxie/runtime/flash/Runtime", [
	"moxie/core/utils/Basic",
	"moxie/core/utils/Env",
	"moxie/core/Exceptions",
	"moxie/runtime/Runtime"
], function(Basic, Env, x, Runtime) {
	
	var type = 'flash', extensions = {};

	/**
	Constructor for the Flash Runtime

	@class FlashRuntime
	@extends Runtime
	*/
	Runtime.addConstructor(type, (function() {
		
		function FlashRuntime(options) {
			var I = this;

			/**
			Get the version of the Flash Player

			@method getShimVersion
			@private
			@return {Number} Flash Player version
			*/
			function getShimVersion() {
				var version;

				try {
					version = navigator.plugins['Shockwave Flash'];
					version = version.description;
				} catch (e1) {
					try {
						version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
					} catch (e2) {
						version = '0.0';
					}
				}
				version = version.match(/\d+/g);
				return parseFloat(version[0] + '.' + version[1]);
			}

			Runtime.call(this, type, Basic.extend({ swf_url: Env.swf_url }, options));

			Basic.extend(this, {

				init: function() {
					var html, el, container;

					// minimal requirement Flash Player 10
					if (getShimVersion() < 10) {
						this.trigger("Error", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
						return;
					}

					container = this.getShimContainer();

					// if not the minimal height, shims are not initialized in older browsers (e.g FF3.6, IE6,7,8, Safari 4.0,5.0, etc)
					Basic.extend(container.style, {
						position: 'absolute',
						top: '-8px',
						left: '-8px',
						width: '9px',
						height: '9px',
						overflow: 'hidden'
					});

					// insert flash object
					html = '<object id="' + this.uid + '" type="application/x-shockwave-flash" data="' +  options.swf_url + '" ';

					if (Env.browser === 'IE') {
						html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
					}

					html += 'width="100%" height="100%" style="outline:0">'  +
						'<param name="movie" value="' + options.swf_url + '" />' +
						'<param name="flashvars" value="uid=' + escape(this.uid) + '&target=' + Env.global_event_dispatcher + '" />' +
						'<param name="wmode" value="transparent" />' +
						'<param name="allowscriptaccess" value="always" />' +
					'</object>';

					if (Env.browser === 'IE') {
						el = document.createElement('div');
						container.appendChild(el);
						el.outerHTML = html;
						el = container = null; // just in case
					} else {
						container.innerHTML = html;
					}

					// Init is dispatched by the shim
					setTimeout(function() {
						var self = I; // keep the reference, since I won't be available after destroy
						if (!self.initialized) {
							self.trigger("Error", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
						}
					}, 5000);
				},

				destroy: (function(destroy) { // extend default destroy method
					return function() {
						destroy.call(I);
						destroy = I = null;
					};
				}(this.destroy))

			}, extensions);
		}

		FlashRuntime.can = (function() {
			var use_urlstream = function() {
					var rc = this.options.required_features || {};
					return rc.access_binary || rc.send_custom_headers || rc.send_browser_cookies;
				},

				caps = Basic.extend({}, Runtime.caps, {
					access_binary: true,
					access_image_binary: true,
					display_media: true,
					drag_and_drop: false,
					report_upload_progress: true,
					resize_image: true,
					return_response_headers: false,
					return_response_type: true,
					return_status_code: true,
					select_multiple: true,
					send_binary_string: true,
					send_browser_cookies: function() {
						return use_urlstream.call(this);
					},
					send_custom_headers: function() {
						return use_urlstream.call(this);
					},
					send_multipart: true,
					slice_blob: true,
					stream_upload: function(value) {
						return !!value && !use_urlstream.call(this);
					},
					summon_file_dialog: false,
					upload_filesize: function(size) {
						var maxSize = use_urlstream.call(this) ? 2097152 : -1; // 200mb || unlimited
						if (!~maxSize || Basic.parseSizeStr(size) <= maxSize) {
							return true;
						}
						return false;
					},
					use_http_method: function(methods) {
						return !Basic.arrayDiff(methods, ['GET', 'POST']);
					}
				});

			function can() {
				var args = [].slice.call(arguments);
				args.unshift(caps);
				return Runtime.can.apply(this, args);
			}

			return can;
		}());

		return FlashRuntime;
	}()));

	return extensions;
});
