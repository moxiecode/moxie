define("runtime/html5/file/Blob", ["o", "file/Blob"], function(o, Blob) {

	return function() {

		function w3cBlobSlice(blob, start, end) {
			var blobSlice;
			
			if (window.File.prototype.slice) {
				try {
					blob.slice();	// depricated version will throw WRONG_ARGUMENTS_ERR exception
					return blob.slice(start, end);
				} catch (e) {
					// depricated slice method
					return blob.slice(start, end - start); 
				}
			// slice method got prefixed: https://bugzilla.mozilla.org/show_bug.cgi?id=649672	
			} else if (blobSlice = window.File.prototype.webkitSlice || window.File.prototype.mozSlice) {
				return blobSlice.call(blob, start, end);	
			} else {
				return null; // or throw some exception	
			}
		}

		this.slice = function() {
			return new Blob(I.uid, w3cBlobSlice.apply(this, arguments));
		};
	};
});
