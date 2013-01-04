define("runtime/html5/file/FileInput", ["o", "core/utils/dom", "core/utils/events"], function(o, dom, events) {

	return function() {
		var _uid, _files = [], _mimes = [], _options;

		function addInput() {
			var comp = this, I = comp.getRuntime(), shimContainer, browseButton, currForm, form, input, uid;

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

		o.extend(this, {
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
		});
	};
});