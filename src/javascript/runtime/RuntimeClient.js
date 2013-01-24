/**
 * RuntimeClient.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, loopfunc:true */
/*global define:true */

define('moxie/runtime/RuntimeClient', [
	'moxie/core/Exceptions',
	'moxie/core/utils/Basic',
	'moxie/runtime/Runtime'
], function(x, Basic, Runtime) {
	/**
	Set of methods and properties, required by a component to acquire ability to connect to a runtime

	@class RuntimeClient
	*/
	return function() {
		var self = this, runtime;

		Basic.extend(this, {
			/**
			Connects to the runtime specified by the options. Will either connect to existing runtime or create a new one

			@method connectRuntime
			@param {Mixed} options Can be a runtme uid or a set of key-value pairs defining requirements and pre-requisites
			*/
			connectRuntime: function(options) {
				var ruid, i, construct, items = [], order;

				// check if a particular runtime was requested
				if (Basic.typeOf(options) === 'string') {
					ruid = options;
				} else if (Basic.typeOf(options.ruid) === 'string') {
					ruid = options.ruid;
				}

				if (ruid) {
					runtime = Runtime.getRuntime(ruid);

					if (runtime) {
						/*if (Basic.typeOf(self.trigger) === 'function') { // connectRuntime might be called on non eventTarget object
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
					construct = Runtime.getConstructor(items[i]);
					if (!construct) {
						continue;
					}

					// check if runtime supports required features
					if (!construct.can(options.required_caps)) {
						continue next_runtime; // runtime fails to support some features
					}

					// try initializing the runtime
					try {
						runtime = new construct(options);
						Runtime.registerRuntime(runtime.uid, runtime);

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


});