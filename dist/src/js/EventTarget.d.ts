/**
Parent object for all event dispatching components and objects

@class moxie/core/EventTarget
@constructor EventTarget
*/
export default class EventTarget {
    /**
     * @property instance
     * @type EventTarget
     * @static
     */
    static instance: EventTarget;
    /**
    Unique id of the event dispatcher, usually overriden by children

    @property uid
    @type String
    */
    uid: string;
    constructor();
    /**
    Register a handler to a specific event dispatched by the object

    @method addEventListener
    @param {String} type Type or basically a name of the event to subscribe to
    @param {Function} fn Callback function that will be called when event happens
    @param {Number} [priority=0] Priority of the event handler - handlers with higher priorities will be called first
    @param {Object} [scope=this] A scope to invoke event handler in
    */
    addEventListener(type: any, fn: any, priority: any, scope: any): void;
    /**
    Check if any handlers were registered to the specified event

    @method hasEventListener
    @param {String} [type] Type or basically a name of the event to check
    @return {Mixed} Returns a handler if it was found and false, if - not
    */
    hasEventListener(type: any): any;
    /**
    Unregister the handler from the event, or if former was not specified - unregister all handlers

    @method removeEventListener
    @param {String} type Type or basically a name of the event
    @param {Function} [fn] Handler to unregister
    */
    removeEventListener(type: any, fn: any): void;
    /**
    Remove all event handlers from the object

    @method removeAllEventListeners
    */
    removeAllEventListeners(): void;
    /**
    Dispatch the event

    @method dispatchEvent
    @param {String/Object} Type of event or event object to dispatch
    @param {Mixed} [...] Variable number of arguments to be passed to a handlers
    @return {Boolean} true by default and false if any handler returned false
    */
    dispatchEvent(type: any): boolean;
    /**
    Register a handler to the event type that will run only once

    @method bindOnce
    @since >1.4.1
    @param {String} type Type or basically a name of the event to subscribe to
    @param {Function} fn Callback function that will be called when event happens
    @param {Number} [priority=0] Priority of the event handler - handlers with higher priorities will be called first
    @param {Object} [scope=this] A scope to invoke event handler in
    */
    bindOnce(type: any, fn: any, priority: any, scope: any): void;
    /**
    Alias for addEventListener

    @method bind
    @protected
    */
    bind(...args: any[]): void;
    /**
    Alias for removeEventListener

    @method unbind
    @protected
    */
    unbind(...args: any[]): void;
    /**
    Alias for removeAllEventListeners

    @method unbindAll
    @protected
    */
    unbindAll(): void;
    /**
    Alias for dispatchEvent

    @method trigger
    @protected
    */
    trigger(...args: any[]): any;
    /**
    Handle properties of on[event] type.

    @method handleEventProps
    @private
    */
    handleEventProps(dispatches: any): void;
}
