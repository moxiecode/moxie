define("runtime/html4/Runtime", ["o", "runtime/Runtime", "runtime/html4/extensions"], function(o, R, extensions) {
	var x = o.Exceptions;
	var type = 'html4';
	
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
				}
			}()), extensions);
		}
		
				
		Runtime.can = (function() {
			var caps = o.extend({}, o.Runtime.caps, {  
					access_binary: !!(window.FileReader || window.File && File.getAsDataURL),		
					access_image_binary: false,		
					display_media: o.ua.can('create_canvas') || o.ua.can('use_data_uri_over32kb'),
					drag_and_drop: false,
					receive_response_type: function(responseType) {
						return !!~o.inArray(o.ua.browser, ['json', 'text', 'document', '']);
					},
					resize_image: function() {
						return can('access_binary') && o.ua.can('create_canvas');
					},
					report_upload_progress: false,
					return_response_headers: false,
					select_multiple: false,
					send_binary_string: false,
					send_custom_headers: false,
					send_multipart: true,
					slice_blob: false,
					stream_upload: true,
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
				return o.Runtime.can.apply(this, args);
			}
			return can;
		}());
		
		return Runtime;
	}()));	

});
