package mxi.image
{
	import flash.display.BitmapData;
	import flash.utils.ByteArray;

	public interface IImage
	{		
		/**
		 * Get dimensions (width & height) of the Image.
		 * This method diggs out dimensions directly from binary, is not affected by various constraints and should be fast.
		 * 
		 * @return Object e.g. { width: 800, height: 600}
		 */
		function get dimensions() : Object;
		
		/**
		 * Get Image headers, optionally by key, which is usually a marker or a tag name. 
		 * If key not passed, method will return all available (supported) headers.
		 * 
		 * @param id mixed (optional)
		 * 
		 * @return Array
		 */ 
		function getHeaders(id:* = null) : Array;
		
		
		/**
		 * Replace specified header or all of them, with a replacement array.
		 * 
		 * @params id mixed (optional) if not passed, all headers will get replaced.
		 * @params replace Array replacement for header(s)
		 */ 
		function setHeaders(... args) : void;
		
		
		/**
		 * Free memory by releasing internal storages.
		 */  
		function purge() : void;
		
		
		/**
		 * Get current ByteArray, after all registered modifications.
		 * 
		 * @return ByteArray
		 */
		function get byteArray() : ByteArray;
		
		
		/**
		 * Get BitmapData od current image, after all registered modifications.
		 * 
		 * @return BitmapData
		 */
		function get bitmapData() : BitmapData;
		
		
		/**
		 * Get thumbnail of the specified width and height, and quality (all thumbs returned as JPEGs).
		 */ 
		function getThumbnail(width:uint, height:uint, quality:uint = 90) : ByteArray;
		
		
		/**
		 * Modify Image using specified operation and arguments.
		 */
		function modify(op:string, ... args) : void;
		
		
		/**
		 * Undo the last modification.
		 */
		function undo() : void;
		
		
		/**
		 * Redo the last modification.
		 */
		function redo() : void;
		
		
		/**
		 * Check if there is anything undoable in history.
		 * 
		 * @return Boolean
		 */
		function undoable() : Boolean;
		
		
		/**
		 * Check if there is anything redoable in history.
		 * 
		 * @return Boolean
		 */
		function redoable() : Boolean;
		
		
		/**
		 * Simply undo all modifications.
		 */ 
		function revert() : void;
		
		
	}
}