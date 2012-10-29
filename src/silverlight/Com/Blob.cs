using System;
using System.Net;
using System.IO;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Browser;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace Moxiecode.Com
{
	public class Blob
	{
		private static uint _counter = 1;

		private string _id;
		public string id {
			get {
				return _id;
			}
		}

		private long _size = 0;
		public long size {
			get {
				return _size;
			}
		}

		private string _type;
		public string type {
			get {
				return _type;
			}
		}

		public List<BufferRegion> _sources;


		public Blob(List<BufferRegion> sources, long size, string type = "")
		{
			_id = (_counter++).ToString();
			
			_sources = sources;
			_size = size; 
			_type = type;
		}


		public virtual Dictionary<string, object> ToObject()
		{
			Dictionary<string, object> dict = new Dictionary<string, object>();
			dict.Add("id", this.id);
			dict.Add("ruid", Moxie.uid);
			dict.Add("size", this.size);
			dict.Add("type", this.type);
			return dict;
		}
	}
}
