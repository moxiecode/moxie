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
			
			// inherit stuff from html5 runtime if it is available
			if (o.Runtime.getConstructor('html5')) {
				o.Runtime.getConstructor('html5').apply(this, [options, arguments[1] || type]);
				shim = this.getShim();
			} else {
				o.Runtime.apply(this, [options, arguments[1] || type]);
				shim = {};
			}

			
			o.extend(this, {
				
				FileInput: (function() {
					var _uid, _files = [], _mimes = [], _options;

					function addInput() {
						var comp = this, shimContainer, browseButton, currForm, form, input, uid;

						uid = o.guid('uid_');

						shimContainer = I.getShimContainer(); // we get new ref everytime to avoid memory leaks in IE

						if (_uid) { // move previous form out of the view
							currForm = o(_uid + '_form');
							if (currForm) {
								o.extend(currForm.style, { top: '100%' });
							}
						}		

						// build form in DOM, since innerHTML version not able to submit file for some reason
						form = document.createElement('form');
						form.setAttribute('id', uid + '_form');
						form.setAttribute('method', 'post');
						form.setAttribute('enctype', 'multipart/form-data');
						form.setAttribute('encoding', 'multipart/form-data');

						o.extend(form.style, {
							overflow: 'hidden',
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%'
						});

						input = document.createElement('input');
						input.setAttribute('id', uid);
						input.setAttribute('type', 'file');
						input.setAttribute('name', 'Filedata');
						input.setAttribute('accept', _mimes.join(','));

						o.extend(input.style, {
							fontSize: '999px',
							opacity: 0 
						});

						form.appendChild(input);
						shimContainer.appendChild(form);

						// prepare file input to be placed underneath the browse_button element
						o.extend(input.style, {
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%'
						});
						

						if (o.ua.browser === 'IE' && o.ua.version < 10) {
							plupload.extend(input.style, {
								filter : "progid:DXImageTransform.Microsoft.Alpha(opacity=0)"
							});
						}

						input.onchange = function() { // there should be only one handler for this
							var file;
							
							if (!this.value) {
								return;
							}

							if (this.files) {
								file = this.files[0];
							} else {
								file = {
									name: this.value
								};
							}

							_files = [file];

							this.onchange = function() {}; // clear event handler
							addInput.call(comp);

							// after file is initialized as o.File, we need to update form and input ids
							comp.bind('change', function() {
								var input = o(uid), form = o(uid + '_form'), file;
								
								if (comp.files.length && input && form) {
									file = comp.files[0];

									input.setAttribute('id', file.uid);
									form.setAttribute('id', file.uid + '_form');

									// set upload target
									form.setAttribute('target', file.uid + '_iframe');
								}
								input = form = null;
							}, 998);

							input = form = null;
							comp.trigger('change');
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
						},

						getFiles: function() {
							return _files;
						},

						disable: function(state) {
							var input;
							if (input = o(_uid)) { 
								input.disabled = !!state;
							}
						}
					};
				}())
			});

			o.extend(shim, {
				XMLHttpRequest: function() {
					var _status, _response, _iframe;

					o.extend(this, {
							
						send: function(meta, data) {
							var target = this, uid, form, input, blob;

							_status = _response = null;

							function createIframe() {
								var 
								  container = I.getShimContainer() || document.body
								, temp = document.createElement('div')
								;

								// IE 6 won't be able to set the name using setAttribute or iframe.name
								temp.innerHTML = '<iframe id="' + uid + '_iframe" name="' + uid + '_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>';
								_iframe = temp.firstChild;
								container.appendChild(_iframe);

								/* _iframe.onreadystatechange = function() {
									console.info(_iframe.readyState);
								};*/

								o.addEvent(_iframe, 'load', function(e) { // _iframe.onload doesn't work in IE lte 8
									var el;

									try {
										el = _iframe.contentWindow.document || _iframe.contentDocument || window.frames[_iframe.id].document;

										// try to detect some standard error pages
										if (/^4\d{2}\s/.test(el.title) && el.getElementsByTagName('address').length) { // standard Apache style
											_status = el.title.replace(/^(\d+).*$/, '$1');
											target.trigger('error');
											return;
										}
										_status = 200;

									} catch (ex) {
										// probably a permission denied error
										_status = 404;
										target.trigger('error');
										return;
									}

									// get result 
									_response = o.trim(el.body.innerHTML);

									// cleanup
									if (!data._blob) {
										form.parentNode.removeChild(form);
									} else {
										o.each(form.getElementsByTagName('input'), function(input) {
											if ('hidden' === input.getAttribute('type')) {
												input.parentNode.removeChild(input);
											}
											input = null;
										});
									}
									form = null;

									// without timeout, request is marked as canceled (in console)
									setTimeout(function() { 
										o.removeEvent(_iframe, 'load', target.uid);
										if (_iframe.parentNode) { // #382
											_iframe.parentNode.removeChild(_iframe);
										}
										_iframe = null; 

										target.trigger({
											type: 'uploadprogress',
											loaded: blob && blob.size || 1025,
											total: blob && blob.size || 1025
										});
										target.trigger('load');
									}, 1);
								}, target.uid);
							} // end createIframe

							// prepare data to be sent and convert if required	
							if (data instanceof o.FormData) {
								if (data._blob) {
									blob = data._fields[data._blob];
									uid = blob.uid;
									input = o(uid);
									form = o(uid + '_form');
									if (!form) {
										throw new x.DOMException(x.DOMException.NOT_FOUND_ERR);
									}
								} else {
									uid = o.guid('uid_');

									form = document.createElement('form');
									form.setAttribute('id', uid + '_form');
									form.setAttribute('method', 'post');
									form.setAttribute('enctype', 'multipart/form-data');
									form.setAttribute('encoding', 'multipart/form-data');
									form.setAttribute("target", uid + '_iframe');
									

									//form.style.position = 'absolute';
								}

								o.each(data._fields, function(value, name) {
									if (value instanceof o.Blob) {
										if (input) {
											input.setAttribute('name', name);
										}
									} else {
										var hidden = document.createElement('input');

										o.extend(hidden, {
											type : 'hidden',
											name : name,
											value : value
										});

										form.appendChild(hidden);
									}
								});

								// set destination url
								form.setAttribute("action", meta.url);

								createIframe();
								form.submit();
								target.trigger('loadstart');

								temp = container == null;
							}
						},

						getStatus: function() {
							return _status;
						},

						getResponse: function(responseType) {
							if ('json' === responseType) {
								// strip off <pre>..</pre> tags that might be enclosing the response
								return o.JSON.parse(_response.replace(/^\s*<pre>/, '').replace(/<\/pre>\s*$/, ''));
							} else if ('document' === responseType) {

							} else {
								return _response;
							}
						},

						abort: function(upload_complete_flag) {
							if (_iframe) {
								if (o.typeOf(_iframe.stop) === 'function') { // FireFox/Safari/Chrome
									_iframe.stop();
								} else {
									_iframe.document.execCommand('Stop'); // IE
								}
							}

							this.dispatchEvent('readystatechange');
							// this.dispatchEvent('progress');
							this.dispatchEvent('abort');
							this.dispatchEvent('loadend');

							if (!upload_complete_flag) {
								// this.dispatchEvent('progress');
								this.upload.dispatchEvent('abort');
								this.upload.dispatchEvent('loadend');
							}
						}
					});
				}
			});

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

}(window, document, mOxie));


