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


		public Blob slice(int start, int end, string type)
		{
			if (start > end) {
				return new Blob(new List<BufferRegion>(), 0, type);
			}

			long size, offset = 0;
			int i = 0, length = _sources.Count;
			BufferRegion src;
			List<BufferRegion> sources = new List<BufferRegion>();

			for (; i < length; i++) {
				src = _sources[i];
				size = src.end - src.start;
								
				if (start > offset + size) { // start is outside of the current source's boundaries 
					continue;
				}
								
				sources.Add(new BufferRegion(src.buffer, src.start + start - offset, Math.Min(src.end, end)));
				offset += size;
				break;
			}
			
			if (i == length || offset > end) {
				return new Blob(sources, end - start, type);
			} 
			
			// loop for the end otherwise
			for (; i < length; i++) {
				src = _sources[i];
				offset += src.end - src.start;
				if (offset < end) {
					sources.Add(src);
				} else {
					sources.Add(new BufferRegion(src.buffer, src.start, src.end - (offset - end)));
					break; // we have found the end
				}
			}
			
			return new Blob(sources, end - start, type);
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
