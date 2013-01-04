define("runtime/silverlight/file/FileDrop", ["o", "core/utils/events"], function(o, events) {
	// not exactly useful, since works only in safari (...crickets...)
	return {
		init: function() {
			var comp = this, self = comp.getRuntime(), dropZone;

			dropZone = self.getShimContainer();

			events.addEvent(dropZone, 'dragover', function(e) {
				e.preventDefault();
				e.stopPropagation();
				e.dataTransfer.dropEffect = 'copy'; 
			}, comp.uid);

			events.addEvent(dropZone, 'dragenter', function(e) {
				e.preventDefault();
				var flag = o(self.uid).dragEnter(e);
			    // If handled, then stop propagation of event in DOM
			    if (flag) e.stopPropagation();
			}, comp.uid);

			events.addEvent(dropZone, 'drop', function(e) {
				e.preventDefault();
				var flag = o(self.uid).dragDrop(e);
			    // If handled, then stop propagation of event in DOM
			    if (flag) e.stopPropagation();
			}, comp.uid);

			return self.shimExec.call(this, 'FileDrop', 'init');
		}
	};
});