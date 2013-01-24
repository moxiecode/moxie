using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Windows.Browser;
using System.Net;
using System.IO;
using System.Collections.Generic;
using System.Threading;
using System.Reflection;
using System.Xml.Serialization;

using Moxiecode.Com;
using Moxiecode.Com.Events;


namespace Moxiecode
{
	/// <summary>
	///  Partial page class for the Silverlight page.
	/// </summary>
	public partial class Moxie : UserControl
	{
		public static string uid;

		public static ComponentFactory comps = new ComponentFactory();

		public static Dictionary<string, object> blobPile = new Dictionary<string, object>();

		#region private fields

		#endregion

		/// <summary>
		///  Main constructor.
		/// </summary>
		/// <param name="init_params">Silverlight init params.</param>
		public Moxie(IDictionary<string, string> init_params)
		{
			InitializeComponent();

			Moxie.uid = init_params["uid"];
			HtmlPage.RegisterScriptableObject("Moxie", this);
			this._fireEvent(Moxie.uid + "::Init");
		}


		[ScriptableMember]
		public dynamic exec(string uid, string compName, string action, ScriptObject scriptObject = null)
		{
			// extract arguments
			List<object> args = new List<object>();
			if (scriptObject != null)
			{
				int i = 0;
				object prop;
				while (true) {
					prop = scriptObject.GetProperty(i++);
					if (prop != null) {
						args.Add(prop);
					} else {
						break;
					}
				}
			}
			return this._exec(uid, compName, action, args.Count != 0 ? args.ToArray() : null);
		}

		[ScriptableMember]
		public dynamic exec(string uid, string compName, string action)
		{
			return this._exec(uid, compName, action);
		}


		private dynamic _exec(string uid, string compName, string action, object[] args = null)
		{
			try {
				object comp = Moxie.comps.get(uid, compName);
				if (comp == null) {
					comp = Moxie.comps.create(this, uid, compName);
				}

				// execute the action if available
				MethodInfo methodInfo = comp.GetType().GetMethod(action);
				
				if (methodInfo != null) {
					return methodInfo.Invoke(comp, args);
				} else {
					//FireEvent(uid + "::Exception", { name: "RuntimeError", code: RuntimeError.NOT_SUPPORTED_ERR });
				}
			}
			catch (Exception ex) {
				// re-route exceptions thrown by components
				_fireEvent(uid + "::Exception", ex.Message);
			}
			return false;
		}


		public void OnComponentEvent(string uid, object sender, EventArgs eventArgs, string eventName)
		{
			// Moxie.log(eventName);

			if (eventArgs is ProgressEventArgs)
			{
				_fireEvent(new Dictionary<string, object>() {
					{ "type", uid + "::" + eventName },
					{ "total", ((ProgressEventArgs)eventArgs).Total },
					{ "loaded", ((ProgressEventArgs)eventArgs).Loaded }
				}, ((ProgressEventArgs)eventArgs).Data);
			}
			else if (eventArgs is DataEventArgs)
			{
				_fireEvent(uid + "::" + eventName, ((DataEventArgs)eventArgs).Data);
			}
			else
			{
				_fireEvent(uid + "::" + eventName, null);
			}
		}

		/// <summary>
		///  Reference to page level plupload.silverlight script object.
		/// </summary>
		public ScriptObject EventTarget
		{
			get { return ((ScriptObject)HtmlPage.Window.Eval("moxie.core.EventTarget.instance")); }
		}

		/// <summary>
		///  Fires a specific event to the page level multi upload script.
		/// </summary>
		/// <param name="name">Event name to fire.</param>
		private void _fireEvent(string type, object args = null)
		{
			EventTarget.Invoke("dispatchEvent", new object[] { type, args });
		}


		private void _fireEvent(object type, object args = null)
		{
			EventTarget.Invoke("dispatchEvent", new object[] { type, args });
		}


		/// <summary>
		///  Send debug message to firebug console.
		/// </summary>
		/// <param name="msg">Message to write.</param>
		public static void log(params string[] args)
		{
			((ScriptObject)HtmlPage.Window.Eval("console")).Invoke("log", args);
		}

	}
}