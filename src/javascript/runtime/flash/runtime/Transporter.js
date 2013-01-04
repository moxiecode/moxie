define("runtime/flash/runtime/Transporter", ["file/Blob"], function(Blob) {
	return {
		getAsBlob: function(type) {
			var self = this.getRuntime()
			, blob = self.shimExec.call(this, 'Transporter', 'getAsBlob', type)
			;
			if (blob) {				
				return new Blob(self.uid, blob);
			}
			return null;
		}
	};
});