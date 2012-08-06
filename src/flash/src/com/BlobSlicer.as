package com
{
	public class BlobSlicer
	{
		public function slice(blob:*, ... args) : Object
		{
			var nBlob:*;
												
			if (typeof blob === 'string') {
				blob = Moxie.blobPile.get(blob);
			}
						
			if (!blob) {
				return null;
			}
			
			nBlob = blob.slice.apply(blob, args);
			Moxie.blobPile.add(nBlob);
			nBlob = nBlob.toObject();
			nBlob.ruid = Moxie.uid;
			
			return nBlob;
		}
		
	}
}