import BlobRef from './BlobRef';
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
