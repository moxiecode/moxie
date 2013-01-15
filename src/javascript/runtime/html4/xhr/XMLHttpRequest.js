define("runtime/html4/xhr/XMLHttpRequest", ["o", "core/utils/events", "file/Blob", "xhr/FormData"], function(o, events, Blob, FormData) {

	var x = o.Exceptions;

	return function() {
		var _status, _response, _iframe;

		function cleanup(cb) {
			var target = this, uid, form, inputs, i, hasFile = false;

			if (!_iframe) {
				return;
			}

			uid = _iframe.id.replace(/_iframe$/, '');

			form = o(uid + '_form');
			if (form) {
				inputs = form.getElementsByTagName('input');
				i = inputs.length;
				
				while (i--) {
					switch (inputs[i].getAttribute('type')) {
						case 'hidden':
							inputs[i].parentNode.removeChild(inputs[i]);
							break;
						case 'file':
							hasFile = true; // flag the case for later
							break;
					}
					inputs[i] = null;
				}

				if (!hasFile) { // we need to keep the form for sake of possible retries
					form.parentNode.removeChild(form);
				}
				form = null;
			}

			// without timeout, request is marked as canceled (in console)
			setTimeout(function() { 
				events.removeEvent(_iframe, 'load', target.uid);
				if (_iframe.parentNode) { // #382
					_iframe.parentNode.removeChild(_iframe);
				}
				_iframe = null; 
				cb();
			}, 1);
		}

		o.extend(this, {
				
			send: function(meta, data) {
				var target = this, I = target.getRuntime(), uid, form, input, blob;

				_status = _response = null;

				function createIframe() {
					var container = I.getShimContainer() || document.body
					, temp = document.createElement('div')
					;

					// IE 6 won't be able to set the name using setAttribute or iframe.name
					temp.innerHTML = '<iframe id="' + uid + '_iframe" name="' + uid + '_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>';
					_iframe = temp.firstChild;
					container.appendChild(_iframe);

					/* _iframe.onreadystatechange = function() {
						console.info(_iframe.readyState);
					};*/

					events.addEvent(_iframe, 'load', function(e) { // _iframe.onload doesn't work in IE lte 8
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

						cleanup.call(this, function() {
							target.trigger({
								type: 'uploadprogress',
								loaded: blob && blob.size || 1025,
								total: blob && blob.size || 1025
							});
							target.trigger('load');
						});
					}, target.uid);
				} // end createIframe

				// prepare data to be sent and convert if required	
				if (data instanceof FormData) {
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
						if (value instanceof Blob) {
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

					temp = container = null;
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
				var target = this;

				if (_iframe && _iframe.contentWindow) {
					if (_iframe.contentWindow.stop) { // FireFox/Safari/Chrome
						_iframe.contentWindow.stop();
					} else if (_iframe.contentWindow.document.execCommand) { // IE
						_iframe.contentWindow.document.execCommand('Stop');
					} else {
						_iframe.src = "about:blank";
					}
				}

				cleanup.call(this, function() {
					// target.dispatchEvent('readystatechange');
					target.dispatchEvent('abort');
				});
			}
		});
	};
});