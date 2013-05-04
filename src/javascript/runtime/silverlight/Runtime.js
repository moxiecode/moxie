/**
 * RunTime.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*global ActiveXObject:true */

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
	"moxie/runtime/Runtime"
], function(Basic, Env, Dom, x, Runtime) {
	
	var type = "silverlight", extensions = {};

	/**
	Constructor for the Silverlight Runtime

	@class SilverlightRuntime
	@extends Runtime
	*/
	function SilverlightRuntime(options) {
		var I = this, initTimer;

		options = Basic.extend({ xap_url: Env.xap_url }, options);

		Runtime.call(this, options, type, {
			access_binary: true,
			access_image_binary: true,
			display_media: true,
			do_cors: true,
			drag_and_drop: false,
			report_upload_progress: true,
			resize_image: true,
			return_response_headers: function() {
				return this.getMode() === 'client';
			},
			return_response_type: true,
			return_status_code: function(code) {
				return this.getMode() === 'client' || !Basic.arrayDiff(code, [200, 404]);
			},
			select_multiple: true,
			send_binary_string: true,
			send_browser_cookies: function() {
				return this.getMode() === 'browser';
			},
			send_custom_headers: function() {
				return this.getMode() === 'client';
			},
			send_multipart: true,
			slice_blob: true,
			stream_upload: true,
			summon_file_dialog: false,
			upload_filesize: true,
			use_http_method: function(methods) {
				return this.getMode() === 'client' || !Basic.arrayDiff(methods, ['GET', 'POST']);
			}
		}, { 
			// capabilities that implicitly switch the runtime into client mode
			return_response_headers: true,
			return_status_code: function(code) {
				return Basic.arrayDiff(code, [200, 404]);
			},
			send_browser_cookies: false,
			send_custom_headers: true,
			use_http_method: function(methods) {
				return Basic.arrayDiff(methods, ['GET', 'POST']);
			}
		});


		Basic.extend(this, {
			getShim: function() {
				return Dom.get(this.uid).content.Moxie;
			},

			shimExec: function(component, action) {
				var args = [].slice.call(arguments, 2);
				return I.getShim().exec(this.uid, component, action, args);
			},

			init : function() {
				var container;

				// minimal requirement Flash Player 10
				if (!isInstalled('2.0.31005.0') || Env.browser === 'Opera') {
					this.trigger("Error", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
					return;
				}

				container = this.getShimContainer();

				container.innerHTML = '<object id="' + this.uid + '" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;">' +
					'<param name="source" value="' + options.xap_url + '"/>' +
					'<param name="background" value="Transparent"/>' +
					'<param name="windowless" value="true"/>' +
					'<param name="enablehtmlaccess" value="true"/>' +
					'<param name="initParams" value="uid=' + this.uid + ',target=' + Env.global_event_dispatcher + '"/>' +
				'</object>';

				// Init is dispatched by the shim
				initTimer = setTimeout(function() {
					if (I && !I.initialized) { // runtime might be already destroyed by this moment
						I.trigger("Error", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
					}
				}, Env.OS !== 'Windows'? 10000 : 5000); // give it more time to initialize in non Windows OS (like Mac)
			},

			destroy: (function(destroy) { // extend default destroy method
				return function() {
					destroy.call(I);
					clearTimeout(initTimer); // initialization check might be still onwait
					options = initTimer = destroy = I = null;
				};
			}(this.destroy))

		}, extensions);

		
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
	}

	Runtime.addConstructor(type, SilverlightRuntime); 

	return extensions;
});
