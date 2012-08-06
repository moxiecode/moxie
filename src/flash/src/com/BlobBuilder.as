package com
{
	import com.utils.Buffer;
	
	import flash.net.FileReference;
	import flash.utils.ByteArray;

	public class BlobBuilder
	{
		protected var _sources:Array = [];
		
		protected var _pointer:Number = 0;
				
		public function append(source:*, ... args) : void {			
			if (source is FileReference) {
				_sources.push({
					buffer: new Buffer(source),
					start: _pointer,
					end: (_pointer += source.size)
				});
			} else if (source is ByteArray) {
				_sources.push({
					buffer: new Buffer(source),
					start: _pointer,
					end: (_pointer += source.length)
				});
			} else if (source is Blob) {
				// increment reference counters for associated buffers
				for (var i:uint = 0, max:uint = source._sources.length; i < max; i++) {
					source._sources[i].buffer.refs++;
				}
				// simply copy over the sources
				_sources.push(source._sources);
				_pointer += source.size;
			}
		}
		
		
		public function getBlob(type:String = '') : Blob {
			return new Blob(_sources, _pointer, type);
		}
		
		public function getFile(type:String = '', name:String = '') : File {
			return new File(_sources, _pointer, type, name);
		}
		
	}
}