define("runtime/silverlight/Runtime", ["o", "runtime/Runtime", "runtime/silverlight/extensions"], function(o, R, extensions) {
	var type = 'silverlight'
	, x = o.Exceptions
	;
	
	/**
	Constructor for the Flash Runtime

	@class RuntimeFlash
	@extends Runtime
	*/
	R.addConstructor(type, (function() {
		
		function Runtime(options) {	
			var self = this, shimContainer;
						
			function isInstalled(version) {
				var isVersionSupported = false, container = null, control = null, actualVer,
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
					setTimeout(function() { wait4shim.call(self, ms) }, 1);
				}
			}
			
			// figure out the options	
			defaults = {
				xap_url: 'js/Moxie.xap'
			};
			self.options = options = o.extend({}, defaults, options);			
			
			R.apply(this, [options, arguments[1] || type]);
			
			o.extend(this, {
					
				getShim: function() {
					return o(this.uid).content.Moxie;
				},
					
				init : function() {	
					var html, el, container;
							
					// minimal requirement Flash Player 10
					if (!isInstalled('2.0.31005.0') || o.ua.browser === 'Opera') {
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
		
				
		Runtime.can = (function() {
			var caps = o.extend({}, R.caps, {
					access_binary: true,
					access_image_binary: true,
					display_media: true,
					drag_and_drop: false,
					receive_response_type: function(responseType) {
						return !~o.inArray(responseType, ['blob']); // not implemented yet
					},
					report_upload_progress: true,
					resize_image: true,
					return_response_headers: false,
					select_multiple: true,
					send_custom_headers: true,
					send_multipart: true,
					slice_blob: true,
					stream_upload: true,
					summon_file_dialog: false,
					upload_filesize: true,
					use_http_method: function(methods) {
						if (o.typeOf(methods) !== 'array') {
							methods = [methods];
						}

						for (var i in methods) {
							// flash only supports GET, POST
							if (!~o.inArray(methods[i].toUpperCase(), ['GET', 'POST'])) {
								return false;
							}
						}
						return true;
					}
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
