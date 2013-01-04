define("runtime/silverlight/file/FileInput", [], function() {
	return {
		init: function(options) {
			var self = this.getRuntime();
			
			function toFilters(accept) {
				var filter = '';
				for (i = 0; i < accept.length; i++) {
					filter += (filter != '' ? '|' : '') + accept[i].title + " | *." + accept[i].extensions.replace(/,/g, ';*.');
				}
				return filter;
			}
										
			return self.shimExec.call(this, 'FileInput', 'init', toFilters(options.accept), options.name, options.multiple);
		}
	};
});