/**
 * mOxie.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */


/**
Global namespace

@module o
@main o
@static
**/
;(function(window, document, undefined) {
		
	function o(id) {
		if (typeof id !== 'string') {
			return id;	
		}
		return document.getElementById(id);
	}					

	
	/**
		Ok, YES, we do a browser sniffing here. Original: http://www.quirksmode.org/js/detect.html
	*/
	o.ua = (function() {
		var browser = [{
			s1: navigator.userAgent, // string
			s2: "Chrome", // substring
			id: "Chrome" // identity
		},{
			s1: navigator.vendor,
			s2: "Apple",
			id: "Safari",
			sv: "Version" // version
		},{
			prop: window.opera && window.opera.buildNumber,
			id: "Opera",
			sv: "Version"
		},{
			s1: navigator.vendor,
			s2: "KDE",
			id: "Konqueror"
		},{
			s1: navigator.userAgent,
			s2: "Firefox",
			id: "Firefox"
		},{
			s1: navigator.vendor,
			s2: "Camino",
			id: "Camino"
		},{		
			// for newer Netscapes (6+)
			s1: navigator.userAgent,
			s2: "Netscape",
			id: "Netscape"
		},{
			s1: navigator.userAgent,
			s2: "MSIE",
			id: "IE",
			sv: "MSIE"
		},{
			s1: navigator.userAgent,
			s2: "Gecko",
			id: "Mozilla",
			sv: "rv"
		}],

		os = [{
			s1: navigator.platform,
			s2: "Win",
			id: "Windows"
		},{
			s1: navigator.platform,
			s2: "Mac",
			id: "Mac"
		},{
			s1: navigator.userAgent,
			s2: "iPhone",
			id: "iOS"
		},{
			s1: navigator.userAgent,
			s2: "iPad",
			id: "iOS"
		},{
			s1: navigator.platform,
			s2: "Linux",
			id: "Linux"
		}]
		, version
		;
			
		
		function getStr(data) {
			var str, prop;
			
			for (var i = 0; i < data.length; i++)	{
				str = data[i].s1;
				prop = data[i].prop;
				version = data[i].sv || data[i].id;
				
				if (str) {
					if (str.indexOf(data[i].s2) != -1) {
						return data[i].id;
					}
				} else if (prop) {
					return data[i].id;
				}
			}
		}
		
		
		function getVer(str) {
			var index = str.indexOf(version);
			if (index == -1) {
				return;
			}
			return parseFloat(str.substring(index + version.length + 1));
		}
					
		
		return {
			browser: getStr(browser),
			version: getVer(navigator.userAgent) || getVer(navigator.appVersion),
			OS: getStr(os)
		};
	}());

	o.ua.can = (function() {
		// ideas for this heavily come from Modernizr (http://modernizr.com/)
		var caps = { 
				define_property: (function() {
					try { // as of IE8, getters/setters are supported only on DOM elements
						var obj = {};
						if (Object.defineProperty) {
							Object.defineProperty(obj, 'prop', {
								enumerable: true, 
								configurable: true 
							});
							return true;
						}
					} catch(ex) {}

					if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) {
						return true;
					}
					return false;
				}()),

				create_canvas: (function() {
					// On the S60 and BB Storm, getContext exists, but always returns undefined
					// so we actually have to call getContext() to verify
					// github.com/Modernizr/Modernizr/issues/issue/97/
					var el = document.createElement('canvas');
					return !!(el.getContext && el.getContext('2d'));
				}()),

				receive_response_type: function(responseType) {
					if (!window.XMLHttpRequest) {
						return false;
					}
					try {
						var xhr = new XMLHttpRequest;
						if (o.typeOf(xhr.responseType) !== 'undefined') {
							xhr.open('get', 'infinity-8.me'); // otherwise Gecko throws an exception
							xhr.responseType = responseType;
							// as of 23.0.1271.64, Chrome switched from throwing exception to merely logging it to the console (why? o why?)
							if (xhr.responseType !== responseType) {
								return false;
							}
							return true;
						}
					} catch (ex) {}
					return false;
				},

				use_data_uri: (function() {
					var du = new Image;

					du.onload = function() {
						caps.use_data_uri = (du.width === 1 && du.height === 1);
					};
					
					setTimeout(function() {
						du.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
					}, 1);
					return false;
				}()),

				use_data_uri_over32kb: function() { // IE8			
					return caps.use_data_uri && (o.ua.browser !== 'IE' || o.ua.version >= 9);
				}, 

				use_data_uri_of: function(bytes) {
					return (caps.use_data_uri && bytes < 33000 || caps.use_data_uri_over32kb());
				}
			};

		return function(cap) {
			var args = [].slice.call(arguments);
			args.shift(); // shift of cap
			return o.typeOf(caps[cap]) === 'function' ? caps[cap].apply(this, args) : !!caps[cap];
		}
	}());
	
	/**
	@namespace o
	*/
	window.mOxie = window.o = o;

}(window, document));
