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
using System.Collections.Generic;

namespace Moxiecode.MXI
{
	public static class Utils
	{

		public static string DictionaryToJSON(Dictionary<string, object> dict)
		{
			string json = "";
			foreach (KeyValuePair<string, object> pair in dict) {
				json += "\"" + pair.Key + "\": \"" + pair.Value.ToString() + "\",";
			}
			return "{" + json.TrimEnd(',') + "}";
		}

		public static string DictionaryToJSON(Dictionary<string, long> dict)
		{
			string json = "";
			foreach (KeyValuePair<string, long> pair in dict)
			{
				json += "\"" + pair.Key + "\": \"" + pair.Value.ToString() + "\",";
			}
			return "{" + json.TrimEnd(',') + "}";
		}


		public static string DictionaryToJSON(Dictionary<string, string> dict)
		{
			string json = "";
			foreach (KeyValuePair<string, string> pair in dict)
			{
				json += "\"" + pair.Key + "\": \"" + pair.Value + "\",";
			}
			return "{" + json.TrimEnd(',') + "}";
		}
	}
}
