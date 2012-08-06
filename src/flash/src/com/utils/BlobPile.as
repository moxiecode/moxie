package com.utils
{
	import com.Blob;
	import com.File;
	
	import flash.net.FileReference;

	public class BlobPile
	{
		private var _count:uint = 0;
		
		private var _pile:Object = {};
		
		
		public function exists(id:String) : Boolean 
		{
			return _pile.hasOwnProperty(id);
		}
		
		
		public function get(id:String) : *
		{
			if (exists(id)) {
				return _pile[id];
			}
			return false;
		}
		
		
		public function add(blob:*) : Boolean
		{
			if (_validBlob(blob) && !exists(blob.id)) {
				_pile[blob.id] = blob;
				return true;
			} 	
			return false;
		}
		
		
		public function update(blob:*) : Boolean
		{
			if (!_validBlob(blob)) {
				return false; // or maybe throw exception
			}
			
			_pile[blob.id] = blob;
			return true;
		}
		
		
		public function purge() : void
		{
		
		}
		
		
		public function destroy() : void
		{
			
		}
		
		
		private function _validBlob(blob:*) : Boolean
		{
			return (blob is Blob) && blob.hasOwnProperty('id'); 
		}
		
		
		
	}
}