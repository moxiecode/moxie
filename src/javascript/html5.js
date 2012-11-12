;(function(window, document, o, undefined) {
	
	var 
	  type = 'html5'
	, x = o.Exceptions
	;
	
	o.Runtime.addConstructor(type, (function() {
		
		function Runtime(options) {	
			var I = this, shim;

			// allow to extend this runtime

			// figure out the options	
			defaults = {
			
			};
			options = typeof(options) === 'object' ? o.extend(defaults, options) : defaults;			
			
			o.Runtime.apply(this, [options, arguments[1] || type]);
			
			o.extend(this, {
					
				init : function() {		
					I.trigger("Init");			
				},

				getShim: function() {
					return shim;
				},

				shimExec: function(component, action) {
					var args = [].slice.call(arguments, 2);
					return I.getShim().exec.call(this, this.uid, component, action, args);
				},
				
				FileInput: (function() {
					var _files = [];

					return {
						init: function(options) {
							var comp = this, input, shimContainer, mimes;

							_files = [];
							
							// figure out accept string
							mimes = options.accept.mimes || o.extList2mimes(options.accept);
														
							shimContainer = I.getShimContainer();		
									
							shimContainer.innerHTML = '<input id="' + I.uid +'" type="file" style="font-size:999px;opacity:0;"' +
													(options.multiple ? 'multiple="multiple"' : '') + ' accept="' + mimes.join(',') + '" />';
							
							input = o(I.uid);
								
							// prepare file input to be placed underneath the browse_button element
							o.extend(input.style, {
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%'
							});
											
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

									o.addEvent(browseButton, 'click', function(e) {
										if (input && !input.disabled) { // for some reason FF (up to 8.0.1 so far) lets to click disabled input[type=file]
											input.click();
										}
										e.preventDefault();
									}, comp.uid); 
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
							
							
							input.onchange = function() { // there should be only one handler for this
								_files = [].slice.call(this.files);
								// Clearing the value enables the user to select the same file again if they want to
								this.value = '';
								comp.trigger('change');
							};
														
						},

						getFiles: function() {
							return _files;
						}
					};
					
				}()),

				FileDrop: (function() {
					var _files = [];

					return {
						init: function() {
							var comp = this, dropZone = options.container;

							// Safari on Windows has drag/drop problems, so we fake it by moving a input type file 
							// in front of the mouse pointer when we drag into the drop zone
							// TODO: Remove this logic once Safari has proper drag/drop support
							if (o.ua.browser === "Safari" && o.ua.OS === "Windows" && o.ua.version < 5.2) {
								if (o.getStyle(dropZone, 'position') === 'static') {
									o.extend(dropZone.style, {
										position : 'relative'
									});
								}

								o.addEvent(dropZone, 'dragenter', function(e) {
									var dropInput = o(I.uid + "_drop");

									e.preventDefault();
									e.stopPropagation();

									if (!dropInput) {
										dropInput = document.createElement("input");
										dropInput.setAttribute('type', "file");
										dropInput.setAttribute('id', I.uid + "_drop");
										dropInput.setAttribute('multiple', 'multiple');
										dropZone.appendChild(dropInput);	
									}	

									// add the selected files from file input
									dropInput.onchange = function() {
										var fileNames = {};
										
										_files = [];
										// there used to be a strange bug in Safari for Windows, when multiple files were dropped 
										// onto input[type=file] and they all basically resulted into the same file
										o.each(this.files, function(file) {
											if (!fileNames[file.name]) {
												_files.push(file);
												fileNames[file.name] = true; // remember file name 
											}
										});
										
										// remove input element
										dropInput.parentNode.removeChild(dropInput);

										comp.trigger("drop");									
									};
												              
									o.extend(dropInput.style, {
										position : 'absolute',
										display : 'block',
										top : 0,
										left : 0,
										right: 0,
										bottom: 0,
										opacity : 0
									});	

									comp.trigger("dragenter");					
								}, comp.uid);


								o.addEvent(dropZone, 'dragleave', function(e) {
									var dropInput = o(I.uid + "_drop");
									if (!dropInput) {
										dropInput.parentNode.removeChild(dropInput);
									}
									
									e.preventDefault();
									e.stopPropagation();
									
									comp.trigger("dragleave");
								}, comp.uid);

								return; // do not proceed farther
							}

							o.addEvent(dropZone, 'dragover', function(e) {
								e.preventDefault();
								e.stopPropagation();
								e.dataTransfer.dropEffect = 'copy'; 
							}, comp.uid);


							o.addEvent(dropZone, 'drop', function(e) {
								e.preventDefault();
								e.stopPropagation();
								_files = e.dataTransfer.files; 
								comp.trigger("drop");
							}, comp.uid);

							o.addEvent(dropZone, 'dragenter', function(e) {
								e.preventDefault();
								e.stopPropagation();
								comp.trigger("dragenter");
							}, comp.uid);

							o.addEvent(dropZone, 'dragleave', function(e) {
								e.preventDefault();
								e.stopPropagation();
								comp.trigger("dragleave");
							}, comp.uid);
						},

						getFiles: function() {
							return _files;
						}
					};
					
				}()),

				FileReader: {
					read : function(op, blob) {
						var target = this, fr = new FileReader;
						
						(function() {
							var events = ['loadstart', 'progress', 'load', 'abort', 'error', 'loadend'];

							function reDispatch(e) {
								if (!!~o.inArray(e.type, ['progress', 'load'])) {
									target.result = fr.result;
								}
								target.trigger(e);
							}

							function removeEventListeners() {
								o.each(events, function(name) {
									fr.removeEventListener(name, reDispatch);
								});

								fr.removeEventListener('loadend', removeEventListeners);
							}

							o.each(events, function(name) {
								fr.addEventListener(name, reDispatch);
							});

							fr.addEventListener('loadend', removeEventListeners);
						}());	

						if (o.typeOf(fr[op]) === 'function') {
							fr[op](blob.getSource());
						}
					}
				},

				Blob: {
					slice: function(srcBlob, start, end, type) {

						function w3cBlobSlice(blob, start, end) {
							var blobSlice;
							
							if (File.prototype.slice) {
								try {
									blob.slice();	// depricated version will throw WRONG_ARGUMENTS_ERR exception
									return blob.slice(start, end);
								} catch (e) {
									// depricated slice method
									return blob.slice(start, end - start); 
								}
							// slice method got prefixed: https://bugzilla.mozilla.org/show_bug.cgi?id=649672	
							} else if (blobSlice = File.prototype.webkitSlice || File.prototype.mozSlice) {
								return blobSlice.call(blob, start, end);	
							} else {
								return null; // or throw some exception	
							}
						}

						return new o.Blob(I.uid, w3cBlobSlice.apply(this, arguments));
					}
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
						var _xhr2, filename;

						o.extend(this, {
							
							send: function(meta, data) {
								var 
								  target = this
								, mustSendAsBinary = false
								, fd
								;

								_xhr2 = new XMLHttpRequest;

								// extract file name
								filename = meta.url.replace(/^.+?\/([\w\-\.]+)$/, '$1').toLowerCase();

								_xhr2.open(meta.method, meta.url, meta.async, meta.user, meta.password);

								// set request headers
								if (!o.isEmptyObj(meta.headers)) {
									o.each(meta.headers, function(value, header) {
										_xhr2.setRequestHeader(header, value);
									});
								}
									
								// prepare data to be sent and convert if required	
								if (data instanceof o.Blob) {
									if (data.isDetached()) {
										// if blob contains binary string, we have to manually build multipart blob 
										data = _prepareMultipart({ Filedata: data });
										mustSendAsBinary = true;
									} else {
										data = data.getSource();
									}
								} else if (data instanceof o.FormData) {
									if (data._blob && data._fields[data._blob].isDetached()) {
										// ... and here too
										data = _prepareMultipart(data._fields);
										mustSendAsBinary = true;
									} else {
										fd = new FormData;

										o.each(data._fields, function(value, name) {
											if (value instanceof o.Blob) {
												fd.append(name, value.getSource());
											} else {
												fd.append(name, value);
											}
										});
										data = fd;
									}
								}

								if ("" !== meta.responseType) {
									if ('json' === meta.responseType && !I.can('receive_response_type', 'json')) { // we can fake this one
										_xhr2.responseType = 'text';
									} else {
										_xhr2.responseType = meta.responseType;
									}
								}

								// attach event handlers
								(function() {
									var events = ['loadstart', 'progress', 'abort', 'error', 'load', 'timeout'];

									function reDispatch(e) {										
										target.trigger(e);
									}

									function removeEventListeners() {
										o.each(events, function(name) {
											_xhr2.removeEventListener(name, reDispatch);
										});

										_xhr2.removeEventListener('loadend', removeEventListeners);
									}

									o.each(events, function(name) {
										_xhr2.addEventListener(name, reDispatch);
									});

									_xhr2.addEventListener('loadend', removeEventListeners);
								}());		

										
								// send ...		
								if (!mustSendAsBinary) {
									_xhr2.send(data);
								} else {
									if (_xhr2.sendAsBinary) { // Gecko
										_xhr2.sendAsBinary(data);
									} else { // other browsers having support for typed arrays
										(function() {
											// mimic Gecko's sendAsBinary
											var ui8a = new Uint8Array(data.length);
											for (var i = 0; i < data.length; i++) {
												ui8a[i] = (data.charCodeAt(i) & 0xff);
											}
											_xhr2.send(ui8a.buffer);
										}());
									}
								}
							},

							getStatus: function() {
								try {
									if (_xhr2) {
										return _xhr2.status;
									}
								} catch(ex) {}
							},

							getResponse: function(responseType) {
								try {
									if (_xhr2) {
										if ('blob' === responseType) {
											var file = new o.File(I.uid, _xhr2.response);
											file.name = filename;
											return file;
										} else if ('json' === responseType && !I.can('receive_response_type', 'json')) {
											return o.JSON.parse(_xhr2.response);
										} else {
											return _xhr2.response;
										}
									}
								} catch(ex) {}
							}
						});

						function _prepareMultipart(params) {
							var 
							  boundary = '----moxieboundary' + new Date().getTime()
							, dashdash = '--'
							, crlf = '\r\n'
							, mimeType = ''
							, src
							, multipart = ''
							;

							if (!I.can('send_binary_string')) {
								throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
							}

							_xhr2.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
		
							// append multipart parameters
							if (o.typeOf(params) === 'object') {
								o.each(params, function(value, name) {
									if (value instanceof o.Blob) {
										src = value.getSource();

										// Build RFC2388 blob
										multipart += dashdash + boundary + crlf +
											'Content-Disposition: form-data; name="' + name + '"; filename="' + unescape(encodeURIComponent(value.name || 'blob')) + '"' + crlf +
											'Content-Type: ' + value.type + crlf + crlf +
											src + crlf;
									} else {
										multipart += dashdash + boundary + crlf + 
											'Content-Disposition: form-data; name="' + name + '"' + crlf + crlf +
											unescape(encodeURIComponent(value)) + crlf;
									}
								});
							}

							multipart += dashdash + boundary + dashdash + crlf;

							return multipart;
						}
					},

					Image: function() {
						var me = this
						, _img, _imgInfo, _canvas, _binStr, _srcBlob
						, _modified = false // is set true whenever image is modified
						; 

						o.extend(me, {
							loadFromBlob: function(srcBlob, asBinary) {
								var comp = this;

								if (!I.can('access_binary')) {
									throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
								}

								_srcBlob = srcBlob;

								if (asBinary) { // this will let us to hack the file internals
									_readAsBinaryString(_srcBlob, function(data) {
										_loadFromBinaryString.call(comp, data);
									});
								} else { // ... but this is faster
									_readAsDataUrl(_srcBlob, function(data) {
										_loadFromDataUrl.call(comp, data);
									});
								}
							},

							loadFromImage: function(img, exact) {
								_srcBlob = {
									name: img.name,
									size: img.size,
									type: img.type
								};

								if (exact) {
									_loadFromBinaryString.call(this, img.getAsBinaryString());
								} else {
									_img = img.getAsImage();
									this.trigger('load', me.getInfo());
								}
							},

							getInfo: function() {
								var info = {
										width: _img && _img.width || 0,
										height: _img && _img.height || 0,
										type: _srcBlob && (_srcBlob.type || _srcBlob.name && o.mimes[_srcBlob.name.replace(/^.+\.([^\.]+)$/, "$1").toLowerCase()]) || '',
										size: _binStr && _binStr.length || _srcBlob.size || 0,
										name: _srcBlob && _srcBlob.name || '',
										meta: {}
									};

								if (I.can('access_image_binary') && _binStr) {
									if (_imgInfo) {
										_imgInfo.purge();
									}
									_imgInfo = new o.ImageInfo(_binStr);
									o.extend(info, _imgInfo);
								}
								return info;
							},

							resize: function() {
								if (!_img) {
									throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);	
								}
								_resize.apply(this, arguments);
							},

							getAsImage: function() {
								if (!_img) {
									throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);	
								}
								_img.id = this.uid + '_img';
								return _img;
							},

							getAsCanvas: function() {
								if (!_canvas) {
									throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);	
								}
								_canvas.id = this.uid + '_canvas';
								return _canvas;
							},

							getAsBlob: function(type, quality) {
								var data, blob;

								data = me.getAsBinaryString.call(this, type, quality);

								blob = new o.Blob(null, { // standalone blob
									type: type,
									size: data.length
								});
								blob.detach(data);
								return blob;
							},

							getAsDataURL: function(type, quality) {
								if (type !== 'image/jpeg') {
									return _canvas.toDataURL('image/png');
								} else {
									try {
										// older Geckos used to result in an exception on quality argument
										return _canvas.toDataURL('image/jpeg', quality/100);	
									} catch (ex) {
										return _canvas.toDataURL('image/jpeg');	
									}
								}
							},

							getAsBinaryString: function(type, quality) {
								var dataUrl;

								// if image has not been modified, return the source right away
								if (!_modified) {
									return _binStr;
								}

								if ('image/jpeg' !== type) {
									dataUrl = me.getAsDataURL(type, quality);	
									_binStr = o.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7));
								} else { 
									// if jpeg
									if (!quality) {
										quality = 90;
									}

									try {
										// older Geckos used to result in an exception on quality argument
										dataUrl = _canvas.toDataURL('image/jpeg', quality/100);	
									} catch (ex) {
										dataUrl = _canvas.toDataURL('image/jpeg');	
									}

									_binStr = o.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7));

									if (_imgInfo) {
										// update dimensions info in exif
										if (_imgInfo.meta && _imgInfo.meta.exif) {
											_imgInfo.setExif({
												PixelXDimension: this.width,
												PixelYDimension: this.height
											});
										}

										_binStr = _imgInfo.writeHeaders(_binStr);
									}
								}
								
								_modified = false;
								
								return _binStr;
							},

							destroy: function() {
								_purge.call(this);
								delete objpool[this.uid];
							}
						});

						
						function _loadFromBinaryString(binStr) {
							var comp = this, info;

							_purge.call(this);

							_binStr = binStr;

							_img = new Image;
							_img.onerror = function() {
								_purge.call(this);
								throw new x.ImageError(x.ImageError.WRONG_FORMAT);
							};
							_img.onload = function() {
								comp.trigger('load', me.getInfo());
							};
							_img.src = 'data:' + (_srcBlob.type || '') + ';base64,' + o.btoa(binStr);
						}

						function _loadFromDataUrl(dataUrl) {
							var comp = this;

							_img = new Image;
							_img.onerror = function() {
								_purge.call(this);
								throw new x.ImageError(x.ImageError.WRONG_FORMAT);
							};
							_img.onload = function() {
								comp.trigger('load', me.getInfo());
							};
							_img.src = dataUrl;
						}

						function _readAsBinaryString(file, callback) {
							var fr;

							// use FileReader if it's available
							if (window.FileReader) {
								fr = new FileReader;
								fr.onload = function() {
									callback(fr.result);
								};
								fr.readAsBinaryString(file);
							} else {
								return callback(file.getAsBinary());
							}
						}

						function _readAsDataUrl(file, callback) {
							var fr;

							// use FileReader if it's available
							if (window.FileReader) {
								fr = new FileReader;
								fr.onload = function() {
									callback(fr.result);
								};
								fr.readAsDataURL(file);
							} else {
								return callback(file.getAsDataURL());
							}
						}

						function _resize(width, height, crop) {
							var ctx, scale, mathFn, imgWidth, imgHeight;

							// unify dimensions
							mathFn = !crop ? Math.min : Math.max;
							scale = mathFn(width/this.width, height/this.height);
							imgWidth = Math.round(this.width * scale);
							imgHeight = Math.round(this.height * scale);

							// we only downsize here
							if (scale > 1) {
								this.trigger('Resize'); 
								return;
							}

							// prepare canvas if necessary
							if (!_canvas) {
								_canvas = document.createElement("canvas");
							}
							
							ctx = _canvas.getContext('2d');

							// scale image and canvas
							if (crop) {
								_canvas.width = width;
								_canvas.height = height;
							} else {
								_canvas.width = imgWidth;
								_canvas.height = imgHeight;
							}

							ctx.clearRect (0, 0 , _canvas.width, _canvas.height);
							ctx.drawImage(_img, 0, 0, imgWidth, imgHeight);

							_modified = true;
							this.trigger('Resize', { 
								width: crop ? width : imgWidth, 
								height: crop ? height : imgHeight 
							});
						}

						function _purge() {
							if (_imgInfo) {
								_imgInfo.purge();
								_imgInfo = null;
							}
							_binStr = _img = _canvas = null;
							_modified = false;
						}

					}
				}
			}());

		}
		
				
		Runtime.can = (function() {
			var caps = o.extend({}, o.Runtime.caps, {  
					access_binary: !!(window.FileReader || window.File && File.getAsDataURL),		
					access_image_binary: function() {
						return can('access_binary') && !!o.ImageInfo;
					},		
					display_media: false,
					drag_and_drop: (function() {
						// this comes directly from Modernizr: http://www.modernizr.com/
						var div = document.createElement('div');
						return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
					}()),
					receive_response_type: function(responseType) {
						if (!window.XMLHttpRequest) {
							return false;
						}
						try {
							var xhr = new XMLHttpRequest;
							if (o.typeOf(xhr.responseType) !== 'undefined') {
								xhr.open('get', 'infinity-8.me'); // otherwise Gecko throws an exception
								xhr.responseType = responseType;
								return true;
							}
						} catch (ex) {}
						return false;
					},
					report_upload_progress: function() {
						return !!(window.XMLHttpRequest && (new XMLHttpRequest).upload);
					},
					resize_image: function() {
						return can('access_binary') && o.ua.can('create_canvas');
					},
					select_multiple: !(o.ua.browser === 'Safari' && o.ua.os === 'Windows'),
					send_binary_string: 
						!!(window.XMLHttpRequest && ((new XMLHttpRequest).sendAsBinary || (window.Uint8Array && window.ArrayBuffer))),
					send_custom_headers: !!window.XMLHttpRequest,
					send_multipart: function() {
						return !!(window.XMLHttpRequest && (new XMLHttpRequest).upload && window.FormData) || can('send_binary_string');
					},
					slice_blob: !!(window.File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)),
					stream_upload: function() {
						return can('slice_blob') && can('send_multipart');
					},
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


