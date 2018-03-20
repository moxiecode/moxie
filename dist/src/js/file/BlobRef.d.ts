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
