;(function(window, document, o, undefined) {
	
	var 
	  type = 'silverlight'
	, x = o.Exceptions
	;
	
	/**
	Constructor for the Flash Runtime

	@class RuntimeFlash
	@extends Runtime
	*/
	o.Runtime.addConstructor(type, (function() {
		
		function Runtime(options) {	
			var self = this,
				shimContainer;
						
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
				
				// wait for 5 sec
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

			// inherit stuff from flash runtime 
			if (o.Runtime.getConstructor('flash')) {
				o.Runtime.getConstructor('flash').apply(this, [options, arguments[1] || type]);
			} else {
				throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);
			}		
						
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

					wait4shim(5000); // Init will be dispatched by the shim	
				},

				FileInput: {
					init: function(options) {
						
						function toFilters(accept) {
							var filter = '';
							for (i = 0; i < accept.length; i++) {
								filter += (filter != '' ? '|' : '') + accept[i].title + " | *." + accept[i].extensions.replace(/,/g, ';*.');
							}
							return filter;
						}
													
						return self.shimExec.call(this, 'FileInput', 'init', toFilters(options.accept), options.name, options.multiple);
					}
				} /*,

				// this works only in safari (...crickets...)

				FileDrop: {
					init: function() {
						var comp = this, dropZone;

						dropZone = self.getShimContainer();

						o.addEvent(dropZone, 'dragover', function(e) {
							e.preventDefault();
							e.stopPropagation();
							e.dataTransfer.dropEffect = 'copy'; 
						}, comp.uid);

						o.addEvent(dropZone, 'dragenter', function(e) {
							e.preventDefault();
							var flag = o(self.uid).dragEnter(e);
						    // If handled, then stop propagation of event in DOM
						    if (flag) e.stopPropagation();
						}, comp.uid);

						o.addEvent(dropZone, 'drop', function(e) {
							e.preventDefault();
							var flag = o(self.uid).dragDrop(e);
						    // If handled, then stop propagation of event in DOM
						    if (flag) e.stopPropagation();
						}, comp.uid);

						return self.shimExec.call(this, 'FileDrop', 'init');
					}
				}*/
			});
		}
				
		Runtime.can = (function() {
			var caps = o.extend({}, o.Runtime.caps, {
					access_binary: true,
					access_image_binary: true,
					display_media: true,
					drag_and_drop: false,
					receive_response_type: true,
					report_upload_progress: true,
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
				return o.Runtime.can.apply(this, args);
			}
			return can;
		}());
		
		return Runtime;
	}()));		

}(window, document, mOxie));


