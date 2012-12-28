define("runtime/html5/file/FileInput", ["o", "core/utils/dom", "core/utils/events"], function(o, dom, events) {

	return function() {
		var _files = [];

		o.extend(this, {
			init: function() {
				var comp = this, I = this.getRuntime(), dropZone = options.container;

				// Safari on Windows has drag/drop problems, so we fake it by moving a input type file 
				// in front of the mouse pointer when we drag into the drop zone
				// TODO: Remove this logic once Safari has proper drag/drop support
				if (o.ua.browser === "Safari" && o.ua.OS === "Windows" && o.ua.version < 5.2) {
					if (dom.getStyle(dropZone, 'position') === 'static') {
						o.extend(dropZone.style, {
							position : 'relative'
						});
					}

					events.addEvent(dropZone, 'dragenter', function(e) {
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


					events.addEvent(dropZone, 'dragleave', function(e) {
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

				events.addEvent(dropZone, 'dragover', function(e) {
					e.preventDefault();
					e.stopPropagation();
					e.dataTransfer.dropEffect = 'copy'; 
				}, comp.uid);


				events.addEvent(dropZone, 'drop', function(e) {
					e.preventDefault();
					e.stopPropagation();
					_files = e.dataTransfer.files; 
					comp.trigger("drop");
				}, comp.uid);

				events.addEvent(dropZone, 'dragenter', function(e) {
					e.preventDefault();
					e.stopPropagation();
					comp.trigger("dragenter");
				}, comp.uid);

				events.addEvent(dropZone, 'dragleave', function(e) {
					e.preventDefault();
					e.stopPropagation();
					comp.trigger("dragleave");
				}, comp.uid);
			},

			getFiles: function() {
				return _files;
			}
		};
		});
	};
});