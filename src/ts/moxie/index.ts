import Basic from 'utils/Basic';
import Dom from 'utils/Dom';
import Encode from 'utils/Encode';
import Env from 'utils/Env';
import Events from 'utils/Events';
import Mime from 'utils/Mime';
import Url from 'utils/Url';
import BlobRef from 'file/BlobRef';
import FileRef from 'file/FileRef';
import FileDrop from 'file/FileDrop';
import FileInput from 'file/FileInput';
import EventTarget from 'EventTarget';

export default {
    utils: {
        Basic,
        Dom,
        Encode,
        Env,
        Events,
        Mime,
        Url
    },
    file: {
        BlobRef,
        FileRef,
        FileDrop,
        FileInput
    },
    EventTarget
}