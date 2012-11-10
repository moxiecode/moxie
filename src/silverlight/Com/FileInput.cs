using System;
using System.Collections.Generic;
using System.IO;
using System.Windows;
using System.Windows.Browser;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using Moxiecode.MXI;
using Moxiecode.MXI.Image;

namespace Moxiecode.Com
{
	public class FileInput : Button
	{
		private List<File> _files = new List<File>(); 

		public static string[] dispatches = new string[] 
		{
			"Cancel", 
			"Change",
			"MouseEnter",
			"MouseLeave",
			"MouseDown",
			"MouseUp"
		};

		public event EventHandler Cancel;
		public event EventHandler Change;
		public event MouseButtonEventHandler MouseDown;
		public event MouseButtonEventHandler MouseUp;

		#region private fields
		private bool _multiple = true;
		private string _accept;
		#endregion

		public FileInput()
		{
			this.Opacity = 0;
			this.Margin = new Thickness(4, 4, 4, 4);
			this.HorizontalAlignment = HorizontalAlignment.Stretch;
			this.VerticalAlignment = VerticalAlignment.Stretch;
		}

		public void init(object accept, object name, object multiple)
		{
			this._init((string)accept, (string)name, (bool)multiple);
		}

		private void _init(string accept, string name, bool multiple)
		{
			_multiple = multiple;
			_accept = accept;

			//this.MouseLeftButtonUp += new MouseButtonEventHandler(OnClick);
			this.MouseLeftButtonDown += delegate(object sender, MouseButtonEventArgs args)
			{
				MouseDown(sender, null);
			};

			this.Click += delegate(object sender, RoutedEventArgs args)
			{
				this._openDialog();
			};
		}

		public Dictionary<string, object>[] getFiles()
		{
			List<Dictionary<string, object>> files = new List<Dictionary<string, object>>();
			foreach (File file in _files)
			{
				files.Add(file.ToObject());
				Moxie.blobPile.Add(file.id, file);
			}
			return files.ToArray();
		}


		private void _openDialog()
		{
			OpenFileDialog dialog = new OpenFileDialog();

			_files.Clear();

			try
			{
				dialog.Multiselect = this._multiple;
				dialog.Filter = this._accept;

				if ((bool)dialog.ShowDialog())
				{
					BlobBuilder bb;
					File blob;
					FileReader fileReader = new FileReader();

					foreach (FileInfo fileInfo in dialog.Files)
					{
						bb = new BlobBuilder();
						bb.append(fileInfo);
						blob = bb.getFile();
						_files.Add(blob);
					}
					Change(this, null);
				}
				else
				{
					Cancel(this, null);
				}
			}
			catch (Exception ex)
			{
				// throw error
			}
		}
	}
}
