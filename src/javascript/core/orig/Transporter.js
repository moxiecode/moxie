/**
 * name_of_the_file.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

// JSLint defined globals
/*global window:false, escape:false */

;(function(window, document, o, undefined) {
	
	
function Transporter() {
	var mod, _runtime, _data, _size, _pos, _chunk_size;
	
	o.RuntimeClient.call(this);	
		
	o.extend(this, {
		
		uid: 'uid_' + o.guid(),
		
		state: Transporter.IDLE,
		
		result: null,
		
		transport: function(data, type, options) {
			var self = this;

			options = o.extend({
				chunk_size: 204798 
			}, options);
			
			// should divide by three, base64 requires this
			if (mod = options.chunk_size % 3) {
				options.chunk_size += 3 - mod;	
			}

			_chunk_size = options.chunk_size;
					
			_reset.call(this);
			_data = data;
			_size = data.length;
			
			if (o.typeOf(options) === 'string' || options.ruid) {
				_run.call(self, type, this.connectRuntime(options));
			} else {
				// we require this to run only once
				var cb = function(e, runtime) {
					self.unbind("RuntimeInit", cb);
					_run.call(self, type, runtime);
				};
				this.bind("RuntimeInit", cb);
				this.connectRuntime(options);
			}
		},
		
		abort: function() {
			this.state = Transporter.IDLE;
			if (_runtime) {
				_runtime.exec.call(self, 'Transporter', 'clear');
				this.trigger("TransportingAborted");
			}
			_reset.call(this);
		},
		

		destroy: function() {
			_reset.call(this);
			this.unbindAll();
		},

		constructor: Transporter
		
	});
	
	function _reset() {
		_size = _pos = 0;
		_data = this.result = null;
	}


	function _run(type, runtime) {
		var self = this;

		_runtime = runtime;

		//self.unbind("RuntimeInit");
		
		self.bind("TransportingProgress", function(e) {	
			_pos = e.loaded;
			
			if (_pos < _size && o.inArray(self.state, [Transporter.IDLE, Transporter.DONE]) === -1) {
				_transport.call(self);
			}				
		}, 999);
		
		self.bind("TransportingComplete", function(e) {
			_pos = _size;
			self.state = Transporter.DONE;
			_data = null; // clean a bit
			self.result = _runtime.exec.call(self, 'Transporter', 'getAsBlob', type || '');
		}, 999);
		
		self.state = Transporter.BUSY;
		self.trigger("TransportingStarted");
		_transport.call(self);	
	}

	
	function _transport() {
		var self = this,
			chunk,
			bytesLeft = _size - _pos;
		
		if (_chunk_size > bytesLeft) {
			_chunk_size = bytesLeft;	
		}
		
		chunk = o.btoa(_data.substr(_pos, _chunk_size));	
		_runtime.exec.call(self, 'Transporter', 'receive', chunk, _size);
	}
}

Transporter.IDLE = 0;
Transporter.BUSY = 1;
Transporter.DONE = 2;

Transporter.prototype = o.eventTarget;

o.Transporter = Transporter;
		
}(window, document, mOxie));