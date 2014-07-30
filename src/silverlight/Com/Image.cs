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
using Moxiecode.MXI;
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

		private bool _preserveHeaders = true;


		public void loadFromBlob(object blob)
		{
			if (blob is string) {
				if ((blob = Moxie.compFactory.get((string)blob)) == null) {
					Error(this, new ErrorEventArgs(ImageError.WRONG_FORMAT));
					return;
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
				if ((source = Moxie.compFactory.get((string)source)) == null) {
					Error(this, new ErrorEventArgs(ImageError.WRONG_FORMAT));
					return;
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

			Load(this, null);
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
				((JPEG)_img).extractHeaders(); // preserve headers for later
				meta = ((JPEG)_img).metaInfo();

				// save thumb data as Blob
				object thumbData;
				if (meta.ContainsKey("thumb") && ((Dictionary<string,object>)meta["thumb"]).TryGetValue("data", out thumbData)) {
					Blob blob = new Blob(new List<object> { (byte[])thumbData }, new Dictionary<string, string>{
						{ "type", "image/jpeg" }
					});
					Moxie.compFactory.add(blob.uid, blob);
					((Dictionary<string, object>)meta["thumb"])["data"] = blob.ToObject();
				}
			} else if (PNG.test(stream)) {
				_img = new PNG(stream);
				type = PNG.MIME;
			} else {
				Error(this, new ErrorEventArgs(ImageError.WRONG_FORMAT));
				return;
			}

			Dictionary<string, int> info = _img.info();
			if (info != null) {
				width = info["width"];
				height = info["height"];
			}

			BitmapImage bitmapImage = new BitmapImage();
			bitmapImage.SetSource(stream);
			_bm = new WriteableBitmap(bitmapImage);

			Load(this, null);
		}


		public Dictionary<string,object> getInfo()
		{
			return new Dictionary<string, object>()
			{
				{ "width", width },
				{ "height", height },
				{ "size", size },
				{ "type", type },
				{ "name", name },
				{ "meta", meta }
			};
		}


		public void downsize(object width, object height, object crop, object preserveHeaders)
		{
			_preserveHeaders = (bool)preserveHeaders;

			int orientation = 1;
			if (meta.ContainsKey("tiff") && ((Dictionary<string, object>)meta["tiff"]).ContainsKey("Orientation")) {
				orientation = Convert.ToInt32(((Dictionary<string, object>)meta["tiff"])["Orientation"]);
			}

			// swap dimensions
			bool requiresSwapping = new List<int> { 5, 6, 7, 8 }.Contains(orientation);
			if (requiresSwapping) {
				object mem = width;
				width = height;
				height = mem;
			}

			int w = Convert.ToInt32(width);
			int h = Convert.ToInt32(height);
			
			double scale;
			if (!(bool)crop) {
				// retain proportions
				scale = Math.Min((double)w / (double)_bm.PixelWidth, (double)h / (double)_bm.PixelHeight);
			} else {
				w = Math.Min(w, _bm.PixelWidth);
				h = Math.Min(h, _bm.PixelHeight);

				// without explicit cast to double, result is implicitly cast back to int (wtf?)
				scale = Math.Max((double)w / (double)_bm.PixelWidth, (double)h / (double)_bm.PixelHeight);
			}

			try {
				if (scale > 1 && !(bool)crop && _preserveHeaders) {
					Resize(this, null);
					return;
				} else {
					int imgWidth = (int)Math.Round(_bm.PixelWidth * scale);
					int imgHeight = (int)Math.Round(_bm.PixelHeight * scale);

					TransformGroup tg = new TransformGroup();
					tg.Children.Add(new ScaleTransform()
					{
						ScaleX = scale,
						ScaleY = scale
					});

					// center crop if required
					if ((bool)crop) {
						if (imgWidth > w) {
							tg.Children.Add(new TranslateTransform() { X = -Math.Round((double)(imgWidth - w) / 2) });
						}

						if (imgHeight > h) {
							tg.Children.Add(new TranslateTransform() { Y = -Math.Round((double)(imgHeight - h) / 2) });
						}
					} else {
						w = imgWidth;
						h = imgHeight;
					}

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

					WriteableBitmap bm = null;

					if (type == JPEG.MIME) {
						if (!_preserveHeaders) {
							_rotateToOrientation(tg, orientation, w, h);
							if (requiresSwapping) {
								bm = new WriteableBitmap(h, w);
							}
						} else if (_img != null) {
							// insert new values into exif headers
							((JPEG)_img).updateDimensions(w, h);
							// update image info
							meta = ((JPEG)_img).metaInfo();
						}
					}

					// if not initialized by now, do it the usuall way
					if (bm == null) {
						bm = new WriteableBitmap(w, h);
					}
					
					System.Windows.Controls.Image image = new System.Windows.Controls.Image() {
						Source = _bm,
						Stretch = Stretch.None
					};
					
					bm.Render(image, tg);
					bm.Invalidate();
				
					_bm = bm;

					this.width = _bm.PixelWidth;
					this.height = _bm.PixelHeight;

					Resize(this, null);
					return;
				}
			}
			catch 
			{
				// Moxie.log(ex.Message);
				Error(this, null);
			}
		}


		public MemoryStream getAsEncodedStream(string type = null, int quality = 90)
		{
			MemoryStream imageStream = new MemoryStream();

			if (type == null) {
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

				if (_img != null) {
					// strip off any headers that might be left by encoder, etc
					imageStream = new MemoryStream(((JPEG)_img).stripHeaders(imageStream));

					if (_preserveHeaders) {
						imageStream = new MemoryStream(((JPEG)_img).insertHeaders(imageStream));
					}
				}
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
				return null;
			}
			return imageStream;
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
			MemoryStream stream = getAsEncodedStream(type, quality);	
			File blob = new File(new List<object>{stream}, new Dictionary<string,string>{
				{ "name", this.name },
				{ "type", type }
			});
			Moxie.compFactory.add(blob.uid, blob);
			return blob.ToObject();
		}

		private void _rotateToOrientation(TransformGroup tg, int orientation, int width, int height)
		{
			switch (orientation)
			{
				case 2:
					// horizontal flip
					tg.Children.Add(new ScaleTransform()
					{
						ScaleX = -1,
						ScaleY = 1
					});
					tg.Children.Add(new TranslateTransform() { 
						X = width,
 						Y = 0
					});
					break;
				case 3:
					// 180 rotate left
					tg.Children.Add(new RotateTransform() { 
						Angle = 180
					});
					tg.Children.Add(new TranslateTransform()
					{
						X = width,
						Y = height
					});
					break;
				case 4:
					// vertical flip
					tg.Children.Add(new ScaleTransform()
					{
						ScaleX = 1,
						ScaleY = -1
					});
					tg.Children.Add(new TranslateTransform() { 
						X = 0,
 						Y = height
					});
					break;
				case 5:
					// vertical flip + 90 rotate right
					tg.Children.Add(new ScaleTransform() {
						ScaleX = 1,
						ScaleY = -1
					});
					tg.Children.Add(new RotateTransform() { 
						Angle = 90
					});
					break;
				case 6:
					// 90 rotate right
					tg.Children.Add(new RotateTransform() { 
						Angle = 90
					});
					tg.Children.Add(new TranslateTransform() { 
						X = height,
 						Y = 0
					});
					break;
				case 7:
					// horizontal flip + 90 rotate right
					tg.Children.Add(new ScaleTransform()
					{
						ScaleX = -1,
						ScaleY = 1
					});
					tg.Children.Add(new RotateTransform() { 
						Angle = 90
					});
					tg.Children.Add(new TranslateTransform() { 
						X = height,
 						Y = width
					});
					break;
				case 8:
					// 90 rotate left
					tg.Children.Add(new RotateTransform() {
						Angle = -90
					});
					tg.Children.Add(new TranslateTransform()
					{
						X = 0,
						Y = width
					});
					break;
			}
		}


		public void destroy()
		{
			_bm = null;
		}

		
		
	}
}
