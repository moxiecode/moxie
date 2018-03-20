import EventTarget from '../EventTarget';
import FileRef from './FileRef';
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
