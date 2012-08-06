package com
{
	import flash.filters.BlurFilter;
	import flash.filters.ColorMatrixFilter;
	import flash.filters.ConvolutionFilter;
	import flash.geom.ColorTransform;
	import flash.geom.Matrix;
	import flash.geom.Rectangle;
	
	import mxi.image.ascb.filters.ColorMatrixArrays;
	import mxi.image.ascb.filters.ConvolutionMatrixArrays;
	
	
	public class ImageEditor
	{
		private var _history:Array;
		
		private var _historyIndex:uint = 0;
		
		private var _crop:Rectangle = null;		
		
		private var _matrix:Matrix;
		
		private var _lastReleaseIndex:uint = 0;
		
		private var _renderAfterEveryModify:Boolean = true;
		
		
		public function ImageEditor()
		{
		}
		
		
		public function modify(op:String, ... args) : void
		{
			_historyIndex++;
			
			if (redoable()) {
				_history.length = _historyIndex; // discard extra redoable ops
			}
			
			_history[_historyIndex] = {
				'op': op,
				'args': args
			};	
			
			if (_renderAfterEveryModify) {
				render();
			}
		}
		
		
		public function render() : void
		{
			_doModifications(_lastReleaseIndex, _historyIndex); // do only incremental modifications if possible
			_lastReleaseIndex = _historyIndex;
		}
		
		
		public function undoable() : Boolean
		{
			return !!_history.length;
		}
		
		
		public function redoable() : Boolean
		{
			return _historyIndex < _history.length;
		}
		
		
		public function undo() : void
		{
			if (undoable()) {	
				_historyIndex--;
				
				if (_historyIndex < _lastReleaseIndex) {
					_lastReleaseIndex = 0;
				}
			}
		}
		
		public function redo() : void
		{
			if (redoable()) {
				_historyIndex++;
			}	
		}
		
		
		public function purge() : void 
		{
			
		}
		
		
		
		
		
		
		protected function _doModifications(start:uint, end:uint) : void
		{
			if (!_bm) {
				return; // throw an exception
			}
			
			for (var i:uint = start, mod:Object; i <= end; mod = _history[i], i++) {
				
				if (typeof this[mod.op] === 'function') {
					this[mod.op].apply(this, mod.args);
				} 
			}
		}
		
		
		protected function rotate(angle:Number) : void
		{
			_matrix = new Matrix;
			_matrix.translate(_bm.x - _bm.width/2, _bm.y -_bm.height/2);
			_matrix.rotate(angle / 180 * Math.PI);
			_matrix.translate(_bm.y + _bm.height/2, _bm.y + _bm.width/2);
			_bm.transform.matrix = _matrix;			
		}
		
		protected function flipH() : void
		{
			_matrix = new Matrix;
			_matrix.scale(-1, 1);
			_matrix.translate(_bm.x + _bm.width, 0);
			_bm.transform.matrix = _matrix;
		}
		
		
		protected function flipV() : void
		{
			_matrix = new Matrix;
			_matrix.scale(1, -1);
			_matrix.translate(0, _bm.y + _bm.height);
			_bm.transform.matrix = _matrix;
		}
		
		protected function resize(w:Number, h:Number) : void
		{
			_matrix = new Matrix;
			_matrix.scale(w / _bm.width, h / _bm.height);
			_bm.transform.matrix = _matrix;
		}
		
		
		protected function crop(rect:Rectangle) : void
		{
			
		}
		
		
		protected function sharpen() : void
		{
			applyConvolution(ConvolutionMatrixArrays.SHARPEN);
		}
		
		protected function emboss() : void
		{
			applyConvolution(ConvolutionMatrixArrays.EMBOSS);
		}
		
		protected function grayscale() : void
		{
			applyColorMatrix(ColorMatrixArrays.GRAYSCALE);
		}
		
		protected function sepia() : void
		{
			applyColorMatrix(ColorMatrixArrays.SEPIA);
		}
		
		
		protected function invert() : void
		{
			applyColorMatrix(ColorMatrixArrays.DIGITAL_NEGATIVE);
		}
		
		
		protected function brightness(value:int) : void
		{			
			applyColorMatrix(ColorMatrixArrays.getBrightnessArray(Math.floor(255 * value)));
		}
		
		
		protected function contrast(value:Number) : void
		{	
			applyColorMatrix(ColorMatrixArrays.getContrastArray(value));
		}
		
		protected function saturate(value:Number) : void
		{	
			applyColorMatrix(ColorMatrixArrays.getSaturationArray(value));
		}
		
		
		protected function blur(value:Number = 0.02, quality:int = 1) : void
		{
			var filters:Array = _bm.filters;
			
			value = Math.floor(255 * value);
			
			if (value & 1) {
				value--; // even values are processed faster
			}
			
			filters.push(new BlurFilter(value, value, quality));
			_bm.filters = filters;
		}
		
		
		protected function applyConvolution(matrix:Array, devisor:Number = 1.0) : void
		{
			var filters:Array = _bm.filters;
			filters.push(new ConvolutionFilter(3, 3, matrix, devisor));
			_bm.filters = filters;
		}
		
		
		protected function applyColorMatrix(matrix:Array) : void
		{
			var filters:Array = _bm.filters;
			filters.push(new ColorMatrixFilter(matrix));
			_bm.filters = filters;
		}
		
		
	}
}