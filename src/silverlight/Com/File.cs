using System;
using System.Net;
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
	[ScriptableType]
	public class File : Blob
	{
		private string _name;
		[ScriptableMember]
		public string name {
			get {
				return _name;
			}
		}

		private DateTime _lastModifiedDate;
		[ScriptableMember]
		public string lastModifiedDate {
			get {
				return _lastModifiedDate.ToString("ddd MMM yyyy hh:mm:ss 'GMT'K"); // Thu Aug 23 2012 19:40:00 GMT+0400 (GET)
			}
		}

		public File(List<BufferRegion> sources, long size, string type = "", string name = "") : base(sources, size, type)
		{
			// figure out last modified date
			sources.ForEach(delegate(BufferRegion source)
			{
				if (_lastModifiedDate == null || _lastModifiedDate.CompareTo(source.buffer.lastModifiedDate) < 0) 
				{
					_lastModifiedDate = source.buffer.lastModifiedDate;
				}
			});

			// if no name was passed take one from first file reference
			if (name == "") {
				_name = sources[0].buffer.name;
			} else {
				_name = name;
			}
		}

		public override Dictionary<string, object> ToObject()
		{
			Dictionary<string, object> dict = base.ToObject();
			dict.Add("name", this.name);
			dict.Add("lastModifiedDate", this.lastModifiedDate);

			return dict;
		}
	}


}
