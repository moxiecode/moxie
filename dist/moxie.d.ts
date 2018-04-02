declare module "moxie/utils/Basic" {
    const _default: {
        guid: (prefix?: string) => string;
        typeOf: (o: any) => any;
        extend: (...args: any[]) => any;
        extendIf: () => any;
        extendImmutable: () => any;
        extendImmutableIf: () => any;
        clone: (value: any) => any;
        each: (obj: any, callback: any) => void;
        isEmptyObj: (obj: any) => boolean;
        inSeries: (queue: any, cb: any) => void;
        inParallel: (queue: any, cb: any) => void;
        inArray: (needle: any, array: any) => any;
        toArray: (obj: any) => any[];
        trim: (str: any) => any;
        sprintf: (str: any) => any;
        parseSizeStr: (size: any) => any;
        delay: (cb: any, timeout: any) => void;
        verComp: (v1: any, v2: any, operator: any) => number | boolean;
    };
    export default _default;
}
declare module "moxie/utils/Dom" {
    const _default: {
        get: (id: any) => any;
        hasClass: (obj: any, name: any) => boolean;
        addClass: (obj: any, name: any) => void;
        removeClass: (obj: any, name: any) => void;
        getStyle: (obj: any, name: any) => any;
        getPos: (node: any, root: any) => {
            x: number;
            y: number;
        };
        getSize: (node: any) => {
            w: any;
            h: any;
        };
    };
    export default _default;
}
declare module "moxie/utils/Encode" {
    const _default: {
        utf8Encode: (str: any) => string;
        utf8Decode: (str_data: any) => string;
        atob: (data: any, utf8: any) => string;
        btoa: (data: any, utf8: any) => string;
    };
    export default _default;
}
declare module "moxie/utils/Env" {
    var Env: any;
    export default Env;
}
declare module "moxie/utils/Events" {
    const _default: {
        addEvent: (obj: any, name: any, func: any, key: any) => void;
        removeEvent: (obj: any, name: any, callback: any) => void;
        removeAllEvents: (obj: any, key: any) => void;
    };
    export default _default;
}
declare module "moxie/utils/Loader" {
    const _default: {
        loadScript: (url: any, cb: any, attrs: any) => any;
        interpolateProgress: (loaded: any, total: any, partNum: any, totalParts: any) => number;
    };
    export default _default;
}
declare module "moxie/utils/I18n" {
    const _default: {
        addI18n: (pack: any) => any;
        translate: (str: any) => any;
        _: (str: any) => any;
        sprintf: (str: any) => any;
    };
    export default _default;
}
declare module "moxie/utils/Mime" {
    const _default: {
        mimes: {};
        extensions: {};
        addMimeType: (mimeData: any) => void;
        extList2mimes: (filters: any, addMissingExtensions: any) => any[];
        mimes2exts: (mimes: any) => any[];
        mimes2extList: (mimes: any) => any[];
        getFileExtension: (fileName: any) => any;
        getFileMime: (fileName: any) => any;
    };
    export default _default;
}
declare module "moxie/utils/Url" {
    const _default: any;
    export default _default;
}
declare module "moxie/utils" {
    import Basic from "moxie/utils/Basic";
    import Dom from "moxie/utils/Dom";
    import Encode from "moxie/utils/Encode";
    import Env from "moxie/utils/Env";
    import Events from "moxie/utils/Events";
    import Loader from "moxie/utils/Loader";
    import Mime from "moxie/utils/Mime";
    import Url from "moxie/utils/Url";
    import I18n from "moxie/utils/I18n";
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
    import { BlobRef, FileDrop, FileInput, FileRef } from "moxie/file";
    import EventTarget from "moxie/EventTarget";
    const _default: {
        utils: {
            Basic: {
                guid: (prefix?: string) => string;
                typeOf: (o: any) => any;
                extend: (...args: any[]) => any;
                extendIf: () => any;
                extendImmutable: () => any;
                extendImmutableIf: () => any;
                clone: (value: any) => any;
                each: (obj: any, callback: any) => void;
                isEmptyObj: (obj: any) => boolean;
                inSeries: (queue: any, cb: any) => void;
                inParallel: (queue: any, cb: any) => void;
                inArray: (needle: any, array: any) => any;
                toArray: (obj: any) => any[];
                trim: (str: any) => any;
                sprintf: (str: any) => any;
                parseSizeStr: (size: any) => any;
                delay: (cb: any, timeout: any) => void;
                verComp: (v1: any, v2: any, operator: any) => number | boolean;
            };
            Dom: {
                get: (id: any) => any;
                hasClass: (obj: any, name: any) => boolean;
                addClass: (obj: any, name: any) => void;
                removeClass: (obj: any, name: any) => void;
                getStyle: (obj: any, name: any) => any;
                getPos: (node: any, root: any) => {
                    x: number;
                    y: number;
                };
                getSize: (node: any) => {
                    w: any;
                    h: any;
                };
            };
            Encode: {
                utf8Encode: (str: any) => string;
                utf8Decode: (str_data: any) => string;
                atob: (data: any, utf8: any) => string;
                btoa: (data: any, utf8: any) => string;
            };
            Env: any;
            Events: {
                addEvent: (obj: any, name: any, func: any, key: any) => void;
                removeEvent: (obj: any, name: any, callback: any) => void;
                removeAllEvents: (obj: any, key: any) => void;
            };
            Mime: {
                mimes: {};
                extensions: {};
                addMimeType: (mimeData: any) => void;
                extList2mimes: (filters: any, addMissingExtensions: any) => any[];
                mimes2exts: (mimes: any) => any[];
                mimes2extList: (mimes: any) => any[];
                getFileExtension: (fileName: any) => any;
                getFileMime: (fileName: any) => any;
            };
            Url: any;
            I18n: {
                addI18n: (pack: any) => any;
                translate: (str: any) => any;
                _: (str: any) => any;
                sprintf: (str: any) => any;
            };
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
