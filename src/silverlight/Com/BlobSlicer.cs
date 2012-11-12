using System;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Collections.Generic;

using Moxiecode.Com.Errors;

namespace Moxiecode.Com
{
	public class BlobSlicer
	{
		public static string[] dispatches = null;

		public Dictionary<string, object> slice(object blob, object start, object end, object type)
		{
			if (blob is string) {
				if (!Moxie.blobPile.TryGetValue((string)blob, out blob)) {
					throw new DOMError(DOMError.NOT_FOUND_ERR);
				}
			}

			Blob nBlob = ((Blob)blob).slice(Convert.ToInt32(start), Convert.ToInt32(end), (string)type);

			Moxie.blobPile.Add(nBlob.id, nBlob);
			return nBlob.ToObject(); 
		}
	}
}
