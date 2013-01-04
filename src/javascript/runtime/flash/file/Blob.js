define("runtime/flash/file/Blob", ["o", "file/Blob"], function(o, Blob) {
	return {
		slice: function(blob, start, end, type) {
			var self = this.getRuntime();
			
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
				blob = new Blob(self.uid, blob);
			}
			return blob;
		}
	};
});