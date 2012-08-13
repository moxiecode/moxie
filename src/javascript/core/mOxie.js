/**
 * mOxie.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

;(function(window, document, undefined) {
		
	function o(id) {
		if (typeof id !== 'string') {
			return id;	
		}
		return document.getElementById(id);
	}	
		
	// Parses the default mime types string into a mimes and extensions lookup maps
	(function(mime_data) {
		var items = mime_data.split(/,/), i, ii, ext;
		
		o.mimes = {};
		o.extensions = {};

		for (i = 0; i < items.length; i += 2) {
			ext = items[i + 1].split(/ /);

			// extension to mime lookup
			for (ii = 0; ii < ext.length; ii++) {
				o.mimes[ext[ii]] = items[i];
			}
			// mime to extension lookup
			o.extensions[items[i]] = ext;
		}
	})(
		"application/msword,doc dot," +
		"application/pdf,pdf," +
		"application/pgp-signature,pgp," +
		"application/postscript,ps ai eps," +
		"application/rtf,rtf," +
		"application/vnd.ms-excel,xls xlb," +
		"application/vnd.ms-powerpoint,ppt pps pot," +
		"application/zip,zip," +
		"application/x-shockwave-flash,swf swfl," +
		"application/vnd.openxmlformats,docx pptx xlsx," +
		"audio/mpeg,mpga mpega mp2 mp3," +
		"audio/x-wav,wav," +
		"audio/mp4,m4a," +
		"image/bmp,bmp," +
		"image/gif,gif," +
		"image/jpeg,jpg jpeg jpe," +
		"image/png,png," +
		"image/svg+xml,svg svgz," +
		"image/tiff,tiff tif," +
		"text/html,htm html xhtml," +
		"text/rtf,rtf," +
		"video/mpeg,mpeg mpg mpe," +
		"video/quicktime,qt mov," +
		"video/mp4,mp4," +
		"video/x-m4v,m4v," +
		"video/x-flv,flv," +
		"video/vnd.rn-realvideo,rv," +
		"text/plain,asc txt text diff log," +
		"application/octet-stream,exe"
	);


	function extList2mimes(filters) {
		var ext, i, y, type, mimes = [];
		
		// Convert extensions to mime types list
		no_type_restriction:
		for (i = 0; i < filters.length; i++) {
			ext = filters[i].extensions.split(/\s*,\s*/);

			for (ii = 0; ii < ext.length; ii++) {
				
				// If there's an asterisk in the list, then accept attribute is not required
				if (ext[ii] === '*') {
					mimes = [];
					break no_type_restriction;
				}
				
				type = o.mimes[ext[ii]];

				if (type && !~o.inArray(type, mimes)) {
					mimes.push(type);
				}
			}
		}
		
		return mimes;
	}


	function mimes2extList(mimes) {
		var exts = '', accept = [];
		
		mimes = o.trim(mimes);
		
		if (mimes !== '*') {
			o.each(mimes.split(/\s*,\s*/), function(mime, i) {
				if (o.extensions[mime]) {
					exts += o.extensions[mime].join(',');
				}
			});
		} else {
			exts = mimes;	
		}
		
		accept.push({
			title: o.translate('Files'),
			extensions: exts
		});
		
		// save original mimes string
		accept.mimes = mimes;
						
		return accept;
	}


	o.extList2mimes = extList2mimes;
	o.mimes2extList = mimes2extList;


							

	
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
			   id: "iPhone/iPod"
			},{
				s1: navigator.platform,
				s2: "Linux",
				id: "Linux"
			}],
			
			version;
			
		
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
