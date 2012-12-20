using System;
using System.Net;
using System.Net.Browser;
using System.IO;
using System.Collections.Generic;
using System.Threading;
using System.Windows;
using System.Windows.Browser;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

using Moxiecode.Com.Events;
using Moxiecode.Com.Errors;

namespace Moxiecode.Com
{
	public delegate void ProgressEventHandler(object sender, ProgressEventArgs args);

	public class XMLHttpRequest
	{
		public static string[] dispatches = new string[] 
		{
			"LoadStart", 
			"Progress",
			"UploadProgress",
			"Load",
			"Error"
		};

		public static ManualResetEvent allDone = new ManualResetEvent(false);

		public event EventHandler LoadStart;
		public event ProgressEventHandler Progress;
		public event ProgressEventHandler UploadProgress;
		public event EventHandler Load;
		public event EventHandler Error;

		
		private Dictionary<string, string> _options;
		
		private bool _multipart = false;
		private byte[] _multipartHeader;
		private byte[] _multipartFooter;

		private Dictionary<string, string> _headers;
		
		private object _blob;
		
		private string _blobName;
		
		private string _blobFieldName;
		
		private  Dictionary<string, string> _postData;
		
		private MemoryStream _response;

		private int _status;

		private string _statusText;

		private HttpWebRequest _req;

		private SynchronizationContext _syncContext; 


		public XMLHttpRequest()
		{
			this._reset();
		}


		public void setRequestHeader(object name, object value)
		{
			_headers.Add((string)name, (string)value);
		}


		public void append(object name, object value)
		{
			_multipart = true;
			_postData.Add((string)name, (string)value);
		}


		public void appendBlob(object name, object blob)
		{
			_multipart = true;
			_blobFieldName = (string)name;
			_blob = blob;

			if (_blob is string) {
				if (!Moxie.blobPile.TryGetValue((string)_blob, out _blob)) {
					throw new DOMError(DOMError.NOT_FOUND_ERR);
				}
			}

			if (_blob is Blob) {
				_blobName = _blob is File && ((File)_blob).name != "" ? ((File)_blob).name : "blob" + DateTime.Now.Ticks;
			}
		}


		public int getStatus()
		{
			return _status;
		}


		public string getStatusText()
		{
			return _statusText;
		}


		public Dictionary<string, object> getResponseAsBlob()
		{
			if (_response == null) {
				return null;
			}

			BlobBuilder bb = new BlobBuilder();
			bb.append(_response);
			File blob = bb.getFile();
			Moxie.blobPile.Add(blob.id, blob);
			return blob.ToObject();
		}


		public void abort()
		{
			if (_req != null) {
				_req.Abort();
				_req = null;
			}
		}


		public void send(ScriptObject args)
		{
			_options = _extractOptions(args);

			if (_options["method"] != "POST" && _options["method"] != "GET") {
				// trigger error
				return;
			}

			_req = (HttpWebRequest)WebRequestCreator.ClientHttp.Create(new Uri(_options["url"]));
			_req.Method = _options["method"];
            // disable buffering (this only works for ClientHttp version)
			//_req.AllowWriteStreamBuffering = false; // causes silent crash on Mac OS X 10.8.x

			// add custom headers
			if (_headers.Count != 0)
			{
				foreach (string key in _headers.Keys)
				{
					if (_headers[key] == null)
						continue;

					switch (key.ToLower())
					{
						// in silverlight 3, these are set by the web browser that hosts the Silverlight application.
						// http://msdn.microsoft.com/en-us/library/system.net.httpwebrequest%28v=vs.95%29.aspx
						case "connection":
						case "content-length":
						case "expect":
						case "if-modified-since":
						case "referer":
						case "transfer-encoding":
						case "user-agent":
							break;

						// in silverlight this isn't supported, can not find reference to why not
						case "range":
							break;

						// in .NET Framework 3.5 and below, these are set by the system.
						// http://msdn.microsoft.com/en-us/library/system.net.httpwebrequest%28v=VS.90%29.aspx
						case "date":
						case "host":
							break;

						case "accept":
							_req.Accept = (string)_headers[key];
							break;

						case "content-type":
							_req.ContentType = _headers[key];
							break;
						default:
							_req.Headers[key] = (string)_headers[key];
							break;
					}
				}
			}

			_req.ContentLength = 0;
			if (_blob != null) {
				_req.ContentLength = ((Blob)_blob).size;
			}

			if (_multipart)
			{
				string boundary = "----moxieboundary" + DateTime.Now.Ticks, dashdash = "--", crlf = "\r\n";
				string header = "";

				// append mutlipart parameters
				foreach (KeyValuePair<string, string> pair in _postData)
				{
					header +=
						dashdash + boundary + crlf +
						"Content-Disposition: form-data; name=\"" + pair.Key + '"' + crlf + crlf +
						pair.Value + crlf;
				}

				// append multipart file header
				if (_blob != null)
				{
					header += 
						dashdash + boundary + crlf +
						"Content-Disposition: form-data; name=\"" + _blobFieldName + "\"; filename=\"" + _blobName + '"' +
						crlf + "Content-Type: " + _options["mimeType"] + crlf + crlf;
				}

				_multipartHeader = _stringToByteArray(header);
				_multipartFooter = _stringToByteArray((_blob != null ? crlf : "") + dashdash + boundary + dashdash + crlf);

				_req.ContentLength += _multipartHeader.Length + _multipartFooter.Length;
				_req.ContentType = "multipart/form-data; boundary=" + boundary;
			}
			else
			{
				_req.ContentType = "application/octet-stream";
			}

			LoadStart(this, null);

			_syncContext = SynchronizationContext.Current;
			IAsyncResult asyncResult = _req.BeginGetRequestStream(new AsyncCallback(_beginRequestStreamCallback), _req);
		}


