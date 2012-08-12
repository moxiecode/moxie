package com
{
	import flash.net.FileReference;

	public class Blob
	{
		private static var _counter:uint = 1;
		
		private var _id:String;
		public function get id() : String {
			return _id;
		}		
		
		private var _size:Number;		
		public function	get size() : Number {
			return _size;
		}
		
		private var _type:String;
		public function get type() : String {
			return _type;
		}
				
		
		public var _sources:Array = [];
		
		// cumulative size of all the sources this blob is part of
		public function get realSize() : uint {
			var src:Object, size:uint = 0;
			
			for each (src in _sources) {
				size += src.buffer.size;
			}
			return size;
		}
		
		// cumulative size of all preloaded sources this blob is part of
		public function get cachedSize() : uint {
			var src:Object, size:uint = 0; 
			
			for each (src in _sources) {
				if (!src.buffer.data) {
					continue;
				}
				size += src.buffer.data.length;
			}
			return size;
		}
		
		
		public function Blob(sources:Array, size:Number, type:String = '') {
			_id = (_counter++).toString();
			
			_sources = sources;
			_size = size; 
			_type = type;
		}
		
		public function slice(... args) : Blob {
			var src:Object, 
				start:int = args[0] || 0, 
				end:int = args[1] || _size, 
				contentType:String = args[2] || '',
				size:uint, offset:uint = 0,
				sources:Array = [];
							
			if (start < 0) {
				start = Math.max(_size + start, 0);
			} else if (start > 0) {
				start = Math.min(start, _size);
			}	
			
			if (end < 0) {
				end = Math.max(_size + end, 0);	
			} else if (end > 0) {
				end = Math.min(end, _size);
			}
			
			if (start > end) {
				return new Blob([], 0, contentType);
			}
			
			for (var i:uint = 0, length:uint = _sources.length; i < length; i++) {
				src = _sources[i];
				size = src.end - src.start;
								
				if (start > offset + size) { // start is outside of the current source's boundaries 
					continue;
				}
				
				// Moxie.log([src.start, src.end, start, end, size]);
								
				sources.push({
					buffer: src.buffer,
					start: src.start + start - offset,
					end: Math.min(src.end, end)
				});
				offset += size;
				break;
			}
			
			if (i == length || offset > end) {
				return new Blob(sources, end - start, contentType);
			} 
			
			// loop for the end otherwise
			for (; i < length; src = _sources[i], i++) {
				offset += src.end - src.start;
				if (offset < end) {
					sources.push(src);
				} else {
					sources.push({
						buffer: src.buffer,
						start: src.start,
						end: src.end - (offset - end)
					});
					break; // we have found the end
				}
			}
			
			return new Blob(sources, end - start, contentType); 
		}
		
		public function isEmpty() : Boolean {
			return !this._sources.length;
		}
		
		
		public function isFileRef() : Boolean 
		{
			return _sources.length === 1 && _sources[0].buffer.fileRef;
		}
		
		
		public function getFileRef() : FileReference {
			if (isFileRef()) {
				return _sources[0].buffer.fileRef;
			}
			return null;
		}
		
		
		public function toObject() : Object 
		{
			return {
				id: id,
				size: size,
				type: type
			};
		}
		
		public function purge() : void // this one simply clears out all FileReferences
		{
			var src:Object;
			
			for each (src in _sources) {
				src.buffer.purge();	
			}
		}
		
		public function destroy() : void
		{
			var src:Object;
			
			for each (src in _sources) {
				src.buffer.destroy();	
			}
		}
	}
}