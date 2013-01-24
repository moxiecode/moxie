/**
 * RunTime.js
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
Defines constructor for Silverlight runtime.

@class moxie/runtime/silverlight/Runtime
@private
*/
define("moxie/runtime/silverlight/Runtime", [
	"moxie/core/utils/Basic", 
	"moxie/core/utils/Env",
	"moxie/core/utils/Dom",
	"moxie/core/Exceptions",
	"moxie/runtime/Runtime", 
	"moxie/runtime/silverlight/extensions"
], function(Basic, Env, Dom, x, Runtime, extensions) {
	
	var type = 'silverlight';

	/**
	Constructor for the Flash Runtime

	@class RuntimeFlash
	@extends Runtime
	*/
	Runtime.addConstructor(type, (function() {

		function SilverlightRuntime(options) {
			var self = this;

			function isInstalled(version) {
				var isVersionSupported = false, control = null, actualVer,
					actualVerArray, reqVerArray, requiredVersionPart, actualVersionPart, index = 0;

				try {
					try {
						control = new ActiveXObject('AgControl.AgControl');

						if (control.IsVersionSupported(version)) {
							isVersionSupported = true;
						}

						control = null;
					} catch (e) {
						var plugin = navigator.plugins["Silverlight Plug-In"];

						if (plugin) {
							actualVer = plugin.description;

							if (actualVer === "1.0.30226.2") {
								actualVer = "2.0.30226.2";
							}

							actualVerArray = actualVer.split(".");

							while (actualVerArray.length > 3) {
								actualVerArray.pop();
							}

							while ( actualVerArray.length < 4) {
								actualVerArray.push(0);
							}

							reqVerArray = version.split(".");

							while (reqVerArray.length > 4) {
								reqVerArray.pop();
							}

							do {
								requiredVersionPart = parseInt(reqVerArray[index], 10);
								actualVersionPart = parseInt(actualVerArray[index], 10);
								index++;
							} while (index < reqVerArray.length && requiredVersionPart === actualVersionPart);

							if (requiredVersionPart <= actualVersionPart && !isNaN(requiredVersionPart)) {
								isVersionSupported = true;
							}
						}
					}
				} catch (e2) {
					isVersionSupported = false;
				}

				return isVersionSupported;
			}

			function wait4shim(ms) {
				if ( wait4shim.counter === undefined ) {
					wait4shim.counter = 0; // initialize static variable
				}

				// wait for ms/1000 sec(s)
				if (wait4shim.counter++ > ms) {
					self.destroy();
					throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);
				}

				// if initialized properly, the shim will trigger Init event on widget itself
				if (!self.initialized) {
					setTimeout(function() { wait4shim.call(self, ms); }, 1);
				}
			}

			// figure out the options
			var defaults = {
				xap_url: 'js/Moxie.xap'
			};
			self.options = options = Basic.extend({}, defaults, options);

			Runtime.apply(this, [options, arguments[1] || type]);

			Basic.extend(this, {

				getShim: function() {
					return Dom.get(this.uid).content.Moxie;
				},

				init : function() {
					var container;

					// minimal requirement Flash Player 10
					if (!isInstalled('2.0.31005.0') || Env.browser === 'Opera') {
						self.destroy();
						throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);
					}

					container = self.getShimContainer();

					container.innerHTML = '<object id="' + self.uid + '" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;">' +
						'<param name="source" value="' + options.xap_url + '"/>' +
						'<param name="background" value="Transparent"/>' +
						'<param name="windowless" value="true"/>' +
						'<param name="enablehtmlaccess" value="true"/>' +
						'<param name="initParams" value="uid=' + self.uid + '"/>' +
					'</object>';

					wait4shim(10000); // Init will be dispatched by the shim
				}
			}, extensions);
		}


		SilverlightRuntime.can = (function() {
			var caps = Basic.extend({}, Runtime.caps, {
					access_binary: true,
					access_image_binary: true,
					display_media: true,
					drag_and_drop: false,
					receive_response_type: function(responseType) {
						return !~Basic.inArray(responseType, ['blob']); // not implemented yet
					},
					report_upload_progress: true,
					resize_image: true,
					return_response_headers: false,
					select_multiple: true,
					send_binary_string: true,
					send_custom_headers: true,
					send_multipart: true,
					slice_blob: true,
					stream_upload: true,
					summon_file_dialog: false,
					upload_filesize: true,
					use_http_method: function(methods) {
						if (Basic.typeOf(methods) !== 'array') {
							methods = [methods];
						}

						for (var i in methods) {
							// flash only supports GET, POST
							if (!~Basic.inArray(methods[i].toUpperCase(), ['GET', 'POST'])) {
								return false;
							}
						}
						return true;
					}
				});

			function can() {
				var args = [].slice.call(arguments);
				args.unshift(caps);
				return Runtime.can.apply(this, args);
			}
			return can;
		}());

		return SilverlightRuntime;
	}()));
});
