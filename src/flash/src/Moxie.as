package
{
	import com.*;
	import com.errors.RuntimeError;
	import com.events.*;
	import com.utils.BlobPile;
	
	import flash.display.LoaderInfo;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.external.ExternalInterface;
	import flash.system.ApplicationDomain;
	import flash.system.Security;
	import flash.utils.*;
	
	import mxi.Extend;
	import mxi.Utils;
	import mxi.events.ODataEvent;
	import mxi.events.OProgressEvent;
	
	[SWF(width='500', height='500')] 
	public class Moxie extends Sprite
	{		
		public static var uid:String;
				
		public static var comps:ComponentFactory;
		
		public static var blobPile:BlobPile;
		
		public static var stageOccupied:Boolean = false; // whether a display facility is already occupied
				
						
		/**
		 * Main constructor for the Plupload class.
		 */
		public function Moxie()
		{
			if (stage) {
				_init();
			} else {
				addEventListener(Event.ADDED_TO_STAGE, init);
			}
		}
		
		
		/**
		 * Initialization event handler.
		 *
		 * @param e Event object.
		 */
		private function _init(e:Event = null):void 
		{			
			removeEventListener(Event.ADDED_TO_STAGE, _init);
						
			// Allow scripting on swf loaded from another domain
			// Security.allowDomain("*");
			
			// Align and scale stage
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.EXACT_FIT;
						
			// Setup id
			Moxie.uid = stage.loaderInfo.parameters["uid"];			
			
			//ExternalInterface.marshallExceptions = true; // propagate AS exceptions to JS and vice-versa
			ExternalInterface.addCallback('exec', exec);
			ExternalInterface.addCallback('isOccupied', isOccupied);
			
			// initialize component factory
			Moxie.comps = new ComponentFactory;
			
			// blob registry
			Moxie.blobPile = new BlobPile;
						
			_fireEvent(Moxie.uid + "::Init");			
		}
		
		
		public function exec(uid:String, compName:String, action:String, args:* = null) : *
		{			
			// Moxie.log([uid, compName, action, args]);
			
			var result:*, comp:* = Moxie.comps.get(uid, compName);	
									
			try {
				// initialize corresponding com 
				if (!comp) { 
					comp = Moxie.comps.create(this, uid, compName);	
				}		
			
				// execute the action if available
				if (comp.hasOwnProperty(action)) {	
					return comp[action].apply(comp, args as Array);
				} else {
					_fireEvent(uid + "::Exception", { name: "RuntimeError", code: RuntimeError.NOT_SUPPORTED_ERR });
				}
				
			} catch(err:*) { // re-route exceptions thrown by components (TODO: check marshallExceptions feature)
				_fireEvent(uid + "::Exception", { name: getQualifiedClassName(err).replace(/^[^:*]::/, ''), code: err.id });
			}
		}
		
		
		public function isOccupied() : Boolean {
			return Moxie.stageOccupied;
		}
		
		
		/**
		 * Intercept component events and do some operations if required
		 * 
		 * @param uid String unique identifier of the component throwing the event
		 * @param e mixed Event object
		 * @param exType String event type in mOxie format
		 */
		public function onComponentEvent(uid:String, e:*, exType:String) : void 
		{
			var evt:Object = {};
			
			switch (e.type) 
			{						
				case ProgressEvent.PROGRESS:
				case OProgressEvent.PROGRESS:
					evt.loaded = e.bytesLoaded;
					evt.total = e.bytesTotal;
					break;
			}
									
			evt.type = [uid, exType].join('::');
			evt.async = true;
									
			_fireEvent(evt, e.hasOwnProperty('data') ? e.data : null);
		}
		
		
		
		/**
		 * Fires an event from the flash movie out to the page level JS.
		 *
		 * @param uid String unique identifier of the component throwing the event
		 * @param type Name of event to fire.
		 * @param obj Object with optional data.
		 */
		private function _fireEvent(evt:*, obj:Object = null):void {
			try {
				ExternalInterface.call("mOxie.eventTarget.dispatchEvent", evt, obj);
			} catch(err:*) {
				//_fireEvent("Exception", { name: 'RuntimeError', message: 4 });
				
				// throwing an exception would be better here
			}
		}
		
		
		public static function log(obj:*) : void {
			ExternalInterface.call('console.info', obj);
		}

	}
}