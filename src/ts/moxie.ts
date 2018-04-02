
import { Basic, Mime, Dom, Events, I18n, Encode, Env, Url } from 'utils';
import { BlobRef, FileDrop, FileInput, FileRef } from 'file';
import EventTarget from 'EventTarget';

export default {
    utils: {
        Basic,
        Dom,
        Encode,
        Env,
        Events,
        Mime,
        Url,
        I18n
    },
    file: {
        BlobRef,
        FileRef,
        FileDrop,
        FileInput
    },
    EventTarget
}