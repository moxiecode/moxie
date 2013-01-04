define("runtime/flash/xhr/XMLHttpRequest", [
		"o", 
		"file/Blob", 
		"file/File",
		"file/FileReaderSync",
		"xhr/FormData", 
		"runtime/Transporter"
	], 
	function(o, Blob, File, FileReaderSync, FormData, Transporter) {

	return {
		send: function(meta, data) {
			var target = this, self = target.getRuntime();

			function send() {
				self.shimExec.call(target, 'XMLHttpRequest', 'send', meta, data);
			}

			function appendBlob(name, blob) {
				self.shimExec.call(target, 'XMLHttpRequest', 'appendBlob', name, blob.getSource().id);
				data = null;
				send();
			}

			function attachBlob(name, blob) {
				var tr = new Transporter;

				tr.bind("TransportingComplete", function() {
					appendBlob(name, this.result);
				});

				tr.transport(blob.getSource(), blob.type, {
					ruid: self.uid
				});
			}

			// copy over the headers if any
			if (!o.isEmptyObj(meta.headers)) {
				o.each(_headers, function(value, header) {
					self.shimExec.call(target, 'XMLHttpRequest', 'setRequestHeader', name, value.toString()); // Silverlight doesn't accept integers into the arguments of type object
				});
			}


			// transfer over multipart params and blob itself
			if (data instanceof FormData) { 
				o.each(data._fields, function(value, name) {
					if (!(value instanceof Blob)) {
						self.shimExec.call(target, 'XMLHttpRequest', 'append', name, value.toString());
					}
				});

				if (!data._blob) {
					data = null;
					send();
				} else {
					var blob = data._fields[data._blob];
					if (blob.isDetached()) {
						attachBlob(data._blob, blob);
					} else {
						appendBlob(data._blob, blob);
					}
				}
			} else if (data instanceof o.Blob) {
				data = data.uid; // something wrong here									
			} else {
				send();
			}												
		},

		getResponse: function(responseType) {
			var blob, response, self = this.getRuntime();

			blob = self.shimExec.call(this, 'XMLHttpRequest', 'getResponseAsBlob');

			if (blob) {
				blob = new File(self.uid, blob);

				if ('blob' === responseType) {
					return blob;
				} else if (!!~o.inArray(responseType, ["", "text"])) {
					var frs = new FileReaderSync;
					return frs.readAsText(blob);
				} else if ('arraybuffer' === responseType) {

					// do something
				
				} else if ('json' === responseType) {
					var frs = new FileReaderSync;

					this.bind('Exception', function(e, err) {
						// throw JSON parse error
						console.info(err);
					});

					return o.JSON.parse(frs.readAsText(blob));
				} 
			}
			return null;
		},

		abort: function(upload_complete_flag) {
			var self = this.getRuntime();

			self.shimExec.call(this, 'XMLHttpRequest', 'abort');

			this.dispatchEvent('readystatechange');
			// this.dispatchEvent('progress');
			this.dispatchEvent('abort');

			if (!upload_complete_flag) {
				// this.dispatchEvent('uploadprogress');
			}
		}
	};
});