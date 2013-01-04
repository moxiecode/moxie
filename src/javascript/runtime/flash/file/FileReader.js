define("runtime/flash/file/FileReader", ["o", "core/utils/encode"], function(o, encode) {

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
			var comp = this, self = comp.getRuntime();
			
			// special prefix for DataURL read mode	
			if (op === 'readAsDataURL') {
				comp.result = 'data:' + (blob.type || '') + ';base64,';	
			}
											
			comp.bind('Progress', function(e, data) {			
				if (data) {
					comp.result += _formatData(data, op);	
				}
			}, 999);
			
			return self.shimExec.call(this, 'FileReader', 'readAsBase64', blob.getSource().id);
		}
	};
});