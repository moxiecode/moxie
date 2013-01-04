define("runtime/flash/Runtime", ["o", "runtime/Runtime", "runtime/flash/extensions"], function(o, R, extensions) {
	var type = 'flash'
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
				swf_url: 'js/Moxie.swf'
			};
			self.options = options = o.extend({}, defaults, options);			
			
			o.Runtime.apply(this, [options, arguments[1] || type]);
			
			o.extend(this, {
					
				init : function() {	
					var html, el, container;
							
					// minimal requirement Flash Player 10
					if (getShimVersion() < 10) { 
						self.destroy();
						throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);
					}
					
					container = self.getShimContainer();

					// if not the minimal height, shims are not initialized in older browsers (e.g FF3.6, IE6,7,8, Safari 4.0,5.0, etc)
					o.extend(container.style, {
						position: 'absolute',
						top: '-8px',
						left: '-8px',
						width: '9px', 
						height: '9px',
						overflow: 'hidden'
					});
					
					// insert flash object						
					html = '<object id="' + self.uid + '" type="application/x-shockwave-flash" data="' +  options.swf_url + '" ';
					
					if (o.ua.browser === 'IE') {
						html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
					}
	
					html += 'width="100%" height="100%" style="outline:0">'  +
						'<param name="movie" value="' + options.swf_url + '" />' +
						'<param name="flashvars" value="uid=' + escape(self.uid) + '" />' +
						'<param name="wmode" value="transparent" />' +
						'<param name="allowscriptaccess" value="always" />' +
					'</object>';
						
					if (o.ua.browser === 'IE') {
						el = document.createElement('div');
						container.appendChild(el);
						el.outerHTML = html;
						el = container = null; // just in case
					} else {
						container.innerHTML = html;
					}
					
					wait4shim(5000); // Init will be dispatched by the shim					
				}
			}, extensions);
		}
		
				
		Runtime.can = (function() {
			var has_to_urlstream = function() {
					var required_caps = this.options.required_caps;
					return !o.isEmptyObj(required_caps) && (required_caps.access_binary || required_caps.send_custom_headers);
				},

				caps = o.extend({}, R.caps, {
					access_binary: true,
					access_image_binary: true,
					display_media: true,
					drag_and_drop: false,
					receive_response_type: true,
					report_upload_progress: true,
					resize_image: true,
					return_response_headers: false,
					select_multiple: true,
					send_custom_headers: true,
					send_multipart: true,
					slice_blob: true,
					stream_upload: function(value) {
						return !!value & !has_to_urlstream.call(this);
					},
					summon_file_dialog: false,
					upload_filesize: function(size) {
						var maxSize = has_to_urlstream.call(this) ? 2097152 : -1; // 200mb || unlimited
						
						if (!~maxSize || o.parseSizeStr(size) <= maxSize) {
							return true;
						}
						return false;
					},
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