		private void _beginRequestStreamCallback(IAsyncResult asynchronousResult)
		{
			HttpWebRequest req = (HttpWebRequest)asynchronousResult.AsyncState;

			try
			{
				using (Stream reqStream = req.EndGetRequestStream(asynchronousResult))
				{
					if (_multipart) {
						reqStream.Write(_multipartHeader, 0, _multipartHeader.Length);
					}
					 
					// stream the file
					if (_blob != null)
					{
						Blob blob = (Blob)_blob;
						FileReader fileReader = new FileReader();
						
						int bytesRead = 0;
						long bytesLoaded = 0;
						byte[] buffer = new byte[1024 * 200];
	
						while ((bytesRead = fileReader.Read(blob, buffer, 0, buffer.Length)) != 0)
						{
							reqStream.Write(buffer, 0, bytesRead);
							reqStream.Flush(); // will block until data is sent

							bytesLoaded += bytesRead;
							_fireUploadProgress(bytesLoaded, blob.size);
						}
					}

					// append multipart file footer
					if (_multipart) {
						reqStream.Write(_multipartFooter, 0, _multipartFooter.Length);
					}
				}
			}
			catch (WebException ex) 
			{
				if (ex.Status != WebExceptionStatus.RequestCanceled) // if request was not aborted
				{
					_syncContext.Post(delegate
					{
						Error(this, null);
					}, this);
				}
			}
			catch (Exception ex)
			{
				_syncContext.Post(delegate
				{
					Error(this, null);
				}, this);
			}


			try
			{
				req.BeginGetResponse(new AsyncCallback(_responseCallback), req);
			}
			catch (WebException ex)
			{
				if (ex.Status != WebExceptionStatus.RequestCanceled) // if request was not aborted
				{
					_syncContext.Post(delegate
					{
						Error(this, null);
					}, this);
				}
			}
			catch (Exception ex)
			{
				_syncContext.Post(delegate
				{
					Error(this, null);
				}, this);
			}
		}


		private void _responseCallback(IAsyncResult asynchronousResult)
		{
			HttpWebRequest req = (HttpWebRequest)asynchronousResult.AsyncState;

			try
			{
				using (HttpWebResponse response = (HttpWebResponse)req.EndGetResponse(asynchronousResult))
				{
					_status = (int)response.StatusCode;
					_statusText = response.StatusDescription;

					using (Stream responseStream = response.GetResponseStream())
					{
						_response = new MemoryStream();
						responseStream.CopyTo(_response);
						_response.Position = 0;
					}
				}

				_syncContext.Post(delegate
				{
					Load(this, null);
				}, this);
			}
			catch (WebException ex)
			{
				if (ex.Status != WebExceptionStatus.RequestCanceled) // if request was not aborted
				{
					_syncContext.Post(delegate
					{
						Error(this, null);
					}, this);
				}
			}
			catch (Exception ex)
			{
				_syncContext.Post(delegate
				{
					Error(this, null);
				}, this);
			}
		}


		private byte[] _stringToByteArray(string str) 
		{
			System.Text.UTF8Encoding encoding = new System.Text.UTF8Encoding();
			return encoding.GetBytes(str);
		}


		private Dictionary<string, string> _extractOptions(ScriptObject args)
		{
			Dictionary<string, string> defaults = new Dictionary<string, string>() {
				{ "url", null },
				{ "user", null },
				{ "password", null },
				{ "method", "POST" },
				{ "mimeType", "" },
				{ "encoding", "UTF-8" },
				{ "responseType", "" }
			};

			Dictionary<string, string> options = new Dictionary<string, string>();
			foreach (string key in defaults.Keys) {
				options.Add(key, (string)args.GetProperty(key));
			}

			string value;
			foreach (var item in defaults) {
				if (!options.TryGetValue(item.Key, out value)) {
					options.Add(item.Key, item.Value);
				}
			}

			// make sure this one is uppercase
			options["method"] = options["method"].ToUpper();

			return options;
		}


		private void _fireUploadProgress(long loaded, long total)
		{
			_syncContext.Post(delegate {
				UploadProgress(this, new ProgressEventArgs(loaded, total));
			}, this);
		}


		private void _reset()
		{
			_status = 0;
			_multipart = false;
			_multipartHeader = _multipartFooter = null;
			_statusText = "";
			_options = new Dictionary<string, string>();
			_headers = new Dictionary<string, string>();
			_blob = null;
			_blobName = "";
			_postData = new Dictionary<string, string>();
			_blobFieldName = "Filedata";

			if (_response != null)
			{
				_response.Dispose();
				_response = null;
			}
		}
		

	}
}
