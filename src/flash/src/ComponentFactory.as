package
{	
	import com.*;
	import com.errors.RuntimeError;
	
	import flash.system.ApplicationDomain;
	import flash.utils.*;
	
	import mxi.Utils;
	
	public class ComponentFactory
	{
		// depending on command-line params, conditionally compile image manipulation logic or not (default is - compile)
		BUILD::NOIMAGE {
			FileInput, FileReader, FileReaderSync, BlobSlicer, XMLHttpRequest, Transporter;
		}
		BUILD::IMAGE {
			FileInput, FileReader, FileReaderSync, BlobSlicer, XMLHttpRequest, Image, ImageView, Transporter;
		}
		
		private var _registry:Object = {};
		
		public function get(uid:String, compName:String) : * 
		{		
			return _registry.hasOwnProperty(uid) && _registry[uid].hasOwnProperty(compName) ? _registry[uid][compName] : false;
		}
		
		public function create(mOxie:Moxie, uid:String, compName:String) : *
		{
			var compFQName:String, compClass:Class, exType:String, comp:*; 	
			
			compFQName = "com." + compName;
			
			if (ApplicationDomain.currentDomain.hasDefinition(compFQName)) {
				compClass = getDefinitionByName(compFQName) as Class;
				comp = new compClass;
				
				// if object dispatches events attach event listeners (@see for example FileInput for the interface)
				if (compClass.dispatches) {
					for (exType in compClass.dispatches) {
						// new context required to handle this properly
						(function(type:String, exType:String) : void {
							comp.addEventListener(type, function(e:*) : void {
								mOxie.onComponentEvent(uid, e, exType);
							});	
						}(compClass.dispatches[exType], /*compName + '::' + */exType));
					}						
				}
				
				// Moxie.log([uid, compName]);
				
				// if component is descendant of the Sprite, add it to the stage
				if (/Sprite$/.test(getQualifiedSuperclassName(comp))) {
					mOxie.addChild(comp);
				}
				
				if (!_registry.hasOwnProperty(uid)) {
					_registry[uid] = {};
				}
				
				_registry[uid][compName] = comp;
				
				return comp;
			} else {
				throw new RuntimeError(RuntimeError.NOT_SUPPORTED_ERR);
			}	
		}
		
		
	}
}