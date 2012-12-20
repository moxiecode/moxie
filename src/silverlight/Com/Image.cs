using System;
using System.IO;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Collections.Generic;

using FluxJpeg.Core.Encoder;
using FluxJpeg.Core;
using Moxie.PngEncoder;

using Moxiecode.Com.Events;
using Moxiecode.Com.Errors;
using Moxiecode.MXI.Image;

namespace Moxiecode.Com
{
	public class Image
	{
		public static string[] dispatches = new string[] 
		{
			"Progress",
			"Load",
			"Resize",
			"Error"
		};

		public event ProgressEventHandler Progress;
		public event EventHandler Load;
		public event EventHandler Resize;
		public event EventHandler Error;

		public long size = 0;
		public int width = 0, height = 0;
		public string type = "";
		public string name = "";
		public Dictionary<string, object> meta = new Dictionary<string, object>();

		private WriteableBitmap _bm;
		private Format _img = null;


		public void loadFromBlob(object blob)
		{
			if (blob is string) {
				if (!Moxie.blobPile.TryGetValue((string)blob, out blob)) {
					throw new DOMError(DOMError.NOT_FOUND_ERR);
				}
			}

			if (blob is File) {
				name = ((File)blob).name;
			}

			FileReader fileReader = new FileReader();
			MemoryStream stream = new MemoryStream();
			fileReader.ReadAsMemoryStream(blob, stream);
			loadFromStream(stream);
		}


		public void loadFromImage(object source)
		{
			if (source is string) {
				if ((source = Moxie.comps.get((string)source, "Image")) == null) {
					throw new ImageError(ImageError.WRONG_FORMAT);
				}
			}

			Image image = (Image)source;

			width = image.width;
			height = image.height;
			size = image.size;
			type = image.type;
			name = image.name;
			meta = image.meta;

			_bm = new WriteableBitmap(width, height);
			_bm.FromByteArray(image.getAsByteArray());

			Load(this, new DataEventArgs(getInfo()));
		}


		public void loadFromByteArray(byte[] buffer)
		{
			loadFromStream(new MemoryStream(buffer));
		}


		public void loadFromStream(Stream stream)
		{
			size = stream.Length;

			if (JPEG.test(stream)) {
				_img = new JPEG(stream);
				type = JPEG.MIME; 
			}

			Dictionary<string, int> info = _img.info();
			if (info != null) {
				width = info["width"];
				height = info["height"];
			}

			BitmapImage bitmapImage = new BitmapImage();
			bitmapImage.SetSource(stream);
			_bm = new WriteableBitmap(bitmapImage);

			Load(this, new DataEventArgs(getInfo()));
		}


		public Dictionary<string,string> getInfo()
		{
			return new Dictionary<string, string>()
			{
				{ "width", width.ToString() },
				{ "height", height.ToString() },
				{ "size", size.ToString() },
				{ "type", type },
				{ "name", name }
			};
		}


		public void resize(object width, object height, object crop)
		{
			try {
				int w = Convert.ToInt32(width);
				int h = Convert.ToInt32(height);
				double scale;

				if (!(bool)crop) {
					// retain proportions
					scale = Math.Min((double)w / (double)_bm.PixelWidth, (double)h / (double)_bm.PixelHeight);
					w = (int)Math.Round(_bm.PixelWidth * scale);
					h = (int)Math.Round(_bm.PixelHeight * scale);
				} else {
					// without explicit cast to double, result is implicitly cast back to int (wtf?)
					scale = Math.Max((double)w / (double)_bm.PixelWidth, (double)h / (double)_bm.PixelHeight);
				}

				if (scale > 1) {
					Resize(this, new DataEventArgs(getInfo()));
					return;
				} else {
					System.Windows.Controls.Image image = new System.Windows.Controls.Image()
					{
						Source = _bm,
						Stretch = Stretch.None
					};

					int imgWidth = (int)Math.Round(_bm.PixelWidth * scale);
					int imgHeight = (int)Math.Round(_bm.PixelHeight * scale);
					
					WriteableBitmap bm = new WriteableBitmap(w, h);

					bm.Render(image, new ScaleTransform()
					{
					    ScaleX = scale,
					    ScaleY = scale,
					    CenterX = imgWidth > w ? -w / 2 : 0,
					    CenterY = imgHeight > h ? -h / 2 : 0
					});
					bm.Invalidate();

					_bm = bm;

					this.width = w;
					this.height = h;

					/* Alternative resize route - better quality, but slower and no crop
	
					FluxJpeg.Core.Image jpegImage = new FluxJpeg.Core.Image(new ColorModel
					{
						colorspace = ColorSpace.RGB
					}, _bm.ToRaster());

					ImageResizer resizer = new ImageResizer(jpegImage);
					FluxJpeg.Core.Image resizedImage = resizer.Resize(w, FluxJpeg.Core.Filtering.ResamplingFilters.LowpassAntiAlias);


					using (MemoryStream imageStream = new MemoryStream())
					{
						JpegEncoder jpegEncoder = new JpegEncoder(resizedImage, 90, imageStream);
						jpegEncoder.Encode();
						BitmapImage bitmapImage = new BitmapImage();
						bitmapImage.SetSource(imageStream);
						_bm = new WriteableBitmap(bitmapImage);
					}

					this.width = resizedImage.Width;
					this.height = resizedImage.Height;*/

					Resize(this, new DataEventArgs(getInfo()));
					return;
				}
			}
			catch 
			{
				// Moxie.log(ex.Message);
				Error(this, null);
			}
		}


		public void getAsEncodedStream(Stream imageStream, string type = null, int quality = 90)
		{
			if (type != null) {
				type = this.type != "" ? this.type : JPEG.MIME;
			}

			if (type == JPEG.MIME) // Encode as JPEG
			{
				byte[][,] raster = _bm.ToRaster();

				FluxJpeg.Core.Image jpegImage = new FluxJpeg.Core.Image(new ColorModel {
					colorspace = ColorSpace.RGB
				}, raster);

				JpegEncoder jpegEncoder = new JpegEncoder(jpegImage, quality, imageStream);
				jpegEncoder.Encode();

				// TODO: restore jpeg headers here
			}
			else if (type == PNG.MIME) // Encode as PNG
			{
				PngEncoder pngEncoder = new PngEncoder(_bm.Pixels, _bm.PixelWidth, _bm.PixelHeight, false, PngEncoder.FILTER_NONE, Deflater.BEST_COMPRESSION);
				byte[] pngBuffer = pngEncoder.pngEncode();
				imageStream.Write(pngBuffer, 0, pngBuffer.Length);
			}
			else
			{
				Error(this, null);
			}
		}


		public void getAsStream(Stream stream)
		{
			_bm.ToStream(stream);
		}


		public WriteableBitmap getAsWriteableBitmap()
		{
			return _bm;
		}


		public byte[] getAsByteArray()
		{
			return _bm.ToByteArray();
		}


		public Dictionary<string, object> getAsBlob(object type, object quality) 
		{
			return _getAsBlob((string)type, Convert.ToInt32(quality));
		}


		private Dictionary<string, object> _getAsBlob(string type = "image/jpeg", int quality = 90)
		{
			MemoryStream stream = new MemoryStream(); 
			getAsEncodedStream(stream, type, quality);	
			BlobBuilder bb = new BlobBuilder();
			bb.append(stream);
			Blob blob = bb.getFile(type, this.name);
			Moxie.blobPile.Add(blob.id, blob);
			return blob.ToObject();
		}


		public void destroy()
		{
			_bm = null;
		}

		
		
	}
}
