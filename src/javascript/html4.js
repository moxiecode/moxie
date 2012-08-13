;(function(window, document, o, undefined) {
	
	var 
	  type = 'html4'
	, x = o.Exceptions
	;
	
	o.Runtime.addConstructor(type, (function() {
		
		function Runtime(options) {	
			var I = this, shim;

			// figure out the options	
			defaults = {
			
			};
			options = typeof(options) === 'object' ? o.extend(defaults, options) : defaults;			
			
			o.Runtime.apply(this, [type, options]);
			
			o.extend(this, {
					
				init : function() {		
					I.trigger("Init");			
				},

				getShim: function() {
					return shim;
				},
				
				API: {	
					FileInput: (function() {
						var _uid, _mimes = [], _options;

						function addInput() {
							var comp = this, shimContainer, browseButton, currForm, input, uid;

							uid = o.guid();

							shimContainer = I.getShimContainer(); // we get new ref everytime to avoid memory leaks in IE

							if (_uid) { // move previous form out of the view
								currForm = o(_uid + '_form');
								if (currForm) {
									o.extend(currForm.style, { top: '100%' });
								}
							}		

							shimContainer.innerHTML += '<form id="' + uid + '_form" method="post" ' + 
								'style="overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;" ' +
								'enctype="multipart/form-data" encode="multipart/form-data" target="' + uid + '_iframe">' + 
									'<input id="' + uid +'" type="file" style="font-size:999px;opacity:0;" accept="' + _mimes.join(',') + '"/>' +
								'</form>';

							input = o(uid);

							if (I.can('summon_file_dialog')) {
								// prepare file input to be placed underneath the browse_button element
								o.extend(input.style, {
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%'
								});
							} else {
								// show arrow cursor in older browsers (instead of the text one - bit more logical)
								o.extend(input.style, {
									cssFloat: 'right', 
									styleFloat: 'right'
								});
							}

							if (o.ua.browser === 'IE' && o.ua.version < 10) {
								plupload.extend(input.style, {
									filter : "progid:DXImageTransform.Microsoft.Alpha(opacity=0)"
								});
							}

							input.onchange = function() { // there should be only one handler for this
								var el = this, files = [], file;
								
								if (!el.value) {
									return;
								}

								if (el.files) {
									file = el.files[0];
								} else {
									file = {
										name: el.value.replace(/\\/g, '/').substr(name.lastIndexOf('/') + 1)
									};
								}

								files.push(new o.File(I.uid, file));

								input.onchange = function() {}; // clear event handler
								addInput.call(comp);

								comp.files = files;
								comp.trigger('change', files);
							};


							// route click event to the input
							if (I.can('summon_file_dialog')) {
								browseButton = o(_options.browse_button);
								o.removeEvent(browseButton, 'click', comp.uid);
								o.addEvent(browseButton, 'click', function(e) {
									if (input && !input.disabled) { // for some reason FF (up to 8.0.1 so far) lets to click disabled input[type=file]
										input.click();
									}
									e.preventDefault();
								}, comp.uid); 
							}

							_uid = uid;

							shimContainer = currForm = browseButton = null;
						}

						return {
							init: function(options) {
								var comp = this, input, form, shimContainer;
								
								// figure out accept string
								_options = options;
								_mimes = options.accept.mimes || o.extList2mimes(options.accept);
								
								shimContainer = I.getShimContainer();	
								
								(function() {
									var browseButton, zIndex, top;

									browseButton  = o(options.browse_button);

									// Route click event to the input[type=file] element for browsers that support such behavior
									if (I.can('summon_file_dialog')) {

										if (o.getStyle(browseButton, 'position') === 'static') {
											browseButton.style.position = 'relative';
										}
										
										zIndex = parseInt(o.getStyle(browseButton, 'z-index'), 10) || 1;
				
										browseButton.style.zIndex = zIndex;
										shimContainer.style.zIndex = zIndex - 1;
									}								

									/* Since we have to place input[type=file] on top of the browse_button for some browsers,
									browse_button loses interactivity, so we restore it here */
									top = I.can('summon_file_dialog') ? browseButton : shimContainer;
									
									o.addEvent(top, 'mouseover', function() {
										comp.trigger('mouseenter');
									}, comp.uid);
									
									o.addEvent(top, 'mouseout', function() {
										comp.trigger('mouseleave');
									}, comp.uid);
									
									o.addEvent(top, 'mousedown', function() {
										comp.trigger('mousedown');	
									}, comp.uid);
									
									o.addEvent(o(options.container), 'mouseup', function() {
										comp.trigger('mouseup');
									}, comp.uid);

								}());

								addInput.call(this);	

								browsebutton = shimContainer = null;
							}
						};
					}())
				}			
			});

			shim = (function() {
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
					},

					XMLHttpRequest: function() {
						
					}
				}
			}());

		}
		
				
		Runtime.can = (function() {
			var caps = o.extend({}, o.Runtime.caps, {  
					access_binary: false,		
					access_image_binary: false,		
					display_media: false,
					drag_and_drop: false,
					receive_response_type: function(responseType) {
						return !!~o.inArray(o.ua.browser, ['json', 'text', 'document', '']);
					},
					select_multiple: false,
					send_binary_string: false,
					send_custom_headers: false,
					send_multipart: true,
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

}(window, document, mOxie));


