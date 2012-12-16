;(function(window, document, o, undefined) {
	
	var type = 'flash'
	, x = o.Exceptions
	;
	
	/**
	Constructor for the Flash Runtime

	@class RuntimeFlash
	@extends Runtime
	*/
	o.Runtime.addConstructor(type, (function() {
		
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
			self.options = options = o.extend({}, defaults, options)			
			
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
			});

			o.extend(this, (function() {

				function _formatData(data, op, type) {
					switch (op) {
						case 'readAsText':
						case 'readAsBinaryString': 
							return o.atob(data);
						
						case 'readAsDataURL':
							return data;
						
					}
					return null;
				}

				return {	
					Transporter: {
						getAsBlob: function(type) {
							var blob = self.shimExec.call(this, 'Transporter', 'getAsBlob', type);
							if (blob) {				
								return new o.Blob(self.uid, blob);
							}
							return null;
						}
					},
					
					Blob: {
						slice: function(blob, start, end, type) {
							
							if (start < 0) {
								start = Math.max(blob.size + start, 0);
							} else if (start > 0) {
								start = Math.min(start, blob.size);
							}	
							
							if (end < 0) {
								end = Math.max(blob.size + end, 0);	
							} else if (end > 0) {
								end = Math.min(end, blob.size);
							}
							
							blob = self.shimExec.call(this, 'BlobSlicer', 'slice', blob.id, start, end, type || '');
							
							if (blob) {
								blob = new o.Blob(self.uid, blob);
							}
							return blob;
						}
					},
							
					FileReader: {
						read : function(op, blob) {
							var comp = this;
							
							// special prefix for DataURL read mode	
							if (op === 'readAsDataURL') {
								comp.result = 'data:' + (blob.type || '') + ';base64,';	
							}
															
							comp.bind('Progress', function(e, data) {			
								if (data) {
									comp.result += _formatData(data, op);	
								}
							}, 999);
							
							return self.shimExec.call(this, 'FileReader', 'readAsBase64', blob.getSource().id);
						}
					},

					FileReaderSync: {
						read : function(op, blob) {
							var result;
													
							result = self.shimExec.call(this, 'FileReaderSync', 'readAsBase64', blob.getSource().id);
							if (!result) {
								return null; // or throw ex
							}

							// special prefix for DataURL read mode	
							if (op === 'readAsDataURL') {
								result = 'data:' + (blob.type || '') + ';base64,' + result;	
							}
							
							return _formatData(result, op, blob.type);
						}
					},
					
					XMLHttpRequest: {
						send: function(meta, data) {
							var target = this;

							function send() {
								self.shimExec.call(target, 'XMLHttpRequest', 'send', meta, data);
							}

							function appendBlob(name, blob) {
								self.shimExec.call(target, 'XMLHttpRequest', 'appendBlob', name, blob.getSource().id);
								data = null;
								send();
							}

							function attachBlob(name, blob) {
								var tr = new o.Transporter;

								tr.bind("TransportingComplete", function() {
									appendBlob(name, this.result);
								});

								tr.transport(blob.getSource(), blob.type, {
									ruid: self.uid
								});
							}

							// copy over the headers if any
							if (!o.isEmptyObj(meta.headers)) {
								o.each(_headers, function(value, header) {
									self.shimExec.call(target, 'XMLHttpRequest', 'setRequestHeader', name, value.toString()); // Silverlight doesn't accept integers into the arguments of type object
								});
							}


							// transfer over multipart params and blob itself
							if (data instanceof o.FormData) { 
								o.each(data._fields, function(value, name) {
									if (!(value instanceof o.Blob)) {
										self.shimExec.call(target, 'XMLHttpRequest', 'append', name, value.toString());
									}
								});

								if (!data._blob) {
									data = null;
									send();
								} else {
									var blob = data._fields[data._blob];
									if (blob.isDetached()) {
										attachBlob(data._blob, blob);
									} else {
										appendBlob(data._blob, blob);
									}
								}
							} else if (data instanceof o.Blob) {
								data = data.uid; // something wrong here									
							} else {
								send();
							}												
						},

						getResponse: function(responseType) {
							var blob, response;

							blob = self.shimExec.call(this, 'XMLHttpRequest', 'getResponseAsBlob');

							if (blob) {
								blob = new o.File(self.uid, blob);

								if ('blob' === responseType) {
									return blob;
								} else if (!!~o.inArray(responseType, ["", "text"])) {
									var frs = new o.FileReaderSync;
									return frs.readAsText(blob);
								} else if ('arraybuffer' === responseType) {

									// do something
								
								} else if ('json' === responseType) {
									var frs = new o.FileReaderSync;

									this.bind('Exception', function(e, err) {
										// throw JSON parse error
										console.info(err);
									});

									return o.JSON.parse(frs.readAsText(blob));
								} 
							}
							return null;
						},

						abort: function(upload_complete_flag) {
							self.shimExec.call(this, 'XMLHttpRequest', 'abort');

							this.dispatchEvent('readystatechange');
							// this.dispatchEvent('progress');
							this.dispatchEvent('abort');

							if (!upload_complete_flag) {
								// this.dispatchEvent('uploadprogress');
							}
						}
					},

					Image: {
						loadFromBlob: function(blob) {
							var comp = this;

							function exec(srcBlob) {
								self.shimExec.call(comp, 'Image', 'loadFromBlob', srcBlob.id);
							}

							if (blob.isDetached()) { // binary string
								var tr = new o.Transporter;
								tr.bind("TransportingComplete", function() {
									exec(tr.result.getSource());
								});
								tr.transport(blob.getSource(), blob.type, self.uid); 
							} else {
								exec(blob.getSource());
							}
						},

						loadFromImage: function(img, exact) {
							return self.shimExec.call(this, 'Image', 'loadFromImage', img.uid);
						},

						getAsBlob: function(type, quality) {
							var blob = self.shimExec.call(this, 'Image', 'getAsBlob', type, quality);
							if (blob) {				
								return new o.Blob(self.uid, blob);
							}
							return null;
						},

						getAsDataURL: function(type, quality) {
							var frs, blob = self.Image.getAsBlob.apply(this, arguments);
							if (!blob) {
								return null;
							}
							frs = new o.FileReaderSync;
							return frs.readAsDataURL(blob);
						}
					}
				};
			}()));
		}
				
		Runtime.can = (function() {
			var has_to_urlstream = function() {
					var required_caps = this.options.required_caps;
					return !o.isEmptyObj(required_caps) && (required_caps.access_binary || required_caps.send_custom_headers);
				},

				caps = o.extend({}, o.Runtime.caps, {
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
				return o.Runtime.can.apply(this, args);
			}
			return can;
		}());
		
		return Runtime;
	}()));		

}(window, document, mOxie));


