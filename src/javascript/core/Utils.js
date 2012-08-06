/**
 * Utils.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

;(function(window, document, o, undefined) {	
	
/**
Extends the specified object with another object.

@method extend
@for o
@param {Object} target Object to extend.
@param {Object} [obj]* Multiple objects to extend with.
@return {Object} Same as target, the extended object.
*/
mOxie.extend = function(target) {
	mOxie.each(arguments, function(arg, i) {
		if (i > 0) {
			o.each(arg, function(value, key) {
				if (value !== undefined) {
					target[key] = value;
				}
			});
		}
	});
	return target;
};
	
/**
Executes the callback function for each item in array/object. If you return false in the
callback it will break the loop.

@method each
@param {Object} obj Object to iterate.
@param {function} callback Callback function to execute for each item.
 */
o.each = function(obj, callback) {
	var length, key, i;

	if (obj) {
		length = obj.length;

		if (length === undefined) {
			// Loop object items
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (callback(obj[key], key) === false) {
						return;
					}
				}
			}
		} else {
			// Loop array items
			for (i = 0; i < length; i++) {
				if (callback(obj[i], i) === false) {
					return;
				}
			}
		}
	}
};


o.extend(o, {
	
	/**
	Gets the true type of the built-in object (better version of typeof).
	@credits Angus Croll (http://javascriptweblog.wordpress.com/)
	
	@method typeOf
	@param {Object} o Object to check.
	@return {String} Object [[Class]]
	*/
	typeOf: function(o) {
		// the snippet below is awesome, however it fails to detect null, undefined and arguments types in IE lte 8
		var undef;
		if (o === undef) {
			return 'undefined';
		} else if (o === null) {
			return 'null';
		}
		return ({}).toString.call(o).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	},
	
	
	/**
	Checks if object is empty.
	
	@method isEmptyObj
	@param {Object} o Object to check.
	@return {Boolean}
	 */
	isEmptyObj : function(obj) {
		if (!obj || o.typeOf(obj) !== 'object') { 
			return true;
		}
		
		for (var prop in obj) {
			return false;	
		}
		
		return true;
	},
	
	
	/**
	Find an element in array and return it's index if present, otherwise return -1.
	
	@method inArray
	@param {mixed} needle Element to find
	@param {Array} array
	@return {Int} Index of the element, or -1 if not found
	 */
	inArray : function(needle, array) {			
		if (array) {
			if (Array.prototype.indexOf) {
				return Array.prototype.indexOf.call(array, needle);
			}
		
			for (var i = 0, length = array.length; i < length; i++) {
				if (array[i] === needle) {
					return i;
				}
			}
		}
		return -1;
	},
	
	/**
	Forces anything into an array.
	
	@method toArray
	@param {Object} obj Object with length field.
	@return {Array} Array object containing all items.
	 */
	toArray : function(obj) {
		var i, arr = [];

		for (i = 0; i < obj.length; i++) {
			arr[i] = obj[i];
		}

		return arr;
	},
	
	/**
	Encodes the specified string.
	
	@method xmlEncode
	@param {String} s String to encode.
	@return {String} Encoded string.
	 */
	xmlEncode : function(str) {
		var xmlEncodeChars = {'<' : 'lt', '>' : 'gt', '&' : 'amp', '"' : 'quot', '\'' : '#39'}, xmlEncodeRegExp = /[<>&\"\']/g;
		
		return str ? ('' + str).replace(xmlEncodeRegExp, function(chr) {
			return xmlEncodeChars[chr] ? '&' + xmlEncodeChars[chr] + ';' : chr;
		}) : str;
	},
	
	/**
	Inherit one object from another object or from constructor. 
	Optionally call init method on final object (if defined) and pass remaining arguments to it.
	
	@method inherit
	@param {Object|Function} proto
	@param {Object|Function} ext
	@return {Object}
	 */
	inherit : function(proto, ext) {
		var obj, args = [].slice.call(arguments, 2);
		
		proto = o.typeOf(proto) === 'function' ? new proto : proto; 
		
		if (!ext || o.typeOf(ext) === 'object') { // properties for new object passed or empty
			function object() {}
			object.prototype = proto;
			obj = o.extend(new object, ext);
		} else if (o.typeOf(ext) === 'function') { // Constructor passed
			ext.prototype = proto; 
			obj = new ext;
		} else {
			return;	
		}
		
		// if init method available, call it with all the extra arguments
		if (o.typeOf(obj.init) === 'function') {
			obj.init.apply(obj, args);
		}
		
		return obj;
	},
	
			
	/**
	Generates an unique ID. This is 99.99% unique since it takes the current time and 5 random numbers.
	The only way a user would be able to get the same ID is if the two persons at the same exact milisecond manages
	to get 5 the same random numbers between 0-65535 it also uses a counter so each call will be guaranteed to be page unique.
	It's more probable for the earth to be hit with an ansteriod. Y
	
	@method guid
	@param {String} prefix to prepend (by default 'o' will be prepended).
	@method guid
	@return {String} Virtually unique id.
	 */
	guid : (function() { 
		var counter = 0;
		
		return function(prefix) {
			var guid = new Date().getTime().toString(32), i;

			for (i = 0; i < 5; i++) {
				guid += Math.floor(Math.random() * 65535).toString(32);
			}
			
			return (prefix || 'o_') + guid + (counter++).toString(32);
		}
	}()),
	
	
	/**
	Trims white spaces around the string
	
	@method trim
	@param {String} str
	@return {String}
	 */
	trim : function(str) {
		if (!str) {
			return str;	
		}
		
		return String.prototype.trim ? String.prototype.trim.call(str) : str.toString().replace(/^\s*/, '').replace(/\s*$/, '');	
	},
	
	
	/**
	Checks if specified DOM element has specified class.
	
	@method hasClass
	@param {Object} obj DOM element like object to add handler to.
	@param {String} name Class name
	 */
	hasClass : function(obj, name) {
		var regExp;
	
		if (obj.className == '') {
			return false;
		}

		regExp = new RegExp("(^|\\s+)"+name+"(\\s+|$)");

		return regExp.test(obj.className);
	},
	
	/**
	Adds specified className to specified DOM element.
	
	@method addClass
	@param {Object} obj DOM element like object to add handler to.
	@param {String} name Class name
	 */
	addClass : function(obj, name) {
		if (!o.hasClass(obj, name)) {
			obj.className = obj.className == '' ? name : obj.className.replace(/\s+$/, '')+' '+name;
		}
	},
	
	/**
	Removes specified className from specified DOM element.
	
	@method removeClass
	@param {Object} obj DOM element like object to add handler to.
	@param {String} name Class name
	 */
	removeClass : function(obj, name) {
		var regExp = new RegExp("(^|\\s+)"+name+"(\\s+|$)");
		
		obj.className = obj.className.replace(regExp, function($0, $1, $2) {
			return $1 === ' ' && $2 === ' ' ? ' ' : '';
		});
	},

	/**
	Returns a given computed style of a DOM element.
	
	@method getStyle
	@param {Object} obj DOM element like object.
	@param {String} name Style you want to get from the DOM element
	 */
	getStyle : function(obj, name) {
		if (obj.currentStyle) {
			return obj.currentStyle[name];
		} else if (window.getComputedStyle) {
			return window.getComputedStyle(obj, null)[name];
		}
	},
	
	
	/**
	Returns the absolute x, y position of an Element. The position will be returned in a object with x, y fields.
	
	@method getPos
	@param {Element} node HTML element or element id to get x, y position from.
	@param {Element} root Optional root element to stop calculations at.
	@return {object} Absolute position of the specified element object with x, y fields.
	*/
	getPos : function(node, root) {
		var x = 0, y = 0, parent, doc = document, nodeRect, rootRect;

		node = node;
		root = root || doc.body;

		// Returns the x, y cordinate for an element on IE 6 and IE 7
		function getIEPos(node) {
			var bodyElm, rect, x = 0, y = 0;

			if (node) {
				rect = node.getBoundingClientRect();
				bodyElm = doc.compatMode === "CSS1Compat" ? doc.documentElement : doc.body;
				x = rect.left + bodyElm.scrollLeft;
				y = rect.top + bodyElm.scrollTop;
			}

			return {
				x : x,
				y : y
			};
		}

		// Use getBoundingClientRect on IE 6 and IE 7 but not on IE 8 in standards mode
		if (node && node.getBoundingClientRect && (navigator.userAgent.indexOf('MSIE') > 0 && doc.documentMode !== 8)) {
			nodeRect = getIEPos(node);
			rootRect = getIEPos(root);

			return {
				x : nodeRect.x - rootRect.x,
				y : nodeRect.y - rootRect.y
			};
		}

		parent = node;
		while (parent && parent != root && parent.nodeType) {
			x += parent.offsetLeft || 0;
			y += parent.offsetTop || 0;
			parent = parent.offsetParent;
		}

		parent = node.parentNode;
		while (parent && parent != root && parent.nodeType) {
			x -= parent.scrollLeft || 0;
			y -= parent.scrollTop || 0;
			parent = parent.parentNode;
		}

		return {
			x : x,
			y : y
		};
	},

	/**
	Returns the size of the specified node in pixels.
	
	@method getSize
	@param {Node} node Node to get the size of.
	@return {Object} Object with a w and h property.
	*/
	getSize : function(node) {
		return {
			w : node.offsetWidth || node.clientWidth,
			h : node.offsetHeight || node.clientHeight
		};
	},
	
	/**
	Parses the specified size string into a byte value. For example 10kb becomes 10240.
	
	@method parseSizeStr
	@param {String/Number} size String to parse or number to just pass through.
	@return {Number} Size in bytes.
	*/
	parseSizeStr : function(size) {
		if (typeof(size) !== 'string') {
			return size;	
		}
		
		var muls = {
				t: 1099511627776,
				g: 1073741824,
				m: 1048576,
				k: 1024
			},
			mul;

		size = /^([0-9]+)([mgk]?)$/.exec(size.toLowerCase().replace(/[^0-9mkg]/g, ''));
		mul = size[2];
		size = +size[1];
		
		if (muls.hasOwnProperty(mul)) {
			size *= muls[mul];	
		}
		return size;
	}
});	


// DOM event management
(function() {
	var eventhash = {}, uid;
	
	// IE W3C like event funcs
	function preventDefault() {
		this.returnValue = false;
	}

	function stopPropagation() {
		this.cancelBubble = true;
	}	
		
	o.extend(o, {
		/**
		Adds an event handler to the specified object and store reference to the handler
		in objects internal Plupload registry (@see removeEvent).
		
		@method addEvent
		@param {Object} obj DOM element like object to add handler to.
		@param {String} name Name to add event listener to.
		@param {Function} callback Function to call when event occurs.
		@param {String} (optional) key that might be used to add specifity to the event record.
		*/
		addEvent : function(obj, name, callback) {
			var func, events, types, key;
			
			// if passed in, event will be locked with this key - one would need to provide it to removeEvent
			key = arguments[3];
						
			name = name.toLowerCase();
						
			// Initialize unique identifier if needed
			if (uid === undefined) {
				uid = 'Moxie_' + o.guid();
			}

			// Add event listener
			if (obj.attachEvent) {
				
				func = function() {
					var evt = window.event;

					if (!evt.target) {
						evt.target = evt.srcElement;
					}

					evt.preventDefault = preventDefault;
					evt.stopPropagation = stopPropagation;

					callback(evt);
				};
				obj.attachEvent('on' + name, func);
				
			} else if (obj.addEventListener) {
				func = callback;
				
				obj.addEventListener(name, func, false);
			}
			
			// Log event handler to objects internal mOxie registry
			if (obj[uid] === undefined) {
				obj[uid] = o.guid();
			}
			
			if (!eventhash.hasOwnProperty(obj[uid])) {
				eventhash[obj[uid]] = {};
			}
			
			events = eventhash[obj[uid]];
			
			if (!events.hasOwnProperty(name)) {
				events[name] = [];
			}
					
			events[name].push({
				func: func,
				orig: callback, // store original callback for IE
				key: key
			});
		},
		
		
		/**
		Remove event handler from the specified object. If third argument (callback)
		is not specified remove all events with the specified name.
		
		@method removeEvent
		@param {Object} obj DOM element to remove event listener(s) from.
		@param {String} name Name of event listener to remove.
		@param {Function|String} (optional) might be a callback or unique key to match.
		*/
		removeEvent: function(obj, name) {
			var type, callback, key;
			
			// match the handler either by callback or by key	
			if (typeof(arguments[2]) == "function") {
				callback = arguments[2];
			} else {
				key = arguments[2];
			}
						
			name = name.toLowerCase();
			
			if (obj[uid] && eventhash[obj[uid]] && eventhash[obj[uid]][name]) {
				type = eventhash[obj[uid]][name];
			} else {
				return;
			}
			
				
			for (var i=type.length-1; i>=0; i--) {
				// undefined or not, key should match			
				if (type[i].key === key || type[i].orig === callback) {
										
					if (obj.detachEvent) {
						obj.detachEvent('on'+name, type[i].func);
					} else if (obj.removeEventListener) {
						obj.removeEventListener(name, type[i].func, false);		
					}
					
					type[i].orig = null;
					type[i].func = null;
					
					type.splice(i, 1);
					
					// If callback was passed we are done here, otherwise proceed
					if (callback !== undefined) {
						break;
					}
				}			
			}	
			
			// If event array got empty, remove it
			if (!type.length) {
				delete eventhash[obj[uid]][name];
			}
			
			// If mOxie registry has become empty, remove it
			if (o.isEmptyObj(eventhash[obj[uid]])) {
				delete eventhash[obj[uid]];
				
				// IE doesn't let you remove DOM object property with - delete
				try {
					delete obj[uid];
				} catch(e) {
					obj[uid] = undefined;
				}
			}
		},
		
		
		/**
		Remove all kind of events from the specified object
		
		@method removeAllEvents
		@param {Object} obj DOM element to remove event listeners from.
		@param {String} (optional) unique key to match, when removing events.
		*/
		removeAllEvents: function(obj) {
			var key = arguments[1];
			
			if (obj[uid] === undefined || !obj[uid]) {
				return;
			}
			
			o.each(eventhash[obj[uid]], function(events, name) {
				o.removeEvent(obj, name, key);
			});		
		}
	});

}());


// getters and setters
(function(){

	/**
	Defines property with specified descriptor on an object
	
	@method defineProperty
	@param {Object} obj Object to add property to
	@param {String} prop Property name
	@param {Object} desc Set of key-value pairs defining descriptor for the property
	*/
	function defineProperty(obj, prop, desc)
	{
		if (o.typeOf(desc) === 'object') {
			defineGSetter.call(obj, prop, desc, 'get');

			if (!Object.defineProperty) {
				// additionally call it for setter
				defineGSetter.call(obj, prop, desc, 'set');
			}
		}
	}

	/**
	Defines getter for the property
	
	@method defineGetter
	@param {Object} obj Object to add property to
	@param {String} prop Property name
	@param {Object} desc Set of key-value pairs defining descriptor for the property
	*/
	function defineGetter(obj, prop, desc)
	{
		return defineGSetter.call(obj, prop, desc, 'get');
	}

	/**
	Defines setter for the property
	
	@method defineSetter
	@param {Object} obj Object to add property to
	@param {String} prop Property name
	@param {Object} desc Set of key-value pairs defining descriptor for the property
	*/
	function defineSetter(obj, prop, desc)
	{
		return defineGSetter.call(obj, prop, desc, 'set');
	}

	/**
	Defines getter or setter, depending on a type param
	
	@method defineGSetter
	@private
	@param {String} prop Property name
	@param {Object} desc Set of key-value pairs defining descriptor for the property
	@param {String} type Can take value of 'set' or 'get'
	*/
	function defineGSetter(prop, desc, type)
	{
		var 
		  defaults = {
			enumerable: true, 
			configurable: true 
		  }
		, fn
		, camelType
		, self = this
		;

		type = type.toLowerCase();
		camelType = type.replace(/^[gs]/, function($1) { return $1.toUpperCase(); });

		// define function object for fallback
		if (o.typeOf(desc) === 'function') {
			fn = desc;
			desc = {};
			desc[type] = fn;
		} else if (o.typeOf(desc[type]) === 'function') {
			fn = desc[type];
		} else {
			return;
		}

		if (o.ua.can('define_property')) {
			if (Object.defineProperty) {
				return Object.defineProperty(this, prop, o.extend({}, defaults, desc));
			} else {
				return self['__define' + camelType + 'ter__'](prop, fn);
			}
		}
	}

	o.defineGetter = defineGetter;
	o.defineSetter = defineSetter;
	o.defineProperty = defineProperty;
}());


o.extend(o, {

	/**
	Parse url into separate components and fill in absent parts with parts from current url,  
	based on https://raw.github.com/kvz/phpjs/master/functions/url/parse_url.js

	@method parseUrl
	@param {String} str Url to parse
	@return {Object} Hash containing extracted uri components
	*/
	parseUrl: function(str) {			
		var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'],
			ports = {
				http: 80,
				https: 443
			},
			uri = {},
			regex = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, 
			m = regex.exec(str || ''),
			i = key.length,
			path;
							
		while (i--) {
			if (m[i]) {
			  uri[key[i]] = m[i];  
			}
		}
		
		// if url is relative, fill in missing parts
		if (/^[^\/]/.test(uri.path) && !uri.scheme) {
			uri.scheme = document.location.protocol.replace(/:$/, '');
			uri.host = document.location.hostname;
			uri.port = document.location.port || ports[uri.scheme];
			
			path = document.location.pathname;
			
			// if path ends with a filename, strip it
			if (!/(\/|\/[^\.]+)$/.test(path)) {
				path = path.replace(/[^\/]+$/, '');
			}
			uri.path = path + (uri.path || '');
		}
											
		delete uri.source;
		return uri;
	},
	
	/**
	Encode string with UTF-8  

	@method utf8_encode
	@param {String} str String to encode
	@return {String} UTF-8 encoded string
	*/
	utf8_encode: function(str) {
		return unescape(encodeURIComponent(str));
	},
	
	/**
	Decode UTF-8 encoded string

	@method utf8_decode
	@param {String} str String to decode
	@return {String} Decoded string
	*/
	utf8_decode : function(str_data) {
		return decodeURIComponent(escape(str_data));
	},
	
	/**
	Decode Base64 encoded string (uses browser's default method if available),
	from: https://raw.github.com/kvz/phpjs/master/functions/url/base64_decode.js

	@method atob
	@param {String} data String to decode
	@return {String} Decoded string
	*/
	atob: function(data) {
		if (typeof(window['atob']) === 'function') {
			return window.atob(data);
		}

		// http://kevin.vanzonneveld.net
	    // +   original by: Tyler Akins (http://rumkin.com)
	    // +   improved by: Thunder.m
	    // +      input by: Aman Gupta
	    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   bugfixed by: Onno Marsman
	    // +   bugfixed by: Pellentesque Malesuada
	    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +      input by: Brett Zamir (http://brett-zamir.me)
	    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
	    // *     returns 1: 'Kevin van Zonneveld'
	    // mozilla has this native
	    // - but breaks in 2.0.0.12!
	    //if (typeof this.window['atob'] == 'function') {
	    //    return atob(data);
	    //}
	    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	        ac = 0,
	        dec = "",
	        tmp_arr = [];

	    if (!data) {
	        return data;
	    }

	    data += '';

	    do { // unpack four hexets into three octets using index points in b64
	        h1 = b64.indexOf(data.charAt(i++));
	        h2 = b64.indexOf(data.charAt(i++));
	        h3 = b64.indexOf(data.charAt(i++));
	        h4 = b64.indexOf(data.charAt(i++));

	        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

	        o1 = bits >> 16 & 0xff;
	        o2 = bits >> 8 & 0xff;
	        o3 = bits & 0xff;

	        if (h3 == 64) {
	            tmp_arr[ac++] = String.fromCharCode(o1);
	        } else if (h4 == 64) {
	            tmp_arr[ac++] = String.fromCharCode(o1, o2);
	        } else {
	            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
	        }
	    } while (i < data.length);

	    dec = tmp_arr.join('');

	    return dec;
	},
	
	/**
	Base64 encode string (uses browser's default method if available),
	from: https://raw.github.com/kvz/phpjs/master/functions/url/base64_encode.js

	@method btoa
	@param {String} data String to encode
	@return {String} Base64 encoded string
	*/
	btoa: function(data) {
		if (typeof(window['btoa']) === 'function') {
			return window.btoa(data);	
		}
		
		// http://kevin.vanzonneveld.net
	    // +   original by: Tyler Akins (http://rumkin.com)
	    // +   improved by: Bayron Guevara
	    // +   improved by: Thunder.m
	    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   bugfixed by: Pellentesque Malesuada
	    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   improved by: Rafał Kukawski (http://kukawski.pl)
	    // *     example 1: base64_encode('Kevin van Zonneveld');
	    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	    // mozilla has this native
	    // - but breaks in 2.0.0.12!
	    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	        ac = 0,
	        enc = "",
	        tmp_arr = [];

	    if (!data) {
	        return data;
	    }

	    do { // pack three octets into four hexets
	        o1 = data.charCodeAt(i++);
	        o2 = data.charCodeAt(i++);
	        o3 = data.charCodeAt(i++);

	        bits = o1 << 16 | o2 << 8 | o3;

	        h1 = bits >> 18 & 0x3f;
	        h2 = bits >> 12 & 0x3f;
	        h3 = bits >> 6 & 0x3f;
	        h4 = bits & 0x3f;

	        // use hexets to index into b64, and append result to encoded string
	        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	    } while (i < data.length);

	    enc = tmp_arr.join('');
	    
	    var r = data.length % 3;
	    
	    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
	}
	
});

/**
@class JSON
@static
*/
o.JSON = {};

/**
Parse string into the JSON object in a safe way
@credits Douglas Crockford: https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js

@method parse
@param {Object} obj Object to add property to
@param {String} prop Property name
@param {Object} desc Set of key-value pairs defining descriptor for the property
*/
o.JSON.parse = !!window.JSON && JSON.parse || (function() {
    "use strict";

// This is a function that can parse a JSON text, producing a JavaScript
// data structure. It is a simple, recursive descent parser. It does not use
// eval or regular expressions, so it can be used as a model for implementing
// a JSON parser in other languages.

// We are defining the function inside of another function to avoid creating
// global variables.

    var at,     // The index of the current character
        ch,     // The current character
        escapee = {
            '"':  '"',
            '\\': '\\',
            '/':  '/',
            b:    '\b',
            f:    '\f',
            n:    '\n',
            r:    '\r',
            t:    '\t'
        },
        text,

        error = function (m) {

// Call error when something is wrong.

            throw {
                name:    'SyntaxError',
                message: m,
                at:      at,
                text:    text
            };
        },

        next = function (c) {

// If a c parameter is provided, verify that it matches the current character.

            if (c && c !== ch) {
                error("Expected '" + c + "' instead of '" + ch + "'");
            }

// Get the next character. When there are no more characters,
// return the empty string.

            ch = text.charAt(at);
            at += 1;
            return ch;
        },

        number = function () {

// Parse a number value.

            var number,
                string = '';

            if (ch === '-') {
                string = '-';
                next('-');
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
            if (ch === '.') {
                string += '.';
                while (next() && ch >= '0' && ch <= '9') {
                    string += ch;
                }
            }
            if (ch === 'e' || ch === 'E') {
                string += ch;
                next();
                if (ch === '-' || ch === '+') {
                    string += ch;
                    next();
                }
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
            }
            number = +string;
            if (!isFinite(number)) {
                error("Bad number");
            } else {
                return number;
            }
        },

        string = function () {

// Parse a string value.

            var hex,
                i,
                string = '',
                uffff;

// When parsing for string values, we must look for " and \ characters.

            if (ch === '"') {
                while (next()) {
                    if (ch === '"') {
                        next();
                        return string;
                    } else if (ch === '\\') {
                        next();
                        if (ch === 'u') {
                            uffff = 0;
                            for (i = 0; i < 4; i += 1) {
                                hex = parseInt(next(), 16);
                                if (!isFinite(hex)) {
                                    break;
                                }
                                uffff = uffff * 16 + hex;
                            }
                            string += String.fromCharCode(uffff);
                        } else if (typeof escapee[ch] === 'string') {
                            string += escapee[ch];
                        } else {
                            break;
                        }
                    } else {
                        string += ch;
                    }
                }
            }
            error("Bad string");
        },

        white = function () {

// Skip whitespace.

            while (ch && ch <= ' ') {
                next();
            }
        },

        word = function () {

// true, false, or null.

            switch (ch) {
            case 't':
                next('t');
                next('r');
                next('u');
                next('e');
                return true;
            case 'f':
                next('f');
                next('a');
                next('l');
                next('s');
                next('e');
                return false;
            case 'n':
                next('n');
                next('u');
                next('l');
                next('l');
                return null;
            }
            error("Unexpected '" + ch + "'");
        },

        value,  // Place holder for the value function.

        array = function () {

// Parse an array value.

            var array = [];

            if (ch === '[') {
                next('[');
                white();
                if (ch === ']') {
                    next(']');
                    return array;   // empty array
                }
                while (ch) {
                    array.push(value());
                    white();
                    if (ch === ']') {
                        next(']');
                        return array;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad array");
        },

        object = function () {

// Parse an object value.

            var key,
                object = {};

            if (ch === '{') {
                next('{');
                white();
                if (ch === '}') {
                    next('}');
                    return object;   // empty object
                }
                while (ch) {
                    key = string();
                    white();
                    next(':');
                    if (Object.hasOwnProperty.call(object, key)) {
                        error('Duplicate key "' + key + '"');
                    }
                    object[key] = value();
                    white();
                    if (ch === '}') {
                        next('}');
                        return object;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad object");
        };

    value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

        white();
        switch (ch) {
        case '{':
            return object();
        case '[':
            return array();
        case '"':
            return string();
        case '-':
            return number();
        default:
            return ch >= '0' && ch <= '9' ? number() : word();
        }
    };

// Return the json_parse function. It will have access to all of the above
// functions and variables.

    return function (source, reviver) {
        var result;

        text = source;
        at = 0;
        ch = ' ';
        result = value();
        white();
        if (ch) {
            error("Syntax error");
        }

// If there is a reviver function, we recursively walk the new structure,
// passing each name/value pair to the reviver function for possible
// transformation, starting with a temporary root object that holds the result
// in an empty key. If there is not a reviver function, we simply return the
// result.

        return typeof reviver === 'function' ? (function walk(holder, key) {
            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }({'': result}, '')) : result;
    };
}());


}(window, document, mOxie));