/* tslint:disable */
/**
 * Env.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

import { verComp, typeOf, inArray } from './Basic';

/**
@class moxie/utils/Env
@public
@static
*/

/**
 * UAParser.js v0.7.7
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2015 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 & MIT
 */
var UAParser: any = (function (undefined) {

	//////////////
	// Constants
	/////////////


	var EMPTY       = '',
		UNKNOWN     = '?',
		FUNC_TYPE   = 'function',
		UNDEF_TYPE  = 'undefined',
		OBJ_TYPE    = 'object',
		NAME        = 'name',
		VERSION     = 'version';


	///////////
	// Helper
	//////////


	var util = {
		has : function (str1, str2) {
			return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
		},
		lowerize : function (str) {
			return str.toLowerCase();
		}
	};


	///////////////
	// Map helper
	//////////////


	var mapper = {

		rgx : function () {

			// loop through all regexes maps
			for (var result, i = 0, j, k, p, q, matches, match, args = arguments; i < args.length; i += 2) {

				var regex = args[i],       // even sequence (0,2,4,..)
					props = args[i + 1];   // odd sequence (1,3,5,..)

				// construct object barebones
				if (typeof(result) === UNDEF_TYPE) {
					result = {};
					for (p in props) {
						q = props[p];
						if (typeof(q) === OBJ_TYPE) {
							result[q[0]] = undefined;
						} else {
							result[q] = undefined;
						}
					}
				}

				// try matching uastring with regexes
				for (j = k = 0; j < regex.length; j++) {
					matches = regex[j].exec(this.getUA());
					if (!!matches) {
						for (p = 0; p < props.length; p++) {
							match = matches[++k];
							q = props[p];
							// check if given property is actually array
							if (typeof(q) === OBJ_TYPE && q.length > 0) {
								if (q.length == 2) {
									if (typeof(q[1]) == FUNC_TYPE) {
										// assign modified match
										result[q[0]] = q[1].call(this, match);
									} else {
										// assign given value, ignore regex match
										result[q[0]] = q[1];
									}
								} else if (q.length == 3) {
									// check whether function or regex
									if (typeof(q[1]) === FUNC_TYPE && !(q[1].exec && q[1].test)) {
										// call function (usually string mapper)
										result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
									} else {
										// sanitize match using given regex
										result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
									}
								} else if (q.length == 4) {
										result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
								}
							} else {
								result[q] = match ? match : undefined;
							}
						}
						break;
					}
				}

				if(!!matches) break; // break the loop immediately if match found
			}
			return result;
		},

		str : function (str, map) {

			for (var i in map) {
				// check if array
				if (typeof(map[i]) === OBJ_TYPE && map[i].length > 0) {
					for (var j = 0; j < map[i].length; j++) {
						if (util.has(map[i][j], str)) {
							return (i === UNKNOWN) ? undefined : i;
						}
					}
				} else if (util.has(map[i], str)) {
					return (i === UNKNOWN) ? undefined : i;
				}
			}
			return str;
		}
	};


	///////////////
	// String map
	//////////////


	var maps = {

		browser : {
			oldsafari : {
				major : {
					'1' : ['/8', '/1', '/3'],
					'2' : '/4',
					'?' : '/'
				},
				version : {
					'1.0'   : '/8',
					'1.2'   : '/1',
					'1.3'   : '/3',
					'2.0'   : '/412',
					'2.0.2' : '/416',
					'2.0.3' : '/417',
					'2.0.4' : '/419',
					'?'     : '/'
				}
			}
		},

		device : {
			sprint : {
				model : {
					'Evo Shift 4G' : '7373KT'
				},
				vendor : {
					'HTC'       : 'APA',
					'Sprint'    : 'Sprint'
				}
			}
		},

		os : {
			windows : {
				version : {
					'ME'        : '4.90',
					'NT 3.11'   : 'NT3.51',
					'NT 4.0'    : 'NT4.0',
					'2000'      : 'NT 5.0',
					'XP'        : ['NT 5.1', 'NT 5.2'],
					'Vista'     : 'NT 6.0',
					'7'         : 'NT 6.1',
					'8'         : 'NT 6.2',
					'8.1'       : 'NT 6.3',
					'RT'        : 'ARM'
				}
			}
		}
	};


	//////////////
	// Regex map
	/////////////


	var regexes = {

		browser : [[

			// Presto based
			/(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
			/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
			/(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
			/(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80

			], [NAME, VERSION], [

			/\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
			], [[NAME, 'Opera'], VERSION], [

			// Mixed
			/(kindle)\/([\w\.]+)/i,                                             // Kindle
			/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
																				// Lunascape/Maxthon/Netfront/Jasmine/Blazer

			// Trident based
			/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
																				// Avant/IEMobile/SlimBrowser/Baidu
			/(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

			// Webkit/KHTML based
			/(rekonq)\/([\w\.]+)*/i,                                            // Rekonq
			/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi)\/([\w\.-]+)/i
																				// Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron
			], [NAME, VERSION], [

			/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
			], [[NAME, 'IE'], VERSION], [

			/(edge)\/((\d+)?[\w\.]+)/i                                          // Microsoft Edge
			], [NAME, VERSION], [

			/(yabrowser)\/([\w\.]+)/i                                           // Yandex
			], [[NAME, 'Yandex'], VERSION], [

			/(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
			], [[NAME, /_/g, ' '], VERSION], [

			/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
																				// Chrome/OmniWeb/Arora/Tizen/Nokia
			/(uc\s?browser|qqbrowser)[\/\s]?([\w\.]+)/i
																				// UCBrowser/QQBrowser
			], [NAME, VERSION], [

			/(dolfin)\/([\w\.]+)/i                                              // Dolphin
			], [[NAME, 'Dolphin'], VERSION], [

			/((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
			], [[NAME, 'Chrome'], VERSION], [

			/XiaoMi\/MiuiBrowser\/([\w\.]+)/i                                   // MIUI Browser
			], [VERSION, [NAME, 'MIUI Browser']], [

			/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i         // Android Browser
			], [VERSION, [NAME, 'Android Browser']], [

			/FBAV\/([\w\.]+);/i                                                 // Facebook App for iOS
			], [VERSION, [NAME, 'Facebook']], [

			/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
			], [VERSION, [NAME, 'Mobile Safari']], [

			/version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
			], [VERSION, NAME], [

			/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
			], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

			/(konqueror)\/([\w\.]+)/i,                                          // Konqueror
			/(webkit|khtml)\/([\w\.]+)/i
			], [NAME, VERSION], [

			// Gecko based
			/(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
			], [[NAME, 'Netscape'], VERSION], [
			/(swiftfox)/i,                                                      // Swiftfox
			/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
																				// IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
			/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
																				// Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
			/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

			// Other
			/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf)[\/\s]?([\w\.]+)/i,
																				// Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf
			/(links)\s\(([\w\.]+)/i,                                            // Links
			/(gobrowser)\/?([\w\.]+)*/i,                                        // GoBrowser
			/(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
			/(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
			], [NAME, VERSION]
		],

		engine : [[

			/windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
			], [VERSION, [NAME, 'EdgeHTML']], [

			/(presto)\/([\w\.]+)/i,                                             // Presto
			/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
			/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
			/(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
			], [NAME, VERSION], [

			/rv\:([\w\.]+).*(gecko)/i                                           // Gecko
			], [VERSION, NAME]
		],

		os : [[

			// Windows based
			/microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
			], [NAME, VERSION], [
			/(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
			/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
			], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
			/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
			], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

			// Mobile/Embedded OS
			/\((bb)(10);/i                                                      // BlackBerry 10
			], [[NAME, 'BlackBerry'], VERSION], [
			/(blackberry)\w*\/?([\w\.]+)*/i,                                    // Blackberry
			/(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
			/(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
																				// Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
			/linux;.+(sailfish);/i                                              // Sailfish OS
			], [NAME, VERSION], [
			/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // Symbian
			], [[NAME, 'Symbian'], VERSION], [
			/\((series40);/i                                                    // Series 40
			], [NAME], [
			/mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
			], [[NAME, 'Firefox OS'], VERSION], [

			// Console
			/(nintendo|playstation)\s([wids3portablevu]+)/i,                    // Nintendo/Playstation

			// GNU/Linux based
			/(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
			/(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
			/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,
																				// Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
																				// Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
			/(hurd|linux)\s?([\w\.]+)*/i,                                       // Hurd/Linux
			/(gnu)\s?([\w\.]+)*/i                                               // GNU
			], [NAME, VERSION], [

			/(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
			], [[NAME, 'Chromium OS'], VERSION],[

			// Solaris
			/(sunos)\s?([\w\.]+\d)*/i                                           // Solaris
			], [[NAME, 'Solaris'], VERSION], [

			// BSD based
			/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
			], [NAME, VERSION],[

			/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i             // iOS
			], [[NAME, 'iOS'], [VERSION, /_/g, '.']], [

			/(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
			/(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
			], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

			// Other
			/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // Solaris
			/(haiku)\s(\w+)/i,                                                  // Haiku
			/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // AIX
			/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
																				// Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
			/(unix)\s?([\w\.]+)*/i                                              // UNIX
			], [NAME, VERSION]
		]
	};


	/////////////////
	// Constructor
	////////////////


	var UAParser = function (uastring) {

		var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);

		this.getBrowser = function () {
			return mapper.rgx.apply(this, regexes.browser);
		};
		this.getEngine = function () {
			return mapper.rgx.apply(this, regexes.engine);
		};
		this.getOS = function () {
			return mapper.rgx.apply(this, regexes.os);
		};
		this.getResult = function() {
			return {
				ua      : this.getUA(),
				browser : this.getBrowser(),
				engine  : this.getEngine(),
				os      : this.getOS()
			};
		};
		this.getUA = function () {
			return ua;
		};
		this.setUA = function (uastring) {
			ua = uastring;
			return this;
		};
		this.setUA(ua);
	};

	return UAParser;
})();

var can = (function() {
	var caps: any = {
		access_global_ns: function () {
			return window.hasOwnProperty('moxie');
		},

		create_canvas: function() {
			// On the S60 and BB Storm, getContext exists, but always returns undefined
			// so we actually have to call getContext() to verify
			// github.com/Modernizr/Modernizr/issues/issue/97/
			var el = document.createElement('canvas');
			var isSupported = !!(el.getContext && el.getContext('2d'));
			caps.create_canvas = isSupported;
			return isSupported;
		},

		filter_by_extension: function() { // if you know how to feature-detect this, please suggest
			return !(
				(Env.browser === 'Chrome' && Env.verComp(Env.version, 28, '<')) ||
				(Env.browser === 'IE' && Env.verComp(Env.version, 10, '<')) ||
				(Env.browser === 'Safari' && Env.verComp(Env.version, 7, '<')) ||
				(Env.browser === 'Firefox' && Env.verComp(Env.version, 37, '<'))
			);
		},

		return_response_type: function(responseType) {
			try {
				if (inArray(responseType, ['', 'text', 'document']) !== -1) {
					return true;
				} else if (window.hasOwnProperty('XMLHttpRequest')) {
					var xhr = new XMLHttpRequest();
					xhr.open('get', '/'); // otherwise Gecko throws an exception
					if ('responseType' in xhr) {
						xhr.responseType = responseType;
						// as of 23.0.1271.64, Chrome switched from throwing exception to merely logging it to the console (why? o why?)
						if (xhr.responseType !== responseType) {
							return false;
						}
						return true;
					}
				}
			} catch (ex) {}
			return false;
		},

		select_file: function() {
			return Env.can('use_fileinput') && window.hasOwnProperty('File');
		},

		select_folder: function() {
			return Env.can('select_file') && (
				Env.browser === 'Chrome' && Env.verComp(Env.version, 21, '>=') ||
				Env.browser === 'Firefox' && Env.verComp(Env.version, 42, '>=') // https://developer.mozilla.org/en-US/Firefox/Releases/42
			);
		},

		select_multiple: function() {
			// it is buggy on Safari Windows and iOS
			return Env.can('select_file') &&
				!(Env.browser === 'Safari' && Env.os === 'Windows') &&
				!(Env.os === 'iOS' && Env.verComp(Env.osVersion, "7.0.0", '>') && Env.verComp(Env.osVersion, "8.0.0", '<'));
		},

		summon_file_dialog: function() { // yeah... some dirty sniffing here...
			return Env.can('select_file') && !(
				(Env.browser === 'Firefox' && Env.verComp(Env.version, 4, '<')) ||
				(Env.browser === 'Opera' && Env.verComp(Env.version, 12, '<')) ||
				(Env.browser === 'IE' && Env.verComp(Env.version, 10, '<'))
			);
		},

		use_blob_uri: function() {
			var URL = window.URL;
			caps.use_blob_uri = (URL &&
				'createObjectURL' in URL &&
				'revokeObjectURL' in URL &&
				(Env.browser !== 'IE' || Env.verComp(Env.version, '11.0.46', '>=')) // IE supports createObjectURL, but not fully, for example it fails to use it as a src for the image
			);
			return caps.use_blob_uri;
		},

		// ideas for this heavily come from Modernizr (http://modernizr.com/)
		use_data_uri: (function() {
			var du = new Image();

			du.onload = function() {
				caps.use_data_uri = (du.width === 1 && du.height === 1);
			};

			setTimeout(function() {
				du.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
			}, 1);
			return false;
		}()),

		use_data_uri_over32kb: function() { // IE8
			return caps.use_data_uri && (Env.browser !== 'IE' || Env.version >= 9);
		},

		use_data_uri_of: function(bytes) {
			return (caps.use_data_uri && bytes < 33000 || caps.use_data_uri_over32kb());
		},

		use_fileinput: function() {
			if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
				return false;
			}

			var el = document.createElement('input');
			el.setAttribute('type', 'file');
			return caps.use_fileinput = !el.disabled;
		},

		use_webgl: function() {
			var canvas = document.createElement('canvas');
			var gl = null, isSupported;
			try {
				gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
			}
			catch(e) {}

			if (!gl) { // it seems that sometimes it doesn't throw exception, but still fails to get context
				gl = null;
			}

			isSupported = !!gl;
			caps.use_webgl = isSupported; // save result of our check
			canvas = undefined;
			return isSupported;
		}
	};

	return function(cap) {
		var args = [].slice.call(arguments);
		args.shift(); // shift of cap
		return typeOf(caps[cap]) === 'function' ? caps[cap].apply(this, args) : !!caps[cap];
	};
}());


var uaResult = (new UAParser()).getResult();


var Env: any = {
	can,

	uaParser: UAParser,

	browser: uaResult.browser.name,
	version: uaResult.browser.version,
	os: uaResult.os.name, // everybody intuitively types it in a lowercase for some reason
	osVersion: uaResult.os.version,

	verComp
};

// for backward compatibility
// @deprecated Use `Env.os` instead
Env.OS = Env.os;

export default Env;
