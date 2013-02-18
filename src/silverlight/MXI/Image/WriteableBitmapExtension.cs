using System;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Moxiecode.MXI.Image
{
	public static class WriteableBitmapExtension
	{
		public static byte[][,] ToRaster(this WriteableBitmap bmp)
		{
			// Setup pixelbuffers
			int[] p = bmp.Pixels;
			int width = bmp.PixelWidth;
			int height = bmp.PixelHeight;

			byte[][,] raster = new byte[3][,];
			for (int b = 0; b < 3; b++) {
				raster[b] = new byte[width, height];
			}

			// Copy WriteableBitmap data into buffer (for FluxJpeg)
			int i = 0;
			for (int y = 0; y < height; y++)
			{
				for (int x = 0; x < width; x++)
				{
					int color = p[i++];

					raster[0][x, y] = (byte)(color >> 16); // R
					raster[1][x, y] = (byte)(color >> 8);  // G
					raster[2][x, y] = (byte)(color);       // B
				}
			}
			return raster;
		}


		public static void FromRaster(this WriteableBitmap bmp, byte[][,] raster)
		{
			int[] pixelBuffer = new int[bmp.PixelHeight * bmp.PixelWidth];

			// Convert FJCore raster to PixelBuffer
			for (int y = 0; y < bmp.PixelHeight; y++)
			{
				for (int x = 0; x < bmp.PixelWidth; x++)
				{
					int color = 0;

					color = color | raster[0][x, y] << 16; // R
					color = color | raster[1][x, y] << 8;  // G
					color = color | raster[2][x, y];       // B

					pixelBuffer[(y * bmp.PixelWidth) + x] = color;
				}
				
			}
			Buffer.BlockCopy(pixelBuffer, 0, bmp.Pixels, 0, pixelBuffer.Length);
		}


		public static byte[] ToByteArray(this WriteableBitmap bmp)
		{
			int[] p = bmp.Pixels;
			int length = p.Length * 4;
			byte[] result = new byte[length]; // ARGB
			System.Buffer.BlockCopy(p, 0, result, 0, length);
			return result;
		}


		public static void FromByteArray(this WriteableBitmap bmp, byte[] buffer)
		{
			Buffer.BlockCopy(buffer, 0, bmp.Pixels, 0, buffer.Length);
		}


		public static void ToStream(this WriteableBitmap bmp, Stream outputStream)
		{
			byte[] bytes = bmp.ToByteArray();
			outputStream.Write(bytes, 0, bytes.Length);
		}
	}
}
