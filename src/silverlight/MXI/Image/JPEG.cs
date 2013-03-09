using System;
using System.IO;
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

namespace Moxiecode.MXI.Image
{
	public class JPEG : Format
	{
		public const string MIME = "image/jpeg";

		private BinaryReader _br;

		protected Dictionary<int, object> _markers = new Dictionary<int, object>(){
			{ 0xFFE1, new Dictionary<string, string>() {
				{ "app", "EXIF" },
				{ "name", "APP1" },
				{ "signature", "Exif" }
			} },
			{ 0xFFE2, new Dictionary<string, string>() {
				{ "app", "ICC" },
				{ "name", "APP1" },
				{ "signature", "ICC PROFILE" }
			} },
			{ 0xFFED, new Dictionary<string, string>() {
				{ "app", "IPTC" },
				{ "name", "APP13" },
				{ "signature", "Photoshop 3.0" }
			} }
		};

		private List<Dictionary<string, object>> _headers = null;


		public JPEG(Stream stream)
		{
			_br = new BinaryReader(stream);
		}

		static public bool test(Stream stream) 
		{
			byte[] signature = new byte[] { 255, 216 };
			bool result = true;
			BinaryReader br = new BinaryReader(stream);
						
			for (int i = signature.Length - 1; i >= 0 ; i--) {
				if (br.BYTE(i) != signature[i]) {
					result = false;
					break;
				}
			}
			br.clear();
			return result;
		}


		public override Dictionary<string, int> info() 
		{
			long idx = 0; 
			int marker, length;
			
			// examine all through the end, since some images might have very large APP segments
			while (idx <= _br.Length) {
				marker = _br.SHORT(idx += 2);

				if (marker >= 0xFFC0 && marker <= 0xFFC3) { // SOFn 
					idx += 5; // marker (2 bytes) + length (2 bytes) + Sample precision (1 byte)
					
					return new Dictionary<string, int>() {
						{ "height", _br.SHORT(idx) },
						{ "width", _br.SHORT(idx += 2) }
					};
				}
				length = _br.SHORT(idx += 2);
				idx += length - 2;			
			}
			return null;
		}	


		public Dictionary<string, object> metaInfo()
		{
			ExifParser exifParser; 
			Dictionary <string, object> tiff, exif, gps, meta;
			
			List<byte[]> headers = getHeaders("exif");
			meta = new Dictionary<string, object>();
			
			if (headers.Count != 0) {
				exifParser = new ExifParser();
				if (exifParser.init(headers[0])) {

					tiff = exifParser.TIFF();
					if (tiff != null) {
						meta.Add("tiff", tiff);
					}
					
					exif = exifParser.EXIF();
					if (exif != null) {
						meta.Add("exif", exif);
					}
					
					gps = exifParser.GPS();
					if (gps != null) {
						meta.Add("gps", gps);
					}
					
					exifParser.purge();
				}
			}
			return meta;
		}
	
		public List<Dictionary<string, object>> extractHeaders() 
		{
			long idx = 2;
			int length, marker;

			object markerObj;
			Dictionary<string, string> markerInfo;

			_headers = new List<Dictionary<string,object>>();
				
			while (idx <= _br.Length) {
				marker = _br.SHORT(idx);
				
				// omit RST (restart) markers
				if (marker >= 0xFFD0 && marker <= 0xFFD7) {
					idx += 2;
					continue;
				}
				
				// no headers allowed after SOS marker
				if (marker == 0xFFDA || marker == 0xFFD9) {
					break;	
				}	
				
				length = _br.SHORT(idx + 2) + 2;	

				if (_markers.TryGetValue(marker, out markerObj)) {
					markerInfo = (Dictionary<string, string>)markerObj;
					if (_br.STRING(idx + 4, markerInfo["signature"].Length) == markerInfo["signature"]) {
						_headers.Add(new Dictionary<string,object>() {
							{ "hex", marker },
							{ "app", markerInfo["app"].ToUpper() },
							{ "name", markerInfo["name"].ToUpper() },
							{ "start", idx },
							{ "length", length },
							{ "segment", _br.SEGMENT((int)idx, length) }
						});
					}
				}
				
				idx += length;			
			}
			return _headers;
		}
		
		public List<byte[]> getHeaders(string app)
		{
			List<Dictionary<string,object>> headers = getHeaders();
			
			List<byte[]> array = new List<byte[]>();
			
			for (int i = 0, max = headers.Count; i < max; i++) {
				if ((string)headers[i]["app"] == app.ToUpper()) {
					array.Add((byte[])headers[i]["segment"]);
				}
			}
			return array;
		}


		public List<Dictionary<string,object>> getHeaders()
		{
			return _headers != null ? _headers : extractHeaders();
		}


		public void setHeaders(string app, object segment)
		{
			List<byte[]> array;
					
			if (segment is byte[]) {
				array = new List<byte[]>();
				array.Add((byte[])segment);	
			} else {
				array = (List<byte[]>)segment;	
			}
						
			for (int i = 0, ii = 0, max = _headers.Count; i < max; i++) {
				if ((string)_headers[i]["app"] == app.ToUpper()) {
					_headers[i]["segment"] = array[ii];
					_headers[i]["length"] = array[ii].Length;
					ii++;
				}
				if (ii >= array.Count) 
					break;
			}
		}
		
		
		public void updateDimensions(int width, int height)
		{
			ExifParser exifParser; 
			List<byte[]> headers;
			
			headers = getHeaders("exif");
			
			if (headers.Count != 0) {
				exifParser = new ExifParser();
				if (exifParser.init(headers[0])) {
					
					exifParser.setExif("PixelXDimension", width);
					exifParser.setExif("PixelYDimension", height);
					
					setHeaders("exif", exifParser.getBinary());						
				}
				exifParser.purge();
			}
		}
		
		
		public byte[] insertHeaders(Stream stream, List<Dictionary<string, object>> headers = null)
		{
			long idx;
			BinaryReader br = new BinaryReader(stream);

			if (headers == null || headers.Count == 0) {
				headers = _headers;
			}
	
			// Check if data is jpeg
			if (br.SHORT(0) != 0xFFD8) {
				throw new ImageError(ImageError.WRONG_FORMAT);
			}	
			
			if (headers.Count != 0) {
				idx = br.SHORT(2) == 0xFFE0 ? 4 + br.SHORT(4) : 2;
				
				for (int i = 0, max = headers.Count; i < max; i++) {
					br.SEGMENT((int)idx, 0, (byte[])headers[i]["segment"]);	
					idx += Convert.ToInt32(headers[i]["length"]);
				}
			}
			return br.SEGMENT();
		}
		
	}
}
