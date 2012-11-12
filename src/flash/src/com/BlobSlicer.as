package com
{
	import com.errors.DOMError;

	public class BlobSlicer
	{
		public function slice(blob:*, ... args) : Object
		{
			var nBlob:*;
												
			if (typeof blob === 'string') {
				blob = Moxie.blobPile.get(blob);
			}
						
			if (!blob) {
				throw new DOMError(DOMError.NOT_FOUND_ERR);
			}
			
			nBlob = blob.slice.apply(blob, args);
			Moxie.blobPile.add(nBlob);
			
			return nBlob.toObject();
		}
		
	}
}