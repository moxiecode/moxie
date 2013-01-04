define("runtime/flash/image/Image", ["o", "runtime/Transporter", "file/Blob", "file/FileReaderSync"], function(o, Transporter, Blob, FileReaderSync) {

	return {
		loadFromBlob: function(blob) {
			var comp = this, self = comp.getRuntime();

			function exec(srcBlob) {
				self.shimExec.call(comp, 'Image', 'loadFromBlob', srcBlob.id);
			}

			if (blob.isDetached()) { // binary string
				var tr = new Transporter;
				tr.bind("TransportingComplete", function() {
					exec(tr.result.getSource());
				});
				tr.transport(blob.getSource(), blob.type, self.uid); 
			} else {
				exec(blob.getSource());
			}
		},

		loadFromImage: function(img, exact) {
			var self = comp.getRuntime();
			return self.shimExec.call(this, 'Image', 'loadFromImage', img.uid);
		},

		getAsBlob: function(type, quality) {
			var self = comp.getRuntime()
			, blob = self.shimExec.call(this, 'Image', 'getAsBlob', type, quality)
			;
			if (blob) {				
				return new Blob(self.uid, blob);
			}
			return null;
		},

		getAsDataURL: function(type, quality) {
			var self = comp.getRuntime()
			, blob = self.Image.getAsBlob.apply(this, arguments)
			, frs
			;
			if (!blob) {
				return null;
			}
			frs = new FileReaderSync;
			return frs.readAsDataURL(blob);
		}
	};
});