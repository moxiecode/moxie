package com
{
	
	public class File extends Blob
	{
		private var _name:String = '';
		public function get name() : String {
			if (_name !== '') {
				return _name;
			}
			// if source is not a FileReference return default name
			if (!isFileRef()) {
				return 'file_' + id;
			}
			// otherwise return original name
			return _sources[0].buffer.fileRef.name;
		}
				
		
		private var _lastModifiedDate:Date;
		public function get lastModifiedDate() : Date {
			if (!isFileRef()) {
				return new Date();
			}
			return _sources[0].buffer.fileRef.modificationDate;
		}
				
		
		public function File(sources:Array, size:Number, type:String = '', name:String = '')
		{
			_name = name;
			super(sources, size, type);		
		}
		
		
		public override function toObject() : Object {
			return {
				id: id,
				size: size,
				type: type,
				name: name,
				lastModifiedDate: lastModifiedDate
			};
		}
		
	}
}