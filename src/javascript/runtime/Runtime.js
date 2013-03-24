/**
 * Runtime.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, laxcomma:true */
/*global define:true */

define('moxie/runtime/Runtime', [
	"moxie/core/utils/Basic",
	"moxie/core/utils/Dom",
	"moxie/core/EventTarget"
], function(Basic, Dom, EventTarget) {
	var runtimeConstructors = {}, runtimes = {};

	/**
	Common set of methods and properties for every runtime instance

	@class Runtime
	*/
	function Runtime(type, options) {
		/**
		Dispatched when runtime is initialized and ready.
		Triggers RuntimeInit on a connected component.

		@event Init
		*/
		var self = this
		, uid = Basic.guid(type + '_')
		, shimid = uid + '_container'
		;

		// register runtime in private hash
		runtimes[uid] = this;

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
				return Dom.get(this.uid);
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
				uid = shimid = self = null;
			}

		});
	}

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
	Runtime.addConstructor = function(type, construct) {
		construct.prototype = EventTarget.instance;
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
		resize_image: false,
		report_upload_progress: false,
		return_response_headers: true,
		return_response_type: false,
		return_status_code: true,
		send_custom_headers: false,
		select_folder: false,
		select_multiple: true,
		send_binary_string: false,
		send_browser_cookies: true,
		send_multipart: true,
		slice_blob: false,
		stream_upload: false,
		summon_file_dialog: false,
		upload_filesize: true,
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
	Runtime.can = function(runtimeCaps, cap, value) {
		if (!cap || Basic.typeOf(cap) === 'object' && Basic.isEmptyObj(cap)) {
			return true;
		}

		// if cap var is a comma-separated list of caps, convert it to object (key/value)
		if (Basic.typeOf(cap) === 'string' && value === undefined) {
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
				if (!Runtime.can.call(this, runtimeCaps, key, cap[key])) {
					return false;
				}
			}

			return true;
		}

		// check the individual cap
		if (Basic.typeOf(runtimeCaps[cap]) === 'function') {
			return runtimeCaps[cap].call(this, value);
		}

		return runtimeCaps[cap];
	};

	return Runtime;
});