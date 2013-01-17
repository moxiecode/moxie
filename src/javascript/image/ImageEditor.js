/**
 * ImageEditor.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */
/*global define:true */

define("moxie/image/ImageEditor", [
	"moxie/core/Exceptions",
	"moxie/core/utils/Basic",
	"moxie&runtime/RuntimeClient"
], function(x, Basic, RuntimeClient) {
	function ImageEditor(image) {
		var self = this,
			ops = "rotate flipH flipV resize crop sharpen emboss".split(/\s+/);

		if (!image || !image.size) { // only preloaded image objects can be used as source
			throw new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);
		}

		RuntimeClient.call(this);

		Basic.each(ops, function(op) {
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