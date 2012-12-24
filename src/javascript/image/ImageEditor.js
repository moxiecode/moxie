define("image/ImageEditor", ["o", "runtime/RuntimeClient"], function(o, RuntimeClient) {

	var x = o.Exceptions;

	function ImageEditor(image) {
		var self = this,
			ops = "rotate flipH flipV resize crop sharpen emboss".split(/\s+/);

		if (!image || !image.size) { // only preloaded image objects can be used as source
			throw new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);	
		}

		RuntimeClient.call(this);

		o.each(ops, function(op) {
			self[op] = function() {
				var runtime;
				
				if (!this.ruid) {
					throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);	
				}

				runtime = this.connectRuntime(this.ruid);
				runtime.exec.call(self, 'ImageEditor', op);	

				return self; // support chaining
			};
		});

	}

	return ImageEditor;
});