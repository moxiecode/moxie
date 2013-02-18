using System;
using System.Net;
using System.IO;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace Moxiecode.Com
{
	public class BlobBuilder
	{
		private List<BufferRegion> _sources;

		private long _pointer = 0;

		public BlobBuilder()
		{
			_sources = new List<BufferRegion>();
		}

		public void append(FileInfo source)
		{
			_sources.Add(new BufferRegion(new Buffer(source)));
			_pointer += source.Length;
		}

		public void append(byte[] source)
		{
			_sources.Add(new BufferRegion(new Buffer(source)));
			_pointer += source.Length;
		}

		public void append(MemoryStream source)
		{
			_sources.Add(new BufferRegion(new Buffer(source)));
			_pointer += source.Length;
		}

		public void append(Blob source)
		{
			source._sources.ForEach(delegate(BufferRegion region)
			{
				region.buffer.refs++;
				_sources.Add(region);
				_pointer += source.size;
			});
		}

		public Blob getBlob(string type = "")
		{
			return new Blob(_sources, _pointer, type);
		}

		public File getFile(string type = "", string name = "")
		{
			return new File(_sources, _pointer, type, name);
		}
	}


	public class Buffer
	{
		public uint refs = 1;

		public DateTime lastModifiedDate = new DateTime();

		private FileInfo _fileInfo;
		public FileInfo fileInfo {
			get {
				return _fileInfo;
			}
		}

		private Stream _stream;
		public Stream stream {
			get {
				return _stream;
			}
		}

		public long size {
			get {
				if (_stream != null) {
					return _stream.Length;
				}
				return 0;
			}
		}

		public string name
		{
			get {
				if (_fileInfo != null) {
					return _fileInfo.Name;
				}
				return "";
			}
		}

		public long Position {
			get {
				Stream stream = getStream();
				if (stream != null) {
					return stream.Position;
				}
				return 0;
			} 
			set {
				Stream stream = getStream();
				if (stream != null) {
					stream.Position = value;
				}
			}
		}

		public Buffer(FileInfo fileInfo)
		{
			_fileInfo = fileInfo;
			// lastModifiedDate = _fileInfo.LastAccessTime; // throws exception
			lastModifiedDate = DateTime.Now;
			_stream = _fileInfo.OpenRead();
		}

		public Buffer(byte[] data)
		{
			_stream = new MemoryStream(data);
			lastModifiedDate = DateTime.Now;
		}

		public Buffer(MemoryStream stream)
		{
			_stream = stream;
		}

		public Stream getStream()
		{
			return _stream;
		}
	}


	public class BufferRegion {

		public long start;

		public long end;

		public Buffer buffer;

		public long size {
			get {
				return this.end - this.start;
			}
		}

		public long Position {
			get {
				return buffer.Position - this.start;
			}
			set {
				buffer.Position = value + this.start;
			}
		}

		public BufferRegion(Buffer buffer, long start = 0, long end = -1)
		{
			this.start = start;
			this.end = end < 0 ? buffer.size : end;
			this.buffer = buffer;
			this.Position = 0;
		}

		public int Read(byte[] ba, int offset = 0, int count = 0)
		{
			Stream stream = buffer.getStream();
			if (stream == null) {
				return 0;
			}

			if (count == 0 || this.start + count > this.end) {
				count = (int)(this.end - this.start);
			}

			int bytesRead = stream.Read(ba, offset, count);
			return bytesRead;
		}

		public void ReadToEnd(byte[] ba)
		{
			Read(ba);
		}
	}
}
