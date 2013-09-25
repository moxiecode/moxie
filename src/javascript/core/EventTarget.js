/**
 * EventTarget.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define('moxie/core/EventTarget', [
	'moxie/core/Exceptions',
	'moxie/core/utils/Basic'
], function(x, Basic) {
	/**
	Parent object for all event dispatching components and objects

	@class EventTarget
	@constructor EventTarget
	*/
	function EventTarget() {
		// hash of event listeners by object uid
		var eventpool = {};
				
		Basic.extend(this, {
			
			/**
			Unique id of the event dispatcher, usually overriden by children

			@property uid
			@type String
			*/
			uid: null,
			
			/**
			Can be called from within a child  in order to acquire uniqie id in automated manner

			@method init
			*/
			init: function() {
				if (!this.uid) {
					this.uid = Basic.guid('uid_');
				}
			},

			/**
			Register a handler to a specific event dispatched by the object

			@method addEventListener
			@param {String} type Type or basically a name of the event to subscribe to
			@param {Function} fn Callback function that will be called when event happens
			@param {Number} [priority=0] Priority of the event handler - handlers with higher priorities will be called first
			@param {Object} [scope=this] A scope to invoke event handler in
			*/
			addEventListener: function(type, fn, priority, scope) {
				var self = this, list;
				
				type = Basic.trim(type);
				
				if (/\s/.test(type)) {
					// multiple event types were passed for one handler
					Basic.each(type.split(/\s+/), function(type) {
						self.addEventListener(type, fn, priority, scope);
					});
					return;
				}
				
				type = type.toLowerCase();
				priority = parseInt(priority, 10) || 0;
				
				list = eventpool[this.uid] && eventpool[this.uid][type] || [];
				list.push({fn : fn, priority : priority, scope : scope || this});
				
				if (!eventpool[this.uid]) {
					eventpool[this.uid] = {};
				}
				eventpool[this.uid][type] = list;
			},
			
			/**
			Check if any handlers were registered to the specified event

			@method hasEventListener
			@param {String} type Type or basically a name of the event to check
			@return {Mixed} Returns a handler if it was found and false, if - not
			*/
			hasEventListener: function(type) {
				return type ? !!(eventpool[this.uid] && eventpool[this.uid][type]) : !!eventpool[this.uid];
			},
			
			/**
			Unregister the handler from the event, or if former was not specified - unregister all handlers

			@method removeEventListener
			@param {String} type Type or basically a name of the event
			@param {Function} [fn] Handler to unregister
			*/
			removeEventListener: function(type, fn) {
				type = type.toLowerCase();
	
				var list = eventpool[this.uid] && eventpool[this.uid][type], i;
	
				if (list) {
					if (fn) {
						for (i = list.length - 1; i >= 0; i--) {
							if (list[i].fn === fn) {
								list.splice(i, 1);
								break;
							}
						}
					} else {
						list = [];
					}
	
					// delete event list if it has become empty
					if (!list.length) {
						delete eventpool[this.uid][type];
						
						// and object specific entry in a hash if it has no more listeners attached
						if (Basic.isEmptyObj(eventpool[this.uid])) {
							delete eventpool[this.uid];
						}
					}
				}
			},
			
			/**
			Remove all event handlers from the object

			@method removeAllEventListeners
			*/
			removeAllEventListeners: function() {
				if (eventpool[this.uid]) {
					delete eventpool[this.uid];
				}
			},
			
			/**
			Dispatch the event

			@method dispatchEvent
			@param {String/Object} Type of event or event object to dispatch
			@param {Mixed} [...] Variable number of arguments to be passed to a handlers
			@return {Boolean} true by default and false if any handler returned false
			*/
			dispatchEvent: function(type) {
				var uid, list, args, tmpEvt, evt = {}, result = true;
				
				if (Basic.typeOf(type) !== 'string') {
					// we can't use original object directly (because of Silverlight)
					tmpEvt = type;

					if (Basic.typeOf(tmpEvt.type) === 'string') {
						type = tmpEvt.type;

						if (tmpEvt.total && tmpEvt.loaded) { // progress event
							evt.total = tmpEvt.total;
							evt.loaded = tmpEvt.loaded;
						}
						evt.async = tmpEvt.async || false;
					} else {
						throw new x.EventException(x.EventException.UNSPECIFIED_EVENT_TYPE_ERR);
					}
				}
				
				// check if event is meant to be dispatched on an object having specific uid
				if (type.indexOf('::') !== -1) {
					(function(arr) {
						uid = arr[0];
						type = arr[1];
					}(type.split('::')));
				} else {
					uid = this.uid;
				}
				
				type = type.toLowerCase();
								
				list = eventpool[uid] && eventpool[uid][type];

				if (list) {
					// sort event list by prority
					list.sort(function(a, b) { return b.priority - a.priority; });
					
					args = [].slice.call(arguments);
					
					// first argument will be pseudo-event object
					args.shift();
					evt.type = type;
					args.unshift(evt);

					// Dispatch event to all listeners
					var queue = [];
					Basic.each(list, function(handler) {
						// explicitly set the target, otherwise events fired from shims do not get it
						args[0].target = handler.scope;
						// if event is marked as async, detach the handler
						if (evt.async) {
							queue.push(function(cb) {
								setTimeout(function() {
									cb(handler.fn.apply(handler.scope, args) === false);
								}, 1);
							});
						} else {
							queue.push(function(cb) {
								cb(handler.fn.apply(handler.scope, args) === false); // if handler returns false stop propagation
							});
						}
					});
					if (queue.length) {
						Basic.inSeries(queue, function(err) {
							result = !err;
						});
					}
				}
				return result;
			},
			
			/**
			Alias for addEventListener

			@method bind
			@protected
			*/
			bind: function() {
				this.addEventListener.apply(this, arguments);
			},
			
			/**
			Alias for removeEventListener

			@method unbind
			@protected
			*/
			unbind: function() {
				this.removeEventListener.apply(this, arguments);
			},
			
			/**
			Alias for removeAllEventListeners

			@method unbindAll
			@protected
			*/
			unbindAll: function() {
				this.removeAllEventListeners.apply(this, arguments);
			},
			
			/**
			Alias for dispatchEvent

			@method trigger
			@protected
			*/
			trigger: function() {
				return this.dispatchEvent.apply(this, arguments);
			},
			
			
			/**
			Converts properties of on[event] type to corresponding event handlers,
			is used to avoid extra hassle around the process of calling them back

			@method convertEventPropsToHandlers
			@private
			*/
			convertEventPropsToHandlers: function(handlers) {
				var h;
						
				if (Basic.typeOf(handlers) !== 'array') {
					handlers = [handlers];
				}

				for (var i = 0; i < handlers.length; i++) {
					h = 'on' + handlers[i];
					
					if (Basic.typeOf(this[h]) === 'function') {
						this.addEventListener(handlers[i], this[h]);
					} else if (Basic.typeOf(this[h]) === 'undefined') {
						this[h] = null; // object must have defined event properties, even if it doesn't make use of them
					}
				}
			}
			
		});
	}

	EventTarget.instance = new EventTarget(); 

	return EventTarget;
});