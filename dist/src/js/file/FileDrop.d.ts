import EventTarget from '../EventTarget';
import FileRef from './FileRef';
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
