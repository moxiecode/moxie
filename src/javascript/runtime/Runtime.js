/**
 * Runtime.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define('moxie/runtime/Runtime', [
	"moxie/core/utils/Basic",
	"moxie/core/utils/Dom",
	"moxie/core/EventTarget"
], function(Basic, Dom, EventTarget) {
	var runtimeConstructors = {}, runtimes = {};

	/**
	Common set of methods and properties for every runtime instance

	@class Runtime

	@param {Object} options
	@param {String} type Sanitized name of the runtime
	@param {Object} [caps] Set of capabilities that differentiate specified runtime
	@param {Object} [clientCaps] Set of capabilities that implicitly switch the runtime to 'client' mode
	@param {String} [defaultMode='browser'] Default operational mode to choose if no required capabilities were requested
	*/
	function Runtime(options, type, caps, clientCaps, defaultMode) {
		/**
		Dispatched when runtime is initialized and ready.
		Results in RuntimeInit on a connected component.

		@event Init
		*/

		/**
		Dispatched when runtime fails to initialize.
		Results in RuntimeError on a connected component.

		@event Error
		*/

		var self = this
		, _shim
		, _uid = Basic.guid(type + '_')
		, _mode = null
		;

		/**
		Runtime (not native one) may operate in browser or client mode.
		
		@method _setMode
		@private
		@param {Object} [clientCaps] Set of capabilities that require client mode
		@param {Object} [defaultMode] The mode to switch to if clientCaps or requiredCaps are empty
		*/
		function _setMode(clientCaps, defaultMode) {
			var self = this
			, rc = options && options.required_caps
			;

			// mode can be effectively set only once
			if (_mode !== null) {
				return _mode;
			}

			if (rc && !Basic.isEmptyObj(clientCaps)) {
				// loop over required caps and check if they do require the same mode
				Basic.each(rc, function(value, cap) {
					if (clientCaps.hasOwnProperty(cap)) {
						var capMode = self.can(cap, value, clientCaps) ? 'client' : 'browser';
						// if cap requires conflicting mode - runtime cannot fulfill required caps
						if (_mode && _mode !== capMode) {
							return (_mode = false);
						} else {
							_mode = capMode;
						}
					}
				});
			} 

			// if mode still not defined
			if (_mode === null) {
				_mode = defaultMode || 'browser';
			}

			// once we got the mode, test against all caps
			if (_mode && rc && !this.can(rc)) {
				_mode = false;
			}	
		}

		// register runtime in private hash
		runtimes[_uid] = this;

		/**
		Default set of capabilities, which can be redifined later by specific runtime

		@private
		@property caps
		@type Object
		*/
		caps = Basic.extend({
			// Runtime can provide access to raw binary data of the file
			access_binary: false,
			// ... provide access to raw binary data of the image (image extension is optional) 
			access_image_binary: false,
			// ... display binary data as thumbs for example
			display_media: false,
			// ... make cross-domain requests
			do_cors: false,
			// ... accept files dragged and dropped from the desktop
			drag_and_drop: false,
			// ... resize image (and manipulate it raw data of any file in general)
			resize_image: false,
			// ... periodically report how many bytes of total in the file were uploaded (loaded)
			report_upload_progress: false,
			// ... provide access to the headers of http response 
			return_response_headers: false,
			// ... support response of specific type, which should be passed as an argument
			// e.g. runtime.can('return_response_type', 'blob')
			return_response_type: false,
			// ... return http status code of the response
			return_status_code: true,
			// ... send custom http header with the request
			send_custom_headers: false,
			// ... select whole folder in file browse dialog
			select_folder: false,
			// ... select multiple files at once in file browse dialog
			select_multiple: true,
			// ... send raw binary data, that is generated after image resizing or manipulation of other kind
			send_binary_string: false,
			// ... send cookies with http request and therefore retain session
			send_browser_cookies: true,
			// ... send data formatted as multipart/form-data
			send_multipart: true,
			// ... slice the file or blob to smaller parts
			slice_blob: false,
			// ... upload file without preloading it to memory, stream it out directly from disk
			stream_upload: false,
			// ... programmatically trigger file browse dialog
			summon_file_dialog: false,
			// ... upload file of specific size, size should be passed as argument
			// e.g. runtime.can('upload_filesize', '500mb')
			upload_filesize: true,
			// ... initiate http request with specific http method, method should be passed as argument
			// e.g. runtime.can('use_http_method', 'put')
			use_http_method: true
		}, caps);
		
		// small extension factory here (is meant to be extended with actual extensions constructors)
		_shim = (function() {
			var objpool = {};

			return {
				exec: function(uid, comp, fn, args) {
					if (_shim[comp]) {
						if (!objpool[uid]) {
							objpool[uid] = {
								context: this,
								instance: new _shim[comp]()
							};
						}

						if (objpool[uid].instance[fn]) {
							return objpool[uid].instance[fn].apply(this, args);
						}
					}
				},

				removeInstance: function(uid) {
					delete objpool[uid];
				},

				removeAllInstances: function() {
					var self = this;
					
					Basic.each(objpool, function(obj, uid) {
						if (Basic.typeOf(obj.instance.destroy) === 'function') {
							obj.instance.destroy.call(obj.context);
						}
						self.removeInstance(uid);
					});
				}
			};
		}());


		// public methods
		Basic.extend(this, {
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
			uid: _uid,

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
			shimid: _uid + '_container',

			/**
			Number of connected clients. If equal to zero, runtime can be destroyed

			@property clients
			@type {Number}
			*/
			clients: 0,

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
			@param {Object} [refCaps] Set of capabilities to check the specified cap against (defaults to internal set)
			@return {Boolean} true if runtime has such capability and false, if - not
			*/
			can: function(cap, value) {
				var refCaps = arguments[2] || caps;

				// if cap var is a comma-separated list of caps, convert it to object (key/value)
				if (Basic.typeOf(cap) === 'string' && Basic.typeOf(value) === 'undefined') {
					cap = (function(arr) {
						var obj = {};

						Basic.each(arr, function(key) {
							obj[key] = true; // since no value supplied, we assume user meant it to be - true
						});

						return obj;
					}(cap.split(',')));
				}

				if (Basic.typeOf(cap) === 'object') {
					for (var key in cap) {
						if (!this.can(key, cap[key], refCaps)) {
							return false;
						}
					}
					return true;
				}

				// check the individual cap
				if (Basic.typeOf(refCaps[cap]) === 'function') {
					return refCaps[cap].call(this, value);
				}

				// for boolean values we check absolute equality
				return Basic.typeOf(value) === 'boolean' ? refCaps[cap] === value : refCaps[cap];
			},
			

			/**
			Runtime (not native one) may operate in browser or client mode.

			@method getMode
			@return {String|Boolean} current mode or false, if none possible
			*/
			getMode: function() {
				return _mode || false;
			},


			/**
			Returns container for the runtime as DOM element

			@method getShimContainer
			@return {DOMElement}
			*/
			getShimContainer: function() {
				var container, shimContainer = Dom.get(this.shimid);

				// if no container for shim, create one
				if (!shimContainer) {
					container = this.options.container ? Dom.get(this.options.container) : document.body;

					// create shim container and insert it at an absolute position into the outer container
					shimContainer = document.createElement('div');
					shimContainer.id = this.shimid;
					shimContainer.className = 'moxie-shim moxie-shim-' + this.type;

					Basic.extend(shimContainer.style, {
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
				return _shim;
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
				return self.getShim().exec.call(this, this.uid, component, action, args);
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
			Destroys the runtime (removes all events and deletes DOM structures)

			@method destroy
			*/
			destroy: function() {
				var shimContainer = Dom.get(this.shimid);
				if (shimContainer) {
					shimContainer.parentNode.removeChild(shimContainer);
				}

				if (_shim) {
					_shim.removeAllInstances();
				}

				this.unbindAll();
				delete runtimes[this.uid];
				_uid = self = _shim = _mode = shimContainer = null;
			}
		});

		_setMode.call(this, clientCaps, defaultMode);
	}

	/**
	Default order to try different runtime types

	@property order
	@type String
	@static
	*/
	Runtime.order = 'html5,flash,silverlight,html4';


	/**
	Retrieves runtime from private hash by it's uid

	@method getRuntime
	@private
	@static
	@param {String} uid Unique identifier of the runtime
	@return {Runtime|Boolean} Returns runtime, if it exists and false, if - not
	*/
	Runtime.getRuntime = function(uid) {
		return runtimes[uid] ? runtimes[uid] : false;
	};

	/**
	Register constructor for the Runtime of new (or perhaps modified) type

	@method addConstructor
	@static
	@param {String} type Runtime type (e.g. flash, html5, etc)
	@param {Function} construct Constructor function for the Runtime
	*/
	Runtime.addConstructor = function(type, constructor) {
		constructor.prototype = EventTarget.instance;
		runtimeConstructors[type] = constructor;
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
		var runtime = Runtime.getRuntime(uid);

		if (runtime) {
			return {
				uid: runtime.uid,
				type: runtime.type,
				can: runtime.can
			};
		}

		return null;
	};

	return Runtime;
});
