package com
{
	import com.events.ImageEditorEvent;
	import com.utils.OEventDispatcher;
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Shader;
	import flash.display.ShaderJob;
	import flash.events.Event;
	import flash.events.ShaderEvent;
	import flash.filters.BlurFilter;
	import flash.filters.ColorMatrixFilter;
	import flash.filters.ConvolutionFilter;
	import flash.geom.ColorTransform;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	import mxi.image.ascb.filters.ColorMatrixArrays;
	import mxi.image.ascb.filters.ConvolutionMatrixArrays;
	import mxi.events.OProgressEvent;
	
	
	public class ImageEditor extends OEventDispatcher
	{	
		[Embed (source="/shaders/BilinearScale.pbj", mimeType="application/octet-stream")]
		private const BilinearScale:Class;
		
		[Embed (source="/shaders/BicubicScale.pbj", mimeType="application/octet-stream")]
		private const BicubicScale:Class;
		
		[Embed (source="/shaders/NearestNeighbourScale.pbj", mimeType="application/octet-stream")]
		private const NearestNeighbourScale:Class;
		
		private var _bdOriginal:BitmapData;
		private var _bd:BitmapData;
		
		private var _matrix:Matrix = new Matrix();
		
		private var _history:Array = [];
		private var _historyIndex:int = 0;
		private var _commitIndex:int = 0;
		private var _renderIndex:int = 0;
		
		private var _currOp:Object = null;
		
		
		private var _lastModifyIndex:int = 0;
		
		private var _busy:Boolean = false;
		private var _crop:Rectangle = null;		
				
		
		public function get bitmapData() : BitmapData {
			return (_bd ? _bd : _bdOriginal).clone();
		}
		
		public function get busy() : Boolean {
			return _busy;
		}
		
		
		public function ImageEditor(bd:BitmapData)
		{
			_bdOriginal = bd.clone();
		}
		
		/**
		 * @param {String} op Operation name to undertake
		 * @param {...} args Variable number of arguments for the specified operation
		 */
		public function modify(op:String, ... args) : void
		{	
			if (typeof(this['_'+op]) != 'function') { // ignore operation that we cannot handle
				return;
			}
						
			if (canRedo()) {
				_history.length = _historyIndex + 1; // discard extra redoable ops
			}
			
			_history.push({
				'method': '_'+op,
				'args': args
			});

			_historyIndex++;
		}
		
		/**
		 * Commits all  pending operations, if any
		 * 
		 * @param {Boolean} [sync=true] Whether to commit modifications synchronously
		 */ 
		public function commit(sync:Boolean = true) : void
		{			
			if (!_busy) {
				_busy = true;				
				commitNext(); 
			}
		}
		
		
		public function canUndo() : Boolean
		{
			return !!_history.length;
		}
		
		
		public function canRedo() : Boolean
		{
			return _historyIndex < _history.length;
		}
		
			
		public function undo() : void
		{
			if (canUndo()) {	
				_historyIndex--;
				
				if (_historyIndex < _commitIndex) {
					_commitIndex = 0;
					if (_bd) {
						_bd.dispose();
						_bd = null;
					}
					_matrix = new Matrix();
				}
			}
		}
		
		
		public function redo() : void
		{
			if (canRedo()) {
				_historyIndex++;
			}	
		}
		
		
		public function purge() : void 
		{
			if (_bd) {
				_bd.dispose();
			}
			_bdOriginal.dispose();
		}
		
		
		public function destroy() : void 
		{
			purge();
			removeAllEventsListeners();
		}
		
		
		private function commitNext() : void
		{
			if (_commitIndex < _historyIndex) {
				_currOp = _history[_commitIndex];
				this[_currOp.method].apply(null, _currOp.args);
			} else {
				_busy = false;
				dispatchEvent(new ImageEditorEvent(ImageEditorEvent.COMPLETE));	
			}	
		}
		
		
		private function onOperationComplete() : void
		{
			_commitIndex++;
			dispatchEvent(new ImageEditorEvent(ImageEditorEvent.COMMIT_COMPLETE));
			commitNext();
		}
		
		
		private function onDrawComplete() : void
		{
			_renderIndex = _commitIndex;
			dispatchEvent(new ImageEditorEvent(ImageEditorEvent.DRAW_COMPLETE));	
		}
		
		
		
		protected function _rotate(angle:Number) : void
		{		
			_matrix.translate(-_bd.width/2,-_bd.height/2);
			_matrix.rotate(angle / 180 * Math.PI);
			_matrix.translate(_bd.width/2,_bd.height/2);
			onOperationComplete();
		}
		
		protected function _flipH() : void
		{
			_matrix.scale(-1, 1);
			_matrix.translate(_bd.width, 0);
			onOperationComplete();
		}
		
		
		protected function _flipV() : void
		{
			_matrix.scale(1, -1);
			_matrix.translate(0, _bd.height);
			onOperationComplete();
		}
		
		protected function _resize(w:Number, h:Number) : void
		{
			_matrix.scale(w / _bd.width, h / _bd.height);
			onOperationComplete();
		}
		
		
		protected function _scale(scale:Number, resample:String = 'default', multiStep:Boolean = true) : void
		{			
			if (resample == 'default') {
				_matrix.scale(scale, scale);
				onOperationComplete();
				return;
			}
			
			if (!_bd) {
				_bd = _bdOriginal.clone();
			}
			draw();
			
			var step:uint = 1;
			var dstWidth:Number = _bd.width * scale;
						
			// find out how many steps will we require until we arrive at final dimensions
			// we only need this to fire a progress event as we descend
			var totalSteps:uint = 1;
			if (multiStep) {
				totalSteps = (function(tmpWidth:Number, newScale:Number) : uint {
					var steps:uint = 1;
					while (newScale < 0.5 || newScale > 2) {
						tmpWidth = newScale < 0.5 ? tmpWidth / 2 : tmpWidth * 2;
						newScale = dstWidth / tmpWidth;
						steps++;
					}
					return steps;
				}(_bd.width, scale));
			}
			
			
			function scale2(newScale:Number) : void {				
				if (newScale < 0.5 || newScale > 2) {
					newScale = newScale < 0.5 ? 0.5 : 2;
				}
				
				// special care for default scaling method
				if (resample == 'deafult') {
					_matrix.scale(newScale, newScale);
					onOperationComplete();
					draw();
					if (_bd.width <= dstWidth) {
						onDrawComplete();
					} else {
						dispatchEvent(new OProgressEvent(OProgressEvent.PROGRESS, step++, totalSteps));
						scale2(dstWidth / _bd.width);
					}
					return;
				}
				
				// ... proceed with shaders and PixelBender
				var shader:Shader = new Shader();
				var job:ShaderJob = new ShaderJob();
				var tmpBd:BitmapData = new BitmapData(_bd.width * newScale, _bd.height * newScale);
				
				switch (resample) {	
					case 'nearest':
						shader.byteCode = new NearestNeighbourScale();
						break;
					
					case 'bicubic':
						shader.byteCode = new BicubicScale(); 
						break;
					
					case 'bilinear':
						shader.byteCode = new BilinearScale();
						break;
					
					default: return;
				}
				
				// order matters - byteCode should be assigned first (that's why it is above this)
				shader.data.src.input = _bd;
				shader.data.scale.value = [newScale];			
				
				job.target = tmpBd;
				job.shader = shader;
				
				job.addEventListener(ShaderEvent.COMPLETE, function onJobComplete() : void {					
					_bd.dispose();
					_bd = tmpBd;
					
					if (tmpBd.width <= dstWidth) {
						onOperationComplete();
						onDrawComplete();
					} else {
						dispatchEvent(new OProgressEvent(OProgressEvent.PROGRESS, step++, totalSteps));
						scale2(dstWidth / tmpBd.width);
					}	
				}, false, 0, true);
				
				job.start(); 				
			}
			
			scale2(scale);
		}
		
		
		protected function _sharpen() : void
		{
			applyConvolution(ConvolutionMatrixArrays.SHARPEN);
			onOperationComplete();
			onDrawComplete();
		}
		
		protected function _emboss() : void
		{
			applyConvolution(ConvolutionMatrixArrays.EMBOSS);
			onOperationComplete();
			onDrawComplete();
		}
		
		protected function _grayscale() : void
		{
			applyColorMatrix(ColorMatrixArrays.GRAYSCALE);
			onOperationComplete();
			onDrawComplete();
		}
		
		protected function _sepia() : void
		{
			applyColorMatrix(ColorMatrixArrays.SEPIA);
			onOperationComplete();
			onDrawComplete();
		}
		
		
		protected function _invert() : void
		{
			applyColorMatrix(ColorMatrixArrays.DIGITAL_NEGATIVE);
			onOperationComplete();
			onDrawComplete();
		}
		
		
		protected function _brightness(value:int) : void
		{			
			applyColorMatrix(ColorMatrixArrays.getBrightnessArray(Math.floor(255 * value)));
			onOperationComplete();
			onDrawComplete();
		}
		
		
		protected function _contrast(value:Number) : void
		{	
			applyColorMatrix(ColorMatrixArrays.getContrastArray(value));
			onOperationComplete();
			onDrawComplete();
			
		}
		
		protected function _saturate(value:Number) : void
		{	
			applyColorMatrix(ColorMatrixArrays.getSaturationArray(value));
			onOperationComplete();
			onDrawComplete();
		}
		
		
		protected function _blur(value:Number = 0.02, quality:int = 1) : void
		{
			if (!_bd) {
				_bd = _bdOriginal.clone();
			}
			
			value = Math.floor(255 * value);
			
			if (value & 1) {
				value--; // even values are processed faster
			}
			
			_bd.applyFilter(_bd, _bd.rect, new Point(0, 0), new BlurFilter(value, value, quality));
			onOperationComplete();
			onDrawComplete();
		}
		
		
		protected function applyConvolution(matrix:Array, devisor:Number = 1.0) : void
		{
			if (!_bd) {
				_bd = _bdOriginal.clone();
			}
			draw();
			_bd.applyFilter(_bd, _bd.rect, new Point(0, 0), new ConvolutionFilter(3, 3, matrix, devisor));
		}
		
		
		protected function applyColorMatrix(matrix:Array) : void
		{
			if (!_bd) {
				_bd = _bdOriginal.clone();
			}
			draw();
			_bd.applyFilter(_bd, _bd.rect, new Point(0, 0), new ColorMatrixFilter(matrix));
		}
		
		
		/**
		 * Redraws current bitmap taking into account pending transformations
		 */ 
		private function draw() : void
		{	
			if (_renderIndex >= _commitIndex) {
				return;
			}
			
			// Finding the four corners of the bounfing box after transformation
			var tl:Point = _matrix.transformPoint(new Point(0, 0));
			var tr:Point = _matrix.transformPoint(new Point(_bd.width, 0));
			var bl:Point = _matrix.transformPoint(new Point(0, _bd.height));
			var br:Point = _matrix.transformPoint(new Point(_bd.width, _bd.height));
			
			// Calculating "who" is "where"
			var top:Number = Math.min(tl.y, tr.y, bl.y, br.y);
			var bottom:Number = Math.max(tl.y, tr.y, bl.y, br.y);
			var left:Number = Math.min(tl.x, tr.x, bl.x, br.x);
			var right:Number = Math.max(tl.x, tr.x, bl.x, br.x);
			
			// Adjusting final position
			_matrix.translate(-left, -top);
			
			// Calculating the size of the new BitmapData
			var width:Number = right - left;
			var height:Number = bottom - top;
			
			// Creating and drawing (with transformation)
			var result:BitmapData = new BitmapData(width, height);
			result.draw(_bd, _matrix);	
			_bd.dispose();
			_bd = result;
			
			_matrix = new Matrix();			
		}
		
		
	}
}