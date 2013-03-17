using System;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace Moxiecode.Com.Errors
{
	public class RuntimeError : Exception
	{
		public const uint NOT_SUPPORTED_ERR = 1;
		public const uint COMP_CONFLICT = 23;

		public uint code;

		public RuntimeError(uint code) : base("")
		{
			this.code = code;
		}
	}
}


