package com
{
	import com.errors.RuntimeError;
	import com.utils.URLStreamProgress;
	
	import flash.events.DataEvent;
	import flash.events.ErrorEvent;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.FileReference;
	import flash.net.URLRequest;
	import flash.net.URLRequestHeader;
	import flash.net.URLRequestMethod;
	import flash.net.URLStream;
	import flash.net.URLVariables;
	import flash.utils.ByteArray;
	import flash.utils.clearTimeout;
	import flash.utils.setTimeout;
	
	import mxi.Utils;
	import mxi.events.OErrorEvent;
	import mxi.events.OProgressEvent;
	
	public class XMLHttpRequest extends EventDispatcher
	{
		// events dispatched by this class
		public static var dispatches:Object = { 
			"LoadStart": Event.OPEN,
			"Progress": OProgressEvent.PROGRESS,
			"UploadProgress": ProgressEvent.PROGRESS,
			"Load": Event.COMPLETE,
			"Error": OErrorEvent.ERROR
		};
		
		public static const UNSENT:uint = 0;
		public static const OPENED:uint = 1;
		public static const HEADERS_RECEIVED:uint = 2;
		public static const LOADING:uint = 3;
		public static const DONE:uint = 4;
		public static const ABORTED:uint = 5;
				
		private var _methods:Object = {
			'GET': URLRequestMethod.GET,
			'POST': URLRequestMethod.POST
		};
		
		private var _options:Object;
		
		private var _multipart:Boolean = false;
		
		private var _blob:*;
		
		private var _blobName:String;
		
		private var _blobFieldName:String = 'Filedata';
		
		private var _postData:URLVariables = new URLVariables;
		
		private var _conn:*;
		
		private var _response:ByteArray;
		
		private var _status:int;
		
		private var _readyState:uint = XMLHttpRequest.UNSENT;
		
		private var _onCompleteTimeout:uint = 0;
		
		private var _notCachedSize:uint = 0;
				
		
		public function append(name:String, value:*) : void
		{
			_multipart = true;
			
			if (name != 'Filename') { // Flash will add this by itself, so we need to omit potential duplicate
				_postData[name] = value;
			}
		}
		
		
		public function appendBlob(name:String, blob:*, fileName:String = null) : void
		{			
			_multipart = true;
			
			_blobName = fileName || 'blob' + new Date().getTime();
			
			if (typeof blob === 'string') {
				blob = Moxie.blobPile.get(blob);
				if (!fileName && blob is File && blob.hasOwnProperty('name')) { 
					_blobName = blob.name;
				} 
			}
			
			_blob = blob;
			_blobFieldName = name;						
		}
		
				
		public function send(meta:Object, blob:* = null) : void
		{	
			// whether to force the flow into URLStream mode
			var urlstream:Boolean = (meta.options.hasOwnProperty('url_stream') && meta.options.url_stream);
			
			if (_blob) {
				blob = _blob;
			}
						
			meta.method = meta.method.toUpperCase();
			_options = meta;
									
			if (typeof blob === 'string') {
				blob = Moxie.blobPile.get(blob);
				if (blob is File && blob.hasOwnProperty('name')) { 
					_blobName = blob.name;
				} 
			}
						
			if (blob && _options.method == 'POST') {
				if (!urlstream && _multipart && blob.isFileRef() && Utils.isEmptyObj(_options.headers)) {
					_uploadFileRef(blob);
				} else {
					_preloadBlob(blob, _doURLStreamRequest);
				}
			} else {
				_doURLStreamRequest();
			}
		}
		
		public function getResponseAsBlob() : Object
		{
			var bb:BlobBuilder, blob:*;
			
			if (!_response) {
				return null;
			}
			
			bb = new BlobBuilder;
			bb.append(_response);
			blob = bb.getFile('', _options.url.replace(/^.+?\/([\w\-\.]+)$/, '$1').toLowerCase());
			Moxie.blobPile.add(blob);
			blob = blob.toObject();
			blob.ruid = Moxie.uid;
			
			return blob;
		}
		
		
		public function getStatus() : int
		{			
			return _status;
		}
		
		
		public function abort() : void 
		{			
			if (!_conn) {
				// mark as aborted in order to be handled as soon as possible
				_readyState = XMLHttpRequest.ABORTED; 
				return;	
			}
			
			if (_conn is FileReference) {
				_conn.cancel();	
			} else if (_conn is URLStream && _conn.connected) {
				_conn.close();	
			}
			
			removeEventListeners(_conn);	
			_conn = null;
		}
		
		
		private function onOpen():void {
			dispatchEvent(new Event(Event.OPEN));
		}
		
		
		private function onProgress(e:ProgressEvent) : void {
			dispatchEvent(new OProgressEvent(OProgressEvent.PROGRESS, e.bytesLoaded, e.bytesTotal));
		}
		
		
		private function onUploadProgress(e:ProgressEvent):void { 
			dispatchEvent(e);
		}
		
		
		private function onUploadComplete(e:*) : void {
			if (_onCompleteTimeout) {
				clearTimeout(_onCompleteTimeout);
			}
			
			// save response
			_response = new ByteArray;
			
			if (_conn is FileReference && e.hasOwnProperty('data')) {
				_response.writeUTFBytes(e.data);
			} else if (_conn is URLStream) {
				_conn.readBytes(_response);
			}
			
			removeEventListeners(e.target);	
			_readyState = XMLHttpRequest.DONE;
			dispatchEvent(new Event(Event.COMPLETE));
		}
		
		private function onComplete(e:*):void {
			// give upload complete event a chance to fire
			_onCompleteTimeout = setTimeout(onUploadComplete, 500, e);
		}
		
		private function onStatus(e:HTTPStatusEvent) : void {
			_status = e.status;
		}
		
		private function onError(e:*):void {
			removeEventListeners(e.target);
			_readyState = XMLHttpRequest.DONE;
			dispatchEvent(e);
		}
		
		private function removeEventListeners(target:*) : void {
			// some of these event handlers may not even be attached, but we try to remove them all for simplicity
			target.removeEventListener(Event.OPEN, onOpen);
			target.removeEventListener(ProgressEvent.PROGRESS, onProgress);
			target.removeEventListener(ProgressEvent.PROGRESS, onUploadProgress);
			target.removeEventListener(Event.COMPLETE, onComplete);
			target.removeEventListener(DataEvent.UPLOAD_COMPLETE_DATA, onUploadComplete);
			target.removeEventListener(HTTPStatusEvent.HTTP_STATUS, onStatus);
			target.removeEventListener(IOErrorEvent.IO_ERROR, onError);
			target.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, onError);
		}
		
		
		private function _uploadFileRef(blob:Blob) : void
		{
			var request:URLRequest;
						
			request = new URLRequest();
			request.method = URLRequestMethod.POST;
			request.url = _options.url;
			request.data = _postData;
								
			_conn = blob.getFileRef();
			_readyState = XMLHttpRequest.OPENED;
						
			_conn.addEventListener(Event.COMPLETE, onComplete);
			_conn.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, onUploadComplete);
			_conn.addEventListener(ProgressEvent.PROGRESS, onUploadProgress);
			_conn.addEventListener(HTTPStatusEvent.HTTP_STATUS, onStatus);
			_conn.addEventListener(IOErrorEvent.IO_ERROR, onError);
			_conn.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onError);
			
			// _conn.addEventListener(Event.OPEN, onOpen); doesn't fire, ideas?
			onOpen(); // trigger it manually
						
			_readyState = XMLHttpRequest.LOADING;
			_conn.upload(request, _blobFieldName, false);
		}
		
		
		private function _preloadBlob(blob:*, callback:Function) : void
		{					
			var fr:FileReader = new FileReader;
			
			fr.addEventListener(ProgressEvent.PROGRESS, function(e:ProgressEvent) : void {
				if (_readyState == XMLHttpRequest.ABORTED) {
					fr.abort();
				}
			});
			
			fr.addEventListener(Event.COMPLETE, function() : void {	
				fr.removeAllEventsListeners();
				if (_readyState == XMLHttpRequest.ABORTED) {
					fr.abort();
					return;
				}
				callback(fr.result);
			});
			
			//_notCachedSize = blob.realSize - blob.cachedSize;
			
			fr.readAsByteArray(blob);
		}
		
		
		private function _doURLStreamRequest(ba:ByteArray = null) : void
		{			
			var request:URLRequest,
			progress:URLStreamProgress, 
			start:Date, end:Date; // we are going to measure upload time for each piece of data and make correction to the progress watch
								
			request = new URLRequest(_options.url);
			
			// set custom headers if required
			if (!Utils.isEmptyObj(_options.headers)) {
				for (var name:String in _options.headers) {
					request.requestHeaders.push(new URLRequestHeader(name, _options.headers[name]));
				}
			}			
			
			// only GET/POST is supported at the moment
			if (['POST', 'GET'].indexOf(_options.method) === -1) {
				dispatchEvent(new OErrorEvent(OErrorEvent.ERROR, RuntimeError.SYNTAX_ERR));
				return;
			}
			
			request.method = _methods[_options.method];
			
			if (_multipart) {
				request.data = _formatAsMultipart(ba, request);
			} else if (ba) {
				request.requestHeaders.push(new URLRequestHeader("Content-Type", "application/octet-stream"));
			}		
						
			_conn = new URLStream;
			_readyState = XMLHttpRequest.OPENED;
			
			// _conn.addEventListener(Event.OPEN, onOpen); // doesn't trigger (I remember it did), maybe adobe abandoned it?..
			_conn.addEventListener(ProgressEvent.PROGRESS, onProgress);
			_conn.addEventListener(IOErrorEvent.IO_ERROR, onError);
			_conn.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onError);
			_conn.addEventListener(HTTPStatusEvent.HTTP_STATUS, onStatus);
			
			if (ba) { 
				progress = new URLStreamProgress({ url: _options.url });
				
				progress.addEventListener(ProgressEvent.PROGRESS, onUploadProgress);
				
				progress.addEventListener(Event.OPEN, function() : void {
					start = new Date;
					
					onOpen(); // trigger it manually
					_conn.load(request);
				});
				
				_conn.addEventListener(Event.COMPLETE, function(e:Event) : void {
					progress.stop();
					progress.removeAllEventsListeners();
					
					// correlate upload speed
					end = new Date;
					URLStreamProgress.calculateSpeed(request.data.length, end.time - start.time);
										
					onComplete(e);
				});		
				
				progress.start(request.data.length);
			}	
			else {	
				_conn.addEventListener(Event.COMPLETE, onComplete);
				
				onOpen(); // trigger it manually
				_conn.load(request);
			}
			
			_readyState = XMLHttpRequest.LOADING;
		}
		
		
		private function _formatAsMultipart(ba:ByteArray, request:URLRequest) : ByteArray
		{
			var boundary:String = '----moxieboundary' + new Date().getTime(),
				dashdash:String = '--', crlf:String = '\r\n',
				tmpBa:ByteArray;
			
			tmpBa = new ByteArray;
						
			request.requestHeaders.push(new URLRequestHeader("Content-Type", 'multipart/form-data; boundary=' + boundary));
			
			// append mutlipart parameters
			for (var name:String in _postData) {
				tmpBa.writeUTFBytes(
					dashdash + boundary + crlf +
					'Content-Disposition: form-data; name="' + name + '"' + crlf + crlf +
					_postData[name] + crlf
				);
			}
			
			// append file if available
			if (ba) {
				tmpBa.writeUTFBytes(
					dashdash + boundary + crlf +
					'Content-Disposition: form-data; name="' + _blobFieldName + '"; filename="' + _blobName + '"' + crlf +
					'Content-Type: ' + _options.mimeType + crlf + crlf
				);
			
				tmpBa.writeBytes(ba, 0, ba.length);
				ba.clear();
				
				tmpBa.writeUTFBytes(crlf);
			}
			
			// wrap it up
			tmpBa.writeUTFBytes(dashdash + boundary + dashdash + crlf);
			
			return tmpBa;
		}
		
	}
}