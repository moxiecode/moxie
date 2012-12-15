/**
 * Runtime.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

;(function(window, document, o, undefined) {
	
var x = o.Exceptions
, runtimeConstructors = {}
, runtimes = {}
;
	
/**
Common set of methods and properties for every runtime instance

@class Runtime
*/
function Runtime(options, type) {
	/**
	Dispatched when runtime is initialized and ready. 
	Triggers RuntimeInit on a connected component.

	@event Init
	*/
	var self = this
	, uid = o.guid(type + '_')
	, shimid =  uid + '_container'
	;
		
		
	// public methods				
	o.extend(this, {
		
		/**
		Specifies whether runtime instance was initialized or not

		@property initialized
		@type {Boolean}
		@default false
		*/
		initialized: false, // shims require this flag to stop initialization retries
		
		/**
		Unique ID of the runtime

		@property uid
		@type {String}
		*/
		uid: uid,
		
		/**
		Runtime type (e.g. flash, html5, etc)

		@property type
		@type {String}
		*/
		type: type,
		
		/**
		id of the DOM container for the runtime (if available)

		@property shimid
		@type {String}
		*/				
		shimid: shimid,

		/**
		Runtime initialization options

		@property options
		@type {Object}
		*/
		options: options,

		/**
		Checks if the runtime has specific capability

		@method can
		@param {String} cap Name of capability to check
		@param {Mixed} [value] If passed, capability should somehow correlate to the value 
		@return {Boolean} true if runtime has such capability and false, if - not
		*/
		can: function() {
			return self.constructor.can.apply(self, arguments);
		},
		
		/**
		Returns container for the runtime as DOM element

		@method getShimContainer 
		@return {DOMElement} 
		*/
		getShimContainer: function() {
			var container, shimContainer = o(this.shimid);

			// if no container for shim, create one
			if (!shimContainer) {
				container = options.container ? o(options.container) : document.body;	
					
				// create shim container and insert it at an absolute position into the outer container
				shimContainer = document.createElement('div');
				shimContainer.id = this.shimid;
				shimContainer.className = 'mOxie-shim mOxie-shim-' + type;
				
				o.extend(shimContainer.style, {
					position: 'absolute',
					top: '0px',
					left: '0px',
					width: '1px',
					height: '1px',
					overflow: 'hidden'
				});
				
				container.appendChild(shimContainer);	
				container = null;
			}

			return shimContainer;
		},
		
		/**
		Returns runtime as DOM element (if appropriate)

		@method getShim
		@return {DOMElement}
		*/
		getShim: function() {
			return o(this.uid);
		},

		
		/**
		Operaional interface that is used by components to invoke specific actions on the runtime
		(is invoked in the scope of component)

		@method exec
		@param {Mixed} []*
		@protected
		@return {Mixed} Depends on the action and component
		*/
		exec: function(component, action) { // this is called in the context of component, not runtime
			var args = [].slice.call(arguments, 2);
			
			if (self[component] && self[component][action]) {
				return self[component][action].apply(this, args);
			}
			return self.shimExec.apply(this, arguments);
		},

		/**
		Invokes a method within the runtime itself (might differ across the runtimes)

		@method shimExec
		@param {Mixed} []
		@protected
		@return {Mixed} Depends on the action and component
		*/
		shimExec: function(component, action) {
			var args = [].slice.call(arguments, 2);
			return self.getShim().exec(this.uid, component, action, args);	
		},
		
		/**
		Destroys the runtime (removes all events and deletes DOM structures)

		@method destroy
		*/
		destroy: function() {
			var shimContainer = this.getShimContainer();
			if (shimContainer) {
				shimContainer.parentNode.removeChild(shimContainer);
				shimContainer = null;
			}			

			this.unbindAll();
			delete runtimes[this.uid];
		}
		
	});		
}

/**
Registers runtime in private hash

@method registerRuntime
@private
@param {String} uid Unique identifier of the runtime
@param {Runtime} runtime Runtime object to register
@return {Runtime}
*/
function registerRuntime(uid, runtime) {			
	runtimes[uid] = runtime;
	return runtime;
}
	
/**
Retrieves runtime from private hash by it's uid

@method getRuntime
@private
@param {String} uid Unique identifier of the runtime
@return {Runtime|Boolean} Returns runtime, if it exists and false, if - not
*/		
function getRuntime(uid) {
	return runtimes[uid] ? runtimes[uid] : false;	
}

/**
Register constructor for the Runtime of new (or perhaps modified) type

@method addConstructor
@static
@param {String} type Runtime type (e.g. flash, html5, etc)
@param {Function} construct Constructor function for the Runtime
*/
Runtime.addConstructor = function(type, construct) {
	construct.prototype = o.eventTarget;	
	runtimeConstructors[type] = construct;
};


Runtime.getConstructor = function(type) {
	return runtimeConstructors[type] || null;
};

/**
Get info about the runtime (uid, type, capabilities)

@method getInfo
@static
@param {String} uid Unique identifier of the runtime
@return {Mixed} Info object or null if runtime doesn't exist
*/
Runtime.getInfo = function(uid) {
	var runtime = getRuntime(uid);
	
	if (runtime) {
		return {
			uid: runtime.uid,
			type: runtime.type,
			can: runtime.can
		}
	}
	return null;
};

