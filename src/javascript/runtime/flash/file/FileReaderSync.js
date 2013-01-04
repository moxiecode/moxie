define("runtime/flash/file/FileReaderSync", ["o", "core/utils/encode"], function(o, encode) {

	function _formatData(data, op, type) {
		switch (op) {
			case 'readAsText':
			case 'readAsBinaryString': 
				return encode.atob(data);
			
			case 'readAsDataURL':
				return data;
			
		}
		return null;
	}

	return {
		read : function(op, blob) {
			var result, self = this.getRuntime();
									
			result = self.shimExec.call(this, 'FileReaderSync', 'readAsBase64', blob.getSource().id);
			if (!result) {
				return null; // or throw ex
			}

			// special prefix for DataURL read mode	
			if (op === 'readAsDataURL') {
				result = 'data:' + (blob.type || '') + ';base64,' + result;	
			}
			
			return _formatData(result, op, blob.type);
		}
	};
});