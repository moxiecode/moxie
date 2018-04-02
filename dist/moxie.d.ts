declare module "moxie/utils/Basic" {
    /**
     * Basic.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */
    /**
    @class moxie/utils/Basic
    @public
    @static
    */
    /**
    Gets the true type of the built-in object (better version of typeof).
    @author Angus Croll (http://javascriptweblog.wordpress.com/)
    
    @method typeOf
    @static
    @param {Object} o Object to check.
    @return {String} Object [[Class]]
    */
    const typeOf: (o: any) => any;
    /**
    Extends the specified object with another object(s).
    
    @method extend
    @static
    @param {Object} target Object to extend.
    @param {Object} [obj]* Multiple objects to extend with.
    @return {Object} Same as target, the extended object.
    */
    const extend: (...args: any[]) => any;
    /**
    Extends the specified object with another object(s), but only if the property exists in the target.
    
    @method extendIf
    @static
    @param {Object} target Object to extend.
    @param {Object} [obj]* Multiple objects to extend with.
    @return {Object} Same as target, the extended object.
    */
    const extendIf: () => any;
    const extendImmutable: () => any;
    const extendImmutableIf: () => any;
    const clone: (value: any) => any;
    /**
    Executes the callback const for each item in array/object. If you return false in the = function
    callback it will break the loop.
    
    @method each
    @static
    @param {Object} obj Object to iterate.
    @param {function} callback Callback const to execute for each item. = function
    */
    const each: (obj: any, callback: any) => void;
    /**
    Checks if object is empty.
    
    @method isEmptyObj
    @static
    @param {Object} o Object to check.
    @return {Boolean}
    */
    const isEmptyObj: (obj: any) => boolean;
    /**
    Recieve an array of functions (usually async) to call in sequence, each  function
    receives a callback as first argument that it should call, when it completes. Finally,
    after everything is complete, main callback is called. Passing truthy value to the
    callback as a first argument will interrupt the sequence and invoke main callback
    immediately.
    
    @method inSeries
    @static
    @param {Array} queue Array of functions to call in sequence
    @param {Function} cb Main callback that is called in the end, or in case of error
    */
    const inSeries: (queue: any, cb: any) => void;
    /**
    Recieve an array of functions (usually async) to call in parallel, each  function
    receives a callback as first argument that it should call, when it completes. After
    everything is complete, main callback is called. Passing truthy value to the
    callback as a first argument will interrupt the process and invoke main callback
    immediately.
    
    @method inParallel
    @static
    @param {Array} queue Array of functions to call in sequence
    @param {Function} cb Main callback that is called in the end, or in case of erro
    */
    const inParallel: (queue: any, cb: any) => void;
    /**
    Find an element in array and return it's index if present, otherwise return -1.
    
    @method inArray
    @static
    @param {Mixed} needle Element to find
    @param {Array} array
    @return {Int} Index of the element, or -1 if not found
    */
    const inArray: (needle: any, array: any) => any;
    /**
    Forces anything into an array.
    
    @method toArray
    @static
    @param {Object} obj Object with length field.
    @return {Array} Array object containing all items.
    */
    const toArray: (obj: any) => any[];
    /**
    Generates an unique ID. The only way a user would be able to get the same ID is if the two persons
    at the same exact millisecond manage to get the same 5 random numbers between 0-65535; it also uses
    a counter so each ID is guaranteed to be unique for the given page. It is more probable for the earth
    to be hit with an asteroid.
    
    @method guid
    @static
    @param {String} prefix to prepend (by default 'o' will be prepended).
    @method guid
    @return {String} Virtually unique id.
    */
    const guid: (prefix?: string) => string;
    /**
    Trims white spaces around the string
    
    @method trim
    @static
    @param {String} str
    @return {String}
    */
    const trim: (str: any) => any;
    /**
    Parses the specified size string into a byte value. For example 10kb becomes 10240.
    
    @method parseSizeStr
    @static
    @param {String/Number} size String to parse or number to just pass through.
    @return {Number} Size in bytes.
    */
    const parseSizeStr: (size: any) => any;
    /**
     * Pseudo sprintf implementation - simple way to replace tokens with specified values.
     *
     * @param {String} str String with tokens
     * @return {String} String with replaced tokens
     */
    const sprintf: (str: any) => any;
    const delay: (cb: any, timeout: any) => void;
    const verComp: (v1: any, v2: any, operator: any) => number | boolean;
    export { guid, typeOf, extend, extendIf, extendImmutable, extendImmutableIf, clone, each, isEmptyObj, inSeries, inParallel, inArray, toArray, trim, sprintf, parseSizeStr, delay, verComp };
}
declare module "moxie/utils/Dom" {
    /**
     * Dom.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */
    /**
    @class moxie/utils/Dom
    @public
    @static
    */
    /**
    Get DOM Element by it's id.
    
    @method get
    @param {String} id Identifier of the DOM Element
    @return {DOMElement}
    */
    const get: (id: any) => any;
    /**
    Checks if specified DOM element has specified class.
    
    @method hasClass
    @static
    @param {Object} obj DOM element like object to add handler to.
    @param {String} name Class name
    */
    const hasClass: (obj: any, name: any) => boolean;
    /**
    Adds specified className to specified DOM element.
    
    @method addClass
    @static
    @param {Object} obj DOM element like object to add handler to.
    @param {String} name Class name
    */
    const addClass: (obj: any, name: any) => void;
    /**
    Removes specified className from specified DOM element.
    
    @method removeClass
    @static
    @param {Object} obj DOM element like object to add handler to.
    @param {String} name Class name
    */
    const removeClass: (obj: any, name: any) => void;
    /**
    Returns a given computed style of a DOM element.
    
    @method getStyle
    @static
    @param {Object} obj DOM element like object.
    @param {String} name Style you want to get from the DOM element
    */
    const getStyle: (obj: any, name: any) => any;
    /**
    Returns the absolute x, y position of an Element. The position will be returned in a object with x, y fields.
    
    @method getPos
    @static
    @param {Element} node HTML element or element id to get x, y position from.
    @param {Element} root Optional root element to stop calculations at.
    @return {object} Absolute position of the specified element object with x, y fields.
    */
    const getPos: (node: any, root: any) => {
        x: number;
        y: number;
    };
    /**
    Returns the size of the specified node in pixels.
    
    @method getSize
    @static
    @param {Node} node Node to get the size of.
    @return {Object} Object with a w and h property.
    */
    const getSize: (node: any) => {
        w: any;
        h: any;
    };
    export { get, hasClass, addClass, removeClass, getStyle, getPos, getSize };
}
declare module "moxie/utils/Encode" {
    /**
     * Encode.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */
    /**
    @class moxie/utils/Encode
    @public
    @static
    */
    /**
    Encode string with UTF-8
    
    @method utf8Encode
    @static
    @param {String} str String to encode
    @return {String} UTF-8 encoded string
    */
    const utf8Encode: (str: any) => string;
    /**
    Decode UTF-8 encoded string
    
    @method utf8Decode
    @static
    @param {String} str String to decode
    @return {String} Decoded string
    */
    const utf8Decode: (str_data: any) => string;
    /**
    Decode Base64 encoded string
    
    @method atob
    @static
    @param {String} data String to decode
    @return {String} Decoded string
    */
    const atob: (data: any, utf8: any) => string;
    /**
    Base64 encode string
    
    @method btoa
    @static
    @param {String} data String to encode
    @return {String} Base64 encoded string
    */
    const btoa: (data: any, utf8: any) => string;
    export { utf8Encode, utf8Decode, atob, btoa };
}
declare module "moxie/utils/Env" {
    var Env: any;
    export default Env;
}
declare module "moxie/utils/Events" {
    /**
    Adds an event handler to the specified object and store reference to the handler
    in objects internal Plupload registry (@see removeEvent).
    
    @method addEvent
    @static
    @param {Object} obj DOM element like object to add handler to.
    @param {String} name Name to add event listener to.
    @param {Function} callback Function to call when event occurs.
    @param {String} [key] that might be used to add specifity to the event record.
    */
    const addEvent: (obj: any, name: any, func: any, key: any) => void;
    /**
    Remove event handler from the specified object. If third argument (callback)
    is not specified remove all events with the specified name.
    
    @method removeEvent
    @static
    @param {Object} obj DOM element to remove event listener(s) from.
    @param {String} name Name of event listener to remove.
    @param {Function|String} [callback] might be a callback or unique key to match.
    */
    const removeEvent: (obj: any, name: any, callback: any) => void;
    /**
    Remove all kind of events from the specified object
    
    @method removeAllEvents
    @static
    @param {Object} obj DOM element to remove event listeners from.
    @param {String} [key] unique key to match, when removing events.
    */
    const removeAllEvents: (obj: any, key: any) => void;
    export { addEvent, removeEvent, removeAllEvents };
}
declare module "moxie/utils/Loader" {
    /**
    @class moxie/utils/Loader
    @private
    */
    const loadScript: (url: any, cb: any, attrs: any) => any;
    const interpolateProgress: (loaded: any, total: any, partNum: any, totalParts: any) => number;
    export { loadScript, interpolateProgress };
}
declare module "moxie/utils/I18n" {
    /**
     * I18n.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */
    import { sprintf } from "moxie/utils/Basic";
    /**
    @class moxie/utils/I18n
    */
    /**
     * Extends the language pack object with new items.
     *
     * @param {Object} pack Language pack items to add.
     * @return {Object} Extended language pack object.
     */
    const addI18n: (pack: any) => any;
    /**
     * Translates the specified string by checking for the english string in the language pack lookup.
     *
     * @param {String} str String to look for.
     * @return {String} Translated string or the input string if it wasn't found.
     */
    const translate: (str: any) => any;
    /**
     * Shortcut for translate function
     *
     * @param {String} str String to look for.
     * @return {String} Translated string or the input string if it wasn't found.
     */
    const _: (str: any) => any;
    export { addI18n, translate, _, sprintf };
}
declare module "moxie/utils/Mime" {
    /**
     * Map of mimes to extensions
     *
     * @property mimes
     * @type {Object}
     */
    const mimes: {};
    /**
     * Map of extensions to mimes
     *
     * @property extensions
     * @type {Object}
     */
    const extensions: {};
    /**
    * Parses mimeData string into a mimes and extensions lookup maps. String should have the
    * following format:
    *
    * application/msword,doc dot,application/pdf,pdf, ...
    *
    * so mime-type followed by comma and followed by space-separated list of associated extensions,
    * then comma again and then another mime-type, etc.
    *
    * If invoked externally will replace override internal lookup maps with user-provided data.
    *
    * @method addMimeType
    * @param {String} mimeData
    */
    const addMimeType: (mimeData: any) => void;
    const extList2mimes: (filters: any, addMissingExtensions: any) => any[];
    const mimes2exts: (mimes: any) => any[];
    const mimes2extList: (mimes: any) => any[];
    /**
     * Extract extension from the given filename
     *
     * @method getFileExtension
     * @param {String} fileName
     * @return {String} File extension
     */
    const getFileExtension: (fileName: any) => any;
    /**
     * Get file mime-type from it's filename - will try to match the extension
     * against internal mime-type lookup map
     *
     * @method getFileMime
     * @param {String} fileName
     * @return File mime-type if found or an empty string if not
     */
    const getFileMime: (fileName: any) => any;
    export { mimes, extensions, addMimeType, extList2mimes, mimes2exts, mimes2extList, getFileExtension, getFileMime };
}
declare module "moxie/utils/Url" {
    /**
    @class moxie/utils/Url
    @public
    @static
    */
    /**
    Parse url into separate components and fill in absent parts with parts from current url,
    based on https://raw.github.com/kvz/phpjs/master/functions/url/parse_url.js
    
    @method parseUrl
    @static
    @param {String} url Url to parse (defaults to empty string if undefined)
    @return {Object} Hash containing extracted uri components
    */
    const parseUrl: (url?: any, currentUrl?: any) => any;
    /**
    Resolve url - among other things will turn relative url to absolute
    
    @method resolveUrl
    @static
    @param {String|Object} url Either absolute or relative, or a result of parseUrl call
    @return {String} Resolved, absolute url
    */
    const resolveUrl: (url: any) => string;
    /**
    Check if specified url has the same origin as the current document
    
    @method hasSameOrigin
    @static
    @param {String|Object} url
    @return {Boolean}
    */
    const hasSameOrigin: (url: any) => boolean;
    export { parseUrl, resolveUrl, hasSameOrigin };
}
declare module "moxie/utils" {
    import * as Basic from "moxie/utils/Basic";
    import * as Dom from "moxie/utils/Dom";
    import * as Encode from "moxie/utils/Encode";
    import * as Env from "moxie/utils/Env";
    import * as Events from "moxie/utils/Events";
    import * as Loader from "moxie/utils/Loader";
    import * as Mime from "moxie/utils/Mime";
    import * as Url from "moxie/utils/Url";
    import * as I18n from "moxie/utils/I18n";
    export { Basic, Dom, Encode, Env, Events, Loader, Mime, Url, I18n };
}
declare module "moxie/file/BlobRef" {
    /**
    @class moxie/file/BlobRef
    @constructor
    @param {Object} blob Object "Native" blob object, as it is represented in the runtime
    */
    export default class BlobRef {
        protected _blob: any;
        /**
        Unique id of the component
    
        @property uid
        @type {String}
        */
        uid: string;
        /**
        Size of blob
    
        @property size
        @type {Number}
        @default 0
        */
        size: number;
        /**
        Mime type of blob
    
        @property type
        @type {String}
        @default ''
        */
        type: string;
        constructor(_blob: any, legacyBlob?: any);
        /**
        @method slice
        @param {Number} [start=0]
        @param {Number} [end=blob.size]
        @param {String} [type] Content Mime type
        */
        slice(): BlobRef;
        /**
        Returns "native" blob object (as it is represented in connected runtime) or null if not found
    
        @method getSource
        @return {BlobRef} Returns "native" blob object or null if not found
        */
        getSource(): any;
        /**
        Destroy BlobRef and free any resources it was using
    
        @method destroy
        */
        destroy(): void;
    }
}
declare module "moxie/file/FileRef" {
    import BlobRef from "moxie/file/BlobRef";
    /**
    @class moxie/file/FileRef
    @extends BlobRef
    @constructor
    @param {Object} file Object "Native" file object, as it is represented in the runtime
    */
    export default class FileRef extends BlobRef {
        /**
        FileRef name
    
        @property name
        @type {String}
        @default UID
        */
        name: string;
        /**
        Relative path to the file inside a directory
        (in fact this property currently is the whole reason for this wrapper to exist)
    
        @property relativePath
        @type {String}
        @default ''
        */
        relativePath: string;
        /**
        Date of last modification
    
        @property lastModifiedDate
        @type {String}
        @default now
        */
        lastModifiedDate: string;
        constructor(file: any, legacyBlob?: any);
    }
}
declare module "moxie/EventTarget" {
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
}
declare module "moxie/file/FileInput" {
    import EventTarget from "moxie/EventTarget";
    import FileRef from "moxie/file/FileRef";
    export default class FileInput extends EventTarget {
        /**
        Unique id of the component
    
        @property uid
        @protected
        @readOnly
        @type {String}
        @default UID
        */
        uid: string;
        /**
        Unique id of the runtime container. Useful to get hold of it for various manipulations.
    
        @property shimid
        @protected
        @type {String}
        */
        shimid: string;
        /**
        Array of selected File objects
    
        @property files
        @type {Array}
        @default null
        */
        files: FileRef[];
        private _disabled;
        private _options;
        private _containerPosition;
        private _browseButtonPosition;
        private _browseButtonZindex;
        constructor(options: any);
        /**
        Initializes the component and dispatches event ready when done.
    
        @method init
        */
        init(): void;
        /**
        Returns container for the runtime as DOM element
    
        @method getShimContainer
        @return {DOMElement}
        */
        getShimContainer(): any;
        /**
         * Get current option value by its name
         *
         * @method getOption
         * @param name
         * @return {Mixed}
         */
        getOption(name: any): any;
        /**
         * Sets a new value for the option specified by name
         *
         * @method setOption
         * @param name
         * @param value
         */
        setOption(name: any, value: any): void;
        /**
        Disables file-picker element, so that it doesn't react to mouse clicks.
    
        @method disable
        @param {Boolean} [state=true] Disable component if - true, enable if - false
        */
        disable(state: any): void;
        /**
        Reposition and resize dialog trigger to match the position and size of browse_button element.
    
        @method refresh
        */
        refresh(): void;
        /**
        Destroy component.
    
        @method destroy
        */
        destroy(): void;
        private createInput();
        private createShimContainer();
    }
}
declare module "moxie/file/FileDrop" {
    import EventTarget from "moxie/EventTarget";
    import FileRef from "moxie/file/FileRef";
    export default class FileDrop extends EventTarget {
        /**
        Unique id of the component
    
        @property uid
        @protected
        @readOnly
        @type {String}
        @default UID
        */
        uid: string;
        /**
        Unique id of the runtime container. Useful to get hold of it for various manipulations.
    
        @property shimid
        @protected
        @type {String}
        */
        shimid: string;
        /**
        Array of selected File objects
    
        @property files
        @type {Array}
        @default null
        */
        files: FileRef[];
        private _disabled;
        private _options;
        private _containerPosition;
        constructor(options: any);
        /**
        Initializes the component and dispatches event ready when done.
    
        @method init
        */
        init(): void;
        /**
        Returns container for the runtime as DOM element
    
        @method getShimContainer
        @return {DOMElement}
        */
        getShimContainer(): any;
        /**
         * Get current option value by its name
         *
         * @method getOption
         * @param name
         * @return {Mixed}
         */
        getOption(name: any): any;
        /**
         * Sets a new value for the option specified by name
         *
         * @method setOption
         * @param name
         * @param value
         */
        setOption(name: any, value: any): void;
        /**
        Disables component, so that it doesn't accept files.
    
        @method disable
        @param {Boolean} [state=true] Disable component if - true, enable if - false
        */
        disable(state: any): void;
        /**
        Destroy component.
    
        @method destroy
        */
        destroy(): void;
        private _hasFiles(e);
        private _addFile(file, relativePath?);
        private _extractExts(accept);
        private _isAcceptable(file);
        private _readItems(items, cb);
        private _readEntries(entries, cb);
        private _readEntry(entry, cb);
        private _readDirEntry(dirEntry, cb);
    }
}
declare module "moxie/file" {
    import BlobRef from "moxie/file/BlobRef";
    import FileRef from "moxie/file/FileRef";
    import FileInput from "moxie/file/FileInput";
    import FileDrop from "moxie/file/FileDrop";
    export { BlobRef, FileRef, FileInput, FileDrop };
}
declare module "moxie" {
    import { Basic, Mime, Dom, Events, I18n, Encode, Env, Url } from "moxie/utils";
    import { BlobRef, FileDrop, FileInput, FileRef } from "moxie/file";
    import EventTarget from "moxie/EventTarget";
    const _default: {
        utils: {
            Basic: typeof Basic;
            Dom: typeof Dom;
            Encode: typeof Encode;
            Env: typeof Env;
            Events: typeof Events;
            Mime: typeof Mime;
            Url: typeof Url;
            I18n: typeof I18n;
        };
        file: {
            BlobRef: typeof BlobRef;
            FileRef: typeof FileRef;
            FileDrop: typeof FileDrop;
            FileInput: typeof FileInput;
        };
        EventTarget: typeof EventTarget;
    };
    export default _default;
}