/**
Default order to try different runtime types

@property order
@type String
@static
*/
Runtime.order = 'html5,flash,silverlight,html4';

/**
Default set of capabilities, which can be redifined later by specific runtime

@property caps
@type Object
@static
*/
Runtime.caps = {
	access_binary: true,
	display_media: false,
	drag_and_drop: false,
	receive_response_type: false,
	resize_image: false,
	report_upload_progress: false,
	return_response_headers: true,
	send_custom_headers: false,
	select_multiple: true,
	send_binary_string: false,
	send_multipart: true,
	slice_blob: false,
	stream_upload: false,	
	summon_file_dialog: false,
	upload_filesize: function(size) {
		return o.parseSizeStr(size) <= 2097152;	// 200mb
	},
	use_http_method: true
};

/**
Transient method, which is invoked internally on a runtime constructor of specific type,
is meant to tell whether the querried runtime has specific capability.

@method can
@protected
@static
@property {Object} runtimeCaps Reference to runtime's all capabilities
@property {String} cap Name of a capability to check
@property {Mixed} [value] If passed, capability will be checked against the value
*/
Runtime.can = function can(runtimeCaps, cap, value) {
	if (!cap || o.typeOf(cap) === 'object' && o.isEmptyObj(cap)) {
		return true;
	}

	// if cap var is a comma-separated list of caps, convert it to object (key/value)
	if (o.typeOf(cap) === 'string' && value === undefined) {
		cap = (function(arr) {
			var obj = {};
			o.each(arr, function(key) {
				obj[key] = true; // since no value supplied, we assume user meant it to be - true
			});
			return obj;
		}(cap.split(',')));
	}

	if (o.typeOf(cap) === 'object') {
		for (var key in cap) {
			if (!Runtime.can.call(this, runtimeCaps, key, cap[key])) { 
				return false;
			}
		}
		return true;
	}

	// check the individual cap	
	if (o.typeOf(runtimeCaps[cap]) === 'function') {
		return runtimeCaps[cap].call(this, value);
	}
	return runtimeCaps[cap];
};
	
o.Runtime = Runtime;

	
/**
Set of methods and properties, required by a component to acquire ability to connect to a runtime

@class RuntimeClient
*/
o.RuntimeClient = function() { 
	var self = this, runtime;
	
	o.extend(this, {
		
		/**
		Connects to the runtime specified by the options. Will either connect to existing runtime or create a new one

		@method connectRuntime
		@param {Mixed} options Can be a runtme uid or a set of key-value pairs defining requirements and pre-requisites
		*/
		connectRuntime: function(options) {
			var ruid, i, type, construct, items = [], order, features, key;
									
			// check if a particular runtime was requested
			if (o.typeOf(options) === 'string') {
				ruid = options;	
			} else if (o.typeOf(options.ruid) === 'string') {
				ruid = options.ruid;	
			}
			
			if (ruid) {
				runtime = getRuntime(ruid);
				
				if (runtime) {
					/*if (o.typeOf(self.trigger) === 'function') { // connectRuntime might be called on non eventTarget object
						self.trigger('RuntimeInit', runtime);	
					}*/
					return runtime;
				} else {
					throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);	
				}						
			}
			
			// initialize a fresh one, that fits runtime list and required features best
			order = options.runtime_order || Runtime.order;			
			
			items = order.split(/\s?,\s?/);
			
			next_runtime: 
			for (i in items) {
				type = items[i];
				
				if (!runtimeConstructors[type]) {
					continue;	
				}
				construct = runtimeConstructors[type];
					
				// check if runtime supports required features
				if (!construct.can(options.required_caps)) { 
					continue next_runtime; // runtime fails to support some features
				}
	
				// try initializing the runtime
				try {
					runtime = new construct(options);
					registerRuntime(runtime.uid, runtime);
					
					runtime.bind('Init', function() {									
						// mark runtime as initialized
						runtime.initialized = true;
						
						runtime.constructor = construct;

						// jailbreak ...
						setTimeout(function() {
							// this will be triggered on component
							self.trigger('RuntimeInit', runtime);
						}, 1);
					});
					
					runtime.bind('Exception', function() {
						// console.info(arguments);
					});
					
					runtime.init();
					return;	
				} catch(err) {
					// destroy failed runtime's remnants and proceed to the next one
					if (runtime) {
						runtime.destroy();
					}
				}
			}
			
			// if we ran out of runtimes
			throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);
		},

		getRuntime: function() {
			return runtime || null;
		},
		
		/**
		Disconnect from the runtime

		@method disconnectRuntime
		*/
		disconnectRuntime: function() {
			
			// check if runtime not occupied
			
			// destroy runtime if not
			
			// unregister runtime
			
		}
		
	});	
};

/**
Instance of this class can be used as a target for the events dispatched by shims,
when allowing them onto components is for either reason inappropriate

@class RuntimeTarget
@constructor
@protected
@extends EventTarget
*/
o.RuntimeTarget = (function() {
	function RuntimeTarget() {
		this.uid = o.guid('uid_');	
		o.RuntimeClient.call(this);
	}
	
	RuntimeTarget.prototype = o.eventTarget;
	
	return RuntimeTarget;
}());
		
		
}(window, document, mOxie));