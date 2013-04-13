/**
 * mOxie - multi-runtime File API & XMLHttpRequest L2 Polyfill
 * v1.0a
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Date: 2012-11-13
 */
/**
 * Compiled inline version. (Library mode)
 */

/*jshint smarttabs:true, undef:true, latedef:true, curly:true, bitwise:true, camelcase:true */
/*globals $code */

(function(exports, undefined) {
	"use strict";

	var modules = {};

	function require(ids, callback) {
		var module, defs = [];

		for (var i = 0; i < ids.length; ++i) {
			module = modules[ids[i]] || resolve(ids[i]);
			if (!module) {
				throw 'module definition dependecy not found: ' + ids[i];
			}

			defs.push(module);
		}

		callback.apply(null, defs);
	}

	function define(id, dependencies, definition) {
		if (typeof id !== 'string') {
			throw 'invalid module definition, module id must be defined and be a string';
		}

		if (dependencies === undefined) {
			throw 'invalid module definition, dependencies must be specified';
		}

		if (definition === undefined) {
			throw 'invalid module definition, definition function must be specified';
		}

		require(dependencies, function() {
			modules[id] = definition.apply(null, arguments);
		});
	}

	function defined(id) {
		return !!modules[id];
	}

	function resolve(id) {
		var target = exports;
		var fragments = id.split(/[.\/]/);

		for (var fi = 0; fi < fragments.length; ++fi) {
			if (!target[fragments[fi]]) {
				return;
			}

			target = target[fragments[fi]];
		}

		return target;
	}

	function expose(ids) {
		for (var i = 0; i < ids.length; i++) {
			var target = exports;
			var id = ids[i];
			var fragments = id.split(/[.\/]/);

			for (var fi = 0; fi < fragments.length - 1; ++fi) {
				if (target[fragments[fi]] === undefined) {
					target[fragments[fi]] = {};
				}

				target = target[fragments[fi]];
			}

			target[fragments[fragments.length - 1]] = modules[id];
		}
	}

// Included from: src/javascript/core/utils/Basic.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/utils/Basic.js", "/**\n * Basic.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/core/utils/Basic', [], function() {\n\tvar undefined;\n\n\t/**\n\tGets the true type of the built-in object (better version of typeof).\n\t@author Angus Croll (http://javascriptweblog.wordpress.com/)\n\n\t@method typeOf\n\t@for Utils\n\t@static\n\t@param {Object} o Object to check.\n\t@return {String} Object [[Class]]\n\t*/\n\tvar typeOf = function(o) {\n\t\tif (o === undefined) {\n\t\t\treturn 'undefined';\n\t\t} else if (o === null) {\n\t\t\treturn 'null';\n\t\t} else if (o.nodeType) {\n\t\t\treturn 'node';\n\t\t}\n\n\t\t// the snippet below is awesome, however it fails to detect null, undefined and arguments types in IE lte 8\n\t\treturn ({}).toString.call(o).match(/\\s([a-z|A-Z]+)/)[1].toLowerCase();\n\t};\n\t\t\n\t/**\n\tExtends the specified object with another object.\n\n\t@method extend\n\t@static\n\t@param {Object} target Object to extend.\n\t@param {Object} [obj]* Multiple objects to extend with.\n\t@return {Object} Same as target, the extended object.\n\t*/\n\tvar extend = function(target) {\n\t\teach(arguments, function(arg, i) {\n\t\t\tif (i > 0) {\n\t\t\t\teach(arg, function(value, key) {\n\t\t\t\t\tif (value !== undefined) {\n\t\t\t\t\t\tif (typeOf(target[key]) === typeOf(value) && !!~inArray(typeOf(value), ['array', 'object'])) {\n\t\t\t\t\t\t\textend(target[key], value);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\ttarget[key] = value;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t}\n\t\t});\n\t\treturn target;\n\t};\n\t\t\n\t/**\n\tExecutes the callback function for each item in array/object. If you return false in the\n\tcallback it will break the loop.\n\n\t@method each\n\t@static\n\t@param {Object} obj Object to iterate.\n\t@param {function} callback Callback function to execute for each item.\n\t*/\n\tvar each = function(obj, callback) {\n\t\tvar length, key, i;\n\n\t\tif (obj) {\n\t\t\ttry {\n\t\t\t\tlength = obj.length;\n\t\t\t} catch(ex) {\n\t\t\t\tlength = undefined;\n\t\t\t}\n\n\t\t\tif (length === undefined) {\n\t\t\t\t// Loop object items\n\t\t\t\tfor (key in obj) {\n\t\t\t\t\tif (obj.hasOwnProperty(key)) {\n\t\t\t\t\t\tif (callback(obj[key], key) === false) {\n\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\t// Loop array items\n\t\t\t\tfor (i = 0; i < length; i++) {\n\t\t\t\t\tif (callback(obj[i], i) === false) {\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\tChecks if object is empty.\n\t\n\t@method isEmptyObj\n\t@static\n\t@param {Object} o Object to check.\n\t@return {Boolean}\n\t*/\n\tvar isEmptyObj = function(obj) {\n\t\tvar prop;\n\n\t\tif (!obj || typeOf(obj) !== 'object') {\n\t\t\treturn true;\n\t\t}\n\n\t\tfor (prop in obj) {\n\t\t\treturn false;\n\t\t}\n\n\t\treturn true;\n\t};\n\n\t/**\n\tRecieve an array of functions (usually async) to call in sequence, each  function\n\treceives a callback as first argument that it should call, when it completes. Finally,\n\tafter everything is complete, main callback is called. Passing truthy value to the\n\tcallback as a first argument will interrupt the sequence and invoke main callback\n\timmediately.\n\n\t@method inSeries\n\t@static\n\t@param {Array} queue Array of functions to call in sequence\n\t@param {Function} cb Main callback that is called in the end, or in case of erro\n\t*/\n\tvar inSeries = function(queue, cb) {\n\t\tvar i = 0, length = queue.length;\n\n\t\tif (typeOf(cb) !== 'function') {\n\t\t\tcb = function() {};\n\t\t}\n\n\t\tif (!queue || !queue.length) {\n\t\t\tcb();\n\t\t}\n\n\t\tfunction callNext(i) {\n\t\t\tif (typeOf(queue[i]) === 'function') {\n\t\t\t\tqueue[i](function(error) {\n\t\t\t\t\t/*jshint expr:true */\n\t\t\t\t\t++i < length && !error ? callNext(i) : cb(error);\n\t\t\t\t});\n\t\t\t}\n\t\t}\n\t\tcallNext(i);\n\t};\n\t\n\t\n\t/**\n\tFind an element in array and return it's index if present, otherwise return -1.\n\t\n\t@method inArray\n\t@static\n\t@param {Mixed} needle Element to find\n\t@param {Array} array\n\t@return {Int} Index of the element, or -1 if not found\n\t*/\n\tvar inArray = function(needle, array) {\n\t\tif (array) {\n\t\t\tif (Array.prototype.indexOf) {\n\t\t\t\treturn Array.prototype.indexOf.call(array, needle);\n\t\t\t}\n\t\t\n\t\t\tfor (var i = 0, length = array.length; i < length; i++) {\n\t\t\t\tif (array[i] === needle) {\n\t\t\t\t\treturn i;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn -1;\n\t};\n\n\n\t/**\n\tReturns elements of first array if they are not present in second. And false - otherwise.\n\n\t@private\n\t@method arrayDiff\n\t@param {Array} needles\n\t@param {Array} array\n\t@return {Array|Boolean}\n\t*/\n\tvar arrayDiff = function(needles, array) {\n\t\tvar diff = [];\n\n\t\tif (typeOf(needles) !== 'array') {\n\t\t\tneedles = [needles];\n\t\t}\n\n\t\tif (typeOf(array) !== 'array') {\n\t\t\tarray = [array];\n\t\t}\n\n\t\tfor (var i in needles) {\n\t\t\tif (inArray(needles[i], array) === -1) {\n\t\t\t\tdiff.push(needles[i]);\n\t\t\t}\t\n\t\t}\n\t\treturn diff.length ? diff : false;\n\t};\n\n\t\n\t/**\n\tForces anything into an array.\n\t\n\t@method toArray\n\t@static\n\t@param {Object} obj Object with length field.\n\t@return {Array} Array object containing all items.\n\t*/\n\tvar toArray = function(obj) {\n\t\tvar i, arr = [];\n\n\t\tfor (i = 0; i < obj.length; i++) {\n\t\t\tarr[i] = obj[i];\n\t\t}\n\n\t\treturn arr;\n\t};\n\t\n\t\t\t\n\t/**\n\tGenerates an unique ID. This is 99.99% unique since it takes the current time and 5 random numbers.\n\tThe only way a user would be able to get the same ID is if the two persons at the same exact milisecond manages\n\tto get 5 the same random numbers between 0-65535 it also uses a counter so each call will be guaranteed to be page unique.\n\tIt's more probable for the earth to be hit with an ansteriod. Y\n\t\n\t@method guid\n\t@static\n\t@param {String} prefix to prepend (by default 'o' will be prepended).\n\t@method guid\n\t@return {String} Virtually unique id.\n\t*/\n\tvar guid = (function() {\n\t\tvar counter = 0;\n\t\t\n\t\treturn function(prefix) {\n\t\t\tvar guid = new Date().getTime().toString(32), i;\n\n\t\t\tfor (i = 0; i < 5; i++) {\n\t\t\t\tguid += Math.floor(Math.random() * 65535).toString(32);\n\t\t\t}\n\t\t\t\n\t\t\treturn (prefix || 'o_') + guid + (counter++).toString(32);\n\t\t};\n\t}());\n\t\n\n\t/**\n\tTrims white spaces around the string\n\t\n\t@method trim\n\t@static\n\t@param {String} str\n\t@return {String}\n\t*/\n\tvar trim = function(str) {\n\t\tif (!str) {\n\t\t\treturn str;\n\t\t}\n\t\treturn String.prototype.trim ? String.prototype.trim.call(str) : str.toString().replace(/^\\s*/, '').replace(/\\s*$/, '');\n\t};\n\n\n\t/**\n\tParses the specified size string into a byte value. For example 10kb becomes 10240.\n\t\n\t@method parseSizeStr\n\t@static\n\t@param {String/Number} size String to parse or number to just pass through.\n\t@return {Number} Size in bytes.\n\t*/\n\tvar parseSizeStr = function(size) {\n\t\tif (typeof(size) !== 'string') {\n\t\t\treturn size;\n\t\t}\n\t\t\n\t\tvar muls = {\n\t\t\t\tt: 1099511627776,\n\t\t\t\tg: 1073741824,\n\t\t\t\tm: 1048576,\n\t\t\t\tk: 1024\n\t\t\t},\n\t\t\tmul;\n\n\t\tsize = /^([0-9]+)([mgk]?)$/.exec(size.toLowerCase().replace(/[^0-9mkg]/g, ''));\n\t\tmul = size[2];\n\t\tsize = +size[1];\n\t\t\n\t\tif (muls.hasOwnProperty(mul)) {\n\t\t\tsize *= muls[mul];\n\t\t}\n\t\treturn size;\n\t};\n\t\n\n\treturn {\n\t\tguid: guid,\n\t\ttypeOf: typeOf,\n\t\textend: extend,\n\t\teach: each,\n\t\tisEmptyObj: isEmptyObj,\n\t\tinSeries: inSeries,\n\t\tinArray: inArray,\n\t\tarrayDiff: arrayDiff,\n\t\ttoArray: toArray,\n\t\ttrim: trim,\n\t\tparseSizeStr: parseSizeStr\n\t};\n});");
__$coverInitRange("src/javascript/core/utils/Basic.js", "344:7076");
__$coverInitRange("src/javascript/core/utils/Basic.js", "395:408");
__$coverInitRange("src/javascript/core/utils/Basic.js", "663:1018");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1264:1650");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1925:2428");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2555:2725");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3261:3659");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3901:4191");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4397:4731");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4905:5033");
__$coverInitRange("src/javascript/core/utils/Basic.js", "5603:5901");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6018:6203");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6445:6836");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6842:7072");
__$coverInitRange("src/javascript/core/utils/Basic.js", "692:830");
__$coverInitRange("src/javascript/core/utils/Basic.js", "945:1014");
__$coverInitRange("src/javascript/core/utils/Basic.js", "718:736");
__$coverInitRange("src/javascript/core/utils/Basic.js", "768:781");
__$coverInitRange("src/javascript/core/utils/Basic.js", "813:826");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1298:1629");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1633:1646");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1336:1623");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1353:1618");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1391:1610");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1424:1603");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1526:1552");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1576:1595");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1964:1982");
__$coverInitRange("src/javascript/core/utils/Basic.js", "1987:2424");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2001:2076");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2082:2420");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2011:2030");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2053:2071");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2139:2275");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2163:2269");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2200:2262");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2248:2254");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2317:2415");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2353:2409");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2396:2402");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2590:2598");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2603:2661");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2666:2705");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2710:2721");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2646:2657");
__$coverInitRange("src/javascript/core/utils/Basic.js", "2689:2701");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3300:3332");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3337:3395");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3400:3442");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3447:3640");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3644:3655");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3373:3391");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3434:3438");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3473:3636");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3516:3631");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3575:3623");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3943:4174");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4178:4187");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3959:4049");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4057:4170");
__$coverInitRange("src/javascript/core/utils/Basic.js", "3994:4044");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4119:4165");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4151:4159");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4442:4455");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4460:4521");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4526:4581");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4586:4690");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4694:4727");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4498:4517");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4562:4577");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4614:4685");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4659:4680");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4937:4952");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4957:5014");
__$coverInitRange("src/javascript/core/utils/Basic.js", "5019:5029");
__$coverInitRange("src/javascript/core/utils/Basic.js", "4995:5010");
__$coverInitRange("src/javascript/core/utils/Basic.js", "5630:5645");
__$coverInitRange("src/javascript/core/utils/Basic.js", "5652:5894");
__$coverInitRange("src/javascript/core/utils/Basic.js", "5681:5728");
__$coverInitRange("src/javascript/core/utils/Basic.js", "5734:5823");
__$coverInitRange("src/javascript/core/utils/Basic.js", "5832:5889");
__$coverInitRange("src/javascript/core/utils/Basic.js", "5764:5818");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6047:6076");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6080:6199");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6062:6072");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6483:6534");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6541:6635");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6640:6718");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6722:6735");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6739:6754");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6761:6817");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6821:6832");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6519:6530");
__$coverInitRange("src/javascript/core/utils/Basic.js", "6796:6813");
__$coverCall('src/javascript/core/utils/Basic.js', '344:7076');
define('moxie/core/utils/Basic', [], function () {
    __$coverCall('src/javascript/core/utils/Basic.js', '395:408');
    var undefined;
    __$coverCall('src/javascript/core/utils/Basic.js', '663:1018');
    var typeOf = function (o) {
        __$coverCall('src/javascript/core/utils/Basic.js', '692:830');
        if (o === undefined) {
            __$coverCall('src/javascript/core/utils/Basic.js', '718:736');
            return 'undefined';
        } else if (o === null) {
            __$coverCall('src/javascript/core/utils/Basic.js', '768:781');
            return 'null';
        } else if (o.nodeType) {
            __$coverCall('src/javascript/core/utils/Basic.js', '813:826');
            return 'node';
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '945:1014');
        return {}.toString.call(o).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '1264:1650');
    var extend = function (target) {
        __$coverCall('src/javascript/core/utils/Basic.js', '1298:1629');
        each(arguments, function (arg, i) {
            __$coverCall('src/javascript/core/utils/Basic.js', '1336:1623');
            if (i > 0) {
                __$coverCall('src/javascript/core/utils/Basic.js', '1353:1618');
                each(arg, function (value, key) {
                    __$coverCall('src/javascript/core/utils/Basic.js', '1391:1610');
                    if (value !== undefined) {
                        __$coverCall('src/javascript/core/utils/Basic.js', '1424:1603');
                        if (typeOf(target[key]) === typeOf(value) && !!~inArray(typeOf(value), [
                                'array',
                                'object'
                            ])) {
                            __$coverCall('src/javascript/core/utils/Basic.js', '1526:1552');
                            extend(target[key], value);
                        } else {
                            __$coverCall('src/javascript/core/utils/Basic.js', '1576:1595');
                            target[key] = value;
                        }
                    }
                });
            }
        });
        __$coverCall('src/javascript/core/utils/Basic.js', '1633:1646');
        return target;
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '1925:2428');
    var each = function (obj, callback) {
        __$coverCall('src/javascript/core/utils/Basic.js', '1964:1982');
        var length, key, i;
        __$coverCall('src/javascript/core/utils/Basic.js', '1987:2424');
        if (obj) {
            __$coverCall('src/javascript/core/utils/Basic.js', '2001:2076');
            try {
                __$coverCall('src/javascript/core/utils/Basic.js', '2011:2030');
                length = obj.length;
            } catch (ex) {
                __$coverCall('src/javascript/core/utils/Basic.js', '2053:2071');
                length = undefined;
            }
            __$coverCall('src/javascript/core/utils/Basic.js', '2082:2420');
            if (length === undefined) {
                __$coverCall('src/javascript/core/utils/Basic.js', '2139:2275');
                for (key in obj) {
                    __$coverCall('src/javascript/core/utils/Basic.js', '2163:2269');
                    if (obj.hasOwnProperty(key)) {
                        __$coverCall('src/javascript/core/utils/Basic.js', '2200:2262');
                        if (callback(obj[key], key) === false) {
                            __$coverCall('src/javascript/core/utils/Basic.js', '2248:2254');
                            return;
                        }
                    }
                }
            } else {
                __$coverCall('src/javascript/core/utils/Basic.js', '2317:2415');
                for (i = 0; i < length; i++) {
                    __$coverCall('src/javascript/core/utils/Basic.js', '2353:2409');
                    if (callback(obj[i], i) === false) {
                        __$coverCall('src/javascript/core/utils/Basic.js', '2396:2402');
                        return;
                    }
                }
            }
        }
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '2555:2725');
    var isEmptyObj = function (obj) {
        __$coverCall('src/javascript/core/utils/Basic.js', '2590:2598');
        var prop;
        __$coverCall('src/javascript/core/utils/Basic.js', '2603:2661');
        if (!obj || typeOf(obj) !== 'object') {
            __$coverCall('src/javascript/core/utils/Basic.js', '2646:2657');
            return true;
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '2666:2705');
        for (prop in obj) {
            __$coverCall('src/javascript/core/utils/Basic.js', '2689:2701');
            return false;
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '2710:2721');
        return true;
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '3261:3659');
    var inSeries = function (queue, cb) {
        __$coverCall('src/javascript/core/utils/Basic.js', '3300:3332');
        var i = 0, length = queue.length;
        __$coverCall('src/javascript/core/utils/Basic.js', '3337:3395');
        if (typeOf(cb) !== 'function') {
            __$coverCall('src/javascript/core/utils/Basic.js', '3373:3391');
            cb = function () {
            };
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '3400:3442');
        if (!queue || !queue.length) {
            __$coverCall('src/javascript/core/utils/Basic.js', '3434:3438');
            cb();
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '3447:3640');
        function callNext(i) {
            __$coverCall('src/javascript/core/utils/Basic.js', '3473:3636');
            if (typeOf(queue[i]) === 'function') {
                __$coverCall('src/javascript/core/utils/Basic.js', '3516:3631');
                queue[i](function (error) {
                    __$coverCall('src/javascript/core/utils/Basic.js', '3575:3623');
                    ++i < length && !error ? callNext(i) : cb(error);
                });
            }
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '3644:3655');
        callNext(i);
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '3901:4191');
    var inArray = function (needle, array) {
        __$coverCall('src/javascript/core/utils/Basic.js', '3943:4174');
        if (array) {
            __$coverCall('src/javascript/core/utils/Basic.js', '3959:4049');
            if (Array.prototype.indexOf) {
                __$coverCall('src/javascript/core/utils/Basic.js', '3994:4044');
                return Array.prototype.indexOf.call(array, needle);
            }
            __$coverCall('src/javascript/core/utils/Basic.js', '4057:4170');
            for (var i = 0, length = array.length; i < length; i++) {
                __$coverCall('src/javascript/core/utils/Basic.js', '4119:4165');
                if (array[i] === needle) {
                    __$coverCall('src/javascript/core/utils/Basic.js', '4151:4159');
                    return i;
                }
            }
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '4178:4187');
        return -1;
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '4397:4731');
    var arrayDiff = function (needles, array) {
        __$coverCall('src/javascript/core/utils/Basic.js', '4442:4455');
        var diff = [];
        __$coverCall('src/javascript/core/utils/Basic.js', '4460:4521');
        if (typeOf(needles) !== 'array') {
            __$coverCall('src/javascript/core/utils/Basic.js', '4498:4517');
            needles = [needles];
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '4526:4581');
        if (typeOf(array) !== 'array') {
            __$coverCall('src/javascript/core/utils/Basic.js', '4562:4577');
            array = [array];
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '4586:4690');
        for (var i in needles) {
            __$coverCall('src/javascript/core/utils/Basic.js', '4614:4685');
            if (inArray(needles[i], array) === -1) {
                __$coverCall('src/javascript/core/utils/Basic.js', '4659:4680');
                diff.push(needles[i]);
            }
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '4694:4727');
        return diff.length ? diff : false;
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '4905:5033');
    var toArray = function (obj) {
        __$coverCall('src/javascript/core/utils/Basic.js', '4937:4952');
        var i, arr = [];
        __$coverCall('src/javascript/core/utils/Basic.js', '4957:5014');
        for (i = 0; i < obj.length; i++) {
            __$coverCall('src/javascript/core/utils/Basic.js', '4995:5010');
            arr[i] = obj[i];
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '5019:5029');
        return arr;
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '5603:5901');
    var guid = function () {
            __$coverCall('src/javascript/core/utils/Basic.js', '5630:5645');
            var counter = 0;
            __$coverCall('src/javascript/core/utils/Basic.js', '5652:5894');
            return function (prefix) {
                __$coverCall('src/javascript/core/utils/Basic.js', '5681:5728');
                var guid = new Date().getTime().toString(32), i;
                __$coverCall('src/javascript/core/utils/Basic.js', '5734:5823');
                for (i = 0; i < 5; i++) {
                    __$coverCall('src/javascript/core/utils/Basic.js', '5764:5818');
                    guid += Math.floor(Math.random() * 65535).toString(32);
                }
                __$coverCall('src/javascript/core/utils/Basic.js', '5832:5889');
                return (prefix || 'o_') + guid + (counter++).toString(32);
            };
        }();
    __$coverCall('src/javascript/core/utils/Basic.js', '6018:6203');
    var trim = function (str) {
        __$coverCall('src/javascript/core/utils/Basic.js', '6047:6076');
        if (!str) {
            __$coverCall('src/javascript/core/utils/Basic.js', '6062:6072');
            return str;
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '6080:6199');
        return String.prototype.trim ? String.prototype.trim.call(str) : str.toString().replace(/^\s*/, '').replace(/\s*$/, '');
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '6445:6836');
    var parseSizeStr = function (size) {
        __$coverCall('src/javascript/core/utils/Basic.js', '6483:6534');
        if (typeof size !== 'string') {
            __$coverCall('src/javascript/core/utils/Basic.js', '6519:6530');
            return size;
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '6541:6635');
        var muls = {
                t: 1099511627776,
                g: 1073741824,
                m: 1048576,
                k: 1024
            }, mul;
        __$coverCall('src/javascript/core/utils/Basic.js', '6640:6718');
        size = /^([0-9]+)([mgk]?)$/.exec(size.toLowerCase().replace(/[^0-9mkg]/g, ''));
        __$coverCall('src/javascript/core/utils/Basic.js', '6722:6735');
        mul = size[2];
        __$coverCall('src/javascript/core/utils/Basic.js', '6739:6754');
        size = +size[1];
        __$coverCall('src/javascript/core/utils/Basic.js', '6761:6817');
        if (muls.hasOwnProperty(mul)) {
            __$coverCall('src/javascript/core/utils/Basic.js', '6796:6813');
            size *= muls[mul];
        }
        __$coverCall('src/javascript/core/utils/Basic.js', '6821:6832');
        return size;
    };
    __$coverCall('src/javascript/core/utils/Basic.js', '6842:7072');
    return {
        guid: guid,
        typeOf: typeOf,
        extend: extend,
        each: each,
        isEmptyObj: isEmptyObj,
        inSeries: inSeries,
        inArray: inArray,
        arrayDiff: arrayDiff,
        toArray: toArray,
        trim: trim,
        parseSizeStr: parseSizeStr
    };
});

// Included from: src/javascript/core/I18n.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/I18n.js", "/**\n * I18n.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine(\"moxie/core/I18n\", [\n\t\"moxie/core/utils/Basic\"\n], function(Basic) {\n\tvar i18n = {};\n\n\treturn {\n\t\t/**\n\t\t * Extends the language pack object with new items.\n\t\t *\n\t\t * @param {Object} pack Language pack items to add.\n\t\t * @return {Object} Extended language pack object.\n\t\t */\n\t\taddI18n: function(pack) {\n\t\t\treturn Basic.extend(i18n, pack);\n\t\t},\n\n\t\t/**\n\t\t * Translates the specified string by checking for the english string in the language pack lookup.\n\t\t *\n\t\t * @param {String} str String to look for.\n\t\t * @return {String} Translated string or the input string if it wasn't found.\n\t\t */\n\t\ttranslate: function(str) {\n\t\t\treturn i18n[str] || str;\n\t\t},\n\n\t\t/**\n\t\t * Shortcut for translate function\n\t\t *\n\t\t * @param {String} str String to look for.\n\t\t * @return {String} Translated string or the input string if it wasn't found.\n\t\t */\n\t\t_: function(str) {\n\t\t\treturn this.translate(str);\n\t\t}\n\t};\n});");
__$coverInitRange("src/javascript/core/I18n.js", "342:1239");
__$coverInitRange("src/javascript/core/I18n.js", "418:431");
__$coverInitRange("src/javascript/core/I18n.js", "435:1235");
__$coverInitRange("src/javascript/core/I18n.js", "653:684");
__$coverInitRange("src/javascript/core/I18n.js", "967:990");
__$coverInitRange("src/javascript/core/I18n.js", "1201:1227");
__$coverCall('src/javascript/core/I18n.js', '342:1239');
define('moxie/core/I18n', ['moxie/core/utils/Basic'], function (Basic) {
    __$coverCall('src/javascript/core/I18n.js', '418:431');
    var i18n = {};
    __$coverCall('src/javascript/core/I18n.js', '435:1235');
    return {
        addI18n: function (pack) {
            __$coverCall('src/javascript/core/I18n.js', '653:684');
            return Basic.extend(i18n, pack);
        },
        translate: function (str) {
            __$coverCall('src/javascript/core/I18n.js', '967:990');
            return i18n[str] || str;
        },
        _: function (str) {
            __$coverCall('src/javascript/core/I18n.js', '1201:1227');
            return this.translate(str);
        }
    };
});

// Included from: src/javascript/core/utils/Mime.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/utils/Mime.js", "/**\n * Mime.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true */\n\ndefine(\"moxie/core/utils/Mime\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/I18n\"\n], function(Basic, I18n) {\n\t\n\tvar mimeData = \"\" +\n\t\t\"application/msword,doc dot,\" +\n\t\t\"application/pdf,pdf,\" +\n\t\t\"application/pgp-signature,pgp,\" +\n\t\t\"application/postscript,ps ai eps,\" +\n\t\t\"application/rtf,rtf,\" +\n\t\t\"application/vnd.ms-excel,xls xlb,\" +\n\t\t\"application/vnd.ms-powerpoint,ppt pps pot,\" +\n\t\t\"application/zip,zip,\" +\n\t\t\"application/x-shockwave-flash,swf swfl,\" +\n\t\t\"application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,\" +\n\t\t\"application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,\" +\n\t\t\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,\" +\n\t\t\"application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,\" +\n\t\t\"application/vnd.openxmlformats-officedocument.presentationml.template,potx,\" +\n\t\t\"application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,\" +\n\t\t\"application/x-javascript,js,\" +\n\t\t\"application/json,json,\" +\n\t\t\"audio/mpeg,mp3 mpga mpega mp2,\" +\n\t\t\"audio/x-wav,wav,\" +\n\t\t\"audio/mp4,m4a,\" +\n\t\t\"image/bmp,bmp,\" +\n\t\t\"image/gif,gif,\" +\n\t\t\"image/jpeg,jpg jpeg jpe,\" +\n\t\t\"image/photoshop,psd,\" +\n\t\t\"image/png,png,\" +\n\t\t\"image/svg+xml,svg svgz,\" +\n\t\t\"image/tiff,tiff tif,\" +\n\t\t\"text/plain,asc txt text diff log,\" +\n\t\t\"text/html,htm html xhtml,\" +\n\t\t\"text/css,css,\" +\n\t\t\"text/csv,csv,\" +\n\t\t\"text/rtf,rtf,\" +\n\t\t\"video/mpeg,mpeg mpg mpe m2v,\" +\n\t\t\"video/quicktime,qt mov,\" +\n\t\t\"video/mp4,mp4,\" +\n\t\t\"video/x-m4v,m4v,\" +\n\t\t\"video/x-flv,flv,\" +\n\t\t\"video/x-ms-wmv,wmv,\" +\n\t\t\"video/avi,avi,\" +\n\t\t\"video/webm,webm,\" +\n\t\t\"video/3gpp,3gp,\" +\n\t\t\"video/3gpp2,3g2,\" +\n\t\t\"video/vnd.rn-realvideo,rv,\" +\n\t\t\"application/vnd.oasis.opendocument.formula-template,otf,\" +\n\t\t\"application/octet-stream,exe\";\n\t\n\t\n\tvar Mime = {\n\n\t\tmimes: {},\n\n\t\textensions: {},\n\n\t\t// Parses the default mime types string into a mimes and extensions lookup maps\n\t\taddMimeType: function (mimeData) {\n\t\t\tvar items = mimeData.split(/,/), i, ii, ext;\n\t\t\t\n\t\t\tfor (i = 0; i < items.length; i += 2) {\n\t\t\t\text = items[i + 1].split(/ /);\n\n\t\t\t\t// extension to mime lookup\n\t\t\t\tfor (ii = 0; ii < ext.length; ii++) {\n\t\t\t\t\tthis.mimes[ext[ii]] = items[i];\n\t\t\t\t}\n\t\t\t\t// mime to extension lookup\n\t\t\t\tthis.extensions[items[i]] = ext;\n\t\t\t}\n\t\t},\n\n\t\textList2mimes: function (filters) {\n\t\t\tvar self = this, ext, i, ii, type, mimes = [];\n\t\t\t\n\t\t\t// Convert extensions to mime types list\n\t\t\tno_type_restriction:\n\t\t\tfor (i = 0; i < filters.length; i++) {\n\t\t\t\text = filters[i].extensions.split(/\\s*,\\s*/);\n\n\t\t\t\tfor (ii = 0; ii < ext.length; ii++) {\n\t\t\t\t\t\n\t\t\t\t\t// If there's an asterisk in the list, then accept attribute is not required\n\t\t\t\t\tif (ext[ii] === '*') {\n\t\t\t\t\t\tmimes = [];\n\t\t\t\t\t\tbreak no_type_restriction;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\ttype = self.mimes[ext[ii]];\n\n\t\t\t\t\tif (type && !~Basic.inArray(type, mimes)) {\n\t\t\t\t\t\tmimes.push(type);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn mimes;\n\t\t},\n\n\n\t\tmimes2extList: function(mimes) {\n\t\t\tvar self = this, exts = '', accept = [];\n\t\t\t\n\t\t\tmimes = Basic.trim(mimes);\n\t\t\t\n\t\t\tif (mimes !== '*') {\n\t\t\t\tBasic.each(mimes.split(/\\s*,\\s*/), function(mime) {\n\t\t\t\t\tif (self.extensions[mime]) {\n\t\t\t\t\t\texts += self.extensions[mime].join(',');\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t} else {\n\t\t\t\texts = mimes;\n\t\t\t}\n\t\t\t\n\t\t\taccept.push({\n\t\t\t\ttitle: I18n.translate('Files'),\n\t\t\t\textensions: exts\n\t\t\t});\n\t\t\t\n\t\t\t// save original mimes string\n\t\t\taccept.mimes = mimes;\n\t\t\t\t\t\t\t\n\t\t\treturn accept;\n\t\t},\n\n\t\tgetFileExtension: function(fileName) {\n\t\t\tvar matches = fileName && fileName.match(/\\.([^.]+)$/);\n\t\t\tif (matches) {\n\t\t\t\treturn matches[1].toLowerCase();\n\t\t\t}\n\t\t\treturn '';\n\t\t},\n\n\t\tgetFileMime: function(fileName) {\n\t\t\treturn this.mimes[this.getFileExtension(fileName)] || '';\n\t\t}\n\t};\n\n\tMime.addMimeType(mimeData);\n\n\treturn Mime;\n});\n");
__$coverInitRange("src/javascript/core/utils/Mime.js", "343:4091");
__$coverInitRange("src/javascript/core/utils/Mime.js", "453:2127");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2134:4042");
__$coverInitRange("src/javascript/core/utils/Mime.js", "4046:4072");
__$coverInitRange("src/javascript/core/utils/Mime.js", "4076:4087");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2303:2346");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2355:2620");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2399:2428");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2467:2546");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2584:2615");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2510:2540");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2669:2714");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2767:3226");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3231:3243");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2834:2878");
__$coverInitRange("src/javascript/core/utils/Mime.js", "2885:3221");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3016:3095");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3108:3134");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3142:3215");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3045:3055");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3063:3088");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3192:3208");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3290:3329");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3338:3363");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3372:3578");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3587:3663");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3705:3725");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3738:3751");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3397:3543");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3454:3535");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3489:3528");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3561:3573");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3803:3857");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3862:3917");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3922:3931");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3881:3912");
__$coverInitRange("src/javascript/core/utils/Mime.js", "3978:4034");
__$coverCall('src/javascript/core/utils/Mime.js', '343:4091');
define('moxie/core/utils/Mime', [
    'moxie/core/utils/Basic',
    'moxie/core/I18n'
], function (Basic, I18n) {
    __$coverCall('src/javascript/core/utils/Mime.js', '453:2127');
    var mimeData = '' + 'application/msword,doc dot,' + 'application/pdf,pdf,' + 'application/pgp-signature,pgp,' + 'application/postscript,ps ai eps,' + 'application/rtf,rtf,' + 'application/vnd.ms-excel,xls xlb,' + 'application/vnd.ms-powerpoint,ppt pps pot,' + 'application/zip,zip,' + 'application/x-shockwave-flash,swf swfl,' + 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,' + 'application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,' + 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,' + 'application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,' + 'application/vnd.openxmlformats-officedocument.presentationml.template,potx,' + 'application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,' + 'application/x-javascript,js,' + 'application/json,json,' + 'audio/mpeg,mp3 mpga mpega mp2,' + 'audio/x-wav,wav,' + 'audio/mp4,m4a,' + 'image/bmp,bmp,' + 'image/gif,gif,' + 'image/jpeg,jpg jpeg jpe,' + 'image/photoshop,psd,' + 'image/png,png,' + 'image/svg+xml,svg svgz,' + 'image/tiff,tiff tif,' + 'text/plain,asc txt text diff log,' + 'text/html,htm html xhtml,' + 'text/css,css,' + 'text/csv,csv,' + 'text/rtf,rtf,' + 'video/mpeg,mpeg mpg mpe m2v,' + 'video/quicktime,qt mov,' + 'video/mp4,mp4,' + 'video/x-m4v,m4v,' + 'video/x-flv,flv,' + 'video/x-ms-wmv,wmv,' + 'video/avi,avi,' + 'video/webm,webm,' + 'video/3gpp,3gp,' + 'video/3gpp2,3g2,' + 'video/vnd.rn-realvideo,rv,' + 'application/vnd.oasis.opendocument.formula-template,otf,' + 'application/octet-stream,exe';
    __$coverCall('src/javascript/core/utils/Mime.js', '2134:4042');
    var Mime = {
            mimes: {},
            extensions: {},
            addMimeType: function (mimeData) {
                __$coverCall('src/javascript/core/utils/Mime.js', '2303:2346');
                var items = mimeData.split(/,/), i, ii, ext;
                __$coverCall('src/javascript/core/utils/Mime.js', '2355:2620');
                for (i = 0; i < items.length; i += 2) {
                    __$coverCall('src/javascript/core/utils/Mime.js', '2399:2428');
                    ext = items[i + 1].split(/ /);
                    __$coverCall('src/javascript/core/utils/Mime.js', '2467:2546');
                    for (ii = 0; ii < ext.length; ii++) {
                        __$coverCall('src/javascript/core/utils/Mime.js', '2510:2540');
                        this.mimes[ext[ii]] = items[i];
                    }
                    __$coverCall('src/javascript/core/utils/Mime.js', '2584:2615');
                    this.extensions[items[i]] = ext;
                }
            },
            extList2mimes: function (filters) {
                __$coverCall('src/javascript/core/utils/Mime.js', '2669:2714');
                var self = this, ext, i, ii, type, mimes = [];
                __$coverCall('src/javascript/core/utils/Mime.js', '2767:3226');
                no_type_restriction:
                    for (i = 0; i < filters.length; i++) {
                        __$coverCall('src/javascript/core/utils/Mime.js', '2834:2878');
                        ext = filters[i].extensions.split(/\s*,\s*/);
                        __$coverCall('src/javascript/core/utils/Mime.js', '2885:3221');
                        for (ii = 0; ii < ext.length; ii++) {
                            __$coverCall('src/javascript/core/utils/Mime.js', '3016:3095');
                            if (ext[ii] === '*') {
                                __$coverCall('src/javascript/core/utils/Mime.js', '3045:3055');
                                mimes = [];
                                __$coverCall('src/javascript/core/utils/Mime.js', '3063:3088');
                                break no_type_restriction;
                            }
                            __$coverCall('src/javascript/core/utils/Mime.js', '3108:3134');
                            type = self.mimes[ext[ii]];
                            __$coverCall('src/javascript/core/utils/Mime.js', '3142:3215');
                            if (type && !~Basic.inArray(type, mimes)) {
                                __$coverCall('src/javascript/core/utils/Mime.js', '3192:3208');
                                mimes.push(type);
                            }
                        }
                    }
                __$coverCall('src/javascript/core/utils/Mime.js', '3231:3243');
                return mimes;
            },
            mimes2extList: function (mimes) {
                __$coverCall('src/javascript/core/utils/Mime.js', '3290:3329');
                var self = this, exts = '', accept = [];
                __$coverCall('src/javascript/core/utils/Mime.js', '3338:3363');
                mimes = Basic.trim(mimes);
                __$coverCall('src/javascript/core/utils/Mime.js', '3372:3578');
                if (mimes !== '*') {
                    __$coverCall('src/javascript/core/utils/Mime.js', '3397:3543');
                    Basic.each(mimes.split(/\s*,\s*/), function (mime) {
                        __$coverCall('src/javascript/core/utils/Mime.js', '3454:3535');
                        if (self.extensions[mime]) {
                            __$coverCall('src/javascript/core/utils/Mime.js', '3489:3528');
                            exts += self.extensions[mime].join(',');
                        }
                    });
                } else {
                    __$coverCall('src/javascript/core/utils/Mime.js', '3561:3573');
                    exts = mimes;
                }
                __$coverCall('src/javascript/core/utils/Mime.js', '3587:3663');
                accept.push({
                    title: I18n.translate('Files'),
                    extensions: exts
                });
                __$coverCall('src/javascript/core/utils/Mime.js', '3705:3725');
                accept.mimes = mimes;
                __$coverCall('src/javascript/core/utils/Mime.js', '3738:3751');
                return accept;
            },
            getFileExtension: function (fileName) {
                __$coverCall('src/javascript/core/utils/Mime.js', '3803:3857');
                var matches = fileName && fileName.match(/\.([^.]+)$/);
                __$coverCall('src/javascript/core/utils/Mime.js', '3862:3917');
                if (matches) {
                    __$coverCall('src/javascript/core/utils/Mime.js', '3881:3912');
                    return matches[1].toLowerCase();
                }
                __$coverCall('src/javascript/core/utils/Mime.js', '3922:3931');
                return '';
            },
            getFileMime: function (fileName) {
                __$coverCall('src/javascript/core/utils/Mime.js', '3978:4034');
                return this.mimes[this.getFileExtension(fileName)] || '';
            }
        };
    __$coverCall('src/javascript/core/utils/Mime.js', '4046:4072');
    Mime.addMimeType(mimeData);
    __$coverCall('src/javascript/core/utils/Mime.js', '4076:4087');
    return Mime;
});

// Included from: src/javascript/core/utils/Env.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/utils/Env.js", "/**\n * Env.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true, laxcomma:true */\n/*global define:true, modules:true */\n\ndefine(\"moxie/core/utils/Env\", [\n\t\"moxie/core/utils/Basic\"\n], function(Basic) {\n\t\n\tvar browser = [{\n\t\t\ts1: navigator.userAgent,\n\t\t\ts2: \"Android\",\n\t\t\tid: \"Android Browser\", // default or Dolphin\n\t\t\tsv: \"Version\" \n\t\t},{\n\t\t\ts1: navigator.userAgent, // string\n\t\t\ts2: \"Chrome\", // substring\n\t\t\tid: \"Chrome\" // identity\n\t\t},{\n\t\t\ts1: navigator.vendor,\n\t\t\ts2: \"Apple\",\n\t\t\tid: \"Safari\",\n\t\t\tsv: \"Version\" // version\n\t\t},{\n\t\t\tprop: window.opera && window.opera.buildNumber,\n\t\t\tid: \"Opera\",\n\t\t\tsv: \"Version\"\n\t\t},{\n\t\t\ts1: navigator.vendor,\n\t\t\ts2: \"KDE\",\n\t\t\tid: \"Konqueror\"\n\t\t},{\n\t\t\ts1: navigator.userAgent,\n\t\t\ts2: \"Firefox\",\n\t\t\tid: \"Firefox\"\n\t\t},{\n\t\t\ts1: navigator.vendor,\n\t\t\ts2: \"Camino\",\n\t\t\tid: \"Camino\"\n\t\t},{\n\t\t\t// for newer Netscapes (6+)\n\t\t\ts1: navigator.userAgent,\n\t\t\ts2: \"Netscape\",\n\t\t\tid: \"Netscape\"\n\t\t},{\n\t\t\ts1: navigator.userAgent,\n\t\t\ts2: \"MSIE\",\n\t\t\tid: \"IE\",\n\t\t\tsv: \"MSIE\"\n\t\t},{\n\t\t\ts1: navigator.userAgent,\n\t\t\ts2: \"Gecko\",\n\t\t\tid: \"Mozilla\",\n\t\t\tsv: \"rv\"\n\t\t}],\n\n\t\tos = [{\n\t\t\ts1: navigator.platform,\n\t\t\ts2: \"Win\",\n\t\t\tid: \"Windows\"\n\t\t},{\n\t\t\ts1: navigator.platform,\n\t\t\ts2: \"Mac\",\n\t\t\tid: \"Mac\"\n\t\t},{\n\t\t\ts1: navigator.userAgent,\n\t\t\ts2: \"iPhone\",\n\t\t\tid: \"iOS\"\n\t\t},{\n\t\t\ts1: navigator.userAgent,\n\t\t\ts2: \"iPad\",\n\t\t\tid: \"iOS\"\n\t\t},{\n\t\t\ts1: navigator.userAgent,\n\t\t\ts2: \"Android\",\n\t\t\tid: \"Android\"\n\t\t},{\n\t\t\ts1: navigator.platform,\n\t\t\ts2: \"Linux\",\n\t\t\tid: \"Linux\"\n\t\t}]\n\t\t, version;\n\n\tfunction getStr(data) {\n\t\tvar str, prop;\n\t\t\n\t\tfor (var i = 0; i < data.length; i++)\t{\n\t\t\tstr = data[i].s1;\n\t\t\tprop = data[i].prop;\n\t\t\tversion = data[i].sv || data[i].id;\n\t\t\t\n\t\t\tif (str) {\n\t\t\t\tif (str.indexOf(data[i].s2) != -1) {\n\t\t\t\t\treturn data[i].id;\n\t\t\t\t}\n\t\t\t} else if (prop) {\n\t\t\t\treturn data[i].id;\n\t\t\t}\n\t\t}\n\t}\n\t\n\t\n\tfunction getVer(str) {\n\t\tvar index = str.indexOf(version);\n\n\t\tif (index == -1) {\n\t\t\treturn;\n\t\t}\n\n\t\treturn parseFloat(str.substring(index + version.length + 1));\n\t}\n\n\tvar can = (function() {\n\t\tvar caps = {\n\t\t\t\tdefine_property: (function() {\n\t\t\t\t\t/* // currently too much extra code required, not exactly worth it\n\t\t\t\t\ttry { // as of IE8, getters/setters are supported only on DOM elements\n\t\t\t\t\t\tvar obj = {};\n\t\t\t\t\t\tif (Object.defineProperty) {\n\t\t\t\t\t\t\tObject.defineProperty(obj, 'prop', {\n\t\t\t\t\t\t\t\tenumerable: true,\n\t\t\t\t\t\t\t\tconfigurable: true\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t}\n\t\t\t\t\t} catch(ex) {}\n\n\t\t\t\t\tif (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}*/\n\t\t\t\t\treturn false;\n\t\t\t\t}()),\n\n\t\t\t\tcreate_canvas: (function() {\n\t\t\t\t\t// On the S60 and BB Storm, getContext exists, but always returns undefined\n\t\t\t\t\t// so we actually have to call getContext() to verify\n\t\t\t\t\t// github.com/Modernizr/Modernizr/issues/issue/97/\n\t\t\t\t\tvar el = document.createElement('canvas');\n\t\t\t\t\treturn !!(el.getContext && el.getContext('2d'));\n\t\t\t\t}()),\n\n\t\t\t\treturn_response_type: function(responseType) {\n\t\t\t\t\tif (!window.XMLHttpRequest) {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t\ttry {\n\t\t\t\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\t\t\tif (Basic.typeOf(xhr.responseType) !== 'undefined') {\n\t\t\t\t\t\t\txhr.open('get', 'infinity-8.me'); // otherwise Gecko throws an exception\n\t\t\t\t\t\t\txhr.responseType = responseType;\n\t\t\t\t\t\t\t// as of 23.0.1271.64, Chrome switched from throwing exception to merely logging it to the console (why? o why?)\n\t\t\t\t\t\t\tif (xhr.responseType !== responseType) {\n\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t}\n\t\t\t\t\t} catch (ex) {}\n\t\t\t\t\treturn false;\n\t\t\t\t},\n\n\t\t\t\t// ideas for this heavily come from Modernizr (http://modernizr.com/)\n\t\t\t\tuse_data_uri: (function() {\n\t\t\t\t\tvar du = new Image();\n\n\t\t\t\t\tdu.onload = function() {\n\t\t\t\t\t\tcaps.use_data_uri = (du.width === 1 && du.height === 1);\n\t\t\t\t\t};\n\t\t\t\t\t\n\t\t\t\t\tsetTimeout(function() {\n\t\t\t\t\t\tdu.src = \"data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==\";\n\t\t\t\t\t}, 1);\n\t\t\t\t\treturn false;\n\t\t\t\t}()),\n\n\t\t\t\tuse_data_uri_over32kb: function() { // IE8\n\t\t\t\t\treturn caps.use_data_uri && (Env.browser !== 'IE' || Env.version >= 9);\n\t\t\t\t},\n\n\t\t\t\tuse_data_uri_of: function(bytes) {\n\t\t\t\t\treturn (caps.use_data_uri && bytes < 33000 || caps.use_data_uri_over32kb());\n\t\t\t\t},\n\n\t\t\t\tuse_fileinput: function() {\n\t\t\t\t\tvar el = document.createElement('input');\n\t\t\t\t\tel.setAttribute('type', 'file');\n\t\t\t\t\treturn !el.disabled;\n\t\t\t\t}\n\t\t\t};\n\n\t\treturn function(cap) {\n\t\t\tvar args = [].slice.call(arguments);\n\t\t\targs.shift(); // shift of cap\n\t\t\treturn Basic.typeOf(caps[cap]) === 'function' ? caps[cap].apply(this, args) : !!caps[cap];\n\t\t};\n\t}());\n\n\tvar Env = {\n\t\tcan: can,\n\t\tbrowser: getStr(browser),\n\t\tversion: getVer(navigator.userAgent) || getVer(navigator.appVersion),\n\t\tOS: getStr(os),\n\t\tswf_url: \"../flash/Moxie.swf\",\n\t\txap_url: \"../silverlight/Moxie.xap\",\n\t\tglobal_event_dispatcher: \"moxie.core.EventTarget.instance.dispatchEvent\"\n\t};\n\n\treturn Env;\n});");
__$coverInitRange("src/javascript/core/utils/Env.js", "371:5102");
__$coverInitRange("src/javascript/core/utils/Env.js", "454:1732");
__$coverInitRange("src/javascript/core/utils/Env.js", "1736:2050");
__$coverInitRange("src/javascript/core/utils/Env.js", "2057:2219");
__$coverInitRange("src/javascript/core/utils/Env.js", "2223:4789");
__$coverInitRange("src/javascript/core/utils/Env.js", "4793:5084");
__$coverInitRange("src/javascript/core/utils/Env.js", "5088:5098");
__$coverInitRange("src/javascript/core/utils/Env.js", "1762:1775");
__$coverInitRange("src/javascript/core/utils/Env.js", "1782:2047");
__$coverInitRange("src/javascript/core/utils/Env.js", "1825:1841");
__$coverInitRange("src/javascript/core/utils/Env.js", "1846:1865");
__$coverInitRange("src/javascript/core/utils/Env.js", "1870:1904");
__$coverInitRange("src/javascript/core/utils/Env.js", "1913:2043");
__$coverInitRange("src/javascript/core/utils/Env.js", "1928:1993");
__$coverInitRange("src/javascript/core/utils/Env.js", "1970:1987");
__$coverInitRange("src/javascript/core/utils/Env.js", "2021:2038");
__$coverInitRange("src/javascript/core/utils/Env.js", "2082:2114");
__$coverInitRange("src/javascript/core/utils/Env.js", "2119:2151");
__$coverInitRange("src/javascript/core/utils/Env.js", "2156:2216");
__$coverInitRange("src/javascript/core/utils/Env.js", "2141:2147");
__$coverInitRange("src/javascript/core/utils/Env.js", "2249:4584");
__$coverInitRange("src/javascript/core/utils/Env.js", "4589:4782");
__$coverInitRange("src/javascript/core/utils/Env.js", "2773:2785");
__$coverInitRange("src/javascript/core/utils/Env.js", "3032:3073");
__$coverInitRange("src/javascript/core/utils/Env.js", "3080:3127");
__$coverInitRange("src/javascript/core/utils/Env.js", "3196:3251");
__$coverInitRange("src/javascript/core/utils/Env.js", "3258:3728");
__$coverInitRange("src/javascript/core/utils/Env.js", "3735:3747");
__$coverInitRange("src/javascript/core/utils/Env.js", "3232:3244");
__$coverInitRange("src/javascript/core/utils/Env.js", "3270:3300");
__$coverInitRange("src/javascript/core/utils/Env.js", "3308:3707");
__$coverInitRange("src/javascript/core/utils/Env.js", "3369:3401");
__$coverInitRange("src/javascript/core/utils/Env.js", "3449:3480");
__$coverInitRange("src/javascript/core/utils/Env.js", "3609:3679");
__$coverInitRange("src/javascript/core/utils/Env.js", "3688:3699");
__$coverInitRange("src/javascript/core/utils/Env.js", "3658:3670");
__$coverInitRange("src/javascript/core/utils/Env.js", "3868:3888");
__$coverInitRange("src/javascript/core/utils/Env.js", "3896:3990");
__$coverInitRange("src/javascript/core/utils/Env.js", "4003:4138");
__$coverInitRange("src/javascript/core/utils/Env.js", "4145:4157");
__$coverInitRange("src/javascript/core/utils/Env.js", "3927:3982");
__$coverInitRange("src/javascript/core/utils/Env.js", "4033:4126");
__$coverInitRange("src/javascript/core/utils/Env.js", "4222:4292");
__$coverInitRange("src/javascript/core/utils/Env.js", "4346:4421");
__$coverInitRange("src/javascript/core/utils/Env.js", "4468:4508");
__$coverInitRange("src/javascript/core/utils/Env.js", "4515:4546");
__$coverInitRange("src/javascript/core/utils/Env.js", "4553:4572");
__$coverInitRange("src/javascript/core/utils/Env.js", "4615:4650");
__$coverInitRange("src/javascript/core/utils/Env.js", "4655:4667");
__$coverInitRange("src/javascript/core/utils/Env.js", "4688:4777");
__$coverCall('src/javascript/core/utils/Env.js', '371:5102');
define('moxie/core/utils/Env', ['moxie/core/utils/Basic'], function (Basic) {
    __$coverCall('src/javascript/core/utils/Env.js', '454:1732');
    var browser = [
            {
                s1: navigator.userAgent,
                s2: 'Android',
                id: 'Android Browser',
                sv: 'Version'
            },
            {
                s1: navigator.userAgent,
                s2: 'Chrome',
                id: 'Chrome'
            },
            {
                s1: navigator.vendor,
                s2: 'Apple',
                id: 'Safari',
                sv: 'Version'
            },
            {
                prop: window.opera && window.opera.buildNumber,
                id: 'Opera',
                sv: 'Version'
            },
            {
                s1: navigator.vendor,
                s2: 'KDE',
                id: 'Konqueror'
            },
            {
                s1: navigator.userAgent,
                s2: 'Firefox',
                id: 'Firefox'
            },
            {
                s1: navigator.vendor,
                s2: 'Camino',
                id: 'Camino'
            },
            {
                s1: navigator.userAgent,
                s2: 'Netscape',
                id: 'Netscape'
            },
            {
                s1: navigator.userAgent,
                s2: 'MSIE',
                id: 'IE',
                sv: 'MSIE'
            },
            {
                s1: navigator.userAgent,
                s2: 'Gecko',
                id: 'Mozilla',
                sv: 'rv'
            }
        ], os = [
            {
                s1: navigator.platform,
                s2: 'Win',
                id: 'Windows'
            },
            {
                s1: navigator.platform,
                s2: 'Mac',
                id: 'Mac'
            },
            {
                s1: navigator.userAgent,
                s2: 'iPhone',
                id: 'iOS'
            },
            {
                s1: navigator.userAgent,
                s2: 'iPad',
                id: 'iOS'
            },
            {
                s1: navigator.userAgent,
                s2: 'Android',
                id: 'Android'
            },
            {
                s1: navigator.platform,
                s2: 'Linux',
                id: 'Linux'
            }
        ], version;
    __$coverCall('src/javascript/core/utils/Env.js', '1736:2050');
    function getStr(data) {
        __$coverCall('src/javascript/core/utils/Env.js', '1762:1775');
        var str, prop;
        __$coverCall('src/javascript/core/utils/Env.js', '1782:2047');
        for (var i = 0; i < data.length; i++) {
            __$coverCall('src/javascript/core/utils/Env.js', '1825:1841');
            str = data[i].s1;
            __$coverCall('src/javascript/core/utils/Env.js', '1846:1865');
            prop = data[i].prop;
            __$coverCall('src/javascript/core/utils/Env.js', '1870:1904');
            version = data[i].sv || data[i].id;
            __$coverCall('src/javascript/core/utils/Env.js', '1913:2043');
            if (str) {
                __$coverCall('src/javascript/core/utils/Env.js', '1928:1993');
                if (str.indexOf(data[i].s2) != -1) {
                    __$coverCall('src/javascript/core/utils/Env.js', '1970:1987');
                    return data[i].id;
                }
            } else if (prop) {
                __$coverCall('src/javascript/core/utils/Env.js', '2021:2038');
                return data[i].id;
            }
        }
    }
    __$coverCall('src/javascript/core/utils/Env.js', '2057:2219');
    function getVer(str) {
        __$coverCall('src/javascript/core/utils/Env.js', '2082:2114');
        var index = str.indexOf(version);
        __$coverCall('src/javascript/core/utils/Env.js', '2119:2151');
        if (index == -1) {
            __$coverCall('src/javascript/core/utils/Env.js', '2141:2147');
            return;
        }
        __$coverCall('src/javascript/core/utils/Env.js', '2156:2216');
        return parseFloat(str.substring(index + version.length + 1));
    }
    __$coverCall('src/javascript/core/utils/Env.js', '2223:4789');
    var can = function () {
            __$coverCall('src/javascript/core/utils/Env.js', '2249:4584');
            var caps = {
                    define_property: function () {
                        __$coverCall('src/javascript/core/utils/Env.js', '2773:2785');
                        return false;
                    }(),
                    create_canvas: function () {
                        __$coverCall('src/javascript/core/utils/Env.js', '3032:3073');
                        var el = document.createElement('canvas');
                        __$coverCall('src/javascript/core/utils/Env.js', '3080:3127');
                        return !!(el.getContext && el.getContext('2d'));
                    }(),
                    return_response_type: function (responseType) {
                        __$coverCall('src/javascript/core/utils/Env.js', '3196:3251');
                        if (!window.XMLHttpRequest) {
                            __$coverCall('src/javascript/core/utils/Env.js', '3232:3244');
                            return false;
                        }
                        __$coverCall('src/javascript/core/utils/Env.js', '3258:3728');
                        try {
                            __$coverCall('src/javascript/core/utils/Env.js', '3270:3300');
                            var xhr = new XMLHttpRequest();
                            __$coverCall('src/javascript/core/utils/Env.js', '3308:3707');
                            if (Basic.typeOf(xhr.responseType) !== 'undefined') {
                                __$coverCall('src/javascript/core/utils/Env.js', '3369:3401');
                                xhr.open('get', 'infinity-8.me');
                                __$coverCall('src/javascript/core/utils/Env.js', '3449:3480');
                                xhr.responseType = responseType;
                                __$coverCall('src/javascript/core/utils/Env.js', '3609:3679');
                                if (xhr.responseType !== responseType) {
                                    __$coverCall('src/javascript/core/utils/Env.js', '3658:3670');
                                    return false;
                                }
                                __$coverCall('src/javascript/core/utils/Env.js', '3688:3699');
                                return true;
                            }
                        } catch (ex) {
                        }
                        __$coverCall('src/javascript/core/utils/Env.js', '3735:3747');
                        return false;
                    },
                    use_data_uri: function () {
                        __$coverCall('src/javascript/core/utils/Env.js', '3868:3888');
                        var du = new Image();
                        __$coverCall('src/javascript/core/utils/Env.js', '3896:3990');
                        du.onload = function () {
                            __$coverCall('src/javascript/core/utils/Env.js', '3927:3982');
                            caps.use_data_uri = du.width === 1 && du.height === 1;
                        };
                        __$coverCall('src/javascript/core/utils/Env.js', '4003:4138');
                        setTimeout(function () {
                            __$coverCall('src/javascript/core/utils/Env.js', '4033:4126');
                            du.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
                        }, 1);
                        __$coverCall('src/javascript/core/utils/Env.js', '4145:4157');
                        return false;
                    }(),
                    use_data_uri_over32kb: function () {
                        __$coverCall('src/javascript/core/utils/Env.js', '4222:4292');
                        return caps.use_data_uri && (Env.browser !== 'IE' || Env.version >= 9);
                    },
                    use_data_uri_of: function (bytes) {
                        __$coverCall('src/javascript/core/utils/Env.js', '4346:4421');
                        return caps.use_data_uri && bytes < 33000 || caps.use_data_uri_over32kb();
                    },
                    use_fileinput: function () {
                        __$coverCall('src/javascript/core/utils/Env.js', '4468:4508');
                        var el = document.createElement('input');
                        __$coverCall('src/javascript/core/utils/Env.js', '4515:4546');
                        el.setAttribute('type', 'file');
                        __$coverCall('src/javascript/core/utils/Env.js', '4553:4572');
                        return !el.disabled;
                    }
                };
            __$coverCall('src/javascript/core/utils/Env.js', '4589:4782');
            return function (cap) {
                __$coverCall('src/javascript/core/utils/Env.js', '4615:4650');
                var args = [].slice.call(arguments);
                __$coverCall('src/javascript/core/utils/Env.js', '4655:4667');
                args.shift();
                __$coverCall('src/javascript/core/utils/Env.js', '4688:4777');
                return Basic.typeOf(caps[cap]) === 'function' ? caps[cap].apply(this, args) : !!caps[cap];
            };
        }();
    __$coverCall('src/javascript/core/utils/Env.js', '4793:5084');
    var Env = {
            can: can,
            browser: getStr(browser),
            version: getVer(navigator.userAgent) || getVer(navigator.appVersion),
            OS: getStr(os),
            swf_url: '../flash/Moxie.swf',
            xap_url: '../silverlight/Moxie.xap',
            global_event_dispatcher: 'moxie.core.EventTarget.instance.dispatchEvent'
        };
    __$coverCall('src/javascript/core/utils/Env.js', '5088:5098');
    return Env;
});

// Included from: src/javascript/core/utils/Dom.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/utils/Dom.js", "/**\n * Dom.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/core/utils/Dom', ['moxie/core/utils/Env'], function(Env) {\n\n\t/**\n\tGet DOM Element by it's id.\n\n\t@method get\n\t@param {String} id Identifier of the DOM Element\n\t@return {DOMElement}\n\t*/\n\tvar get = function(id) {\n\t\tif (typeof id !== 'string') {\n\t\t\treturn id;\n\t\t}\n\n\t\treturn document.getElementById(id);\n\t};\n\n\t/**\n\tChecks if specified DOM element has specified class.\n\n\t@method hasClass\n\t@static\n\t@param {Object} obj DOM element like object to add handler to.\n\t@param {String} name Class name\n\t*/\n\tvar hasClass = function(obj, name) {\n\t\tvar regExp;\n\n\t\tif (obj.className === '') {\n\t\t\treturn false;\n\t\t}\n\n\t\tregExp = new RegExp(\"(^|\\\\s+)\"+name+\"(\\\\s+|$)\");\n\n\t\treturn regExp.test(obj.className);\n\t};\n\n\t/**\n\tAdds specified className to specified DOM element.\n\n\t@method addClass\n\t@static\n\t@param {Object} obj DOM element like object to add handler to.\n\t@param {String} name Class name\n\t*/\n\tvar addClass = function(obj, name) {\n\t\tif (!hasClass(obj, name)) {\n\t\t\tobj.className = obj.className === '' ? name : obj.className.replace(/\\s+$/, '') + ' ' + name;\n\t\t}\n\t};\n\n\t/**\n\tRemoves specified className from specified DOM element.\n\n\t@method removeClass\n\t@static\n\t@param {Object} obj DOM element like object to add handler to.\n\t@param {String} name Class name\n\t*/\n\tvar removeClass = function(obj, name) {\n\t\tvar regExp = new RegExp(\"(^|\\\\s+)\"+name+\"(\\\\s+|$)\");\n\n\t\tobj.className = obj.className.replace(regExp, function($0, $1, $2) {\n\t\t\treturn $1 === ' ' && $2 === ' ' ? ' ' : '';\n\t\t});\n\t};\n\n\t/**\n\tReturns a given computed style of a DOM element.\n\n\t@method getStyle\n\t@static\n\t@param {Object} obj DOM element like object.\n\t@param {String} name Style you want to get from the DOM element\n\t*/\n\tvar getStyle = function(obj, name) {\n\t\tif (obj.currentStyle) {\n\t\t\treturn obj.currentStyle[name];\n\t\t} else if (window.getComputedStyle) {\n\t\t\treturn window.getComputedStyle(obj, null)[name];\n\t\t}\n\t};\n\n\n\t/**\n\tReturns the absolute x, y position of an Element. The position will be returned in a object with x, y fields.\n\n\t@method getPos\n\t@static\n\t@param {Element} node HTML element or element id to get x, y position from.\n\t@param {Element} root Optional root element to stop calculations at.\n\t@return {object} Absolute position of the specified element object with x, y fields.\n\t*/\n\tvar getPos = function(node, root) {\n\t\tvar x = 0, y = 0, parent, doc = document, nodeRect, rootRect;\n\n\t\tnode = node;\n\t\troot = root || doc.body;\n\n\t\t// Returns the x, y cordinate for an element on IE 6 and IE 7\n\t\tfunction getIEPos(node) {\n\t\t\tvar bodyElm, rect, x = 0, y = 0;\n\n\t\t\tif (node) {\n\t\t\t\trect = node.getBoundingClientRect();\n\t\t\t\tbodyElm = doc.compatMode === \"CSS1Compat\" ? doc.documentElement : doc.body;\n\t\t\t\tx = rect.left + bodyElm.scrollLeft;\n\t\t\t\ty = rect.top + bodyElm.scrollTop;\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tx : x,\n\t\t\t\ty : y\n\t\t\t};\n\t\t}\n\n\t\t// Use getBoundingClientRect on IE 6 and IE 7 but not on IE 8 in standards mode\n\t\tif (node && node.getBoundingClientRect && Env.browser === 'IE' && (!doc.documentMode || doc.documentMode < 8)) {\n\t\t\tnodeRect = getIEPos(node);\n\t\t\trootRect = getIEPos(root);\n\n\t\t\treturn {\n\t\t\t\tx : nodeRect.x - rootRect.x,\n\t\t\t\ty : nodeRect.y - rootRect.y\n\t\t\t};\n\t\t}\n\n\t\tparent = node;\n\t\twhile (parent && parent != root && parent.nodeType) {\n\t\t\tx += parent.offsetLeft || 0;\n\t\t\ty += parent.offsetTop || 0;\n\t\t\tparent = parent.offsetParent;\n\t\t}\n\n\t\tparent = node.parentNode;\n\t\twhile (parent && parent != root && parent.nodeType) {\n\t\t\tx -= parent.scrollLeft || 0;\n\t\t\ty -= parent.scrollTop || 0;\n\t\t\tparent = parent.parentNode;\n\t\t}\n\n\t\treturn {\n\t\t\tx : x,\n\t\t\ty : y\n\t\t};\n\t};\n\n\t/**\n\tReturns the size of the specified node in pixels.\n\n\t@method getSize\n\t@static\n\t@param {Node} node Node to get the size of.\n\t@return {Object} Object with a w and h property.\n\t*/\n\tvar getSize = function(node) {\n\t\treturn {\n\t\t\tw : node.offsetWidth || node.clientWidth,\n\t\t\th : node.offsetHeight || node.clientHeight\n\t\t};\n\t};\n\n\treturn {\n\t\tget: get,\n\t\thasClass: hasClass,\n\t\taddClass: addClass,\n\t\tremoveClass: removeClass,\n\t\tgetStyle: getStyle,\n\t\tgetPos: getPos,\n\t\tgetSize: getSize\n\t};\n});");
__$coverInitRange("src/javascript/core/utils/Dom.js", "341:4369");
__$coverInitRange("src/javascript/core/utils/Dom.js", "540:656");
__$coverInitRange("src/javascript/core/utils/Dom.js", "848:1043");
__$coverInitRange("src/javascript/core/utils/Dom.js", "1233:1403");
__$coverInitRange("src/javascript/core/utils/Dom.js", "1601:1823");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2025:2220");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2604:3881");
__$coverInitRange("src/javascript/core/utils/Dom.js", "4067:4207");
__$coverInitRange("src/javascript/core/utils/Dom.js", "4211:4365");
__$coverInitRange("src/javascript/core/utils/Dom.js", "567:613");
__$coverInitRange("src/javascript/core/utils/Dom.js", "618:652");
__$coverInitRange("src/javascript/core/utils/Dom.js", "600:609");
__$coverInitRange("src/javascript/core/utils/Dom.js", "887:897");
__$coverInitRange("src/javascript/core/utils/Dom.js", "902:949");
__$coverInitRange("src/javascript/core/utils/Dom.js", "954:1001");
__$coverInitRange("src/javascript/core/utils/Dom.js", "1006:1039");
__$coverInitRange("src/javascript/core/utils/Dom.js", "933:945");
__$coverInitRange("src/javascript/core/utils/Dom.js", "1272:1399");
__$coverInitRange("src/javascript/core/utils/Dom.js", "1303:1395");
__$coverInitRange("src/javascript/core/utils/Dom.js", "1643:1694");
__$coverInitRange("src/javascript/core/utils/Dom.js", "1699:1819");
__$coverInitRange("src/javascript/core/utils/Dom.js", "1771:1813");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2064:2216");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2091:2120");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2165:2212");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2642:2702");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2707:2718");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2722:2745");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2814:3138");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3225:3484");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3489:3502");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3506:3658");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3663:3687");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3691:3841");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3846:3877");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2843:2874");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2880:3094");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3100:3134");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2896:2931");
__$coverInitRange("src/javascript/core/utils/Dom.js", "2937:3011");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3017:3051");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3057:3089");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3341:3366");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3371:3396");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3402:3480");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3563:3590");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3595:3621");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3626:3654");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3748:3775");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3780:3806");
__$coverInitRange("src/javascript/core/utils/Dom.js", "3811:3837");
__$coverInitRange("src/javascript/core/utils/Dom.js", "4100:4203");
__$coverCall('src/javascript/core/utils/Dom.js', '341:4369');
define('moxie/core/utils/Dom', ['moxie/core/utils/Env'], function (Env) {
    __$coverCall('src/javascript/core/utils/Dom.js', '540:656');
    var get = function (id) {
        __$coverCall('src/javascript/core/utils/Dom.js', '567:613');
        if (typeof id !== 'string') {
            __$coverCall('src/javascript/core/utils/Dom.js', '600:609');
            return id;
        }
        __$coverCall('src/javascript/core/utils/Dom.js', '618:652');
        return document.getElementById(id);
    };
    __$coverCall('src/javascript/core/utils/Dom.js', '848:1043');
    var hasClass = function (obj, name) {
        __$coverCall('src/javascript/core/utils/Dom.js', '887:897');
        var regExp;
        __$coverCall('src/javascript/core/utils/Dom.js', '902:949');
        if (obj.className === '') {
            __$coverCall('src/javascript/core/utils/Dom.js', '933:945');
            return false;
        }
        __$coverCall('src/javascript/core/utils/Dom.js', '954:1001');
        regExp = new RegExp('(^|\\s+)' + name + '(\\s+|$)');
        __$coverCall('src/javascript/core/utils/Dom.js', '1006:1039');
        return regExp.test(obj.className);
    };
    __$coverCall('src/javascript/core/utils/Dom.js', '1233:1403');
    var addClass = function (obj, name) {
        __$coverCall('src/javascript/core/utils/Dom.js', '1272:1399');
        if (!hasClass(obj, name)) {
            __$coverCall('src/javascript/core/utils/Dom.js', '1303:1395');
            obj.className = obj.className === '' ? name : obj.className.replace(/\s+$/, '') + ' ' + name;
        }
    };
    __$coverCall('src/javascript/core/utils/Dom.js', '1601:1823');
    var removeClass = function (obj, name) {
        __$coverCall('src/javascript/core/utils/Dom.js', '1643:1694');
        var regExp = new RegExp('(^|\\s+)' + name + '(\\s+|$)');
        __$coverCall('src/javascript/core/utils/Dom.js', '1699:1819');
        obj.className = obj.className.replace(regExp, function ($0, $1, $2) {
            __$coverCall('src/javascript/core/utils/Dom.js', '1771:1813');
            return $1 === ' ' && $2 === ' ' ? ' ' : '';
        });
    };
    __$coverCall('src/javascript/core/utils/Dom.js', '2025:2220');
    var getStyle = function (obj, name) {
        __$coverCall('src/javascript/core/utils/Dom.js', '2064:2216');
        if (obj.currentStyle) {
            __$coverCall('src/javascript/core/utils/Dom.js', '2091:2120');
            return obj.currentStyle[name];
        } else if (window.getComputedStyle) {
            __$coverCall('src/javascript/core/utils/Dom.js', '2165:2212');
            return window.getComputedStyle(obj, null)[name];
        }
    };
    __$coverCall('src/javascript/core/utils/Dom.js', '2604:3881');
    var getPos = function (node, root) {
        __$coverCall('src/javascript/core/utils/Dom.js', '2642:2702');
        var x = 0, y = 0, parent, doc = document, nodeRect, rootRect;
        __$coverCall('src/javascript/core/utils/Dom.js', '2707:2718');
        node = node;
        __$coverCall('src/javascript/core/utils/Dom.js', '2722:2745');
        root = root || doc.body;
        __$coverCall('src/javascript/core/utils/Dom.js', '2814:3138');
        function getIEPos(node) {
            __$coverCall('src/javascript/core/utils/Dom.js', '2843:2874');
            var bodyElm, rect, x = 0, y = 0;
            __$coverCall('src/javascript/core/utils/Dom.js', '2880:3094');
            if (node) {
                __$coverCall('src/javascript/core/utils/Dom.js', '2896:2931');
                rect = node.getBoundingClientRect();
                __$coverCall('src/javascript/core/utils/Dom.js', '2937:3011');
                bodyElm = doc.compatMode === 'CSS1Compat' ? doc.documentElement : doc.body;
                __$coverCall('src/javascript/core/utils/Dom.js', '3017:3051');
                x = rect.left + bodyElm.scrollLeft;
                __$coverCall('src/javascript/core/utils/Dom.js', '3057:3089');
                y = rect.top + bodyElm.scrollTop;
            }
            __$coverCall('src/javascript/core/utils/Dom.js', '3100:3134');
            return {
                x: x,
                y: y
            };
        }
        __$coverCall('src/javascript/core/utils/Dom.js', '3225:3484');
        if (node && node.getBoundingClientRect && Env.browser === 'IE' && (!doc.documentMode || doc.documentMode < 8)) {
            __$coverCall('src/javascript/core/utils/Dom.js', '3341:3366');
            nodeRect = getIEPos(node);
            __$coverCall('src/javascript/core/utils/Dom.js', '3371:3396');
            rootRect = getIEPos(root);
            __$coverCall('src/javascript/core/utils/Dom.js', '3402:3480');
            return {
                x: nodeRect.x - rootRect.x,
                y: nodeRect.y - rootRect.y
            };
        }
        __$coverCall('src/javascript/core/utils/Dom.js', '3489:3502');
        parent = node;
        __$coverCall('src/javascript/core/utils/Dom.js', '3506:3658');
        while (parent && parent != root && parent.nodeType) {
            __$coverCall('src/javascript/core/utils/Dom.js', '3563:3590');
            x += parent.offsetLeft || 0;
            __$coverCall('src/javascript/core/utils/Dom.js', '3595:3621');
            y += parent.offsetTop || 0;
            __$coverCall('src/javascript/core/utils/Dom.js', '3626:3654');
            parent = parent.offsetParent;
        }
        __$coverCall('src/javascript/core/utils/Dom.js', '3663:3687');
        parent = node.parentNode;
        __$coverCall('src/javascript/core/utils/Dom.js', '3691:3841');
        while (parent && parent != root && parent.nodeType) {
            __$coverCall('src/javascript/core/utils/Dom.js', '3748:3775');
            x -= parent.scrollLeft || 0;
            __$coverCall('src/javascript/core/utils/Dom.js', '3780:3806');
            y -= parent.scrollTop || 0;
            __$coverCall('src/javascript/core/utils/Dom.js', '3811:3837');
            parent = parent.parentNode;
        }
        __$coverCall('src/javascript/core/utils/Dom.js', '3846:3877');
        return {
            x: x,
            y: y
        };
    };
    __$coverCall('src/javascript/core/utils/Dom.js', '4067:4207');
    var getSize = function (node) {
        __$coverCall('src/javascript/core/utils/Dom.js', '4100:4203');
        return {
            w: node.offsetWidth || node.clientWidth,
            h: node.offsetHeight || node.clientHeight
        };
    };
    __$coverCall('src/javascript/core/utils/Dom.js', '4211:4365');
    return {
        get: get,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getStyle: getStyle,
        getPos: getPos,
        getSize: getSize
    };
});

// Included from: src/javascript/core/Exceptions.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/Exceptions.js", "/**\n * Exceptions.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/core/Exceptions', [\n\t'moxie/core/utils/Basic'\n], function(Basic) {\n\tfunction _findKey(obj, value) {\n\t\tvar key;\n\t\tfor (key in obj) {\n\t\t\tif (obj[key] === value) {\n\t\t\t\treturn key;\n\t\t\t}\n\t\t}\n\t\treturn null;\n\t}\n\n\treturn {\n\t\tRuntimeError: (function() {\n\t\t\tvar namecodes = {\n\t\t\t\tNOT_INIT_ERR: 1,\n\t\t\t\tNOT_SUPPORTED_ERR: 9,\n\t\t\t\tJS_ERR: 4\n\t\t\t};\n\n\t\t\tfunction RuntimeError(code) {\n\t\t\t\tthis.code = code;\n\t\t\t\tthis.name = _findKey(namecodes, code);\n\t\t\t\tthis.message = this.name + \": RuntimeError \" + this.code;\n\t\t\t}\n\t\t\t\n\t\t\tBasic.extend(RuntimeError, namecodes);\n\t\t\tRuntimeError.prototype = Error.prototype;\n\t\t\treturn RuntimeError;\n\t\t}()),\n\t\t\n\t\tOperationNotAllowedException: (function() {\n\t\t\t\n\t\t\tfunction OperationNotAllowedException(code) {\n\t\t\t\tthis.code = code;\n\t\t\t\tthis.name = 'OperationNotAllowedException';\n\t\t\t}\n\t\t\t\n\t\t\tBasic.extend(OperationNotAllowedException, {\n\t\t\t\tNOT_ALLOWED_ERR: 1\n\t\t\t});\n\t\t\t\n\t\t\tOperationNotAllowedException.prototype = Error.prototype;\n\t\t\t\n\t\t\treturn OperationNotAllowedException;\n\t\t}()),\n\n\t\tImageError: (function() {\n\t\t\tvar namecodes = {\n\t\t\t\tWRONG_FORMAT: 1\n\t\t\t};\n\n\t\t\tfunction ImageError(code) {\n\t\t\t\tthis.code = code;\n\t\t\t\tthis.name = _findKey(namecodes, code);\n\t\t\t\tthis.message = this.name + \": ImageError \" + this.code;\n\t\t\t}\n\t\t\t\n\t\t\tBasic.extend(ImageError, namecodes);\n\t\t\tImageError.prototype = Error.prototype;\n\n\t\t\treturn ImageError;\n\t\t}()),\n\n\t\tFileException: (function() {\n\t\t\tvar namecodes = {\n\t\t\t\tNOT_FOUND_ERR: 1,\n\t\t\t\tSECURITY_ERR: 2,\n\t\t\t\tABORT_ERR: 3,\n\t\t\t\tNOT_READABLE_ERR: 4,\n\t\t\t\tENCODING_ERR: 5,\n\t\t\t\tNO_MODIFICATION_ALLOWED_ERR: 6,\n\t\t\t\tINVALID_STATE_ERR: 7,\n\t\t\t\tSYNTAX_ERR: 8\n\t\t\t};\n\n\t\t\tfunction FileException(code) {\n\t\t\t\tthis.code = code;\n\t\t\t\tthis.name = _findKey(namecodes, code);\n\t\t\t\tthis.message = this.name + \": FileException \" + this.code;\n\t\t\t}\n\t\t\t\n\t\t\tBasic.extend(FileException, namecodes);\n\t\t\tFileException.prototype = Error.prototype;\n\t\t\treturn FileException;\n\t\t}()),\n\t\t\n\t\tDOMException: (function() {\n\t\t\tvar namecodes = {\n\t\t\t\tINDEX_SIZE_ERR: 1,\n\t\t\t\tDOMSTRING_SIZE_ERR: 2,\n\t\t\t\tHIERARCHY_REQUEST_ERR: 3,\n\t\t\t\tWRONG_DOCUMENT_ERR: 4,\n\t\t\t\tINVALID_CHARACTER_ERR: 5,\n\t\t\t\tNO_DATA_ALLOWED_ERR: 6,\n\t\t\t\tNO_MODIFICATION_ALLOWED_ERR: 7,\n\t\t\t\tNOT_FOUND_ERR: 8,\n\t\t\t\tNOT_SUPPORTED_ERR: 9,\n\t\t\t\tINUSE_ATTRIBUTE_ERR: 10,\n\t\t\t\tINVALID_STATE_ERR: 11,\n\t\t\t\tSYNTAX_ERR: 12,\n\t\t\t\tINVALID_MODIFICATION_ERR: 13,\n\t\t\t\tNAMESPACE_ERR: 14,\n\t\t\t\tINVALID_ACCESS_ERR: 15,\n\t\t\t\tVALIDATION_ERR: 16,\n\t\t\t\tTYPE_MISMATCH_ERR: 17,\n\t\t\t\tSECURITY_ERR: 18,\n\t\t\t\tNETWORK_ERR: 19,\n\t\t\t\tABORT_ERR: 20,\n\t\t\t\tURL_MISMATCH_ERR: 21,\n\t\t\t\tQUOTA_EXCEEDED_ERR: 22,\n\t\t\t\tTIMEOUT_ERR: 23,\n\t\t\t\tINVALID_NODE_TYPE_ERR: 24,\n\t\t\t\tDATA_CLONE_ERR: 25\n\t\t\t};\n\n\t\t\tfunction DOMException(code) {\n\t\t\t\tthis.code = code;\n\t\t\t\tthis.name = _findKey(namecodes, code);\n\t\t\t\tthis.message = this.name + \": DOMException \" + this.code;\n\t\t\t}\n\t\t\t\n\t\t\tBasic.extend(DOMException, namecodes);\n\t\t\tDOMException.prototype = Error.prototype;\n\t\t\treturn DOMException;\n\t\t}()),\n\t\t\n\t\tEventException: (function() {\n\t\t\tfunction EventException(code) {\n\t\t\t\tthis.code = code;\n\t\t\t\tthis.name = 'EventException';\n\t\t\t}\n\t\t\t\n\t\t\tBasic.extend(EventException, {\n\t\t\t\tUNSPECIFIED_EVENT_TYPE_ERR: 0\n\t\t\t});\n\t\t\t\n\t\t\tEventException.prototype = Error.prototype;\n\t\t\t\n\t\t\treturn EventException;\n\t\t}())\n\t};\n});");
__$coverInitRange("src/javascript/core/Exceptions.js", "348:3561");
__$coverInitRange("src/javascript/core/Exceptions.js", "430:564");
__$coverInitRange("src/javascript/core/Exceptions.js", "568:3557");
__$coverInitRange("src/javascript/core/Exceptions.js", "464:471");
__$coverInitRange("src/javascript/core/Exceptions.js", "475:546");
__$coverInitRange("src/javascript/core/Exceptions.js", "550:561");
__$coverInitRange("src/javascript/core/Exceptions.js", "497:542");
__$coverInitRange("src/javascript/core/Exceptions.js", "527:537");
__$coverInitRange("src/javascript/core/Exceptions.js", "610:693");
__$coverInitRange("src/javascript/core/Exceptions.js", "699:859");
__$coverInitRange("src/javascript/core/Exceptions.js", "868:905");
__$coverInitRange("src/javascript/core/Exceptions.js", "910:950");
__$coverInitRange("src/javascript/core/Exceptions.js", "955:974");
__$coverInitRange("src/javascript/core/Exceptions.js", "733:749");
__$coverInitRange("src/javascript/core/Exceptions.js", "755:792");
__$coverInitRange("src/javascript/core/Exceptions.js", "798:854");
__$coverInitRange("src/javascript/core/Exceptions.js", "1040:1159");
__$coverInitRange("src/javascript/core/Exceptions.js", "1168:1241");
__$coverInitRange("src/javascript/core/Exceptions.js", "1250:1306");
__$coverInitRange("src/javascript/core/Exceptions.js", "1315:1350");
__$coverInitRange("src/javascript/core/Exceptions.js", "1090:1106");
__$coverInitRange("src/javascript/core/Exceptions.js", "1112:1154");
__$coverInitRange("src/javascript/core/Exceptions.js", "1392:1434");
__$coverInitRange("src/javascript/core/Exceptions.js", "1440:1596");
__$coverInitRange("src/javascript/core/Exceptions.js", "1605:1640");
__$coverInitRange("src/javascript/core/Exceptions.js", "1645:1683");
__$coverInitRange("src/javascript/core/Exceptions.js", "1689:1706");
__$coverInitRange("src/javascript/core/Exceptions.js", "1472:1488");
__$coverInitRange("src/javascript/core/Exceptions.js", "1494:1531");
__$coverInitRange("src/javascript/core/Exceptions.js", "1537:1591");
__$coverInitRange("src/javascript/core/Exceptions.js", "1751:1960");
__$coverInitRange("src/javascript/core/Exceptions.js", "1966:2128");
__$coverInitRange("src/javascript/core/Exceptions.js", "2137:2175");
__$coverInitRange("src/javascript/core/Exceptions.js", "2180:2221");
__$coverInitRange("src/javascript/core/Exceptions.js", "2226:2246");
__$coverInitRange("src/javascript/core/Exceptions.js", "2001:2017");
__$coverInitRange("src/javascript/core/Exceptions.js", "2023:2060");
__$coverInitRange("src/javascript/core/Exceptions.js", "2066:2123");
__$coverInitRange("src/javascript/core/Exceptions.js", "2292:2966");
__$coverInitRange("src/javascript/core/Exceptions.js", "2972:3132");
__$coverInitRange("src/javascript/core/Exceptions.js", "3141:3178");
__$coverInitRange("src/javascript/core/Exceptions.js", "3183:3223");
__$coverInitRange("src/javascript/core/Exceptions.js", "3228:3247");
__$coverInitRange("src/javascript/core/Exceptions.js", "3006:3022");
__$coverInitRange("src/javascript/core/Exceptions.js", "3028:3065");
__$coverInitRange("src/javascript/core/Exceptions.js", "3071:3127");
__$coverInitRange("src/javascript/core/Exceptions.js", "3295:3386");
__$coverInitRange("src/javascript/core/Exceptions.js", "3395:3465");
__$coverInitRange("src/javascript/core/Exceptions.js", "3474:3516");
__$coverInitRange("src/javascript/core/Exceptions.js", "3525:3546");
__$coverInitRange("src/javascript/core/Exceptions.js", "3331:3347");
__$coverInitRange("src/javascript/core/Exceptions.js", "3353:3381");
__$coverCall('src/javascript/core/Exceptions.js', '348:3561');
define('moxie/core/Exceptions', ['moxie/core/utils/Basic'], function (Basic) {
    __$coverCall('src/javascript/core/Exceptions.js', '430:564');
    function _findKey(obj, value) {
        __$coverCall('src/javascript/core/Exceptions.js', '464:471');
        var key;
        __$coverCall('src/javascript/core/Exceptions.js', '475:546');
        for (key in obj) {
            __$coverCall('src/javascript/core/Exceptions.js', '497:542');
            if (obj[key] === value) {
                __$coverCall('src/javascript/core/Exceptions.js', '527:537');
                return key;
            }
        }
        __$coverCall('src/javascript/core/Exceptions.js', '550:561');
        return null;
    }
    __$coverCall('src/javascript/core/Exceptions.js', '568:3557');
    return {
        RuntimeError: function () {
            __$coverCall('src/javascript/core/Exceptions.js', '610:693');
            var namecodes = {
                    NOT_INIT_ERR: 1,
                    NOT_SUPPORTED_ERR: 9,
                    JS_ERR: 4
                };
            __$coverCall('src/javascript/core/Exceptions.js', '699:859');
            function RuntimeError(code) {
                __$coverCall('src/javascript/core/Exceptions.js', '733:749');
                this.code = code;
                __$coverCall('src/javascript/core/Exceptions.js', '755:792');
                this.name = _findKey(namecodes, code);
                __$coverCall('src/javascript/core/Exceptions.js', '798:854');
                this.message = this.name + ': RuntimeError ' + this.code;
            }
            __$coverCall('src/javascript/core/Exceptions.js', '868:905');
            Basic.extend(RuntimeError, namecodes);
            __$coverCall('src/javascript/core/Exceptions.js', '910:950');
            RuntimeError.prototype = Error.prototype;
            __$coverCall('src/javascript/core/Exceptions.js', '955:974');
            return RuntimeError;
        }(),
        OperationNotAllowedException: function () {
            __$coverCall('src/javascript/core/Exceptions.js', '1040:1159');
            function OperationNotAllowedException(code) {
                __$coverCall('src/javascript/core/Exceptions.js', '1090:1106');
                this.code = code;
                __$coverCall('src/javascript/core/Exceptions.js', '1112:1154');
                this.name = 'OperationNotAllowedException';
            }
            __$coverCall('src/javascript/core/Exceptions.js', '1168:1241');
            Basic.extend(OperationNotAllowedException, { NOT_ALLOWED_ERR: 1 });
            __$coverCall('src/javascript/core/Exceptions.js', '1250:1306');
            OperationNotAllowedException.prototype = Error.prototype;
            __$coverCall('src/javascript/core/Exceptions.js', '1315:1350');
            return OperationNotAllowedException;
        }(),
        ImageError: function () {
            __$coverCall('src/javascript/core/Exceptions.js', '1392:1434');
            var namecodes = { WRONG_FORMAT: 1 };
            __$coverCall('src/javascript/core/Exceptions.js', '1440:1596');
            function ImageError(code) {
                __$coverCall('src/javascript/core/Exceptions.js', '1472:1488');
                this.code = code;
                __$coverCall('src/javascript/core/Exceptions.js', '1494:1531');
                this.name = _findKey(namecodes, code);
                __$coverCall('src/javascript/core/Exceptions.js', '1537:1591');
                this.message = this.name + ': ImageError ' + this.code;
            }
            __$coverCall('src/javascript/core/Exceptions.js', '1605:1640');
            Basic.extend(ImageError, namecodes);
            __$coverCall('src/javascript/core/Exceptions.js', '1645:1683');
            ImageError.prototype = Error.prototype;
            __$coverCall('src/javascript/core/Exceptions.js', '1689:1706');
            return ImageError;
        }(),
        FileException: function () {
            __$coverCall('src/javascript/core/Exceptions.js', '1751:1960');
            var namecodes = {
                    NOT_FOUND_ERR: 1,
                    SECURITY_ERR: 2,
                    ABORT_ERR: 3,
                    NOT_READABLE_ERR: 4,
                    ENCODING_ERR: 5,
                    NO_MODIFICATION_ALLOWED_ERR: 6,
                    INVALID_STATE_ERR: 7,
                    SYNTAX_ERR: 8
                };
            __$coverCall('src/javascript/core/Exceptions.js', '1966:2128');
            function FileException(code) {
                __$coverCall('src/javascript/core/Exceptions.js', '2001:2017');
                this.code = code;
                __$coverCall('src/javascript/core/Exceptions.js', '2023:2060');
                this.name = _findKey(namecodes, code);
                __$coverCall('src/javascript/core/Exceptions.js', '2066:2123');
                this.message = this.name + ': FileException ' + this.code;
            }
            __$coverCall('src/javascript/core/Exceptions.js', '2137:2175');
            Basic.extend(FileException, namecodes);
            __$coverCall('src/javascript/core/Exceptions.js', '2180:2221');
            FileException.prototype = Error.prototype;
            __$coverCall('src/javascript/core/Exceptions.js', '2226:2246');
            return FileException;
        }(),
        DOMException: function () {
            __$coverCall('src/javascript/core/Exceptions.js', '2292:2966');
            var namecodes = {
                    INDEX_SIZE_ERR: 1,
                    DOMSTRING_SIZE_ERR: 2,
                    HIERARCHY_REQUEST_ERR: 3,
                    WRONG_DOCUMENT_ERR: 4,
                    INVALID_CHARACTER_ERR: 5,
                    NO_DATA_ALLOWED_ERR: 6,
                    NO_MODIFICATION_ALLOWED_ERR: 7,
                    NOT_FOUND_ERR: 8,
                    NOT_SUPPORTED_ERR: 9,
                    INUSE_ATTRIBUTE_ERR: 10,
                    INVALID_STATE_ERR: 11,
                    SYNTAX_ERR: 12,
                    INVALID_MODIFICATION_ERR: 13,
                    NAMESPACE_ERR: 14,
                    INVALID_ACCESS_ERR: 15,
                    VALIDATION_ERR: 16,
                    TYPE_MISMATCH_ERR: 17,
                    SECURITY_ERR: 18,
                    NETWORK_ERR: 19,
                    ABORT_ERR: 20,
                    URL_MISMATCH_ERR: 21,
                    QUOTA_EXCEEDED_ERR: 22,
                    TIMEOUT_ERR: 23,
                    INVALID_NODE_TYPE_ERR: 24,
                    DATA_CLONE_ERR: 25
                };
            __$coverCall('src/javascript/core/Exceptions.js', '2972:3132');
            function DOMException(code) {
                __$coverCall('src/javascript/core/Exceptions.js', '3006:3022');
                this.code = code;
                __$coverCall('src/javascript/core/Exceptions.js', '3028:3065');
                this.name = _findKey(namecodes, code);
                __$coverCall('src/javascript/core/Exceptions.js', '3071:3127');
                this.message = this.name + ': DOMException ' + this.code;
            }
            __$coverCall('src/javascript/core/Exceptions.js', '3141:3178');
            Basic.extend(DOMException, namecodes);
            __$coverCall('src/javascript/core/Exceptions.js', '3183:3223');
            DOMException.prototype = Error.prototype;
            __$coverCall('src/javascript/core/Exceptions.js', '3228:3247');
            return DOMException;
        }(),
        EventException: function () {
            __$coverCall('src/javascript/core/Exceptions.js', '3295:3386');
            function EventException(code) {
                __$coverCall('src/javascript/core/Exceptions.js', '3331:3347');
                this.code = code;
                __$coverCall('src/javascript/core/Exceptions.js', '3353:3381');
                this.name = 'EventException';
            }
            __$coverCall('src/javascript/core/Exceptions.js', '3395:3465');
            Basic.extend(EventException, { UNSPECIFIED_EVENT_TYPE_ERR: 0 });
            __$coverCall('src/javascript/core/Exceptions.js', '3474:3516');
            EventException.prototype = Error.prototype;
            __$coverCall('src/javascript/core/Exceptions.js', '3525:3546');
            return EventException;
        }()
    };
});

// Included from: src/javascript/core/EventTarget.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/EventTarget.js", "/**\n * EventTarget.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/core/EventTarget', [\n\t'moxie/core/Exceptions',\n\t'moxie/core/utils/Basic'\n], function(x, Basic) {\n\t/**\n\tParent object for all event dispatching components and objects\n\n\t@class EventTarget\n\t@constructor EventTarget\n\t*/\n\tfunction EventTarget() {\n\t\t// hash of event listeners by object uid\n\t\tvar eventpool = {};\n\t\t\t\t\n\t\tBasic.extend(this, {\n\t\t\t\n\t\t\t/**\n\t\t\tUnique id of the event dispatcher, usually overriden by children\n\n\t\t\t@property uid\n\t\t\t@type String\n\t\t\t*/\n\t\t\tuid: null,\n\t\t\t\n\t\t\t/**\n\t\t\tCan be called from within a child  in order to acquire uniqie id in automated manner\n\n\t\t\t@method init\n\t\t\t*/\n\t\t\tinit: function() {\n\t\t\t\tif (!this.uid) {\n\t\t\t\t\tthis.uid = Basic.guid('uid_');\n\t\t\t\t}\n\t\t\t},\n\n\t\t\t/**\n\t\t\tRegister a handler to a specific event dispatched by the object\n\n\t\t\t@method addEventListener\n\t\t\t@param {String} type Type or basically a name of the event to subscribe to\n\t\t\t@param {Function} fn Callback function that will be called when event happens\n\t\t\t@param {Number} [priority=0] Priority of the event handler - handlers with higher priorities will be called first\n\t\t\t@param {Object} [scope=this] A scope to invoke event handler in\n\t\t\t*/\n\t\t\taddEventListener: function(type, fn, priority, scope) {\n\t\t\t\tvar self = this, list;\n\t\t\t\t\n\t\t\t\ttype = Basic.trim(type);\n\t\t\t\t\n\t\t\t\tif (/\\s/.test(type)) {\n\t\t\t\t\t// multiple event types were passed for one handler\n\t\t\t\t\tBasic.each(type.split(/\\s+/), function(type) {\n\t\t\t\t\t\tself.addEventListener(type, fn, priority, scope);\n\t\t\t\t\t});\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\ttype = type.toLowerCase();\n\t\t\t\tpriority = parseInt(priority, 10) || 0;\n\t\t\t\t\n\t\t\t\tlist = eventpool[this.uid] && eventpool[this.uid][type] || [];\n\t\t\t\tlist.push({fn : fn, priority : priority, scope : scope || this});\n\t\t\t\t\n\t\t\t\tif (!eventpool[this.uid]) {\n\t\t\t\t\teventpool[this.uid] = {};\n\t\t\t\t}\n\t\t\t\teventpool[this.uid][type] = list;\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tCheck if any handlers were registered to the specified event\n\n\t\t\t@method hasEventListener\n\t\t\t@param {String} type Type or basically a name of the event to check\n\t\t\t@return {Mixed} Returns a handler if it was found and false, if - not\n\t\t\t*/\n\t\t\thasEventListener: function(type) {\n\t\t\t\treturn type ? !!(eventpool[this.uid] && eventpool[this.uid][type]) : !!eventpool[this.uid];\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tUnregister the handler from the event, or if former was not specified - unregister all handlers\n\n\t\t\t@method removeEventListener\n\t\t\t@param {String} type Type or basically a name of the event\n\t\t\t@param {Function} [fn] Handler to unregister\n\t\t\t*/\n\t\t\tremoveEventListener: function(type, fn) {\n\t\t\t\ttype = type.toLowerCase();\n\t\n\t\t\t\tvar list = eventpool[this.uid] && eventpool[this.uid][type], i;\n\t\n\t\t\t\tif (list) {\n\t\t\t\t\tif (fn) {\n\t\t\t\t\t\tfor (i = list.length - 1; i >= 0; i--) {\n\t\t\t\t\t\t\tif (list[i].fn === fn) {\n\t\t\t\t\t\t\t\tlist.splice(i, 1);\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t} else {\n\t\t\t\t\t\tlist = [];\n\t\t\t\t\t}\n\t\n\t\t\t\t\t// delete event list if it has become empty\n\t\t\t\t\tif (!list.length) {\n\t\t\t\t\t\tdelete eventpool[this.uid][type];\n\t\t\t\t\t\t\n\t\t\t\t\t\t// and object specific entry in a hash if it has no more listeners attached\n\t\t\t\t\t\tif (Basic.isEmptyObj(eventpool[this.uid])) {\n\t\t\t\t\t\t\tdelete eventpool[this.uid];\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tRemove all event handlers from the object\n\n\t\t\t@method removeAllEventListeners\n\t\t\t*/\n\t\t\tremoveAllEventListeners: function() {\n\t\t\t\tif (eventpool[this.uid]) {\n\t\t\t\t\tdelete eventpool[this.uid];\n\t\t\t\t}\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tDispatch the event\n\n\t\t\t@method dispatchEvent\n\t\t\t@param {String/Object} Type of event or event object to dispatch\n\t\t\t@param {Mixed} [...] Variable number of arguments to be passed to a handlers\n\t\t\t@return {Boolean} true by default and false if any handler returned false\n\t\t\t*/\n\t\t\tdispatchEvent: function(type) {\n\t\t\t\tvar uid, list, args, tmpEvt, evt = {};\n\t\t\t\t\n\t\t\t\tif (Basic.typeOf(type) !== 'string') {\n\t\t\t\t\t// we can't use original object directly\n\t\t\t\t\ttmpEvt = type;\n\n\t\t\t\t\tif (Basic.typeOf(tmpEvt.type) === 'string') {\n\t\t\t\t\t\ttype = tmpEvt.type;\n\n\t\t\t\t\t\tif (tmpEvt.total && tmpEvt.loaded) { // progress event\n\t\t\t\t\t\t\tevt.total = tmpEvt.total;\n\t\t\t\t\t\t\tevt.loaded = tmpEvt.loaded;\n\t\t\t\t\t\t}\n\t\t\t\t\t} else {\n\t\t\t\t\t\tthrow new x.EventException(x.EventException.UNSPECIFIED_EVENT_TYPE_ERR);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t// check if event is meant to be dispatched on an object having specific uid\n\t\t\t\tif (type.indexOf('::') !== -1) {\n\t\t\t\t\t(function(arr) {\n\t\t\t\t\t\tuid = arr[0];\n\t\t\t\t\t\ttype = arr[1];\n\t\t\t\t\t}(type.split('::')));\n\t\t\t\t} else {\n\t\t\t\t\tuid = this.uid;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\ttype = type.toLowerCase();\n\t\t\t\t\t\t\t\t\n\t\t\t\tlist = eventpool[uid] && eventpool[uid][type];\n\n\t\t\t\tif (list) {\n\t\t\t\t\t// sort event list by prority\n\t\t\t\t\tlist.sort(function(a, b) { return b.priority - a.priority; });\n\t\t\t\t\t\n\t\t\t\t\targs = [].slice.call(arguments);\n\t\t\t\t\t\n\t\t\t\t\t// first argument will be pseudo-event object\n\t\t\t\t\targs.shift();\n\t\t\t\t\tevt.type = type;\n\t\t\t\t\targs.unshift(evt);\n\n\t\t\t\t\t// Dispatch event to all listeners\n\t\t\t\t\tvar queue = [];\n\t\t\t\t\tBasic.each(list, function(handler) {\n\t\t\t\t\t\t// explicitly set the target, otherwise events fired from shims to not get it\n\t\t\t\t\t\targs[0].target = handler.scope;\n\t\t\t\t\t\t// if event is marked as async, detach the handler\n\t\t\t\t\t\tif (evt.async) {\n\t\t\t\t\t\t\tqueue.push(function(cb) {\n\t\t\t\t\t\t\t\tsetTimeout(function() {\n\t\t\t\t\t\t\t\t\tcb(handler.fn.apply(handler.scope, args) === false);\n\t\t\t\t\t\t\t\t}, 1);\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tqueue.push(function(cb) {\n\t\t\t\t\t\t\t\tcb(handler.fn.apply(handler.scope, args) === false); // if handler returns false stop propagation\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t\tif (queue.length) {\n\t\t\t\t\t\tBasic.inSeries(queue);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn true;\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tAlias for addEventListener\n\n\t\t\t@method bind\n\t\t\t@protected\n\t\t\t*/\n\t\t\tbind: function() {\n\t\t\t\tthis.addEventListener.apply(this, arguments);\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tAlias for removeEventListener\n\n\t\t\t@method unbind\n\t\t\t@protected\n\t\t\t*/\n\t\t\tunbind: function() {\n\t\t\t\tthis.removeEventListener.apply(this, arguments);\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tAlias for removeAllEventListeners\n\n\t\t\t@method unbindAll\n\t\t\t@protected\n\t\t\t*/\n\t\t\tunbindAll: function() {\n\t\t\t\tthis.removeAllEventListeners.apply(this, arguments);\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tAlias for dispatchEvent\n\n\t\t\t@method trigger\n\t\t\t@protected\n\t\t\t*/\n\t\t\ttrigger: function() {\n\t\t\t\tthis.dispatchEvent.apply(this, arguments);\n\t\t\t},\n\t\t\t\n\t\t\t\n\t\t\t/**\n\t\t\tConverts properties of on[event] type to corresponding event handlers,\n\t\t\tis used to avoid extra hassle around the process of calling them back\n\n\t\t\t@method convertEventPropsToHandlers\n\t\t\t@private\n\t\t\t*/\n\t\t\tconvertEventPropsToHandlers: function(handlers) {\n\t\t\t\tvar h;\n\t\t\t\t\t\t\n\t\t\t\tif (Basic.typeOf(handlers) !== 'array') {\n\t\t\t\t\thandlers = [handlers];\n\t\t\t\t}\n\n\t\t\t\tfor (var i = 0; i < handlers.length; i++) {\n\t\t\t\t\th = 'on' + handlers[i];\n\t\t\t\t\t\n\t\t\t\t\tif (Basic.typeOf(this[h]) === 'function') {\n\t\t\t\t\t\tthis.addEventListener(handlers[i], this[h]);\n\t\t\t\t\t} else if (this[h] === undefined) {\n\t\t\t\t\t\tthis[h] = null; // object must have defined event properties, even if it doesn't make use of them\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t\n\t\t});\n\t}\n\n\tEventTarget.instance = new EventTarget(); \n\n\treturn EventTarget;\n});");
__$coverInitRange("src/javascript/core/EventTarget.js", "349:7351");
__$coverInitRange("src/javascript/core/EventTarget.js", "581:7280");
__$coverInitRange("src/javascript/core/EventTarget.js", "7284:7324");
__$coverInitRange("src/javascript/core/EventTarget.js", "7329:7347");
__$coverInitRange("src/javascript/core/EventTarget.js", "651:669");
__$coverInitRange("src/javascript/core/EventTarget.js", "678:7277");
__$coverInitRange("src/javascript/core/EventTarget.js", "980:1037");
__$coverInitRange("src/javascript/core/EventTarget.js", "1002:1031");
__$coverInitRange("src/javascript/core/EventTarget.js", "1561:1582");
__$coverInitRange("src/javascript/core/EventTarget.js", "1593:1616");
__$coverInitRange("src/javascript/core/EventTarget.js", "1627:1841");
__$coverInitRange("src/javascript/core/EventTarget.js", "1852:1877");
__$coverInitRange("src/javascript/core/EventTarget.js", "1883:1921");
__$coverInitRange("src/javascript/core/EventTarget.js", "1932:1993");
__$coverInitRange("src/javascript/core/EventTarget.js", "1999:2063");
__$coverInitRange("src/javascript/core/EventTarget.js", "2074:2137");
__$coverInitRange("src/javascript/core/EventTarget.js", "2143:2175");
__$coverInitRange("src/javascript/core/EventTarget.js", "1712:1822");
__$coverInitRange("src/javascript/core/EventTarget.js", "1829:1835");
__$coverInitRange("src/javascript/core/EventTarget.js", "1765:1813");
__$coverInitRange("src/javascript/core/EventTarget.js", "2107:2131");
__$coverInitRange("src/javascript/core/EventTarget.js", "2479:2569");
__$coverInitRange("src/javascript/core/EventTarget.js", "2884:2909");
__$coverInitRange("src/javascript/core/EventTarget.js", "2917:2979");
__$coverInitRange("src/javascript/core/EventTarget.js", "2987:3500");
__$coverInitRange("src/javascript/core/EventTarget.js", "3004:3188");
__$coverInitRange("src/javascript/core/EventTarget.js", "3246:3494");
__$coverInitRange("src/javascript/core/EventTarget.js", "3020:3150");
__$coverInitRange("src/javascript/core/EventTarget.js", "3068:3142");
__$coverInitRange("src/javascript/core/EventTarget.js", "3101:3118");
__$coverInitRange("src/javascript/core/EventTarget.js", "3128:3133");
__$coverInitRange("src/javascript/core/EventTarget.js", "3172:3181");
__$coverInitRange("src/javascript/core/EventTarget.js", "3272:3304");
__$coverInitRange("src/javascript/core/EventTarget.js", "3401:3487");
__$coverInitRange("src/javascript/core/EventTarget.js", "3453:3479");
__$coverInitRange("src/javascript/core/EventTarget.js", "3651:3715");
__$coverInitRange("src/javascript/core/EventTarget.js", "3683:3709");
__$coverInitRange("src/javascript/core/EventTarget.js", "4052:4089");
__$coverInitRange("src/javascript/core/EventTarget.js", "4100:4525");
__$coverInitRange("src/javascript/core/EventTarget.js", "4617:4778");
__$coverInitRange("src/javascript/core/EventTarget.js", "4789:4814");
__$coverInitRange("src/javascript/core/EventTarget.js", "4829:4874");
__$coverInitRange("src/javascript/core/EventTarget.js", "4881:5868");
__$coverInitRange("src/javascript/core/EventTarget.js", "5874:5885");
__$coverInitRange("src/javascript/core/EventTarget.js", "4190:4203");
__$coverInitRange("src/javascript/core/EventTarget.js", "4211:4519");
__$coverInitRange("src/javascript/core/EventTarget.js", "4263:4281");
__$coverInitRange("src/javascript/core/EventTarget.js", "4290:4419");
__$coverInitRange("src/javascript/core/EventTarget.js", "4352:4376");
__$coverInitRange("src/javascript/core/EventTarget.js", "4385:4411");
__$coverInitRange("src/javascript/core/EventTarget.js", "4441:4512");
__$coverInitRange("src/javascript/core/EventTarget.js", "4655:4738");
__$coverInitRange("src/javascript/core/EventTarget.js", "4678:4690");
__$coverInitRange("src/javascript/core/EventTarget.js", "4698:4711");
__$coverInitRange("src/javascript/core/EventTarget.js", "4758:4772");
__$coverInitRange("src/javascript/core/EventTarget.js", "4933:4994");
__$coverInitRange("src/javascript/core/EventTarget.js", "5007:5038");
__$coverInitRange("src/javascript/core/EventTarget.js", "5102:5114");
__$coverInitRange("src/javascript/core/EventTarget.js", "5121:5136");
__$coverInitRange("src/javascript/core/EventTarget.js", "5143:5160");
__$coverInitRange("src/javascript/core/EventTarget.js", "5208:5222");
__$coverInitRange("src/javascript/core/EventTarget.js", "5229:5801");
__$coverInitRange("src/javascript/core/EventTarget.js", "5808:5862");
__$coverInitRange("src/javascript/core/EventTarget.js", "4960:4990");
__$coverInitRange("src/javascript/core/EventTarget.js", "5356:5386");
__$coverInitRange("src/javascript/core/EventTarget.js", "5451:5792");
__$coverInitRange("src/javascript/core/EventTarget.js", "5475:5619");
__$coverInitRange("src/javascript/core/EventTarget.js", "5509:5608");
__$coverInitRange("src/javascript/core/EventTarget.js", "5542:5593");
__$coverInitRange("src/javascript/core/EventTarget.js", "5643:5784");
__$coverInitRange("src/javascript/core/EventTarget.js", "5677:5728");
__$coverInitRange("src/javascript/core/EventTarget.js", "5834:5855");
__$coverInitRange("src/javascript/core/EventTarget.js", "5997:6041");
__$coverInitRange("src/javascript/core/EventTarget.js", "6160:6207");
__$coverInitRange("src/javascript/core/EventTarget.js", "6336:6387");
__$coverInitRange("src/javascript/core/EventTarget.js", "6502:6543");
__$coverInitRange("src/javascript/core/EventTarget.js", "6828:6833");
__$coverInitRange("src/javascript/core/EventTarget.js", "6846:6920");
__$coverInitRange("src/javascript/core/EventTarget.js", "6927:7262");
__$coverInitRange("src/javascript/core/EventTarget.js", "6893:6914");
__$coverInitRange("src/javascript/core/EventTarget.js", "6976:6998");
__$coverInitRange("src/javascript/core/EventTarget.js", "7011:7256");
__$coverInitRange("src/javascript/core/EventTarget.js", "7061:7104");
__$coverInitRange("src/javascript/core/EventTarget.js", "7153:7167");
__$coverCall('src/javascript/core/EventTarget.js', '349:7351');
define('moxie/core/EventTarget', [
    'moxie/core/Exceptions',
    'moxie/core/utils/Basic'
], function (x, Basic) {
    __$coverCall('src/javascript/core/EventTarget.js', '581:7280');
    function EventTarget() {
        __$coverCall('src/javascript/core/EventTarget.js', '651:669');
        var eventpool = {};
        __$coverCall('src/javascript/core/EventTarget.js', '678:7277');
        Basic.extend(this, {
            uid: null,
            init: function () {
                __$coverCall('src/javascript/core/EventTarget.js', '980:1037');
                if (!this.uid) {
                    __$coverCall('src/javascript/core/EventTarget.js', '1002:1031');
                    this.uid = Basic.guid('uid_');
                }
            },
            addEventListener: function (type, fn, priority, scope) {
                __$coverCall('src/javascript/core/EventTarget.js', '1561:1582');
                var self = this, list;
                __$coverCall('src/javascript/core/EventTarget.js', '1593:1616');
                type = Basic.trim(type);
                __$coverCall('src/javascript/core/EventTarget.js', '1627:1841');
                if (/\s/.test(type)) {
                    __$coverCall('src/javascript/core/EventTarget.js', '1712:1822');
                    Basic.each(type.split(/\s+/), function (type) {
                        __$coverCall('src/javascript/core/EventTarget.js', '1765:1813');
                        self.addEventListener(type, fn, priority, scope);
                    });
                    __$coverCall('src/javascript/core/EventTarget.js', '1829:1835');
                    return;
                }
                __$coverCall('src/javascript/core/EventTarget.js', '1852:1877');
                type = type.toLowerCase();
                __$coverCall('src/javascript/core/EventTarget.js', '1883:1921');
                priority = parseInt(priority, 10) || 0;
                __$coverCall('src/javascript/core/EventTarget.js', '1932:1993');
                list = eventpool[this.uid] && eventpool[this.uid][type] || [];
                __$coverCall('src/javascript/core/EventTarget.js', '1999:2063');
                list.push({
                    fn: fn,
                    priority: priority,
                    scope: scope || this
                });
                __$coverCall('src/javascript/core/EventTarget.js', '2074:2137');
                if (!eventpool[this.uid]) {
                    __$coverCall('src/javascript/core/EventTarget.js', '2107:2131');
                    eventpool[this.uid] = {};
                }
                __$coverCall('src/javascript/core/EventTarget.js', '2143:2175');
                eventpool[this.uid][type] = list;
            },
            hasEventListener: function (type) {
                __$coverCall('src/javascript/core/EventTarget.js', '2479:2569');
                return type ? !!(eventpool[this.uid] && eventpool[this.uid][type]) : !!eventpool[this.uid];
            },
            removeEventListener: function (type, fn) {
                __$coverCall('src/javascript/core/EventTarget.js', '2884:2909');
                type = type.toLowerCase();
                __$coverCall('src/javascript/core/EventTarget.js', '2917:2979');
                var list = eventpool[this.uid] && eventpool[this.uid][type], i;
                __$coverCall('src/javascript/core/EventTarget.js', '2987:3500');
                if (list) {
                    __$coverCall('src/javascript/core/EventTarget.js', '3004:3188');
                    if (fn) {
                        __$coverCall('src/javascript/core/EventTarget.js', '3020:3150');
                        for (i = list.length - 1; i >= 0; i--) {
                            __$coverCall('src/javascript/core/EventTarget.js', '3068:3142');
                            if (list[i].fn === fn) {
                                __$coverCall('src/javascript/core/EventTarget.js', '3101:3118');
                                list.splice(i, 1);
                                __$coverCall('src/javascript/core/EventTarget.js', '3128:3133');
                                break;
                            }
                        }
                    } else {
                        __$coverCall('src/javascript/core/EventTarget.js', '3172:3181');
                        list = [];
                    }
                    __$coverCall('src/javascript/core/EventTarget.js', '3246:3494');
                    if (!list.length) {
                        __$coverCall('src/javascript/core/EventTarget.js', '3272:3304');
                        delete eventpool[this.uid][type];
                        __$coverCall('src/javascript/core/EventTarget.js', '3401:3487');
                        if (Basic.isEmptyObj(eventpool[this.uid])) {
                            __$coverCall('src/javascript/core/EventTarget.js', '3453:3479');
                            delete eventpool[this.uid];
                        }
                    }
                }
            },
            removeAllEventListeners: function () {
                __$coverCall('src/javascript/core/EventTarget.js', '3651:3715');
                if (eventpool[this.uid]) {
                    __$coverCall('src/javascript/core/EventTarget.js', '3683:3709');
                    delete eventpool[this.uid];
                }
            },
            dispatchEvent: function (type) {
                __$coverCall('src/javascript/core/EventTarget.js', '4052:4089');
                var uid, list, args, tmpEvt, evt = {};
                __$coverCall('src/javascript/core/EventTarget.js', '4100:4525');
                if (Basic.typeOf(type) !== 'string') {
                    __$coverCall('src/javascript/core/EventTarget.js', '4190:4203');
                    tmpEvt = type;
                    __$coverCall('src/javascript/core/EventTarget.js', '4211:4519');
                    if (Basic.typeOf(tmpEvt.type) === 'string') {
                        __$coverCall('src/javascript/core/EventTarget.js', '4263:4281');
                        type = tmpEvt.type;
                        __$coverCall('src/javascript/core/EventTarget.js', '4290:4419');
                        if (tmpEvt.total && tmpEvt.loaded) {
                            __$coverCall('src/javascript/core/EventTarget.js', '4352:4376');
                            evt.total = tmpEvt.total;
                            __$coverCall('src/javascript/core/EventTarget.js', '4385:4411');
                            evt.loaded = tmpEvt.loaded;
                        }
                    } else {
                        __$coverCall('src/javascript/core/EventTarget.js', '4441:4512');
                        throw new x.EventException(x.EventException.UNSPECIFIED_EVENT_TYPE_ERR);
                    }
                }
                __$coverCall('src/javascript/core/EventTarget.js', '4617:4778');
                if (type.indexOf('::') !== -1) {
                    __$coverCall('src/javascript/core/EventTarget.js', '4655:4738');
                    (function (arr) {
                        __$coverCall('src/javascript/core/EventTarget.js', '4678:4690');
                        uid = arr[0];
                        __$coverCall('src/javascript/core/EventTarget.js', '4698:4711');
                        type = arr[1];
                    }(type.split('::')));
                } else {
                    __$coverCall('src/javascript/core/EventTarget.js', '4758:4772');
                    uid = this.uid;
                }
                __$coverCall('src/javascript/core/EventTarget.js', '4789:4814');
                type = type.toLowerCase();
                __$coverCall('src/javascript/core/EventTarget.js', '4829:4874');
                list = eventpool[uid] && eventpool[uid][type];
                __$coverCall('src/javascript/core/EventTarget.js', '4881:5868');
                if (list) {
                    __$coverCall('src/javascript/core/EventTarget.js', '4933:4994');
                    list.sort(function (a, b) {
                        __$coverCall('src/javascript/core/EventTarget.js', '4960:4990');
                        return b.priority - a.priority;
                    });
                    __$coverCall('src/javascript/core/EventTarget.js', '5007:5038');
                    args = [].slice.call(arguments);
                    __$coverCall('src/javascript/core/EventTarget.js', '5102:5114');
                    args.shift();
                    __$coverCall('src/javascript/core/EventTarget.js', '5121:5136');
                    evt.type = type;
                    __$coverCall('src/javascript/core/EventTarget.js', '5143:5160');
                    args.unshift(evt);
                    __$coverCall('src/javascript/core/EventTarget.js', '5208:5222');
                    var queue = [];
                    __$coverCall('src/javascript/core/EventTarget.js', '5229:5801');
                    Basic.each(list, function (handler) {
                        __$coverCall('src/javascript/core/EventTarget.js', '5356:5386');
                        args[0].target = handler.scope;
                        __$coverCall('src/javascript/core/EventTarget.js', '5451:5792');
                        if (evt.async) {
                            __$coverCall('src/javascript/core/EventTarget.js', '5475:5619');
                            queue.push(function (cb) {
                                __$coverCall('src/javascript/core/EventTarget.js', '5509:5608');
                                setTimeout(function () {
                                    __$coverCall('src/javascript/core/EventTarget.js', '5542:5593');
                                    cb(handler.fn.apply(handler.scope, args) === false);
                                }, 1);
                            });
                        } else {
                            __$coverCall('src/javascript/core/EventTarget.js', '5643:5784');
                            queue.push(function (cb) {
                                __$coverCall('src/javascript/core/EventTarget.js', '5677:5728');
                                cb(handler.fn.apply(handler.scope, args) === false);
                            });
                        }
                    });
                    __$coverCall('src/javascript/core/EventTarget.js', '5808:5862');
                    if (queue.length) {
                        __$coverCall('src/javascript/core/EventTarget.js', '5834:5855');
                        Basic.inSeries(queue);
                    }
                }
                __$coverCall('src/javascript/core/EventTarget.js', '5874:5885');
                return true;
            },
            bind: function () {
                __$coverCall('src/javascript/core/EventTarget.js', '5997:6041');
                this.addEventListener.apply(this, arguments);
            },
            unbind: function () {
                __$coverCall('src/javascript/core/EventTarget.js', '6160:6207');
                this.removeEventListener.apply(this, arguments);
            },
            unbindAll: function () {
                __$coverCall('src/javascript/core/EventTarget.js', '6336:6387');
                this.removeAllEventListeners.apply(this, arguments);
            },
            trigger: function () {
                __$coverCall('src/javascript/core/EventTarget.js', '6502:6543');
                this.dispatchEvent.apply(this, arguments);
            },
            convertEventPropsToHandlers: function (handlers) {
                __$coverCall('src/javascript/core/EventTarget.js', '6828:6833');
                var h;
                __$coverCall('src/javascript/core/EventTarget.js', '6846:6920');
                if (Basic.typeOf(handlers) !== 'array') {
                    __$coverCall('src/javascript/core/EventTarget.js', '6893:6914');
                    handlers = [handlers];
                }
                __$coverCall('src/javascript/core/EventTarget.js', '6927:7262');
                for (var i = 0; i < handlers.length; i++) {
                    __$coverCall('src/javascript/core/EventTarget.js', '6976:6998');
                    h = 'on' + handlers[i];
                    __$coverCall('src/javascript/core/EventTarget.js', '7011:7256');
                    if (Basic.typeOf(this[h]) === 'function') {
                        __$coverCall('src/javascript/core/EventTarget.js', '7061:7104');
                        this.addEventListener(handlers[i], this[h]);
                    } else if (this[h] === undefined) {
                        __$coverCall('src/javascript/core/EventTarget.js', '7153:7167');
                        this[h] = null;
                    }
                }
            }
        });
    }
    __$coverCall('src/javascript/core/EventTarget.js', '7284:7324');
    EventTarget.instance = new EventTarget();
    __$coverCall('src/javascript/core/EventTarget.js', '7329:7347');
    return EventTarget;
});

// Included from: src/javascript/core/utils/Encode.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/utils/Encode.js", "/**\n * Encode.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true, escape: true, unescape: true */\n\ndefine('moxie/core/utils/Encode', [], function() {\n\n\t/**\n\tEncode string with UTF-8\n\n\t@method utf8_encode\n\t@static\n\t@param {String} str String to encode\n\t@return {String} UTF-8 encoded string\n\t*/\n\tvar utf8_encode = function(str) {\n\t\treturn unescape(encodeURIComponent(str));\n\t};\n\t\n\t/**\n\tDecode UTF-8 encoded string\n\n\t@method utf8_decode\n\t@static\n\t@param {String} str String to decode\n\t@return {String} Decoded string\n\t*/\n\tvar utf8_decode = function(str_data) {\n\t\treturn decodeURIComponent(escape(str_data));\n\t};\n\t\n\t/**\n\tDecode Base64 encoded string (uses browser's default method if available),\n\tfrom: https://raw.github.com/kvz/phpjs/master/functions/url/base64_decode.js\n\n\t@method atob\n\t@static\n\t@param {String} data String to decode\n\t@return {String} Decoded string\n\t*/\n\tvar atob = function(data) {\n\t\tif (typeof(window.atob) === 'function') {\n\t\t\treturn window.atob(data);\n\t\t}\n\n\t\t// http://kevin.vanzonneveld.net\n\t\t// +   original by: Tyler Akins (http://rumkin.com)\n\t\t// +   improved by: Thunder.m\n\t\t// +      input by: Aman Gupta\n\t\t// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)\n\t\t// +   bugfixed by: Onno Marsman\n\t\t// +   bugfixed by: Pellentesque Malesuada\n\t\t// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)\n\t\t// +      input by: Brett Zamir (http://brett-zamir.me)\n\t\t// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)\n\t\t// *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');\n\t\t// *     returns 1: 'Kevin van Zonneveld'\n\t\t// mozilla has this native\n\t\t// - but breaks in 2.0.0.12!\n\t\t//if (typeof this.window.atob == 'function') {\n\t\t//    return atob(data);\n\t\t//}\n\t\tvar b64 = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\";\n\t\tvar o1, o2, o3, h1, h2, h3, h4, bits, i = 0,\n\t\t\tac = 0,\n\t\t\tdec = \"\",\n\t\t\ttmp_arr = [];\n\n\t\tif (!data) {\n\t\t\treturn data;\n\t\t}\n\n\t\tdata += '';\n\n\t\tdo { // unpack four hexets into three octets using index points in b64\n\t\t\th1 = b64.indexOf(data.charAt(i++));\n\t\t\th2 = b64.indexOf(data.charAt(i++));\n\t\t\th3 = b64.indexOf(data.charAt(i++));\n\t\t\th4 = b64.indexOf(data.charAt(i++));\n\n\t\t\tbits = h1 << 18 | h2 << 12 | h3 << 6 | h4;\n\n\t\t\to1 = bits >> 16 & 0xff;\n\t\t\to2 = bits >> 8 & 0xff;\n\t\t\to3 = bits & 0xff;\n\n\t\t\tif (h3 == 64) {\n\t\t\t\ttmp_arr[ac++] = String.fromCharCode(o1);\n\t\t\t} else if (h4 == 64) {\n\t\t\t\ttmp_arr[ac++] = String.fromCharCode(o1, o2);\n\t\t\t} else {\n\t\t\t\ttmp_arr[ac++] = String.fromCharCode(o1, o2, o3);\n\t\t\t}\n\t\t} while (i < data.length);\n\n\t\tdec = tmp_arr.join('');\n\n\t\treturn dec;\n\t};\n\t\n\t/**\n\tBase64 encode string (uses browser's default method if available),\n\tfrom: https://raw.github.com/kvz/phpjs/master/functions/url/base64_encode.js\n\n\t@method btoa\n\t@static\n\t@param {String} data String to encode\n\t@return {String} Base64 encoded string\n\t*/\n\tvar btoa = function(data) {\n\t\tif (typeof(window.btoa) === 'function') {\n\t\t\treturn window.btoa(data);\n\t\t}\n\n\t\t// http://kevin.vanzonneveld.net\n\t\t// +   original by: Tyler Akins (http://rumkin.com)\n\t\t// +   improved by: Bayron Guevara\n\t\t// +   improved by: Thunder.m\n\t\t// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)\n\t\t// +   bugfixed by: Pellentesque Malesuada\n\t\t// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)\n\t\t// +   improved by: Rafał Kukawski (http://kukawski.pl)\n\t\t// *     example 1: base64_encode('Kevin van Zonneveld');\n\t\t// *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='\n\t\t// mozilla has this native\n\t\t// - but breaks in 2.0.0.12!\n\t\tvar b64 = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\";\n\t\tvar o1, o2, o3, h1, h2, h3, h4, bits, i = 0,\n\t\t\tac = 0,\n\t\t\tenc = \"\",\n\t\t\ttmp_arr = [];\n\n\t\tif (!data) {\n\t\t\treturn data;\n\t\t}\n\n\t\tdo { // pack three octets into four hexets\n\t\t\to1 = data.charCodeAt(i++);\n\t\t\to2 = data.charCodeAt(i++);\n\t\t\to3 = data.charCodeAt(i++);\n\n\t\t\tbits = o1 << 16 | o2 << 8 | o3;\n\n\t\t\th1 = bits >> 18 & 0x3f;\n\t\t\th2 = bits >> 12 & 0x3f;\n\t\t\th3 = bits >> 6 & 0x3f;\n\t\t\th4 = bits & 0x3f;\n\n\t\t\t// use hexets to index into b64, and append result to encoded string\n\t\t\ttmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);\n\t\t} while (i < data.length);\n\n\t\tenc = tmp_arr.join('');\n\n\t\tvar r = data.length % 3;\n\n\t\treturn (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);\n\t};\n\n\n\treturn {\n\t\tutf8_encode: utf8_encode,\n\t\tutf8_decode: utf8_decode,\n\t\tatob: atob,\n\t\tbtoa: btoa\n\t};\n});");
__$coverInitRange("src/javascript/core/utils/Encode.js", "375:4721");
__$coverInitRange("src/javascript/core/utils/Encode.js", "571:651");
__$coverInitRange("src/javascript/core/utils/Encode.js", "796:884");
__$coverInitRange("src/javascript/core/utils/Encode.js", "1148:2878");
__$coverInitRange("src/javascript/core/utils/Encode.js", "3141:4618");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4623:4717");
__$coverInitRange("src/javascript/core/utils/Encode.js", "607:647");
__$coverInitRange("src/javascript/core/utils/Encode.js", "837:880");
__$coverInitRange("src/javascript/core/utils/Encode.js", "1178:1251");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2025:2102");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2106:2190");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2195:2226");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2231:2241");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2246:2832");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2837:2859");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2864:2874");
__$coverInitRange("src/javascript/core/utils/Encode.js", "1223:1247");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2211:2222");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2320:2354");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2359:2393");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2398:2432");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2437:2471");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2477:2518");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2524:2546");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2551:2572");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2577:2593");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2599:2803");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2619:2658");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2690:2733");
__$coverInitRange("src/javascript/core/utils/Encode.js", "2751:2798");
__$coverInitRange("src/javascript/core/utils/Encode.js", "3171:3244");
__$coverInitRange("src/javascript/core/utils/Encode.js", "3831:3908");
__$coverInitRange("src/javascript/core/utils/Encode.js", "3912:3996");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4001:4032");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4037:4494");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4499:4521");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4526:4549");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4554:4614");
__$coverInitRange("src/javascript/core/utils/Encode.js", "3216:3240");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4017:4028");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4083:4108");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4113:4138");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4143:4168");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4174:4204");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4210:4232");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4237:4259");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4264:4285");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4290:4306");
__$coverInitRange("src/javascript/core/utils/Encode.js", "4384:4465");
__$coverCall('src/javascript/core/utils/Encode.js', '375:4721');
define('moxie/core/utils/Encode', [], function () {
    __$coverCall('src/javascript/core/utils/Encode.js', '571:651');
    var utf8_encode = function (str) {
        __$coverCall('src/javascript/core/utils/Encode.js', '607:647');
        return unescape(encodeURIComponent(str));
    };
    __$coverCall('src/javascript/core/utils/Encode.js', '796:884');
    var utf8_decode = function (str_data) {
        __$coverCall('src/javascript/core/utils/Encode.js', '837:880');
        return decodeURIComponent(escape(str_data));
    };
    __$coverCall('src/javascript/core/utils/Encode.js', '1148:2878');
    var atob = function (data) {
        __$coverCall('src/javascript/core/utils/Encode.js', '1178:1251');
        if (typeof window.atob === 'function') {
            __$coverCall('src/javascript/core/utils/Encode.js', '1223:1247');
            return window.atob(data);
        }
        __$coverCall('src/javascript/core/utils/Encode.js', '2025:2102');
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        __$coverCall('src/javascript/core/utils/Encode.js', '2106:2190');
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = '', tmp_arr = [];
        __$coverCall('src/javascript/core/utils/Encode.js', '2195:2226');
        if (!data) {
            __$coverCall('src/javascript/core/utils/Encode.js', '2211:2222');
            return data;
        }
        __$coverCall('src/javascript/core/utils/Encode.js', '2231:2241');
        data += '';
        __$coverCall('src/javascript/core/utils/Encode.js', '2246:2832');
        do {
            __$coverCall('src/javascript/core/utils/Encode.js', '2320:2354');
            h1 = b64.indexOf(data.charAt(i++));
            __$coverCall('src/javascript/core/utils/Encode.js', '2359:2393');
            h2 = b64.indexOf(data.charAt(i++));
            __$coverCall('src/javascript/core/utils/Encode.js', '2398:2432');
            h3 = b64.indexOf(data.charAt(i++));
            __$coverCall('src/javascript/core/utils/Encode.js', '2437:2471');
            h4 = b64.indexOf(data.charAt(i++));
            __$coverCall('src/javascript/core/utils/Encode.js', '2477:2518');
            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
            __$coverCall('src/javascript/core/utils/Encode.js', '2524:2546');
            o1 = bits >> 16 & 255;
            __$coverCall('src/javascript/core/utils/Encode.js', '2551:2572');
            o2 = bits >> 8 & 255;
            __$coverCall('src/javascript/core/utils/Encode.js', '2577:2593');
            o3 = bits & 255;
            __$coverCall('src/javascript/core/utils/Encode.js', '2599:2803');
            if (h3 == 64) {
                __$coverCall('src/javascript/core/utils/Encode.js', '2619:2658');
                tmp_arr[ac++] = String.fromCharCode(o1);
            } else if (h4 == 64) {
                __$coverCall('src/javascript/core/utils/Encode.js', '2690:2733');
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            } else {
                __$coverCall('src/javascript/core/utils/Encode.js', '2751:2798');
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        } while (i < data.length);
        __$coverCall('src/javascript/core/utils/Encode.js', '2837:2859');
        dec = tmp_arr.join('');
        __$coverCall('src/javascript/core/utils/Encode.js', '2864:2874');
        return dec;
    };
    __$coverCall('src/javascript/core/utils/Encode.js', '3141:4618');
    var btoa = function (data) {
        __$coverCall('src/javascript/core/utils/Encode.js', '3171:3244');
        if (typeof window.btoa === 'function') {
            __$coverCall('src/javascript/core/utils/Encode.js', '3216:3240');
            return window.btoa(data);
        }
        __$coverCall('src/javascript/core/utils/Encode.js', '3831:3908');
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        __$coverCall('src/javascript/core/utils/Encode.js', '3912:3996');
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', tmp_arr = [];
        __$coverCall('src/javascript/core/utils/Encode.js', '4001:4032');
        if (!data) {
            __$coverCall('src/javascript/core/utils/Encode.js', '4017:4028');
            return data;
        }
        __$coverCall('src/javascript/core/utils/Encode.js', '4037:4494');
        do {
            __$coverCall('src/javascript/core/utils/Encode.js', '4083:4108');
            o1 = data.charCodeAt(i++);
            __$coverCall('src/javascript/core/utils/Encode.js', '4113:4138');
            o2 = data.charCodeAt(i++);
            __$coverCall('src/javascript/core/utils/Encode.js', '4143:4168');
            o3 = data.charCodeAt(i++);
            __$coverCall('src/javascript/core/utils/Encode.js', '4174:4204');
            bits = o1 << 16 | o2 << 8 | o3;
            __$coverCall('src/javascript/core/utils/Encode.js', '4210:4232');
            h1 = bits >> 18 & 63;
            __$coverCall('src/javascript/core/utils/Encode.js', '4237:4259');
            h2 = bits >> 12 & 63;
            __$coverCall('src/javascript/core/utils/Encode.js', '4264:4285');
            h3 = bits >> 6 & 63;
            __$coverCall('src/javascript/core/utils/Encode.js', '4290:4306');
            h4 = bits & 63;
            __$coverCall('src/javascript/core/utils/Encode.js', '4384:4465');
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);
        __$coverCall('src/javascript/core/utils/Encode.js', '4499:4521');
        enc = tmp_arr.join('');
        __$coverCall('src/javascript/core/utils/Encode.js', '4526:4549');
        var r = data.length % 3;
        __$coverCall('src/javascript/core/utils/Encode.js', '4554:4614');
        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    };
    __$coverCall('src/javascript/core/utils/Encode.js', '4623:4717');
    return {
        utf8_encode: utf8_encode,
        utf8_decode: utf8_decode,
        atob: atob,
        btoa: btoa
    };
});

// Included from: src/javascript/runtime/Runtime.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/Runtime.js", "/**\n * Runtime.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, laxcomma:true */\n/*global define:true */\n\ndefine('moxie/runtime/Runtime', [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/utils/Dom\",\n\t\"moxie/core/EventTarget\"\n], function(Basic, Dom, EventTarget) {\n\tvar runtimeConstructors = {}, runtimes = {};\n\n\t/**\n\tCommon set of methods and properties for every runtime instance\n\n\t@class Runtime\n\t*/\n\tfunction Runtime(type, options, caps) {\n\t\t/**\n\t\tDispatched when runtime is initialized and ready.\n\t\tResults in RuntimeInit on a connected component.\n\n\t\t@event Init\n\t\t*/\n\n\t\t/**\n\t\tDispatched when runtime fails to initialize.\n\t\tResults in RuntimeError on a connected component.\n\n\t\t@event Error\n\t\t*/\n\n\t\tvar self = this, uid = Basic.guid(type + '_');\n\n\t\t// register runtime in private hash\n\t\truntimes[uid] = this;\n\n\t\t/**\n\t\tDefault set of capabilities, which can be redifined later by specific runtime\n\n\t\t@private\n\t\t@property caps\n\t\t@type Object\n\t\t*/\n\t\tcaps = Basic.extend({\n\t\t\t// Runtime can provide access to raw binary data of the file\n\t\t\taccess_binary: false,\n\t\t\t// ... provide access to raw binary data of the image (image extension is optional) \n\t\t\taccess_image_binary: false,\n\t\t\t// ... display binary data as thumbs for example\n\t\t\tdisplay_media: false,\n\t\t\t// ... accept files dragged and dropped from the desktop\n\t\t\tdrag_and_drop: false,\n\t\t\t// ... resize image (and manipulate it raw data of any file in general)\n\t\t\tresize_image: false,\n\t\t\t// ... periodically report how many bytes of total in the file were uploaded (loaded)\n\t\t\treport_upload_progress: false,\n\t\t\t// ... provide access to the headers of http response \n\t\t\treturn_response_headers: true,\n\t\t\t// ... support response of specific type, which should be passed as an argument\n\t\t\t// e.g. runtime.can('return_response_type', 'blob')\n\t\t\treturn_response_type: false,\n\t\t\t// ... return http status code of the response\n\t\t\treturn_status_code: true,\n\t\t\t// ... send custom http header with the request\n\t\t\tsend_custom_headers: false,\n\t\t\t// ... select whole folder in file browse dialog\n\t\t\tselect_folder: false,\n\t\t\t// ... select multiple files at once in file browse dialog\n\t\t\tselect_multiple: true,\n\t\t\t// ... send raw binary data, that is generated after image resizing or manipulation of other kind\n\t\t\tsend_binary_string: false,\n\t\t\t// ... send cookies with http request and therefore retain session\n\t\t\tsend_browser_cookies: true,\n\t\t\t// ... send data formatted as multipart/form-data\n\t\t\tsend_multipart: true,\n\t\t\t// ... slice the file or blob to smaller parts\n\t\t\tslice_blob: false,\n\t\t\t// ... upload file without preloading it to memory, stream it out directly from disk\n\t\t\tstream_upload: false,\n\t\t\t// ... programmatically trigger file browse dialog\n\t\t\tsummon_file_dialog: false,\n\t\t\t// ... upload file of specific size, size should be passed as argument\n\t\t\t// e.g. runtime.can('upload_filesize', '500mb')\n\t\t\tupload_filesize: true,\n\t\t\t// ... initiate http request with specific http method, method should be passed as argument\n\t\t\t// e.g. runtime.can('use_http_method', 'put')\n\t\t\tuse_http_method: true\n\t\t}, caps);\n\n\n\t\t// public methods\n\t\tBasic.extend(this, {\n\t\t\t/**\n\t\t\tSpecifies whether runtime instance was initialized or not\n\n\t\t\t@property initialized\n\t\t\t@type {Boolean}\n\t\t\t@default false\n\t\t\t*/\n\t\t\tinitialized: false, // shims require this flag to stop initialization retries\n\n\t\t\t/**\n\t\t\tUnique ID of the runtime\n\n\t\t\t@property uid\n\t\t\t@type {String}\n\t\t\t*/\n\t\t\tuid: uid,\n\n\t\t\t/**\n\t\t\tRuntime type (e.g. flash, html5, etc)\n\n\t\t\t@property type\n\t\t\t@type {String}\n\t\t\t*/\n\t\t\ttype: type,\n\n\t\t\t/**\n\t\t\tid of the DOM container for the runtime (if available)\n\n\t\t\t@property shimid\n\t\t\t@type {String}\n\t\t\t*/\n\t\t\tshimid: uid + '_container',\n\n\t\t\t/**\n\t\t\tNumber of connected clients. If equal to zero, runtime can be destroyed\n\n\t\t\t@property clients\n\t\t\t@type {Number}\n\t\t\t*/\n\t\t\tclients: 0,\n\n\t\t\t/**\n\t\t\tRuntime initialization options\n\n\t\t\t@property options\n\t\t\t@type {Object}\n\t\t\t*/\n\t\t\toptions: options,\n\n\t\t\t/**\n\t\t\tChecks if the runtime has specific capability\n\n\t\t\t@method can\n\t\t\t@param {String} cap Name of capability to check\n\t\t\t@param {Mixed} [value] If passed, capability should somehow correlate to the value\n\t\t\t@return {Boolean} true if runtime has such capability and false, if - not\n\t\t\t*/\n\t\t\tcan: function(cap, value) {\n\t\t\t\t// if cap var is a comma-separated list of caps, convert it to object (key/value)\n\t\t\t\tif (Basic.typeOf(cap) === 'string' && Basic.typeOf(value) === 'undefined') {\n\t\t\t\t\tcap = (function(arr) {\n\t\t\t\t\t\tvar obj = {};\n\n\t\t\t\t\t\tBasic.each(arr, function(key) {\n\t\t\t\t\t\t\tobj[key] = true; // since no value supplied, we assume user meant it to be - true\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\treturn obj;\n\t\t\t\t\t}(cap.split(',')));\n\t\t\t\t}\n\n\t\t\t\tif (Basic.typeOf(cap) === 'object') {\n\t\t\t\t\tfor (var key in cap) {\n\t\t\t\t\t\tif (!this.can(key, cap[key])) {\n\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t\t// check the individual cap\n\t\t\t\tif (Basic.typeOf(caps[cap]) === 'function') {\n\t\t\t\t\treturn caps[cap].call(this, value);\n\t\t\t\t}\n\n\t\t\t\treturn caps[cap] || false;\n\t\t\t},\n\n\t\t\t/**\n\t\t\tReturns container for the runtime as DOM element\n\n\t\t\t@method getShimContainer\n\t\t\t@return {DOMElement}\n\t\t\t*/\n\t\t\tgetShimContainer: function() {\n\t\t\t\tvar container, shimContainer = Dom.get(this.shimid);\n\n\t\t\t\t// if no container for shim, create one\n\t\t\t\tif (!shimContainer) {\n\t\t\t\t\tcontainer = this.options.container ? Dom.get(this.options.container) : document.body;\n\n\t\t\t\t\t// create shim container and insert it at an absolute position into the outer container\n\t\t\t\t\tshimContainer = document.createElement('div');\n\t\t\t\t\tshimContainer.id = this.shimid;\n\t\t\t\t\tshimContainer.className = 'moxie-shim moxie-shim-' + this.type;\n\n\t\t\t\t\tBasic.extend(shimContainer.style, {\n\t\t\t\t\t\tposition: 'absolute',\n\t\t\t\t\t\ttop: '0px',\n\t\t\t\t\t\tleft: '0px',\n\t\t\t\t\t\twidth: '1px',\n\t\t\t\t\t\theight: '1px',\n\t\t\t\t\t\toverflow: 'hidden'\n\t\t\t\t\t});\n\n\t\t\t\t\tcontainer.appendChild(shimContainer);\n\t\t\t\t\tcontainer = null;\n\t\t\t\t}\n\n\t\t\t\treturn shimContainer;\n\t\t\t},\n\n\t\t\t/**\n\t\t\tReturns runtime as DOM element (if appropriate)\n\n\t\t\t@method getShim\n\t\t\t@return {DOMElement}\n\t\t\t*/\n\t\t\tgetShim: function() {\n\t\t\t\treturn Dom.get(this.uid);\n\t\t\t},\n\n\t\t\t/**\n\t\t\tOperaional interface that is used by components to invoke specific actions on the runtime\n\t\t\t(is invoked in the scope of component)\n\n\t\t\t@method exec\n\t\t\t@param {Mixed} []*\n\t\t\t@protected\n\t\t\t@return {Mixed} Depends on the action and component\n\t\t\t*/\n\t\t\texec: function(component, action) { // this is called in the context of component, not runtime\n\t\t\t\tvar args = [].slice.call(arguments, 2);\n\n\t\t\t\tif (self[component] && self[component][action]) {\n\t\t\t\t\treturn self[component][action].apply(this, args);\n\t\t\t\t}\n\t\t\t\treturn self.shimExec.apply(this, arguments);\n\t\t\t},\n\n\t\t\t/**\n\t\t\tInvokes a method within the runtime itself (might differ across the runtimes)\n\n\t\t\t@method shimExec\n\t\t\t@param {Mixed} []\n\t\t\t@protected\n\t\t\t@return {Mixed} Depends on the action and component\n\t\t\t*/\n\t\t\tshimExec: function(component, action) {\n\t\t\t\tvar args = [].slice.call(arguments, 2);\n\t\t\t\treturn self.getShim().exec(this.uid, component, action, args);\n\t\t\t},\n\n\t\t\t/**\n\t\t\tDestroys the runtime (removes all events and deletes DOM structures)\n\n\t\t\t@method destroy\n\t\t\t*/\n\t\t\tdestroy: function() {\n\t\t\t\tvar shimContainer = this.getShimContainer();\n\t\t\t\tif (shimContainer) {\n\t\t\t\t\tshimContainer.parentNode.removeChild(shimContainer);\n\t\t\t\t\tshimContainer = null;\n\t\t\t\t}\n\n\t\t\t\tthis.unbindAll();\n\t\t\t\tdelete runtimes[this.uid];\n\t\t\t\tuid = self = null;\n\t\t\t}\n\t\t});\n\t}\n\n\t/**\n\tDefault order to try different runtime types\n\n\t@property order\n\t@type String\n\t@static\n\t*/\n\tRuntime.order = 'html5,flash,silverlight,html4';\n\n\n\t/**\n\tRetrieves runtime from private hash by it's uid\n\n\t@method getRuntime\n\t@private\n\t@static\n\t@param {String} uid Unique identifier of the runtime\n\t@return {Runtime|Boolean} Returns runtime, if it exists and false, if - not\n\t*/\n\tRuntime.getRuntime = function(uid) {\n\t\treturn runtimes[uid] ? runtimes[uid] : false;\n\t};\n\n\t/**\n\tRegister constructor for the Runtime of new (or perhaps modified) type\n\n\t@method addConstructor\n\t@static\n\t@param {String} type Runtime type (e.g. flash, html5, etc)\n\t@param {Function} construct Constructor function for the Runtime\n\t*/\n\tRuntime.addConstructor = function(type, constructor) {\n\t\tconstructor.prototype = EventTarget.instance;\n\t\truntimeConstructors[type] = constructor;\n\t};\n\n\tRuntime.getConstructor = function(type) {\n\t\treturn runtimeConstructors[type] || null;\n\t};\n\n\t/**\n\tGet info about the runtime (uid, type, capabilities)\n\n\t@method getInfo\n\t@static\n\t@param {String} uid Unique identifier of the runtime\n\t@return {Mixed} Info object or null if runtime doesn't exist\n\t*/\n\tRuntime.getInfo = function(uid) {\n\t\tvar runtime = Runtime.getRuntime(uid);\n\n\t\tif (runtime) {\n\t\t\treturn {\n\t\t\t\tuid: runtime.uid,\n\t\t\t\ttype: runtime.type,\n\t\t\t\tcan: runtime.can\n\t\t\t};\n\t\t}\n\n\t\treturn null;\n\t};\n\n\treturn Runtime;\n});");
__$coverInitRange("src/javascript/runtime/Runtime.js", "360:9018");
__$coverInitRange("src/javascript/runtime/Runtime.js", "512:555");
__$coverInitRange("src/javascript/runtime/Runtime.js", "650:7633");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7733:7780");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8014:8101");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8346:8494");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8498:8586");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8796:8996");
__$coverInitRange("src/javascript/runtime/Runtime.js", "9000:9014");
__$coverInitRange("src/javascript/runtime/Runtime.js", "949:994");
__$coverInitRange("src/javascript/runtime/Runtime.js", "1037:1057");
__$coverInitRange("src/javascript/runtime/Runtime.js", "1197:3308");
__$coverInitRange("src/javascript/runtime/Runtime.js", "3334:7630");
__$coverInitRange("src/javascript/runtime/Runtime.js", "4580:4891");
__$coverInitRange("src/javascript/runtime/Runtime.js", "4898:5060");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5099:5190");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5197:5222");
__$coverInitRange("src/javascript/runtime/Runtime.js", "4662:4885");
__$coverInitRange("src/javascript/runtime/Runtime.js", "4691:4703");
__$coverInitRange("src/javascript/runtime/Runtime.js", "4712:4841");
__$coverInitRange("src/javascript/runtime/Runtime.js", "4850:4860");
__$coverInitRange("src/javascript/runtime/Runtime.js", "4751:4766");
__$coverInitRange("src/javascript/runtime/Runtime.js", "4941:5036");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5043:5054");
__$coverInitRange("src/javascript/runtime/Runtime.js", "4970:5029");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5009:5021");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5150:5184");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5387:5438");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5489:6107");
__$coverInitRange("src/javascript/runtime/Runtime.js", "6114:6134");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5516:5600");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5701:5746");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5753:5783");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5790:5852");
__$coverInitRange("src/javascript/runtime/Runtime.js", "5860:6034");
__$coverInitRange("src/javascript/runtime/Runtime.js", "6042:6078");
__$coverInitRange("src/javascript/runtime/Runtime.js", "6085:6101");
__$coverInitRange("src/javascript/runtime/Runtime.js", "6280:6304");
__$coverInitRange("src/javascript/runtime/Runtime.js", "6671:6709");
__$coverInitRange("src/javascript/runtime/Runtime.js", "6716:6825");
__$coverInitRange("src/javascript/runtime/Runtime.js", "6831:6874");
__$coverInitRange("src/javascript/runtime/Runtime.js", "6771:6819");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7135:7173");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7179:7240");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7383:7426");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7432:7542");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7549:7565");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7571:7596");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7602:7619");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7458:7509");
__$coverInitRange("src/javascript/runtime/Runtime.js", "7516:7536");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8053:8097");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8403:8447");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8451:8490");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8542:8582");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8832:8869");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8874:8976");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8981:8992");
__$coverInitRange("src/javascript/runtime/Runtime.js", "8892:8972");
__$coverCall('src/javascript/runtime/Runtime.js', '360:9018');
define('moxie/runtime/Runtime', [
    'moxie/core/utils/Basic',
    'moxie/core/utils/Dom',
    'moxie/core/EventTarget'
], function (Basic, Dom, EventTarget) {
    __$coverCall('src/javascript/runtime/Runtime.js', '512:555');
    var runtimeConstructors = {}, runtimes = {};
    __$coverCall('src/javascript/runtime/Runtime.js', '650:7633');
    function Runtime(type, options, caps) {
        __$coverCall('src/javascript/runtime/Runtime.js', '949:994');
        var self = this, uid = Basic.guid(type + '_');
        __$coverCall('src/javascript/runtime/Runtime.js', '1037:1057');
        runtimes[uid] = this;
        __$coverCall('src/javascript/runtime/Runtime.js', '1197:3308');
        caps = Basic.extend({
            access_binary: false,
            access_image_binary: false,
            display_media: false,
            drag_and_drop: false,
            resize_image: false,
            report_upload_progress: false,
            return_response_headers: true,
            return_response_type: false,
            return_status_code: true,
            send_custom_headers: false,
            select_folder: false,
            select_multiple: true,
            send_binary_string: false,
            send_browser_cookies: true,
            send_multipart: true,
            slice_blob: false,
            stream_upload: false,
            summon_file_dialog: false,
            upload_filesize: true,
            use_http_method: true
        }, caps);
        __$coverCall('src/javascript/runtime/Runtime.js', '3334:7630');
        Basic.extend(this, {
            initialized: false,
            uid: uid,
            type: type,
            shimid: uid + '_container',
            clients: 0,
            options: options,
            can: function (cap, value) {
                __$coverCall('src/javascript/runtime/Runtime.js', '4580:4891');
                if (Basic.typeOf(cap) === 'string' && Basic.typeOf(value) === 'undefined') {
                    __$coverCall('src/javascript/runtime/Runtime.js', '4662:4885');
                    cap = function (arr) {
                        __$coverCall('src/javascript/runtime/Runtime.js', '4691:4703');
                        var obj = {};
                        __$coverCall('src/javascript/runtime/Runtime.js', '4712:4841');
                        Basic.each(arr, function (key) {
                            __$coverCall('src/javascript/runtime/Runtime.js', '4751:4766');
                            obj[key] = true;
                        });
                        __$coverCall('src/javascript/runtime/Runtime.js', '4850:4860');
                        return obj;
                    }(cap.split(','));
                }
                __$coverCall('src/javascript/runtime/Runtime.js', '4898:5060');
                if (Basic.typeOf(cap) === 'object') {
                    __$coverCall('src/javascript/runtime/Runtime.js', '4941:5036');
                    for (var key in cap) {
                        __$coverCall('src/javascript/runtime/Runtime.js', '4970:5029');
                        if (!this.can(key, cap[key])) {
                            __$coverCall('src/javascript/runtime/Runtime.js', '5009:5021');
                            return false;
                        }
                    }
                    __$coverCall('src/javascript/runtime/Runtime.js', '5043:5054');
                    return true;
                }
                __$coverCall('src/javascript/runtime/Runtime.js', '5099:5190');
                if (Basic.typeOf(caps[cap]) === 'function') {
                    __$coverCall('src/javascript/runtime/Runtime.js', '5150:5184');
                    return caps[cap].call(this, value);
                }
                __$coverCall('src/javascript/runtime/Runtime.js', '5197:5222');
                return caps[cap] || false;
            },
            getShimContainer: function () {
                __$coverCall('src/javascript/runtime/Runtime.js', '5387:5438');
                var container, shimContainer = Dom.get(this.shimid);
                __$coverCall('src/javascript/runtime/Runtime.js', '5489:6107');
                if (!shimContainer) {
                    __$coverCall('src/javascript/runtime/Runtime.js', '5516:5600');
                    container = this.options.container ? Dom.get(this.options.container) : document.body;
                    __$coverCall('src/javascript/runtime/Runtime.js', '5701:5746');
                    shimContainer = document.createElement('div');
                    __$coverCall('src/javascript/runtime/Runtime.js', '5753:5783');
                    shimContainer.id = this.shimid;
                    __$coverCall('src/javascript/runtime/Runtime.js', '5790:5852');
                    shimContainer.className = 'moxie-shim moxie-shim-' + this.type;
                    __$coverCall('src/javascript/runtime/Runtime.js', '5860:6034');
                    Basic.extend(shimContainer.style, {
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden'
                    });
                    __$coverCall('src/javascript/runtime/Runtime.js', '6042:6078');
                    container.appendChild(shimContainer);
                    __$coverCall('src/javascript/runtime/Runtime.js', '6085:6101');
                    container = null;
                }
                __$coverCall('src/javascript/runtime/Runtime.js', '6114:6134');
                return shimContainer;
            },
            getShim: function () {
                __$coverCall('src/javascript/runtime/Runtime.js', '6280:6304');
                return Dom.get(this.uid);
            },
            exec: function (component, action) {
                __$coverCall('src/javascript/runtime/Runtime.js', '6671:6709');
                var args = [].slice.call(arguments, 2);
                __$coverCall('src/javascript/runtime/Runtime.js', '6716:6825');
                if (self[component] && self[component][action]) {
                    __$coverCall('src/javascript/runtime/Runtime.js', '6771:6819');
                    return self[component][action].apply(this, args);
                }
                __$coverCall('src/javascript/runtime/Runtime.js', '6831:6874');
                return self.shimExec.apply(this, arguments);
            },
            shimExec: function (component, action) {
                __$coverCall('src/javascript/runtime/Runtime.js', '7135:7173');
                var args = [].slice.call(arguments, 2);
                __$coverCall('src/javascript/runtime/Runtime.js', '7179:7240');
                return self.getShim().exec(this.uid, component, action, args);
            },
            destroy: function () {
                __$coverCall('src/javascript/runtime/Runtime.js', '7383:7426');
                var shimContainer = this.getShimContainer();
                __$coverCall('src/javascript/runtime/Runtime.js', '7432:7542');
                if (shimContainer) {
                    __$coverCall('src/javascript/runtime/Runtime.js', '7458:7509');
                    shimContainer.parentNode.removeChild(shimContainer);
                    __$coverCall('src/javascript/runtime/Runtime.js', '7516:7536');
                    shimContainer = null;
                }
                __$coverCall('src/javascript/runtime/Runtime.js', '7549:7565');
                this.unbindAll();
                __$coverCall('src/javascript/runtime/Runtime.js', '7571:7596');
                delete runtimes[this.uid];
                __$coverCall('src/javascript/runtime/Runtime.js', '7602:7619');
                uid = self = null;
            }
        });
    }
    __$coverCall('src/javascript/runtime/Runtime.js', '7733:7780');
    Runtime.order = 'html5,flash,silverlight,html4';
    __$coverCall('src/javascript/runtime/Runtime.js', '8014:8101');
    Runtime.getRuntime = function (uid) {
        __$coverCall('src/javascript/runtime/Runtime.js', '8053:8097');
        return runtimes[uid] ? runtimes[uid] : false;
    };
    __$coverCall('src/javascript/runtime/Runtime.js', '8346:8494');
    Runtime.addConstructor = function (type, constructor) {
        __$coverCall('src/javascript/runtime/Runtime.js', '8403:8447');
        constructor.prototype = EventTarget.instance;
        __$coverCall('src/javascript/runtime/Runtime.js', '8451:8490');
        runtimeConstructors[type] = constructor;
    };
    __$coverCall('src/javascript/runtime/Runtime.js', '8498:8586');
    Runtime.getConstructor = function (type) {
        __$coverCall('src/javascript/runtime/Runtime.js', '8542:8582');
        return runtimeConstructors[type] || null;
    };
    __$coverCall('src/javascript/runtime/Runtime.js', '8796:8996');
    Runtime.getInfo = function (uid) {
        __$coverCall('src/javascript/runtime/Runtime.js', '8832:8869');
        var runtime = Runtime.getRuntime(uid);
        __$coverCall('src/javascript/runtime/Runtime.js', '8874:8976');
        if (runtime) {
            __$coverCall('src/javascript/runtime/Runtime.js', '8892:8972');
            return {
                uid: runtime.uid,
                type: runtime.type,
                can: runtime.can
            };
        }
        __$coverCall('src/javascript/runtime/Runtime.js', '8981:8992');
        return null;
    };
    __$coverCall('src/javascript/runtime/Runtime.js', '9000:9014');
    return Runtime;
});

// Included from: src/javascript/runtime/RuntimeClient.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/RuntimeClient.js", "/**\n * RuntimeClient.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, loopfunc:true */\n/*global define:true */\n\ndefine('moxie/runtime/RuntimeClient', [\n\t'moxie/core/Exceptions',\n\t'moxie/core/utils/Basic',\n\t'moxie/runtime/Runtime'\n], function(x, Basic, Runtime) {\n\t/**\n\tSet of methods and properties, required by a component to acquire ability to connect to a runtime\n\n\t@class RuntimeClient\n\t*/\n\treturn function RuntimeClient() {\n\t\tvar runtime;\n\n\t\tBasic.extend(this, {\n\t\t\t/**\n\t\t\tConnects to the runtime specified by the options. Will either connect to existing runtime or create a new one.\n\t\t\tIncrements number of clients connected to the specified runtime.\n\n\t\t\t@method connectRuntime\n\t\t\t@param {Mixed} options Can be a runtme uid or a set of key-value pairs defining requirements and pre-requisites\n\t\t\t*/\n\t\t\tconnectRuntime: function(options) {\n\t\t\t\tvar comp = this, ruid;\n\n\t\t\t\tfunction initialize(items) {\n\t\t\t\t\tvar type, constructor;\n\n\t\t\t\t\t// if we ran out of runtimes\n\t\t\t\t\tif (!items.length) {\n\t\t\t\t\t\tcomp.trigger('RuntimeError', new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));\n\t\t\t\t\t\truntime = null;\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\n\t\t\t\t\ttype = items.shift();\n\t\t\t\t\tconstructor = Runtime.getConstructor(type);\n\t\t\t\t\tif (!constructor) {\n\t\t\t\t\t\tinitialize(items);\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\n\t\t\t\t\t// try initializing the runtime\n\t\t\t\t\truntime = new constructor(options);\n\n\t\t\t\t\t// if any capabilities required, check if the runtime has them\n\t\t\t\t\tif (options.required_caps && !runtime.can(options.required_caps)) {\n\t\t\t\t\t\tinitialize(items);\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\n\t\t\t\t\truntime.bind('Init', function() {\n\t\t\t\t\t\t// mark runtime as initialized\n\t\t\t\t\t\truntime.initialized = true;\n\n\t\t\t\t\t\t// jailbreak ...\n\t\t\t\t\t\tsetTimeout(function() {\n\t\t\t\t\t\t\truntime.clients++;\n\t\t\t\t\t\t\t// this will be triggered on component\n\t\t\t\t\t\t\tcomp.trigger('RuntimeInit', runtime);\n\t\t\t\t\t\t}, 1);\n\t\t\t\t\t});\n\n\t\t\t\t\truntime.bind('Error', function(e, err) {\n\t\t\t\t\t\truntime.destroy(); // runtime cannot destroy itself from inside at a right moment, thus we do it here\n\t\t\t\t\t\tinitialize(items);\n\t\t\t\t\t});\n\n\t\t\t\t\t/*runtime.bind('Exception', function() { });*/\n\n\t\t\t\t\truntime.init();\n\t\t\t\t}\n\n\t\t\t\t// check if a particular runtime was requested\n\t\t\t\tif (Basic.typeOf(options) === 'string') {\n\t\t\t\t\truid = options;\n\t\t\t\t} else if (Basic.typeOf(options.ruid) === 'string') {\n\t\t\t\t\truid = options.ruid;\n\t\t\t\t}\n\n\t\t\t\tif (ruid) {\n\t\t\t\t\truntime = Runtime.getRuntime(ruid);\n\t\t\t\t\tif (runtime) {\n\t\t\t\t\t\truntime.clients++;\n\t\t\t\t\t\treturn runtime;\n\t\t\t\t\t} else {\n\t\t\t\t\t\t// there should be a runtime and there's none - weird case\n\t\t\t\t\t\tthrow new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\t// initialize a fresh one, that fits runtime list and required features best\n\t\t\t\tinitialize((options.runtime_order || Runtime.order).split(/\\s*,\\s*/));\n\t\t\t},\n\n\t\t\t/**\n\t\t\tReturns the runtime to which the client is currently connected.\n\n\t\t\t@method getRuntime\n\t\t\t@return {Runtime} Runtime or null if client is not connected\n\t\t\t*/\n\t\t\tgetRuntime: function() {\n\t\t\t\treturn runtime || null;\n\t\t\t},\n\n\t\t\t/**\n\t\t\tDisconnects from the runtime. Decrements number of clients connected to the specified runtime.\n\n\t\t\t@method disconnectRuntime\n\t\t\t*/\n\t\t\tdisconnectRuntime: function() {\n\t\t\t\tif (runtime && --runtime.clients <= 0) {\n\t\t\t\t\truntime.destroy();\n\t\t\t\t\truntime = null;\n\t\t\t\t}\n\t\t\t}\n\n\t\t});\n\t};\n\n\n});");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "366:3538");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "649:3532");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "685:696");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "701:3528");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1102:1123");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1130:2363");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2421:2572");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2579:2850");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2938:3007");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1164:1185");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1227:1374");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1382:1402");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1409:1451");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1458:1522");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1567:1601");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1677:1789");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1797:2093");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2101:2282");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2343:2357");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1254:1331");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1339:1353");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1361:1367");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1484:1501");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1509:1515");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1751:1768");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1776:1782");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1874:1900");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1932:2084");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "1963:1980");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2035:2071");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2148:2165");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2256:2273");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2468:2482");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2547:2566");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2596:2630");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2637:2844");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2658:2675");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2683:2697");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "2784:2837");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "3215:3237");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "3426:3516");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "3472:3489");
__$coverInitRange("src/javascript/runtime/RuntimeClient.js", "3496:3510");
__$coverCall('src/javascript/runtime/RuntimeClient.js', '366:3538');
define('moxie/runtime/RuntimeClient', [
    'moxie/core/Exceptions',
    'moxie/core/utils/Basic',
    'moxie/runtime/Runtime'
], function (x, Basic, Runtime) {
    __$coverCall('src/javascript/runtime/RuntimeClient.js', '649:3532');
    return function RuntimeClient() {
        __$coverCall('src/javascript/runtime/RuntimeClient.js', '685:696');
        var runtime;
        __$coverCall('src/javascript/runtime/RuntimeClient.js', '701:3528');
        Basic.extend(this, {
            connectRuntime: function (options) {
                __$coverCall('src/javascript/runtime/RuntimeClient.js', '1102:1123');
                var comp = this, ruid;
                __$coverCall('src/javascript/runtime/RuntimeClient.js', '1130:2363');
                function initialize(items) {
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '1164:1185');
                    var type, constructor;
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '1227:1374');
                    if (!items.length) {
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '1254:1331');
                        comp.trigger('RuntimeError', new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '1339:1353');
                        runtime = null;
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '1361:1367');
                        return;
                    }
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '1382:1402');
                    type = items.shift();
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '1409:1451');
                    constructor = Runtime.getConstructor(type);
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '1458:1522');
                    if (!constructor) {
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '1484:1501');
                        initialize(items);
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '1509:1515');
                        return;
                    }
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '1567:1601');
                    runtime = new constructor(options);
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '1677:1789');
                    if (options.required_caps && !runtime.can(options.required_caps)) {
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '1751:1768');
                        initialize(items);
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '1776:1782');
                        return;
                    }
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '1797:2093');
                    runtime.bind('Init', function () {
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '1874:1900');
                        runtime.initialized = true;
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '1932:2084');
                        setTimeout(function () {
                            __$coverCall('src/javascript/runtime/RuntimeClient.js', '1963:1980');
                            runtime.clients++;
                            __$coverCall('src/javascript/runtime/RuntimeClient.js', '2035:2071');
                            comp.trigger('RuntimeInit', runtime);
                        }, 1);
                    });
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '2101:2282');
                    runtime.bind('Error', function (e, err) {
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '2148:2165');
                        runtime.destroy();
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '2256:2273');
                        initialize(items);
                    });
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '2343:2357');
                    runtime.init();
                }
                __$coverCall('src/javascript/runtime/RuntimeClient.js', '2421:2572');
                if (Basic.typeOf(options) === 'string') {
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '2468:2482');
                    ruid = options;
                } else if (Basic.typeOf(options.ruid) === 'string') {
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '2547:2566');
                    ruid = options.ruid;
                }
                __$coverCall('src/javascript/runtime/RuntimeClient.js', '2579:2850');
                if (ruid) {
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '2596:2630');
                    runtime = Runtime.getRuntime(ruid);
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '2637:2844');
                    if (runtime) {
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '2658:2675');
                        runtime.clients++;
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '2683:2697');
                        return runtime;
                    } else {
                        __$coverCall('src/javascript/runtime/RuntimeClient.js', '2784:2837');
                        throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);
                    }
                }
                __$coverCall('src/javascript/runtime/RuntimeClient.js', '2938:3007');
                initialize((options.runtime_order || Runtime.order).split(/\s*,\s*/));
            },
            getRuntime: function () {
                __$coverCall('src/javascript/runtime/RuntimeClient.js', '3215:3237');
                return runtime || null;
            },
            disconnectRuntime: function () {
                __$coverCall('src/javascript/runtime/RuntimeClient.js', '3426:3516');
                if (runtime && --runtime.clients <= 0) {
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '3472:3489');
                    runtime.destroy();
                    __$coverCall('src/javascript/runtime/RuntimeClient.js', '3496:3510');
                    runtime = null;
                }
            }
        });
    };
});

// Included from: src/javascript/file/Blob.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/file/Blob.js", "/**\n * Blob.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/file/Blob', [\n\t'moxie/core/utils/Basic',\n\t'moxie/core/utils/Encode',\n\t'moxie/runtime/RuntimeClient'\n], function(Basic, Encode, RuntimeClient) {\n\t\n\tvar blobpool = {};\n\n\t/**\n\t@class Blob\n\t@constructor\n\t@param {String} ruid Unique id of the runtime, to which this blob belongs to\n\t@param {Object} blob Object \"Native\" blob object, as it is represented in the runtime\n\t*/\n\tfunction Blob(ruid, blob) {\n\n\t\tfunction _sliceDetached(start, end, type) {\n\t\t\tvar blob, data = blobpool[this.uid];\n\n\t\t\tif (Basic.typeOf(data) !== 'string' || !data.length) {\n\t\t\t\treturn null; // or throw exception\n\t\t\t}\n\n\t\t\tblob = new Blob(null, {\n\t\t\t\ttype: type,\n\t\t\t\tsize: end - start\n\t\t\t});\n\t\t\tblob.detach(data.substr(start, blob.size));\n\n\t\t\treturn blob;\n\t\t}\n\n\t\tfunction _getRuntime() {\n\t\t\tif (Basic.typeOf(this.connectRuntime) !== 'function') {\t\t\n\t\t\t\tRuntimeClient.call(this);\n\t\t\t}\n\t\t\treturn this.connectRuntime(this.ruid);\n\t\t}\n\n\n\t\tif (!blob) {\n\t\t\tblob = {};\n\t\t} else if (Basic.typeOf(blob) === 'string') { // dataUrl or binary string\n\t\t\tblob = { data: blob };\n\t\t}\n\n\t\tBasic.extend(this, {\n\t\t\t\n\t\t\t/**\n\t\t\tUnique id of the component\n\n\t\t\t@property uid\n\t\t\t@type {String}\n\t\t\t*/\n\t\t\tuid: blob.uid || Basic.guid('uid_'),\n\t\t\t\n\t\t\t/**\n\t\t\tUnique id of the connected runtime, if falsy, then runtime will have to be initialized \n\t\t\tbefore this Blob can be used, modified or sent\n\n\t\t\t@property ruid\n\t\t\t@type {String}\n\t\t\t*/\n\t\t\truid: ruid,\n\t\n\t\t\t/**\n\t\t\tSize of blob\n\n\t\t\t@property size\n\t\t\t@type {Number}\n\t\t\t@default 0\n\t\t\t*/\n\t\t\tsize: blob.size || 0,\n\t\t\t\n\t\t\t/**\n\t\t\tMime type of blob\n\n\t\t\t@property type\n\t\t\t@type {String}\n\t\t\t@default ''\n\t\t\t*/\n\t\t\ttype: blob.type || '',\n\t\t\t\n\t\t\t/**\n\t\t\t@method slice\n\t\t\t@param {Number} [start=0]\n\t\t\t*/\n\t\t\tslice: function(start, end, type) {\t\t\n\t\t\t\tif (this.isDetached()) {\n\t\t\t\t\treturn _sliceDetached.apply(this, arguments);\n\t\t\t\t}\n\t\t\t\treturn _getRuntime.call(this).exec.call(this, 'Blob', 'slice', this.getSource(), start, end, type);\n\t\t\t},\n\n\t\t\t/**\n\t\t\tReturns \"native\" blob object (as it is represented in connected runtime) or null if not found\n\n\t\t\t@method getSource\n\t\t\t@return {Blob} Returns \"native\" blob object or null if not found\n\t\t\t*/\n\t\t\tgetSource: function() {\n\t\t\t\tif (!blobpool[this.uid]) {\n\t\t\t\t\treturn null;\t\n\t\t\t\t}\n\t\t\t\treturn blobpool[this.uid];\n\t\t\t},\n\n\t\t\t/** \n\t\t\tDetaches blob from any runtime that it depends on and initialize with standalone value\n\n\t\t\t@method detach\n\t\t\t@protected\n\t\t\t@param {DOMString} [data=''] Standalone value\n\t\t\t*/\n\t\t\tdetach: function(data) {\n\t\t\t\tif (this.ruid) {\n\t\t\t\t\t_getRuntime.call(this).exec.call(this, 'Blob', 'destroy', blobpool[this.uid]);\n\t\t\t\t\tthis.disconnectRuntime();\n\t\t\t\t\tthis.ruid = null;\n\t\t\t\t}\n\n\t\t\t\tdata = data || '';\n\n\t\t\t\t// if dataUrl, convert to binary string\n\t\t\t\tvar matches = data.match(/^data:([^;]*);base64,/);\n\t\t\t\tif (matches) {\n\t\t\t\t\tthis.type = matches[1];\n\t\t\t\t\tdata = Encode.atob(data.substring(data.indexOf('base64,') + 7));\n\t\t\t\t}\n\n\t\t\t\tthis.size = data.length;\n\n\t\t\t\tblobpool[this.uid] = data;\n\t\t\t},\n\n\t\t\t/**\n\t\t\tChecks if blob is standalone (detached of any runtime)\n\t\t\t\n\t\t\t@method isDetached\n\t\t\t@protected\n\t\t\t@return {Boolean}\n\t\t\t*/\n\t\t\tisDetached: function() {\n\t\t\t\treturn !this.ruid && Basic.typeOf(blobpool[this.uid]) === 'string';\n\t\t\t},\n\t\t\t\n\t\t\t/** \n\t\t\tDestroy Blob and free any resources it was using\n\n\t\t\t@method destroy\n\t\t\t*/\n\t\t\tdestroy: function() {\n\t\t\t\tthis.detach();\n\t\t\t\tdelete blobpool[this.uid];\n\t\t\t}\n\t\t});\n\n\t\t\n\t\tif (blob.data) {\n\t\t\tthis.detach(blob.data); // auto-detach if payload has been passed\n\t\t} else {\n\t\t\tblobpool[this.uid] = blob;\t\n\t\t}\n\t}\n\t\n\treturn Blob;\n});");
__$coverInitRange("src/javascript/file/Blob.js", "342:3862");
__$coverInitRange("src/javascript/file/Blob.js", "503:520");
__$coverInitRange("src/javascript/file/Blob.js", "725:3842");
__$coverInitRange("src/javascript/file/Blob.js", "3847:3858");
__$coverInitRange("src/javascript/file/Blob.js", "756:1082");
__$coverInitRange("src/javascript/file/Blob.js", "1087:1252");
__$coverInitRange("src/javascript/file/Blob.js", "1258:1389");
__$coverInitRange("src/javascript/file/Blob.js", "1394:3701");
__$coverInitRange("src/javascript/file/Blob.js", "3709:3839");
__$coverInitRange("src/javascript/file/Blob.js", "803:838");
__$coverInitRange("src/javascript/file/Blob.js", "844:941");
__$coverInitRange("src/javascript/file/Blob.js", "947:1014");
__$coverInitRange("src/javascript/file/Blob.js", "1019:1061");
__$coverInitRange("src/javascript/file/Blob.js", "1067:1078");
__$coverInitRange("src/javascript/file/Blob.js", "903:914");
__$coverInitRange("src/javascript/file/Blob.js", "1115:1206");
__$coverInitRange("src/javascript/file/Blob.js", "1211:1248");
__$coverInitRange("src/javascript/file/Blob.js", "1177:1201");
__$coverInitRange("src/javascript/file/Blob.js", "1274:1283");
__$coverInitRange("src/javascript/file/Blob.js", "1364:1385");
__$coverInitRange("src/javascript/file/Blob.js", "2079:2159");
__$coverInitRange("src/javascript/file/Blob.js", "2165:2263");
__$coverInitRange("src/javascript/file/Blob.js", "2109:2153");
__$coverInitRange("src/javascript/file/Blob.js", "2503:2553");
__$coverInitRange("src/javascript/file/Blob.js", "2559:2584");
__$coverInitRange("src/javascript/file/Blob.js", "2535:2546");
__$coverInitRange("src/javascript/file/Blob.js", "2811:2970");
__$coverInitRange("src/javascript/file/Blob.js", "2977:2994");
__$coverInitRange("src/javascript/file/Blob.js", "3045:3094");
__$coverInitRange("src/javascript/file/Blob.js", "3100:3218");
__$coverInitRange("src/javascript/file/Blob.js", "3225:3248");
__$coverInitRange("src/javascript/file/Blob.js", "3255:3280");
__$coverInitRange("src/javascript/file/Blob.js", "2833:2910");
__$coverInitRange("src/javascript/file/Blob.js", "2917:2941");
__$coverInitRange("src/javascript/file/Blob.js", "2948:2964");
__$coverInitRange("src/javascript/file/Blob.js", "3120:3142");
__$coverInitRange("src/javascript/file/Blob.js", "3149:3212");
__$coverInitRange("src/javascript/file/Blob.js", "3453:3519");
__$coverInitRange("src/javascript/file/Blob.js", "3646:3659");
__$coverInitRange("src/javascript/file/Blob.js", "3665:3690");
__$coverInitRange("src/javascript/file/Blob.js", "3729:3751");
__$coverInitRange("src/javascript/file/Blob.js", "3809:3834");
__$coverCall('src/javascript/file/Blob.js', '342:3862');
define('moxie/file/Blob', [
    'moxie/core/utils/Basic',
    'moxie/core/utils/Encode',
    'moxie/runtime/RuntimeClient'
], function (Basic, Encode, RuntimeClient) {
    __$coverCall('src/javascript/file/Blob.js', '503:520');
    var blobpool = {};
    __$coverCall('src/javascript/file/Blob.js', '725:3842');
    function Blob(ruid, blob) {
        __$coverCall('src/javascript/file/Blob.js', '756:1082');
        function _sliceDetached(start, end, type) {
            __$coverCall('src/javascript/file/Blob.js', '803:838');
            var blob, data = blobpool[this.uid];
            __$coverCall('src/javascript/file/Blob.js', '844:941');
            if (Basic.typeOf(data) !== 'string' || !data.length) {
                __$coverCall('src/javascript/file/Blob.js', '903:914');
                return null;
            }
            __$coverCall('src/javascript/file/Blob.js', '947:1014');
            blob = new Blob(null, {
                type: type,
                size: end - start
            });
            __$coverCall('src/javascript/file/Blob.js', '1019:1061');
            blob.detach(data.substr(start, blob.size));
            __$coverCall('src/javascript/file/Blob.js', '1067:1078');
            return blob;
        }
        __$coverCall('src/javascript/file/Blob.js', '1087:1252');
        function _getRuntime() {
            __$coverCall('src/javascript/file/Blob.js', '1115:1206');
            if (Basic.typeOf(this.connectRuntime) !== 'function') {
                __$coverCall('src/javascript/file/Blob.js', '1177:1201');
                RuntimeClient.call(this);
            }
            __$coverCall('src/javascript/file/Blob.js', '1211:1248');
            return this.connectRuntime(this.ruid);
        }
        __$coverCall('src/javascript/file/Blob.js', '1258:1389');
        if (!blob) {
            __$coverCall('src/javascript/file/Blob.js', '1274:1283');
            blob = {};
        } else if (Basic.typeOf(blob) === 'string') {
            __$coverCall('src/javascript/file/Blob.js', '1364:1385');
            blob = { data: blob };
        }
        __$coverCall('src/javascript/file/Blob.js', '1394:3701');
        Basic.extend(this, {
            uid: blob.uid || Basic.guid('uid_'),
            ruid: ruid,
            size: blob.size || 0,
            type: blob.type || '',
            slice: function (start, end, type) {
                __$coverCall('src/javascript/file/Blob.js', '2079:2159');
                if (this.isDetached()) {
                    __$coverCall('src/javascript/file/Blob.js', '2109:2153');
                    return _sliceDetached.apply(this, arguments);
                }
                __$coverCall('src/javascript/file/Blob.js', '2165:2263');
                return _getRuntime.call(this).exec.call(this, 'Blob', 'slice', this.getSource(), start, end, type);
            },
            getSource: function () {
                __$coverCall('src/javascript/file/Blob.js', '2503:2553');
                if (!blobpool[this.uid]) {
                    __$coverCall('src/javascript/file/Blob.js', '2535:2546');
                    return null;
                }
                __$coverCall('src/javascript/file/Blob.js', '2559:2584');
                return blobpool[this.uid];
            },
            detach: function (data) {
                __$coverCall('src/javascript/file/Blob.js', '2811:2970');
                if (this.ruid) {
                    __$coverCall('src/javascript/file/Blob.js', '2833:2910');
                    _getRuntime.call(this).exec.call(this, 'Blob', 'destroy', blobpool[this.uid]);
                    __$coverCall('src/javascript/file/Blob.js', '2917:2941');
                    this.disconnectRuntime();
                    __$coverCall('src/javascript/file/Blob.js', '2948:2964');
                    this.ruid = null;
                }
                __$coverCall('src/javascript/file/Blob.js', '2977:2994');
                data = data || '';
                __$coverCall('src/javascript/file/Blob.js', '3045:3094');
                var matches = data.match(/^data:([^;]*);base64,/);
                __$coverCall('src/javascript/file/Blob.js', '3100:3218');
                if (matches) {
                    __$coverCall('src/javascript/file/Blob.js', '3120:3142');
                    this.type = matches[1];
                    __$coverCall('src/javascript/file/Blob.js', '3149:3212');
                    data = Encode.atob(data.substring(data.indexOf('base64,') + 7));
                }
                __$coverCall('src/javascript/file/Blob.js', '3225:3248');
                this.size = data.length;
                __$coverCall('src/javascript/file/Blob.js', '3255:3280');
                blobpool[this.uid] = data;
            },
            isDetached: function () {
                __$coverCall('src/javascript/file/Blob.js', '3453:3519');
                return !this.ruid && Basic.typeOf(blobpool[this.uid]) === 'string';
            },
            destroy: function () {
                __$coverCall('src/javascript/file/Blob.js', '3646:3659');
                this.detach();
                __$coverCall('src/javascript/file/Blob.js', '3665:3690');
                delete blobpool[this.uid];
            }
        });
        __$coverCall('src/javascript/file/Blob.js', '3709:3839');
        if (blob.data) {
            __$coverCall('src/javascript/file/Blob.js', '3729:3751');
            this.detach(blob.data);
        } else {
            __$coverCall('src/javascript/file/Blob.js', '3809:3834');
            blobpool[this.uid] = blob;
        }
    }
    __$coverCall('src/javascript/file/Blob.js', '3847:3858');
    return Blob;
});

// Included from: src/javascript/file/File.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/file/File.js", "/**\n * File.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/file/File', [\n\t'moxie/core/utils/Basic',\n\t'moxie/core/utils/Mime',\n\t'moxie/file/Blob'\n], function(Basic, Mime, Blob) {\n\t/**\n\t@class File\n\t@extends Blob\n\t@constructor\n\t@param {String} ruid Unique id of the runtime, to which this blob belongs to\n\t@param {Object} file Object \"Native\" file object, as it is represented in the runtime\n\t*/\n\tfunction File(ruid, file) {\n\t\tvar name, type;\n\n\t\tif (!file) { // avoid extra errors in case we overlooked something\n\t\t\tfile = {};\n\t\t}\n\n\t\t// figure out the type\n\t\tif (file.type && file.type !== '') {\n\t\t\ttype = file.type;\n\t\t} else {\n\t\t\ttype = Mime.getFileMime(file.name);\n\t\t}\n\n\t\t// sanitize file name or generate new one\n\t\tif (file.name) {\n\t\t\tname = file.name.replace(/\\\\/g, '/');\n\t\t\tname = name.substr(name.lastIndexOf('/') + 1);\n\t\t} else {\n\t\t\tvar prefix = type.split('/')[0];\n\t\t\tname = Basic.guid((prefix !== '' ? prefix : 'file') + '_');\n\t\t\t\n\t\t\tif (Mime.extensions[type]) {\n\t\t\t\tname += '.' + Mime.extensions[type][0]; // append proper extension if possible\n\t\t\t}\n\t\t}\n\n\t\tBlob.apply(this, arguments);\n\t\t\n\t\tBasic.extend(this, {\n\t\t\ttype: type || '',\n\n\t\t\t/**\n\t\t\tFile name\n\n\t\t\t@property name\n\t\t\t@type {String}\n\t\t\t@default ''\n\t\t\t*/\n\t\t\tname: name || Basic.guid('file_'),\n\t\t\t\n\t\t\t/**\n\t\t\tDate of last modification\n\n\t\t\t@property name\n\t\t\t@type {String}\n\t\t\t@default now\n\t\t\t*/\n\t\t\tlastModifiedDate: file.lastModifiedDate || (new Date()).toLocaleString() // Thu Aug 23 2012 19:40:00 GMT+0400 (GET)\n\t\t});\n\t}\n\n\tFile.prototype = Blob.prototype;\n\n\treturn File;\n});");
__$coverInitRange("src/javascript/file/File.js", "342:1834");
__$coverInitRange("src/javascript/file/File.js", "692:1780");
__$coverInitRange("src/javascript/file/File.js", "1784:1815");
__$coverInitRange("src/javascript/file/File.js", "1819:1830");
__$coverInitRange("src/javascript/file/File.js", "722:736");
__$coverInitRange("src/javascript/file/File.js", "741:824");
__$coverInitRange("src/javascript/file/File.js", "854:964");
__$coverInitRange("src/javascript/file/File.js", "1013:1357");
__$coverInitRange("src/javascript/file/File.js", "1362:1389");
__$coverInitRange("src/javascript/file/File.js", "1396:1777");
__$coverInitRange("src/javascript/file/File.js", "811:820");
__$coverInitRange("src/javascript/file/File.js", "894:910");
__$coverInitRange("src/javascript/file/File.js", "926:960");
__$coverInitRange("src/javascript/file/File.js", "1033:1069");
__$coverInitRange("src/javascript/file/File.js", "1074:1119");
__$coverInitRange("src/javascript/file/File.js", "1135:1166");
__$coverInitRange("src/javascript/file/File.js", "1171:1229");
__$coverInitRange("src/javascript/file/File.js", "1238:1353");
__$coverInitRange("src/javascript/file/File.js", "1271:1309");
__$coverCall('src/javascript/file/File.js', '342:1834');
define('moxie/file/File', [
    'moxie/core/utils/Basic',
    'moxie/core/utils/Mime',
    'moxie/file/Blob'
], function (Basic, Mime, Blob) {
    __$coverCall('src/javascript/file/File.js', '692:1780');
    function File(ruid, file) {
        __$coverCall('src/javascript/file/File.js', '722:736');
        var name, type;
        __$coverCall('src/javascript/file/File.js', '741:824');
        if (!file) {
            __$coverCall('src/javascript/file/File.js', '811:820');
            file = {};
        }
        __$coverCall('src/javascript/file/File.js', '854:964');
        if (file.type && file.type !== '') {
            __$coverCall('src/javascript/file/File.js', '894:910');
            type = file.type;
        } else {
            __$coverCall('src/javascript/file/File.js', '926:960');
            type = Mime.getFileMime(file.name);
        }
        __$coverCall('src/javascript/file/File.js', '1013:1357');
        if (file.name) {
            __$coverCall('src/javascript/file/File.js', '1033:1069');
            name = file.name.replace(/\\/g, '/');
            __$coverCall('src/javascript/file/File.js', '1074:1119');
            name = name.substr(name.lastIndexOf('/') + 1);
        } else {
            __$coverCall('src/javascript/file/File.js', '1135:1166');
            var prefix = type.split('/')[0];
            __$coverCall('src/javascript/file/File.js', '1171:1229');
            name = Basic.guid((prefix !== '' ? prefix : 'file') + '_');
            __$coverCall('src/javascript/file/File.js', '1238:1353');
            if (Mime.extensions[type]) {
                __$coverCall('src/javascript/file/File.js', '1271:1309');
                name += '.' + Mime.extensions[type][0];
            }
        }
        __$coverCall('src/javascript/file/File.js', '1362:1389');
        Blob.apply(this, arguments);
        __$coverCall('src/javascript/file/File.js', '1396:1777');
        Basic.extend(this, {
            type: type || '',
            name: name || Basic.guid('file_'),
            lastModifiedDate: file.lastModifiedDate || new Date().toLocaleString()
        });
    }
    __$coverCall('src/javascript/file/File.js', '1784:1815');
    File.prototype = Blob.prototype;
    __$coverCall('src/javascript/file/File.js', '1819:1830');
    return File;
});

// Included from: src/javascript/file/FileInput.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/file/FileInput.js", "/**\n * FileInput.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/file/FileInput', [\n\t'moxie/core/utils/Basic',\n\t'moxie/core/utils/Mime',\n\t'moxie/core/utils/Dom',\n\t'moxie/core/Exceptions',\n\t'moxie/core/EventTarget',\n\t'moxie/core/I18n',\n\t'moxie/file/File',\n\t'moxie/runtime/RuntimeClient'\n], function(Basic, Mime, Dom, x, EventTarget, I18n, File, RuntimeClient) {\n\t/**\n\tProvides a convenient way to create cross-browser file-picker. Generates file selection dialog on click,\n\tconverts selected files to mOxie.File objects, to be used in conjunction with _mOxie.Image_, preloaded in memory\n\twith _mOxie.FileReader_ or uploaded to a server through _mOxie.XMLHttpRequest_.\n\n\t@class FileInput\n\t@constructor\n\t@extends EventTarget\n\t@uses RuntimeClient\n\t@param {Object|String} options If options has typeof string, argument is considered as options.browse_button\n\t@param {String|DOMElement} options.browse_button DOM Element to turn into file picker\n\t@param {Array} [options.accept] Array of mime types to accept. By default accepts all\n\t@param {String} [options.file='file'] Name of the file field (not the filename)\n\t@param {Boolean} [options.multiple=false] Enable selection of multiple files\n\t@param {Boolean} [options.directory=false] Turn file input into the folder input (cannot be both at the same time)\n\t@param {String|DOMElement} [options.container] DOM Element to use as acontainer for file-picker. Defaults to parentNode for options.browse_button\n\t@param {Object|String} [options.required_caps] Set of required capabilities, that chosen runtime must support\n\n\t@example\n\t\t<div id=\"container\">\n\t\t\t<a id=\"file-picker\" href=\"javascript:;\">Browse...</a>\n\t\t</div>\n\n\t\t<script>\n\t\t\tvar fileInput = new mOxie.FileInput({\n\t\t\t\tbrowse_button: 'file-picker', // or document.getElementById('file-picker')\n\t\t\t\tcontainer: 'container'\n\t\t\t\taccept: [\n\t\t\t\t\t{title: \"Image files\", extensions: \"jpg,gif,png\"} // accept only images\n\t\t\t\t],\n\t\t\t\tmultiple: true // allow multiple file selection\n\t\t\t});\n\n\t\t\tfileInput.onchange = function(e) {\n\t\t\t\t// do something to files array\n\t\t\t\tconsole.info(e.target.files); // or this.files or fileInput.files\n\t\t\t};\n\n\t\t\tfileInput.init(); // initialize\n\t\t</script>\n\t*/\n\tvar dispatches = [\n\t\t/**\n\t\tDispatched when runtime is connected and file-picker is ready to be used.\n\n\t\t@event ready\n\t\t@param {Object} event\n\t\t*/\n\t\t'ready',\n\n\t\t/**\n\t\tDispatched when selection of files in the dialog is complete.\n\n\t\t@event change\n\t\t@param {Object} event\n\t\t*/\n\t\t'change',\n\n\t\t'cancel', // TODO: might be useful\n\n\t\t/**\n\t\tDispatched when mouse cursor enters file-picker area. Can be used to style element\n\t\taccordingly.\n\n\t\t@event mouseenter\n\t\t@param {Object} event\n\t\t*/\n\t\t'mouseenter',\n\n\t\t/**\n\t\tDispatched when mouse cursor leaves file-picker area. Can be used to style element\n\t\taccordingly.\n\n\t\t@event mouseleave\n\t\t@param {Object} event\n\t\t*/\n\t\t'mouseleave',\n\n\t\t/**\n\t\tDispatched when functional mouse button is pressed on top of file-picker area.\n\n\t\t@event mousedown\n\t\t@param {Object} event\n\t\t*/\n\t\t'mousedown',\n\n\t\t/**\n\t\tDispatched when functional mouse button is released on top of file-picker area.\n\n\t\t@event mouseup\n\t\t@param {Object} event\n\t\t*/\n\t\t'mouseup'\n\t];\n\n\tfunction FileInput(options) {\n\t\tvar self = this,\n\t\t\tcontainer, browseButton, defaults;\n\n\t\t// if flat argument passed it should be browse_button id\n\t\tif (typeof(options) === 'string') {\n\t\t\toptions = { browse_button : options };\n\t\t}\n\n\t\t// this will help us to find proper default container\n\t\tbrowseButton = Dom.get(options.browse_button);\n\t\tif (!browseButton) {\n\t\t\t// browse button is required\n\t\t\tthrow new x.DOMException(x.DOMException.NOT_FOUND_ERR);\n\t\t}\n\n\t\t// figure out the options\n\t\tdefaults = {\n\t\t\taccept: [{\n\t\t\t\ttitle: I18n.translate('All Files'),\n\t\t\t\textensions: '*'\n\t\t\t}],\n\t\t\tname: 'file',\n\t\t\tmultiple: false,\n\t\t\trequired_caps: false,\n\t\t\tcontainer: browseButton.parentNode || document.body\n\t\t};\n\t\t\n\t\toptions = typeof(options) === 'object' ? Basic.extend({}, defaults, options) : defaults;\n\t\t\t\t\t\n\t\t// normalize accept option (could be list of mime types or array of title/extensions pairs)\n\t\tif (typeof(options.accept) === 'string') {\n\t\t\toptions.accept = Mime.mimes2extList(options.accept);\n\t\t}\n\n\t\tcontainer = Dom.get(options.container);\n\t\t// make sure we have container\n\t\tif (!container) {\n\t\t\tcontainer = document.body;\n\t\t}\n\n\t\t// make container relative, if it's not\n\t\tif (Dom.getStyle(container, 'position') === 'static') {\n\t\t\tcontainer.style.position = 'relative';\n\t\t}\n\n\t\tcontainer = browseButton = null; // IE\n\t\t\t\t\t\t\n\t\tRuntimeClient.call(self);\n\t\t\n\t\tBasic.extend(self, {\n\t\t\t/**\n\t\t\tUnique id of the component\n\n\t\t\t@property uid\n\t\t\t@protected\n\t\t\t@readOnly\n\t\t\t@type {String}\n\t\t\t@default UID\n\t\t\t*/\n\t\t\tuid: Basic.guid('uid_'),\n\t\t\t\n\t\t\t/**\n\t\t\tUnique id of the connected runtime, if any.\n\n\t\t\t@property ruid\n\t\t\t@protected\n\t\t\t@type {String}\n\t\t\t*/\n\t\t\truid: null,\n\t\t\t\n\t\t\t/**\n\t\t\tArray of selected mOxie.File objects\n\n\t\t\t@property files\n\t\t\t@type {Array}\n\t\t\t@default null\n\t\t\t*/\n\t\t\tfiles: null,\n\n\t\t\t/**\n\t\t\tInitializes the file-picker, connects it to runtime and dispatches event ready when done.\n\n\t\t\t@method init\n\t\t\t*/\n\t\t\tinit: function() {\n\t\t\t\tself.convertEventPropsToHandlers(dispatches);\n\n\t\t\t\tself.bind('RuntimeInit', function(e, runtime) {\n\t\t\t\t\tself.ruid = runtime.uid;\n\n\t\t\t\t\tself.bind(\"Change\", function() {\n\t\t\t\t\t\tvar files = runtime.exec.call(self, 'FileInput', 'getFiles');\n\n\t\t\t\t\t\tself.files = [];\n\n\t\t\t\t\t\tBasic.each(files, function(file) {\n\t\t\t\t\t\t\truntime.clients++;\n\t\t\t\t\t\t\tself.files.push(new File(self.ruid, file));\n\t\t\t\t\t\t});\n\t\t\t\t\t}, 999);\n\t\t\t\t\t\n\t\t\t\t\truntime.exec.call(self, 'FileInput', 'init', options);\n\n\t\t\t\t\t// re-position and resize shim container\n\t\t\t\t\tself.bind('Refresh', function() {\n\t\t\t\t\t\tvar pos, size, browseButton;\n\t\t\t\t\t\t\n\t\t\t\t\t\tbrowseButton = Dom.get(options.browse_button);\n\n\t\t\t\t\t\tif (browseButton) {\n\t\t\t\t\t\t\tpos = Dom.getPos(browseButton, Dom.get(options.container));\n\t\t\t\t\t\t\tsize = Dom.getSize(browseButton);\n\n\t\t\t\t\t\t\tBasic.extend(runtime.getShimContainer().style, {\n\t\t\t\t\t\t\t\ttop     : pos.y + 'px',\n\t\t\t\t\t\t\t\tleft    : pos.x + 'px',\n\t\t\t\t\t\t\t\twidth   : size.w + 'px',\n\t\t\t\t\t\t\t\theight  : size.h + 'px'\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\tbrowseButton = null;\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\n\t\t\t\t\tself.trigger('Refresh');\n\t\t\t\t\tself.dispatchEvent('ready');\n\t\t\t\t});\n\n\t\t\t\t// runtime needs: options.required_features, options.runtime_order and options.container\n\t\t\t\tself.connectRuntime(options); // throws RuntimeError\n\t\t\t},\n\n\t\t\t/**\n\t\t\tDisables file-picker element, so that it doesn't react to mouse clicks.\n\n\t\t\t@method disable\n\t\t\t@param {Boolean} [state=true] Disable component if - true, enable if - false\n\t\t\t*/\n\t\t\tdisable: function(state) {\n\t\t\t\tvar runtime = this.getRuntime();\n\t\t\t\tif (runtime) {\n\t\t\t\t\truntime.exec.call(this, 'FileInput', 'disable', state === undefined ? true : state);\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t}\n\n\tFileInput.prototype = EventTarget.instance;\n\n\treturn FileInput;\n});\n");
__$coverInitRange("src/javascript/file/FileInput.js", "347:7099");
__$coverInitRange("src/javascript/file/FileInput.js", "2475:3447");
__$coverInitRange("src/javascript/file/FileInput.js", "3451:7029");
__$coverInitRange("src/javascript/file/FileInput.js", "7033:7075");
__$coverInitRange("src/javascript/file/FileInput.js", "7079:7095");
__$coverInitRange("src/javascript/file/FileInput.js", "3483:3536");
__$coverInitRange("src/javascript/file/FileInput.js", "3600:3680");
__$coverInitRange("src/javascript/file/FileInput.js", "3741:3786");
__$coverInitRange("src/javascript/file/FileInput.js", "3790:3904");
__$coverInitRange("src/javascript/file/FileInput.js", "3937:4151");
__$coverInitRange("src/javascript/file/FileInput.js", "4158:4245");
__$coverInitRange("src/javascript/file/FileInput.js", "4349:4450");
__$coverInitRange("src/javascript/file/FileInput.js", "4455:4493");
__$coverInitRange("src/javascript/file/FileInput.js", "4530:4580");
__$coverInitRange("src/javascript/file/FileInput.js", "4627:4727");
__$coverInitRange("src/javascript/file/FileInput.js", "4732:4763");
__$coverInitRange("src/javascript/file/FileInput.js", "4780:4804");
__$coverInitRange("src/javascript/file/FileInput.js", "4811:7026");
__$coverInitRange("src/javascript/file/FileInput.js", "3639:3676");
__$coverInitRange("src/javascript/file/FileInput.js", "3846:3900");
__$coverInitRange("src/javascript/file/FileInput.js", "4395:4446");
__$coverInitRange("src/javascript/file/FileInput.js", "4551:4576");
__$coverInitRange("src/javascript/file/FileInput.js", "4686:4723");
__$coverInitRange("src/javascript/file/FileInput.js", "5389:5433");
__$coverInitRange("src/javascript/file/FileInput.js", "5440:6487");
__$coverInitRange("src/javascript/file/FileInput.js", "6587:6615");
__$coverInitRange("src/javascript/file/FileInput.js", "5493:5516");
__$coverInitRange("src/javascript/file/FileInput.js", "5524:5790");
__$coverInitRange("src/javascript/file/FileInput.js", "5803:5856");
__$coverInitRange("src/javascript/file/FileInput.js", "5910:6414");
__$coverInitRange("src/javascript/file/FileInput.js", "6422:6445");
__$coverInitRange("src/javascript/file/FileInput.js", "6452:6479");
__$coverInitRange("src/javascript/file/FileInput.js", "5563:5623");
__$coverInitRange("src/javascript/file/FileInput.js", "5632:5647");
__$coverInitRange("src/javascript/file/FileInput.js", "5656:5776");
__$coverInitRange("src/javascript/file/FileInput.js", "5698:5715");
__$coverInitRange("src/javascript/file/FileInput.js", "5724:5766");
__$coverInitRange("src/javascript/file/FileInput.js", "5950:5977");
__$coverInitRange("src/javascript/file/FileInput.js", "5992:6037");
__$coverInitRange("src/javascript/file/FileInput.js", "6046:6405");
__$coverInitRange("src/javascript/file/FileInput.js", "6073:6131");
__$coverInitRange("src/javascript/file/FileInput.js", "6140:6172");
__$coverInitRange("src/javascript/file/FileInput.js", "6182:6369");
__$coverInitRange("src/javascript/file/FileInput.js", "6378:6397");
__$coverInitRange("src/javascript/file/FileInput.js", "6869:6900");
__$coverInitRange("src/javascript/file/FileInput.js", "6906:7015");
__$coverInitRange("src/javascript/file/FileInput.js", "6926:7009");
__$coverCall('src/javascript/file/FileInput.js', '347:7099');
define('moxie/file/FileInput', [
    'moxie/core/utils/Basic',
    'moxie/core/utils/Mime',
    'moxie/core/utils/Dom',
    'moxie/core/Exceptions',
    'moxie/core/EventTarget',
    'moxie/core/I18n',
    'moxie/file/File',
    'moxie/runtime/RuntimeClient'
], function (Basic, Mime, Dom, x, EventTarget, I18n, File, RuntimeClient) {
    __$coverCall('src/javascript/file/FileInput.js', '2475:3447');
    var dispatches = [
            'ready',
            'change',
            'cancel',
            'mouseenter',
            'mouseleave',
            'mousedown',
            'mouseup'
        ];
    __$coverCall('src/javascript/file/FileInput.js', '3451:7029');
    function FileInput(options) {
        __$coverCall('src/javascript/file/FileInput.js', '3483:3536');
        var self = this, container, browseButton, defaults;
        __$coverCall('src/javascript/file/FileInput.js', '3600:3680');
        if (typeof options === 'string') {
            __$coverCall('src/javascript/file/FileInput.js', '3639:3676');
            options = { browse_button: options };
        }
        __$coverCall('src/javascript/file/FileInput.js', '3741:3786');
        browseButton = Dom.get(options.browse_button);
        __$coverCall('src/javascript/file/FileInput.js', '3790:3904');
        if (!browseButton) {
            __$coverCall('src/javascript/file/FileInput.js', '3846:3900');
            throw new x.DOMException(x.DOMException.NOT_FOUND_ERR);
        }
        __$coverCall('src/javascript/file/FileInput.js', '3937:4151');
        defaults = {
            accept: [{
                    title: I18n.translate('All Files'),
                    extensions: '*'
                }],
            name: 'file',
            multiple: false,
            required_caps: false,
            container: browseButton.parentNode || document.body
        };
        __$coverCall('src/javascript/file/FileInput.js', '4158:4245');
        options = typeof options === 'object' ? Basic.extend({}, defaults, options) : defaults;
        __$coverCall('src/javascript/file/FileInput.js', '4349:4450');
        if (typeof options.accept === 'string') {
            __$coverCall('src/javascript/file/FileInput.js', '4395:4446');
            options.accept = Mime.mimes2extList(options.accept);
        }
        __$coverCall('src/javascript/file/FileInput.js', '4455:4493');
        container = Dom.get(options.container);
        __$coverCall('src/javascript/file/FileInput.js', '4530:4580');
        if (!container) {
            __$coverCall('src/javascript/file/FileInput.js', '4551:4576');
            container = document.body;
        }
        __$coverCall('src/javascript/file/FileInput.js', '4627:4727');
        if (Dom.getStyle(container, 'position') === 'static') {
            __$coverCall('src/javascript/file/FileInput.js', '4686:4723');
            container.style.position = 'relative';
        }
        __$coverCall('src/javascript/file/FileInput.js', '4732:4763');
        container = browseButton = null;
        __$coverCall('src/javascript/file/FileInput.js', '4780:4804');
        RuntimeClient.call(self);
        __$coverCall('src/javascript/file/FileInput.js', '4811:7026');
        Basic.extend(self, {
            uid: Basic.guid('uid_'),
            ruid: null,
            files: null,
            init: function () {
                __$coverCall('src/javascript/file/FileInput.js', '5389:5433');
                self.convertEventPropsToHandlers(dispatches);
                __$coverCall('src/javascript/file/FileInput.js', '5440:6487');
                self.bind('RuntimeInit', function (e, runtime) {
                    __$coverCall('src/javascript/file/FileInput.js', '5493:5516');
                    self.ruid = runtime.uid;
                    __$coverCall('src/javascript/file/FileInput.js', '5524:5790');
                    self.bind('Change', function () {
                        __$coverCall('src/javascript/file/FileInput.js', '5563:5623');
                        var files = runtime.exec.call(self, 'FileInput', 'getFiles');
                        __$coverCall('src/javascript/file/FileInput.js', '5632:5647');
                        self.files = [];
                        __$coverCall('src/javascript/file/FileInput.js', '5656:5776');
                        Basic.each(files, function (file) {
                            __$coverCall('src/javascript/file/FileInput.js', '5698:5715');
                            runtime.clients++;
                            __$coverCall('src/javascript/file/FileInput.js', '5724:5766');
                            self.files.push(new File(self.ruid, file));
                        });
                    }, 999);
                    __$coverCall('src/javascript/file/FileInput.js', '5803:5856');
                    runtime.exec.call(self, 'FileInput', 'init', options);
                    __$coverCall('src/javascript/file/FileInput.js', '5910:6414');
                    self.bind('Refresh', function () {
                        __$coverCall('src/javascript/file/FileInput.js', '5950:5977');
                        var pos, size, browseButton;
                        __$coverCall('src/javascript/file/FileInput.js', '5992:6037');
                        browseButton = Dom.get(options.browse_button);
                        __$coverCall('src/javascript/file/FileInput.js', '6046:6405');
                        if (browseButton) {
                            __$coverCall('src/javascript/file/FileInput.js', '6073:6131');
                            pos = Dom.getPos(browseButton, Dom.get(options.container));
                            __$coverCall('src/javascript/file/FileInput.js', '6140:6172');
                            size = Dom.getSize(browseButton);
                            __$coverCall('src/javascript/file/FileInput.js', '6182:6369');
                            Basic.extend(runtime.getShimContainer().style, {
                                top: pos.y + 'px',
                                left: pos.x + 'px',
                                width: size.w + 'px',
                                height: size.h + 'px'
                            });
                            __$coverCall('src/javascript/file/FileInput.js', '6378:6397');
                            browseButton = null;
                        }
                    });
                    __$coverCall('src/javascript/file/FileInput.js', '6422:6445');
                    self.trigger('Refresh');
                    __$coverCall('src/javascript/file/FileInput.js', '6452:6479');
                    self.dispatchEvent('ready');
                });
                __$coverCall('src/javascript/file/FileInput.js', '6587:6615');
                self.connectRuntime(options);
            },
            disable: function (state) {
                __$coverCall('src/javascript/file/FileInput.js', '6869:6900');
                var runtime = this.getRuntime();
                __$coverCall('src/javascript/file/FileInput.js', '6906:7015');
                if (runtime) {
                    __$coverCall('src/javascript/file/FileInput.js', '6926:7009');
                    runtime.exec.call(this, 'FileInput', 'disable', state === undefined ? true : state);
                }
            }
        });
    }
    __$coverCall('src/javascript/file/FileInput.js', '7033:7075');
    FileInput.prototype = EventTarget.instance;
    __$coverCall('src/javascript/file/FileInput.js', '7079:7095');
    return FileInput;
});

// Included from: src/javascript/file/FileDrop.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/file/FileDrop.js", "/**\n * FileDrop.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/file/FileDrop', [\n\t'moxie/core/I18n',\n\t'moxie/core/utils/Dom',\n\t'moxie/core/Exceptions',\n\t'moxie/core/utils/Basic',\n\t'moxie/file/File',\n\t'moxie/runtime/RuntimeClient',\n\t'moxie/core/EventTarget',\n\t'moxie/core/utils/Mime'\n], function(I18n, Dom, x, Basic, File, RuntimeClient, EventTarget, Mime) {\n\t/**\n\tTurn arbitrary DOM element to a drop zone accepting files. Converts selected files to mOxie.File objects, to be used \n\tin conjunction with _mOxie.Image_, preloaded in memory with _mOxie.FileReader_ or uploaded to a server through \n\t_mOxie.XMLHttpRequest_.\n\n\t@example\n\t\t<div id=\"drop_zone\">\n\t\t\tDrop files here\n\t\t</div>\n\t\t<br />\n\t\t<div id=\"filelist\"></div>\n\n\t\t<script type=\"text/javascript\">\n\t\t\tvar fileDrop = new mOxie.FileDrop('drop_zone'), fileList = mOxie.get('filelist');\n\n\t\t\tfileDrop.ondrop = function() {\n\t\t\t\tmOxie.each(this.files, function(file) {\n\t\t\t\t\tfileList.innerHTML += '<div>' + file.name + '</div>';\n\t\t\t\t});\n\t\t\t};\n\n\t\t\tfileDrop.init();\n\t\t</script>\n\n\t@class FileDrop\n\t@constructor\n\t@extends EventTarget\n\t@uses RuntimeClient\n\t@param {Object|String} options If options has typeof string, argument is considered as options.drop_zone\n\t@param {String|DOMElement} options.drop_zone DOM Element to turn into a drop zone\n\t@param {Array} [options.accept] Array of mime types to accept. By default accepts all\n\t@param {Object|String} [options.required_caps] Set of required capabilities, that chosen runtime must support\n\t*/\n\tvar dispatches = [\n\t\t/**\n\t\tDispatched when runtime is connected and drop zone is ready to accept files.\n\n\t\t@event ready\n\t\t@param {Object} event\n\t\t*/\n\t\t'ready', \n\n\t\t/**\n\t\tDispatched when dragging cursor enters the drop zone.\n\n\t\t@event dragenter\n\t\t@param {Object} event\n\t\t*/\n\t\t'dragenter',\n\n\t\t/**\n\t\tDispatched when dragging cursor leaves the drop zone.\n\n\t\t@event dragleave\n\t\t@param {Object} event\n\t\t*/\n\t\t'dragleave', \n\n\t\t/**\n\t\tDispatched when file is dropped onto the drop zone.\n\n\t\t@event drop\n\t\t@param {Object} event\n\t\t*/\n\t\t'drop', \n\n\t\t/**\n\t\tDispatched if error occurs.\n\n\t\t@event error\n\t\t@param {Object} event\n\t\t*/\n\t\t'error'\n\t];\n\n\tfunction FileDrop(options) {\n\t\tvar self = this, defaults;\n\n\t\t// if flat argument passed it should be drop_zone id\n\t\tif (typeof(options) === 'string') {\n\t\t\toptions = { drop_zone : options };\n\t\t}\n\n\t\t// figure out the options\n\t\tdefaults = {\n\t\t\taccept: [{\n\t\t\t\ttitle: I18n.translate('All Files'),\n\t\t\t\textensions: '*'\n\t\t\t}],\n\t\t\trequired_caps: {\n\t\t\t\tdrag_and_drop: true\n\t\t\t}\n\t\t};\n\t\t\n\t\toptions = typeof(options) === 'object' ? Basic.extend({}, defaults, options) : defaults;\n\n\t\t// this will help us to find proper default container\n\t\toptions.container = Dom.get(options.drop_zone) || document.body;\n\n\t\t// make container relative, if it is not\n\t\tif (Dom.getStyle(options.container, 'position') === 'static') {\n\t\t\toptions.container.style.position = 'relative';\n\t\t}\n\t\t\t\t\t\n\t\t// normalize accept option (could be list of mime types or array of title/extensions pairs)\n\t\tif (typeof(options.accept) === 'string') {\n\t\t\toptions.accept = Mime.mimes2extList(options.accept);\n\t\t}\n\n\t\tRuntimeClient.call(self);\n\n\t\tBasic.extend(self, {\n\t\t\tuid: Basic.guid('uid_'),\n\n\t\t\truid: null,\n\n\t\t\tfiles: null,\n\n\t\t\tinit: function() {\n\t\n\t\t\t\tself.convertEventPropsToHandlers(dispatches);\n\t\t\n\t\t\t\tself.bind('RuntimeInit', function(e, runtime) {\n\t\t\t\t\tself.ruid = runtime.uid;\n\n\t\t\t\t\tself.bind(\"Drop\", function() {\n\t\t\t\t\t\tvar files = runtime.exec.call(self, 'FileDrop', 'getFiles');\n\n\t\t\t\t\t\tself.files = [];\n\n\t\t\t\t\t\tBasic.each(files, function(file) {\n\t\t\t\t\t\t\tself.files.push(new File(self.ruid, file));\n\t\t\t\t\t\t});\n\t\t\t\t\t}, 999);\n\n\t\t\t\t\truntime.exec.call(self, 'FileDrop', 'init', options);\n\n\t\t\t\t\tself.dispatchEvent('ready');\n\t\t\t\t});\n\t\t\t\t\t\t\t\n\t\t\t\t// runtime needs: options.required_features, options.runtime_order and options.container\n\t\t\t\tself.connectRuntime(options); // throws RuntimeError\n\t\t\t}\n\t\t});\n\t}\n\n\tFileDrop.prototype = EventTarget.instance;\n\n\treturn FileDrop;\n});\n");
__$coverInitRange("src/javascript/file/FileDrop.js", "346:4238");
__$coverInitRange("src/javascript/file/FileDrop.js", "1788:2414");
__$coverInitRange("src/javascript/file/FileDrop.js", "2418:4170");
__$coverInitRange("src/javascript/file/FileDrop.js", "4174:4215");
__$coverInitRange("src/javascript/file/FileDrop.js", "4219:4234");
__$coverInitRange("src/javascript/file/FileDrop.js", "2449:2474");
__$coverInitRange("src/javascript/file/FileDrop.js", "2534:2610");
__$coverInitRange("src/javascript/file/FileDrop.js", "2643:2789");
__$coverInitRange("src/javascript/file/FileDrop.js", "2796:2883");
__$coverInitRange("src/javascript/file/FileDrop.js", "2944:3007");
__$coverInitRange("src/javascript/file/FileDrop.js", "3055:3171");
__$coverInitRange("src/javascript/file/FileDrop.js", "3275:3376");
__$coverInitRange("src/javascript/file/FileDrop.js", "3381:3405");
__$coverInitRange("src/javascript/file/FileDrop.js", "3410:4167");
__$coverInitRange("src/javascript/file/FileDrop.js", "2573:2606");
__$coverInitRange("src/javascript/file/FileDrop.js", "3122:3167");
__$coverInitRange("src/javascript/file/FileDrop.js", "3321:3372");
__$coverInitRange("src/javascript/file/FileDrop.js", "3521:3565");
__$coverInitRange("src/javascript/file/FileDrop.js", "3574:3998");
__$coverInitRange("src/javascript/file/FileDrop.js", "4105:4133");
__$coverInitRange("src/javascript/file/FileDrop.js", "3627:3650");
__$coverInitRange("src/javascript/file/FileDrop.js", "3658:3895");
__$coverInitRange("src/javascript/file/FileDrop.js", "3903:3955");
__$coverInitRange("src/javascript/file/FileDrop.js", "3963:3990");
__$coverInitRange("src/javascript/file/FileDrop.js", "3695:3754");
__$coverInitRange("src/javascript/file/FileDrop.js", "3763:3778");
__$coverInitRange("src/javascript/file/FileDrop.js", "3787:3881");
__$coverInitRange("src/javascript/file/FileDrop.js", "3829:3871");
__$coverCall('src/javascript/file/FileDrop.js', '346:4238');
define('moxie/file/FileDrop', [
    'moxie/core/I18n',
    'moxie/core/utils/Dom',
    'moxie/core/Exceptions',
    'moxie/core/utils/Basic',
    'moxie/file/File',
    'moxie/runtime/RuntimeClient',
    'moxie/core/EventTarget',
    'moxie/core/utils/Mime'
], function (I18n, Dom, x, Basic, File, RuntimeClient, EventTarget, Mime) {
    __$coverCall('src/javascript/file/FileDrop.js', '1788:2414');
    var dispatches = [
            'ready',
            'dragenter',
            'dragleave',
            'drop',
            'error'
        ];
    __$coverCall('src/javascript/file/FileDrop.js', '2418:4170');
    function FileDrop(options) {
        __$coverCall('src/javascript/file/FileDrop.js', '2449:2474');
        var self = this, defaults;
        __$coverCall('src/javascript/file/FileDrop.js', '2534:2610');
        if (typeof options === 'string') {
            __$coverCall('src/javascript/file/FileDrop.js', '2573:2606');
            options = { drop_zone: options };
        }
        __$coverCall('src/javascript/file/FileDrop.js', '2643:2789');
        defaults = {
            accept: [{
                    title: I18n.translate('All Files'),
                    extensions: '*'
                }],
            required_caps: { drag_and_drop: true }
        };
        __$coverCall('src/javascript/file/FileDrop.js', '2796:2883');
        options = typeof options === 'object' ? Basic.extend({}, defaults, options) : defaults;
        __$coverCall('src/javascript/file/FileDrop.js', '2944:3007');
        options.container = Dom.get(options.drop_zone) || document.body;
        __$coverCall('src/javascript/file/FileDrop.js', '3055:3171');
        if (Dom.getStyle(options.container, 'position') === 'static') {
            __$coverCall('src/javascript/file/FileDrop.js', '3122:3167');
            options.container.style.position = 'relative';
        }
        __$coverCall('src/javascript/file/FileDrop.js', '3275:3376');
        if (typeof options.accept === 'string') {
            __$coverCall('src/javascript/file/FileDrop.js', '3321:3372');
            options.accept = Mime.mimes2extList(options.accept);
        }
        __$coverCall('src/javascript/file/FileDrop.js', '3381:3405');
        RuntimeClient.call(self);
        __$coverCall('src/javascript/file/FileDrop.js', '3410:4167');
        Basic.extend(self, {
            uid: Basic.guid('uid_'),
            ruid: null,
            files: null,
            init: function () {
                __$coverCall('src/javascript/file/FileDrop.js', '3521:3565');
                self.convertEventPropsToHandlers(dispatches);
                __$coverCall('src/javascript/file/FileDrop.js', '3574:3998');
                self.bind('RuntimeInit', function (e, runtime) {
                    __$coverCall('src/javascript/file/FileDrop.js', '3627:3650');
                    self.ruid = runtime.uid;
                    __$coverCall('src/javascript/file/FileDrop.js', '3658:3895');
                    self.bind('Drop', function () {
                        __$coverCall('src/javascript/file/FileDrop.js', '3695:3754');
                        var files = runtime.exec.call(self, 'FileDrop', 'getFiles');
                        __$coverCall('src/javascript/file/FileDrop.js', '3763:3778');
                        self.files = [];
                        __$coverCall('src/javascript/file/FileDrop.js', '3787:3881');
                        Basic.each(files, function (file) {
                            __$coverCall('src/javascript/file/FileDrop.js', '3829:3871');
                            self.files.push(new File(self.ruid, file));
                        });
                    }, 999);
                    __$coverCall('src/javascript/file/FileDrop.js', '3903:3955');
                    runtime.exec.call(self, 'FileDrop', 'init', options);
                    __$coverCall('src/javascript/file/FileDrop.js', '3963:3990');
                    self.dispatchEvent('ready');
                });
                __$coverCall('src/javascript/file/FileDrop.js', '4105:4133');
                self.connectRuntime(options);
            }
        });
    }
    __$coverCall('src/javascript/file/FileDrop.js', '4174:4215');
    FileDrop.prototype = EventTarget.instance;
    __$coverCall('src/javascript/file/FileDrop.js', '4219:4234');
    return FileDrop;
});

// Included from: src/javascript/file/FileReader.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/file/FileReader.js", "/**\n * FileReader.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true, sub:false */\n/*global define:true */\n\ndefine('moxie/file/FileReader', [\n\t'moxie/core/utils/Basic',\n\t'moxie/core/Exceptions',\n\t'moxie/core/EventTarget',\n\t'moxie/runtime/RuntimeClient'\n], function(Basic, x, EventTarget, RuntimeClient) {\n\t/**\n\tUtility for preloading o.Blob/o.File objects in memory. By design closely follows [W3C FileReader](http://www.w3.org/TR/FileAPI/#dfn-filereader)\n\tinterface. Where possible uses native FileReader, where - not falls back to shims.\n\n\t@class FileReader\n\t@constructor FileReader\n\t@extends EventTarget\n\t@uses RuntimeClient\n\t*/\n\tvar dispatches = ['loadstart', 'progress', 'load', 'abort', 'error', 'loadend'];\n\t\n\tfunction FileReader() {\n\t\t\t\t\n\t\tRuntimeClient.call(this);\n\n\t\tBasic.extend(this, {\n\t\t\tuid: Basic.guid('uid_'),\n\n\t\t\t/**\n\t\t\tContains current state of o.FileReader object. Can take values of o.FileReader.EMPTY, o.FileReader.LOADING\n\t\t\tand o.FileReader.DONE.\n\n\t\t\t@property readyState\n\t\t\t@type {Number}\n\t\t\t@default FileReader.EMPTY\n\t\t\t*/\n\t\t\treadyState: FileReader.EMPTY,\n\t\t\t\n\t\t\tresult: null,\n\t\t\t\n\t\t\terror: null,\n\t\t\t\n\t\t\t/**\n\t\t\tInitiates reading of o.File/o.Blob object contents to binary string.\n\n\t\t\t@method readAsBinaryString\n\t\t\t@param {Blob|File} blob Object to preload\n\t\t\t*/\n\t\t\treadAsBinaryString: function(blob) {\n\t\t\t\tthis.result = '';\n\t\t\t\t_read.call(this, 'readAsBinaryString', blob);\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tInitiates reading of o.File/o.Blob object contents to dataURL string.\n\n\t\t\t@method readAsDataURL\n\t\t\t@param {Blob|File} blob Object to preload\n\t\t\t*/\n\t\t\treadAsDataURL: function(blob) {\n\t\t\t\t_read.call(this, 'readAsDataURL', blob);\n\t\t\t},\n\t\t\t\n\t\t\treadAsArrayBuffer: function(blob) {\n\t\t\t\t_read.call(this, 'readAsArrayBuffer', blob);\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tInitiates reading of o.File/o.Blob object contents to string.\n\n\t\t\t@method readAsText\n\t\t\t@param {Blob|File} blob Object to preload\n\t\t\t*/\n\t\t\treadAsText: function(blob) {\n\t\t\t\t_read.call(this, 'readAsText', blob);\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tAborts preloading process.\n\n\t\t\t@method abort\n\t\t\t*/\n\t\t\tabort: function() {\n\t\t\t\tthis.result = null;\n\t\t\t\t\n\t\t\t\tif (!!~Basic.inArray(this.readyState, [FileReader.EMPTY, FileReader.DONE])) {\n\t\t\t\t\treturn;\n\t\t\t\t} else if (this.readyState === FileReader.LOADING) {\n\t\t\t\t\tthis.readyState = FileReader.DONE;\n\t\t\t\t}\n\n\t\t\t\tvar runtime = this.getRuntime();\n\t\t\t\tif (runtime) {\n\t\t\t\t\truntime.exec.call(this, 'FileReader', 'abort');\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\tthis.bind('Abort', function() {\n\t\t\t\t\tthis.trigger('loadend');\n\t\t\t\t});\n\t\t\t},\n\n\t\t\t/**\n\t\t\tDestroy component and release resources.\n\n\t\t\t@method destroy\n\t\t\t*/\n\t\t\tdestroy: function() {\n\t\t\t\tthis.abort();\n\n\t\t\t\tvar runtime = this.getRuntime();\n\t\t\t\tif (runtime) {\n\t\t\t\t\truntime.exec.call(this, 'FileReader', 'destroy');\n\t\t\t\t\tthis.disconnectRuntime();\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t\t\n\t\t\n\t\tfunction _read(op, blob) {\n\t\t\tthis.readyState = FileReader.EMPTY;\n\t\t\tthis.error = null;\n\n\t\t\tif (this.readyState === FileReader.LOADING || !blob.ruid || !blob.uid) {\n\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t}\n\t\t\t\n\t\t\tthis.convertEventPropsToHandlers(dispatches);\n\t\t\t\t\t\t\n\t\t\tthis.bind('Error', function(e, error) {\n\t\t\t\tthis.readyState = FileReader.DONE;\n\t\t\t\tthis.result = null;\n\t\t\t\tthis.error = error;\n\t\t\t\tthis.trigger('loadend');\n\t\t\t}, 999);\n\t\t\t\n\t\t\t\n\t\t\tthis.bind('LoadStart', function() {\n\t\t\t\tthis.readyState = FileReader.LOADING;\n\t\t\t}, 999);\n\t\t\t\n\t\t\tthis.bind('Load', function() {\n\t\t\t\tthis.readyState = FileReader.DONE;\n\t\t\t\tthis.trigger('loadend');\n\t\t\t}, 999);\n\n\t\t\tthis.connectRuntime(blob.ruid).exec.call(this, 'FileReader', 'read', op, blob);\n\t\t}\n\t}\n\t\n\t/**\n\tInitial FileReader state\n\n\t@property EMPTY\n\t@type {Number}\n\t@final\n\t@static\n\t@default 0\n\t*/\n\tFileReader.EMPTY = 0;\n\n\t/**\n\tFileReader switches to this state when it is preloading the source\n\n\t@property LOADING\n\t@type {Number}\n\t@final\n\t@static\n\t@default 1\n\t*/\n\tFileReader.LOADING = 1;\n\n\t/**\n\tPreloading is complete, this is a final state\n\n\t@property DONE\n\t@type {Number}\n\t@final\n\t@static\n\t@default 2\n\t*/\n\tFileReader.DONE = 2;\n\n\tFileReader.prototype = EventTarget.instance;\n\n\treturn FileReader;\n});");
__$coverInitRange("src/javascript/file/FileReader.js", "360:4314");
__$coverInitRange("src/javascript/file/FileReader.js", "885:964");
__$coverInitRange("src/javascript/file/FileReader.js", "969:3810");
__$coverInitRange("src/javascript/file/FileReader.js", "3913:3933");
__$coverInitRange("src/javascript/file/FileReader.js", "4079:4101");
__$coverInitRange("src/javascript/file/FileReader.js", "4223:4242");
__$coverInitRange("src/javascript/file/FileReader.js", "4246:4289");
__$coverInitRange("src/javascript/file/FileReader.js", "4293:4310");
__$coverInitRange("src/javascript/file/FileReader.js", "1000:1024");
__$coverInitRange("src/javascript/file/FileReader.js", "1029:3027");
__$coverInitRange("src/javascript/file/FileReader.js", "3037:3807");
__$coverInitRange("src/javascript/file/FileReader.js", "1583:1599");
__$coverInitRange("src/javascript/file/FileReader.js", "1605:1649");
__$coverInitRange("src/javascript/file/FileReader.js", "1857:1896");
__$coverInitRange("src/javascript/file/FileReader.js", "1951:1994");
__$coverInitRange("src/javascript/file/FileReader.js", "2188:2224");
__$coverInitRange("src/javascript/file/FileReader.js", "2324:2342");
__$coverInitRange("src/javascript/file/FileReader.js", "2353:2545");
__$coverInitRange("src/javascript/file/FileReader.js", "2552:2583");
__$coverInitRange("src/javascript/file/FileReader.js", "2589:2661");
__$coverInitRange("src/javascript/file/FileReader.js", "2672:2740");
__$coverInitRange("src/javascript/file/FileReader.js", "2436:2442");
__$coverInitRange("src/javascript/file/FileReader.js", "2506:2539");
__$coverInitRange("src/javascript/file/FileReader.js", "2609:2655");
__$coverInitRange("src/javascript/file/FileReader.js", "2709:2732");
__$coverInitRange("src/javascript/file/FileReader.js", "2855:2867");
__$coverInitRange("src/javascript/file/FileReader.js", "2874:2905");
__$coverInitRange("src/javascript/file/FileReader.js", "2911:3016");
__$coverInitRange("src/javascript/file/FileReader.js", "2931:2979");
__$coverInitRange("src/javascript/file/FileReader.js", "2986:3010");
__$coverInitRange("src/javascript/file/FileReader.js", "3067:3101");
__$coverInitRange("src/javascript/file/FileReader.js", "3106:3123");
__$coverInitRange("src/javascript/file/FileReader.js", "3129:3269");
__$coverInitRange("src/javascript/file/FileReader.js", "3278:3322");
__$coverInitRange("src/javascript/file/FileReader.js", "3334:3500");
__$coverInitRange("src/javascript/file/FileReader.js", "3513:3601");
__$coverInitRange("src/javascript/file/FileReader.js", "3610:3719");
__$coverInitRange("src/javascript/file/FileReader.js", "3725:3803");
__$coverInitRange("src/javascript/file/FileReader.js", "3206:3264");
__$coverInitRange("src/javascript/file/FileReader.js", "3378:3411");
__$coverInitRange("src/javascript/file/FileReader.js", "3417:3435");
__$coverInitRange("src/javascript/file/FileReader.js", "3441:3459");
__$coverInitRange("src/javascript/file/FileReader.js", "3465:3488");
__$coverInitRange("src/javascript/file/FileReader.js", "3553:3589");
__$coverInitRange("src/javascript/file/FileReader.js", "3645:3678");
__$coverInitRange("src/javascript/file/FileReader.js", "3684:3707");
__$coverCall('src/javascript/file/FileReader.js', '360:4314');
define('moxie/file/FileReader', [
    'moxie/core/utils/Basic',
    'moxie/core/Exceptions',
    'moxie/core/EventTarget',
    'moxie/runtime/RuntimeClient'
], function (Basic, x, EventTarget, RuntimeClient) {
    __$coverCall('src/javascript/file/FileReader.js', '885:964');
    var dispatches = [
            'loadstart',
            'progress',
            'load',
            'abort',
            'error',
            'loadend'
        ];
    __$coverCall('src/javascript/file/FileReader.js', '969:3810');
    function FileReader() {
        __$coverCall('src/javascript/file/FileReader.js', '1000:1024');
        RuntimeClient.call(this);
        __$coverCall('src/javascript/file/FileReader.js', '1029:3027');
        Basic.extend(this, {
            uid: Basic.guid('uid_'),
            readyState: FileReader.EMPTY,
            result: null,
            error: null,
            readAsBinaryString: function (blob) {
                __$coverCall('src/javascript/file/FileReader.js', '1583:1599');
                this.result = '';
                __$coverCall('src/javascript/file/FileReader.js', '1605:1649');
                _read.call(this, 'readAsBinaryString', blob);
            },
            readAsDataURL: function (blob) {
                __$coverCall('src/javascript/file/FileReader.js', '1857:1896');
                _read.call(this, 'readAsDataURL', blob);
            },
            readAsArrayBuffer: function (blob) {
                __$coverCall('src/javascript/file/FileReader.js', '1951:1994');
                _read.call(this, 'readAsArrayBuffer', blob);
            },
            readAsText: function (blob) {
                __$coverCall('src/javascript/file/FileReader.js', '2188:2224');
                _read.call(this, 'readAsText', blob);
            },
            abort: function () {
                __$coverCall('src/javascript/file/FileReader.js', '2324:2342');
                this.result = null;
                __$coverCall('src/javascript/file/FileReader.js', '2353:2545');
                if (!!~Basic.inArray(this.readyState, [
                        FileReader.EMPTY,
                        FileReader.DONE
                    ])) {
                    __$coverCall('src/javascript/file/FileReader.js', '2436:2442');
                    return;
                } else if (this.readyState === FileReader.LOADING) {
                    __$coverCall('src/javascript/file/FileReader.js', '2506:2539');
                    this.readyState = FileReader.DONE;
                }
                __$coverCall('src/javascript/file/FileReader.js', '2552:2583');
                var runtime = this.getRuntime();
                __$coverCall('src/javascript/file/FileReader.js', '2589:2661');
                if (runtime) {
                    __$coverCall('src/javascript/file/FileReader.js', '2609:2655');
                    runtime.exec.call(this, 'FileReader', 'abort');
                }
                __$coverCall('src/javascript/file/FileReader.js', '2672:2740');
                this.bind('Abort', function () {
                    __$coverCall('src/javascript/file/FileReader.js', '2709:2732');
                    this.trigger('loadend');
                });
            },
            destroy: function () {
                __$coverCall('src/javascript/file/FileReader.js', '2855:2867');
                this.abort();
                __$coverCall('src/javascript/file/FileReader.js', '2874:2905');
                var runtime = this.getRuntime();
                __$coverCall('src/javascript/file/FileReader.js', '2911:3016');
                if (runtime) {
                    __$coverCall('src/javascript/file/FileReader.js', '2931:2979');
                    runtime.exec.call(this, 'FileReader', 'destroy');
                    __$coverCall('src/javascript/file/FileReader.js', '2986:3010');
                    this.disconnectRuntime();
                }
            }
        });
        __$coverCall('src/javascript/file/FileReader.js', '3037:3807');
        function _read(op, blob) {
            __$coverCall('src/javascript/file/FileReader.js', '3067:3101');
            this.readyState = FileReader.EMPTY;
            __$coverCall('src/javascript/file/FileReader.js', '3106:3123');
            this.error = null;
            __$coverCall('src/javascript/file/FileReader.js', '3129:3269');
            if (this.readyState === FileReader.LOADING || !blob.ruid || !blob.uid) {
                __$coverCall('src/javascript/file/FileReader.js', '3206:3264');
                throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }
            __$coverCall('src/javascript/file/FileReader.js', '3278:3322');
            this.convertEventPropsToHandlers(dispatches);
            __$coverCall('src/javascript/file/FileReader.js', '3334:3500');
            this.bind('Error', function (e, error) {
                __$coverCall('src/javascript/file/FileReader.js', '3378:3411');
                this.readyState = FileReader.DONE;
                __$coverCall('src/javascript/file/FileReader.js', '3417:3435');
                this.result = null;
                __$coverCall('src/javascript/file/FileReader.js', '3441:3459');
                this.error = error;
                __$coverCall('src/javascript/file/FileReader.js', '3465:3488');
                this.trigger('loadend');
            }, 999);
            __$coverCall('src/javascript/file/FileReader.js', '3513:3601');
            this.bind('LoadStart', function () {
                __$coverCall('src/javascript/file/FileReader.js', '3553:3589');
                this.readyState = FileReader.LOADING;
            }, 999);
            __$coverCall('src/javascript/file/FileReader.js', '3610:3719');
            this.bind('Load', function () {
                __$coverCall('src/javascript/file/FileReader.js', '3645:3678');
                this.readyState = FileReader.DONE;
                __$coverCall('src/javascript/file/FileReader.js', '3684:3707');
                this.trigger('loadend');
            }, 999);
            __$coverCall('src/javascript/file/FileReader.js', '3725:3803');
            this.connectRuntime(blob.ruid).exec.call(this, 'FileReader', 'read', op, blob);
        }
    }
    __$coverCall('src/javascript/file/FileReader.js', '3913:3933');
    FileReader.EMPTY = 0;
    __$coverCall('src/javascript/file/FileReader.js', '4079:4101');
    FileReader.LOADING = 1;
    __$coverCall('src/javascript/file/FileReader.js', '4223:4242');
    FileReader.DONE = 2;
    __$coverCall('src/javascript/file/FileReader.js', '4246:4289');
    FileReader.prototype = EventTarget.instance;
    __$coverCall('src/javascript/file/FileReader.js', '4293:4310');
    return FileReader;
});

// Included from: src/javascript/core/utils/Url.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/utils/Url.js", "/**\n * Url.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, laxcomma:true */\n/*global define:true */\n\ndefine('moxie/core/utils/Url', [], function() {\n\t/**\n\tParse url into separate components and fill in absent parts with parts from current url,\n\tbased on https://raw.github.com/kvz/phpjs/master/functions/url/parse_url.js\n\n\t@method parseUrl\n\t@static\n\t@param {String} str Url to parse (defaults to empty string if undefined)\n\t@return {Object} Hash containing extracted uri components\n\t*/\n\tvar parseUrl = function(str) {\n\t\tvar key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment']\n\t\t, i = key.length\n\t\t, ports = {\n\t\t\thttp: 80,\n\t\t\thttps: 443\n\t\t}\n\t\t, uri = {}\n\t\t, regex = /^(?:([^:\\/?#]+):)?(?:\\/\\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?()(?:(()(?:(?:[^?#\\/]*\\/)*)()(?:[^?#]*))(?:\\\\?([^#]*))?(?:#(.*))?)/\n\t\t, m = regex.exec(str || '') // default to empty string if undefined\n\t\t;\n\t\t\t\t\t\n\t\twhile (i--) {\n\t\t\tif (m[i]) {\n\t\t\t  uri[key[i]] = m[i];\n\t\t\t}\n\t\t}\n\n\t\tif (/^[^\\/]/.test(uri.path) && !uri.scheme) { // when url is relative, we need to figure out the path ourselves\n\t\t\tvar path = document.location.pathname;\n\t\t\t// if path ends with a filename, strip it\n\t\t\tif (!/(\\/|\\/[^\\.]+)$/.test(path)) {\n\t\t\t\tpath = path.replace(/[^\\/]+$/, '');\n\t\t\t}\n\t\t\turi.host = document.location.hostname;\n\t\t\turi.path = path + (uri.path || ''); // site may reside at domain.com or domain.com/subdir\n\t\t}\n\n\t\tif (!uri.scheme) {\n\t\t\turi.scheme = document.location.protocol.replace(/:$/, '');\n\t\t}\n\n\t\tif (!uri.host) {\n\t\t\turi.host = document.location.hostname;\n\t\t}\n\n\t\tif (!uri.port) {\n\t\t\turi.port = document.location.port || ports[uri.scheme] || 80;\n\t\t} \n\t\turi.port = parseInt(uri.port, 10);\n\n\t\tif (!uri.path) {\n\t\t\turi.path = \"/\";\n\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\n\t\tdelete uri.source;\n\t\treturn uri;\n\t};\n\n\t/**\n\tResolve url - among other things will turn relative url to absolute\n\n\t@method resolveUrl\n\t@static\n\t@param {String} url Either absolute or relative\n\t@return {String} Resolved, absolute url\n\t*/\n\tvar resolveUrl = function(url) {\n\t\tvar ports = { // we ignore default ports\n\t\t\thttp: 80,\n\t\t\thttps: 443\n\t\t}\n\t\t, urlp = parseUrl(url)\n\t\t;\n\n\t\treturn urlp.scheme + '://' + urlp.host + (urlp.port !== ports[urlp.scheme] ? ':' + urlp.port : '') + urlp.path + (urlp.query ? urlp.query : '');\n\t};\n\n\t/**\n\tCheck if specified url has the same origin as the current document\n\n\t@method hasSameOrigin\n\t@param {String|Object} url\n\t@return {Boolean}\n\t*/\n\tvar hasSameOrigin = function(url) {\n\t\tfunction origin(url) {\n\t\t\treturn [url.scheme, url.host, url.port].join('/');\n\t\t}\n\t\t\t\n\t\tif (typeof url === 'string') {\n\t\t\turl = parseUrl(url);\n\t\t}\t\n\t\t\n\t\treturn origin(parseUrl()) === origin(url);\n\t};\n\n\treturn {\n\t\tparseUrl: parseUrl,\n\t\tresolveUrl: resolveUrl,\n\t\thasSameOrigin: hasSameOrigin\n\t};\n});");
__$coverInitRange("src/javascript/core/utils/Url.js", "356:3085");
__$coverInitRange("src/javascript/core/utils/Url.js", "742:2112");
__$coverInitRange("src/javascript/core/utils/Url.js", "2314:2600");
__$coverInitRange("src/javascript/core/utils/Url.js", "2752:2987");
__$coverInitRange("src/javascript/core/utils/Url.js", "2991:3081");
__$coverInitRange("src/javascript/core/utils/Url.js", "775:1240");
__$coverInitRange("src/javascript/core/utils/Url.js", "1241:1241");
__$coverInitRange("src/javascript/core/utils/Url.js", "1251:1312");
__$coverInitRange("src/javascript/core/utils/Url.js", "1317:1737");
__$coverInitRange("src/javascript/core/utils/Url.js", "1742:1825");
__$coverInitRange("src/javascript/core/utils/Url.js", "1830:1891");
__$coverInitRange("src/javascript/core/utils/Url.js", "1896:1980");
__$coverInitRange("src/javascript/core/utils/Url.js", "1985:2018");
__$coverInitRange("src/javascript/core/utils/Url.js", "2023:2061");
__$coverInitRange("src/javascript/core/utils/Url.js", "2077:2094");
__$coverInitRange("src/javascript/core/utils/Url.js", "2098:2108");
__$coverInitRange("src/javascript/core/utils/Url.js", "1268:1308");
__$coverInitRange("src/javascript/core/utils/Url.js", "1285:1303");
__$coverInitRange("src/javascript/core/utils/Url.js", "1432:1469");
__$coverInitRange("src/javascript/core/utils/Url.js", "1519:1598");
__$coverInitRange("src/javascript/core/utils/Url.js", "1603:1640");
__$coverInitRange("src/javascript/core/utils/Url.js", "1645:1679");
__$coverInitRange("src/javascript/core/utils/Url.js", "1559:1593");
__$coverInitRange("src/javascript/core/utils/Url.js", "1764:1821");
__$coverInitRange("src/javascript/core/utils/Url.js", "1850:1887");
__$coverInitRange("src/javascript/core/utils/Url.js", "1916:1976");
__$coverInitRange("src/javascript/core/utils/Url.js", "2043:2057");
__$coverInitRange("src/javascript/core/utils/Url.js", "2349:2447");
__$coverInitRange("src/javascript/core/utils/Url.js", "2448:2448");
__$coverInitRange("src/javascript/core/utils/Url.js", "2453:2596");
__$coverInitRange("src/javascript/core/utils/Url.js", "2790:2869");
__$coverInitRange("src/javascript/core/utils/Url.js", "2877:2934");
__$coverInitRange("src/javascript/core/utils/Url.js", "2942:2983");
__$coverInitRange("src/javascript/core/utils/Url.js", "2816:2865");
__$coverInitRange("src/javascript/core/utils/Url.js", "2911:2930");
__$coverCall('src/javascript/core/utils/Url.js', '356:3085');
define('moxie/core/utils/Url', [], function () {
    __$coverCall('src/javascript/core/utils/Url.js', '742:2112');
    var parseUrl = function (str) {
        __$coverCall('src/javascript/core/utils/Url.js', '775:1240');
        var key = [
                'source',
                'scheme',
                'authority',
                'userInfo',
                'user',
                'pass',
                'host',
                'port',
                'relative',
                'path',
                'directory',
                'file',
                'query',
                'fragment'
            ], i = key.length, ports = {
                http: 80,
                https: 443
            }, uri = {}, regex = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/, m = regex.exec(str || '');
        __$coverCall('src/javascript/core/utils/Url.js', '1241:1241');
        ;
        __$coverCall('src/javascript/core/utils/Url.js', '1251:1312');
        while (i--) {
            __$coverCall('src/javascript/core/utils/Url.js', '1268:1308');
            if (m[i]) {
                __$coverCall('src/javascript/core/utils/Url.js', '1285:1303');
                uri[key[i]] = m[i];
            }
        }
        __$coverCall('src/javascript/core/utils/Url.js', '1317:1737');
        if (/^[^\/]/.test(uri.path) && !uri.scheme) {
            __$coverCall('src/javascript/core/utils/Url.js', '1432:1469');
            var path = document.location.pathname;
            __$coverCall('src/javascript/core/utils/Url.js', '1519:1598');
            if (!/(\/|\/[^\.]+)$/.test(path)) {
                __$coverCall('src/javascript/core/utils/Url.js', '1559:1593');
                path = path.replace(/[^\/]+$/, '');
            }
            __$coverCall('src/javascript/core/utils/Url.js', '1603:1640');
            uri.host = document.location.hostname;
            __$coverCall('src/javascript/core/utils/Url.js', '1645:1679');
            uri.path = path + (uri.path || '');
        }
        __$coverCall('src/javascript/core/utils/Url.js', '1742:1825');
        if (!uri.scheme) {
            __$coverCall('src/javascript/core/utils/Url.js', '1764:1821');
            uri.scheme = document.location.protocol.replace(/:$/, '');
        }
        __$coverCall('src/javascript/core/utils/Url.js', '1830:1891');
        if (!uri.host) {
            __$coverCall('src/javascript/core/utils/Url.js', '1850:1887');
            uri.host = document.location.hostname;
        }
        __$coverCall('src/javascript/core/utils/Url.js', '1896:1980');
        if (!uri.port) {
            __$coverCall('src/javascript/core/utils/Url.js', '1916:1976');
            uri.port = document.location.port || ports[uri.scheme] || 80;
        }
        __$coverCall('src/javascript/core/utils/Url.js', '1985:2018');
        uri.port = parseInt(uri.port, 10);
        __$coverCall('src/javascript/core/utils/Url.js', '2023:2061');
        if (!uri.path) {
            __$coverCall('src/javascript/core/utils/Url.js', '2043:2057');
            uri.path = '/';
        }
        __$coverCall('src/javascript/core/utils/Url.js', '2077:2094');
        delete uri.source;
        __$coverCall('src/javascript/core/utils/Url.js', '2098:2108');
        return uri;
    };
    __$coverCall('src/javascript/core/utils/Url.js', '2314:2600');
    var resolveUrl = function (url) {
        __$coverCall('src/javascript/core/utils/Url.js', '2349:2447');
        var ports = {
                http: 80,
                https: 443
            }, urlp = parseUrl(url);
        __$coverCall('src/javascript/core/utils/Url.js', '2448:2448');
        ;
        __$coverCall('src/javascript/core/utils/Url.js', '2453:2596');
        return urlp.scheme + '://' + urlp.host + (urlp.port !== ports[urlp.scheme] ? ':' + urlp.port : '') + urlp.path + (urlp.query ? urlp.query : '');
    };
    __$coverCall('src/javascript/core/utils/Url.js', '2752:2987');
    var hasSameOrigin = function (url) {
        __$coverCall('src/javascript/core/utils/Url.js', '2790:2869');
        function origin(url) {
            __$coverCall('src/javascript/core/utils/Url.js', '2816:2865');
            return [
                url.scheme,
                url.host,
                url.port
            ].join('/');
        }
        __$coverCall('src/javascript/core/utils/Url.js', '2877:2934');
        if (typeof url === 'string') {
            __$coverCall('src/javascript/core/utils/Url.js', '2911:2930');
            url = parseUrl(url);
        }
        __$coverCall('src/javascript/core/utils/Url.js', '2942:2983');
        return origin(parseUrl()) === origin(url);
    };
    __$coverCall('src/javascript/core/utils/Url.js', '2991:3081');
    return {
        parseUrl: parseUrl,
        resolveUrl: resolveUrl,
        hasSameOrigin: hasSameOrigin
    };
});

// Included from: src/javascript/runtime/RuntimeTarget.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/RuntimeTarget.js", "/**\n * RuntimeTarget.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/runtime/RuntimeTarget', [\n\t'moxie/core/utils/Basic',\n\t'moxie/runtime/RuntimeClient',\n\t\"moxie/core/EventTarget\"\n], function(Basic, RuntimeClient, EventTarget) {\n\t/**\n\tInstance of this class can be used as a target for the events dispatched by shims,\n\twhen allowing them onto components is for either reason inappropriate\n\n\t@class RuntimeTarget\n\t@constructor\n\t@protected\n\t@extends EventTarget\n\t*/\n\tfunction RuntimeTarget() {\n\t\tthis.uid = Basic.guid('uid_');\n\t\t\n\t\tRuntimeClient.call(this);\n\n\t\tthis.destroy = function() {\n\t\t\tthis.disconnectRuntime();\n\t\t\tthis.unbindAll();\n\t\t};\n\t}\n\n\tRuntimeTarget.prototype = EventTarget.instance;\n\n\treturn RuntimeTarget;\n});");
__$coverInitRange("src/javascript/runtime/RuntimeTarget.js", "351:1017");
__$coverInitRange("src/javascript/runtime/RuntimeTarget.js", "761:939");
__$coverInitRange("src/javascript/runtime/RuntimeTarget.js", "943:989");
__$coverInitRange("src/javascript/runtime/RuntimeTarget.js", "993:1013");
__$coverInitRange("src/javascript/runtime/RuntimeTarget.js", "790:819");
__$coverInitRange("src/javascript/runtime/RuntimeTarget.js", "826:850");
__$coverInitRange("src/javascript/runtime/RuntimeTarget.js", "855:936");
__$coverInitRange("src/javascript/runtime/RuntimeTarget.js", "886:910");
__$coverInitRange("src/javascript/runtime/RuntimeTarget.js", "915:931");
__$coverCall('src/javascript/runtime/RuntimeTarget.js', '351:1017');
define('moxie/runtime/RuntimeTarget', [
    'moxie/core/utils/Basic',
    'moxie/runtime/RuntimeClient',
    'moxie/core/EventTarget'
], function (Basic, RuntimeClient, EventTarget) {
    __$coverCall('src/javascript/runtime/RuntimeTarget.js', '761:939');
    function RuntimeTarget() {
        __$coverCall('src/javascript/runtime/RuntimeTarget.js', '790:819');
        this.uid = Basic.guid('uid_');
        __$coverCall('src/javascript/runtime/RuntimeTarget.js', '826:850');
        RuntimeClient.call(this);
        __$coverCall('src/javascript/runtime/RuntimeTarget.js', '855:936');
        this.destroy = function () {
            __$coverCall('src/javascript/runtime/RuntimeTarget.js', '886:910');
            this.disconnectRuntime();
            __$coverCall('src/javascript/runtime/RuntimeTarget.js', '915:931');
            this.unbindAll();
        };
    }
    __$coverCall('src/javascript/runtime/RuntimeTarget.js', '943:989');
    RuntimeTarget.prototype = EventTarget.instance;
    __$coverCall('src/javascript/runtime/RuntimeTarget.js', '993:1013');
    return RuntimeTarget;
});

// Included from: src/javascript/xhr/FormData.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/xhr/FormData.js", "/**\n * FormData.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true */\n\ndefine(\"moxie/xhr/FormData\", [\n\t\"moxie/core/Exceptions\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/file/Blob\"\n], function(x, Basic, Blob) {\n\t/**\n\tFormData\n\n\t@class FormData\n\t@constructor\n\t*/\n\tfunction FormData() {\n\t\tvar _blobField, _fields = {}, _name = \"\";\n\n\t\tBasic.extend(this, {\n\t\t\t/**\n\t\t\tAppend another key-value pair to the FormData object\n\n\t\t\t@method append\n\t\t\t@param {String} name Name for the new field\n\t\t\t@param {String|Blob|Array|Object} value Value for the field\n\t\t\t*/\n\t\t\tappend: function(name, value) {\n\t\t\t\tvar self = this, valueType = Basic.typeOf(value);\n\n\t\t\t\tif (value instanceof Blob) {\n\t\t\t\t\tif (_blobField) { \n\t\t\t\t\t\tdelete _fields[_blobField];\n\t\t\t\t\t}\n\t\t\t\t\t_blobField = name; \n\t\t\t\t\t_fields[name] = [value]; // unfortunately we can only send single Blob in one FormData\n\t\t\t\t} else if ('array' === valueType) {\n\t\t\t\t\tname += '[]';\n\n\t\t\t\t\tBasic.each(value, function(value) {\n\t\t\t\t\t\tself.append.call(self, name, value);\n\t\t\t\t\t});\n\t\t\t\t} else if ('object' === valueType) {\n\t\t\t\t\tBasic.each(value, function(value, key) {\n\t\t\t\t\t\tself.append.call(self, name + '[' + key + ']', value);\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tvalue = value.toString(); // according to specs value might be either Blob or String\n\n\t\t\t\t\tif (!_fields[name]) {\n\t\t\t\t\t\t_fields[name] = [];\n\t\t\t\t\t} \n\t\t\t\t\t_fields[name].push(value);\n\t\t\t\t}\n\t\t\t},\n\n\t\t\t/**\n\t\t\tChecks if FormData contains Blob.\n\n\t\t\t@method hasBlob\n\t\t\t@return {Boolean}\n\t\t\t*/\n\t\t\thasBlob: function() {\n\t\t\t\treturn !!_blobField;\n\t\t\t},\n\n\t\t\t/**\n\t\t\tRetrieves blob.\n\n\t\t\t@method geBlob\n\t\t\t@return {Object} Either Blob if found or null\n\t\t\t*/\n\t\t\tgetBlob: function() {\n\t\t\t\treturn _fields[_blobField] && _fields[_blobField][0] || null;\n\t\t\t},\n\n\t\t\t/**\n\t\t\tRetrieves blob field name.\n\n\t\t\t@method geBlobName\n\t\t\t@return {String} Either Blob field name or null\n\t\t\t*/\n\t\t\tgetBlobName: function() {\n\t\t\t\treturn _blobField || null;\n\t\t\t},\n\n\t\t\t/**\n\t\t\tLoop over the fields in FormData and invoke the callback for each of them.\n\n\t\t\t@method each\n\t\t\t@param {Function} cb Callback to call for each field\n\t\t\t*/\n\t\t\teach: function(cb) {\n\t\t\t\tvar self = this;\n\n\t\t\t\tBasic.each(_fields, function(value, name) {\n\t\t\t\t\tBasic.each(value, function(value) {\n\t\t\t\t\t\tcb(value, name);\n\t\t\t\t\t});\n\t\t\t\t});\n\t\t\t},\n\n\t\t\tdestroy: function() {\n\t\t\t\t_blobField = null;\n\t\t\t\t_name = \"\";\n\t\t\t\t_fields = {};\n\t\t\t}\n\t\t});\n\t}\n\n\treturn FormData;\n});\n");
__$coverInitRange("src/javascript/xhr/FormData.js", "347:2638");
__$coverInitRange("src/javascript/xhr/FormData.js", "532:2615");
__$coverInitRange("src/javascript/xhr/FormData.js", "2619:2634");
__$coverInitRange("src/javascript/xhr/FormData.js", "556:596");
__$coverInitRange("src/javascript/xhr/FormData.js", "601:2612");
__$coverInitRange("src/javascript/xhr/FormData.js", "859:907");
__$coverInitRange("src/javascript/xhr/FormData.js", "914:1636");
__$coverInitRange("src/javascript/xhr/FormData.js", "948:1006");
__$coverInitRange("src/javascript/xhr/FormData.js", "1013:1030");
__$coverInitRange("src/javascript/xhr/FormData.js", "1038:1061");
__$coverInitRange("src/javascript/xhr/FormData.js", "973:999");
__$coverInitRange("src/javascript/xhr/FormData.js", "1170:1182");
__$coverInitRange("src/javascript/xhr/FormData.js", "1190:1276");
__$coverInitRange("src/javascript/xhr/FormData.js", "1232:1267");
__$coverInitRange("src/javascript/xhr/FormData.js", "1324:1433");
__$coverInitRange("src/javascript/xhr/FormData.js", "1371:1424");
__$coverInitRange("src/javascript/xhr/FormData.js", "1453:1477");
__$coverInitRange("src/javascript/xhr/FormData.js", "1544:1597");
__$coverInitRange("src/javascript/xhr/FormData.js", "1605:1630");
__$coverInitRange("src/javascript/xhr/FormData.js", "1572:1590");
__$coverInitRange("src/javascript/xhr/FormData.js", "1765:1784");
__$coverInitRange("src/javascript/xhr/FormData.js", "1922:1982");
__$coverInitRange("src/javascript/xhr/FormData.js", "2141:2166");
__$coverInitRange("src/javascript/xhr/FormData.js", "2367:2382");
__$coverInitRange("src/javascript/xhr/FormData.js", "2389:2512");
__$coverInitRange("src/javascript/xhr/FormData.js", "2438:2504");
__$coverInitRange("src/javascript/xhr/FormData.js", "2480:2495");
__$coverInitRange("src/javascript/xhr/FormData.js", "2550:2567");
__$coverInitRange("src/javascript/xhr/FormData.js", "2573:2583");
__$coverInitRange("src/javascript/xhr/FormData.js", "2589:2601");
__$coverCall('src/javascript/xhr/FormData.js', '347:2638');
define('moxie/xhr/FormData', [
    'moxie/core/Exceptions',
    'moxie/core/utils/Basic',
    'moxie/file/Blob'
], function (x, Basic, Blob) {
    __$coverCall('src/javascript/xhr/FormData.js', '532:2615');
    function FormData() {
        __$coverCall('src/javascript/xhr/FormData.js', '556:596');
        var _blobField, _fields = {}, _name = '';
        __$coverCall('src/javascript/xhr/FormData.js', '601:2612');
        Basic.extend(this, {
            append: function (name, value) {
                __$coverCall('src/javascript/xhr/FormData.js', '859:907');
                var self = this, valueType = Basic.typeOf(value);
                __$coverCall('src/javascript/xhr/FormData.js', '914:1636');
                if (value instanceof Blob) {
                    __$coverCall('src/javascript/xhr/FormData.js', '948:1006');
                    if (_blobField) {
                        __$coverCall('src/javascript/xhr/FormData.js', '973:999');
                        delete _fields[_blobField];
                    }
                    __$coverCall('src/javascript/xhr/FormData.js', '1013:1030');
                    _blobField = name;
                    __$coverCall('src/javascript/xhr/FormData.js', '1038:1061');
                    _fields[name] = [value];
                } else if ('array' === valueType) {
                    __$coverCall('src/javascript/xhr/FormData.js', '1170:1182');
                    name += '[]';
                    __$coverCall('src/javascript/xhr/FormData.js', '1190:1276');
                    Basic.each(value, function (value) {
                        __$coverCall('src/javascript/xhr/FormData.js', '1232:1267');
                        self.append.call(self, name, value);
                    });
                } else if ('object' === valueType) {
                    __$coverCall('src/javascript/xhr/FormData.js', '1324:1433');
                    Basic.each(value, function (value, key) {
                        __$coverCall('src/javascript/xhr/FormData.js', '1371:1424');
                        self.append.call(self, name + '[' + key + ']', value);
                    });
                } else {
                    __$coverCall('src/javascript/xhr/FormData.js', '1453:1477');
                    value = value.toString();
                    __$coverCall('src/javascript/xhr/FormData.js', '1544:1597');
                    if (!_fields[name]) {
                        __$coverCall('src/javascript/xhr/FormData.js', '1572:1590');
                        _fields[name] = [];
                    }
                    __$coverCall('src/javascript/xhr/FormData.js', '1605:1630');
                    _fields[name].push(value);
                }
            },
            hasBlob: function () {
                __$coverCall('src/javascript/xhr/FormData.js', '1765:1784');
                return !!_blobField;
            },
            getBlob: function () {
                __$coverCall('src/javascript/xhr/FormData.js', '1922:1982');
                return _fields[_blobField] && _fields[_blobField][0] || null;
            },
            getBlobName: function () {
                __$coverCall('src/javascript/xhr/FormData.js', '2141:2166');
                return _blobField || null;
            },
            each: function (cb) {
                __$coverCall('src/javascript/xhr/FormData.js', '2367:2382');
                var self = this;
                __$coverCall('src/javascript/xhr/FormData.js', '2389:2512');
                Basic.each(_fields, function (value, name) {
                    __$coverCall('src/javascript/xhr/FormData.js', '2438:2504');
                    Basic.each(value, function (value) {
                        __$coverCall('src/javascript/xhr/FormData.js', '2480:2495');
                        cb(value, name);
                    });
                });
            },
            destroy: function () {
                __$coverCall('src/javascript/xhr/FormData.js', '2550:2567');
                _blobField = null;
                __$coverCall('src/javascript/xhr/FormData.js', '2573:2583');
                _name = '';
                __$coverCall('src/javascript/xhr/FormData.js', '2589:2601');
                _fields = {};
            }
        });
    }
    __$coverCall('src/javascript/xhr/FormData.js', '2619:2634');
    return FormData;
});

// Included from: src/javascript/xhr/XMLHttpRequest.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/xhr/XMLHttpRequest.js", "/**\n * XMLHttpRequest.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true, evil:false */\n/*global define:true, ActiveXObject:true */\n\ndefine(\"moxie/xhr/XMLHttpRequest\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/core/EventTarget\",\n\t\"moxie/core/utils/Encode\",\n\t\"moxie/core/utils/Url\",\n\t\"moxie/runtime/RuntimeTarget\",\n\t\"moxie/file/Blob\",\n\t\"moxie/xhr/FormData\",\n\t\"moxie/core/utils/Env\",\n\t\"moxie/core/utils/Mime\"\n], function(Basic, x, EventTarget, Encode, Url, RuntimeTarget, Blob, FormData, Env, Mime) {\n\tvar undef;\n\n\tvar httpCode = {\n\t\t100: 'Continue',\n\t\t101: 'Switching Protocols',\n\t\t102: 'Processing',\n\n\t\t200: 'OK',\n\t\t201: 'Created',\n\t\t202: 'Accepted',\n\t\t203: 'Non-Authoritative Information',\n\t\t204: 'No Content',\n\t\t205: 'Reset Content',\n\t\t206: 'Partial Content',\n\t\t207: 'Multi-Status',\n\t\t226: 'IM Used',\n\n\t\t300: 'Multiple Choices',\n\t\t301: 'Moved Permanently',\n\t\t302: 'Found',\n\t\t303: 'See Other',\n\t\t304: 'Not Modified',\n\t\t305: 'Use Proxy',\n\t\t306: 'Reserved',\n\t\t307: 'Temporary Redirect',\n\n\t\t400: 'Bad Request',\n\t\t401: 'Unauthorized',\n\t\t402: 'Payment Required',\n\t\t403: 'Forbidden',\n\t\t404: 'Not Found',\n\t\t405: 'Method Not Allowed',\n\t\t406: 'Not Acceptable',\n\t\t407: 'Proxy Authentication Required',\n\t\t408: 'Request Timeout',\n\t\t409: 'Conflict',\n\t\t410: 'Gone',\n\t\t411: 'Length Required',\n\t\t412: 'Precondition Failed',\n\t\t413: 'Request Entity Too Large',\n\t\t414: 'Request-URI Too Long',\n\t\t415: 'Unsupported Media Type',\n\t\t416: 'Requested Range Not Satisfiable',\n\t\t417: 'Expectation Failed',\n\t\t422: 'Unprocessable Entity',\n\t\t423: 'Locked',\n\t\t424: 'Failed Dependency',\n\t\t426: 'Upgrade Required',\n\n\t\t500: 'Internal Server Error',\n\t\t501: 'Not Implemented',\n\t\t502: 'Bad Gateway',\n\t\t503: 'Service Unavailable',\n\t\t504: 'Gateway Timeout',\n\t\t505: 'HTTP Version Not Supported',\n\t\t506: 'Variant Also Negotiates',\n\t\t507: 'Insufficient Storage',\n\t\t510: 'Not Extended'\n\t};\n\n\tfunction XMLHttpRequestUpload() {\n\t\tthis.uid = Basic.guid('uid_');\n\t}\n\t\n\tXMLHttpRequestUpload.prototype = EventTarget.instance;\n\n\t/**\n\tImplementation of XMLHttpRequest\n\n\t@class XMLHttpRequest\n\t@constructor\n\t@uses RuntimeClient\n\t@extends EventTarget\n\t*/\n\tvar dispatches = ['loadstart', 'progress', 'abort', 'error', 'load', 'timeout', 'loadend']; // & readystatechange (for historical reasons)\n\t\n\tvar NATIVE = 1, RUNTIME = 2;\n\t\t\t\t\t\n\tfunction XMLHttpRequest() {\n\t\tvar self = this,\n\t\t\t// this (together with _p() @see below) is here to gracefully upgrade to setter/getter syntax where possible\n\t\t\tprops = {\n\t\t\t\t/**\n\t\t\t\tThe amount of milliseconds a request can take before being terminated. Initially zero. Zero means there is no timeout.\n\n\t\t\t\t@property timeout\n\t\t\t\t@type Number\n\t\t\t\t@default 0\n\t\t\t\t*/\n\t\t\t\ttimeout: 0,\n\n\t\t\t\t/**\n\t\t\t\tCurrent state, can take following values:\n\t\t\t\tUNSENT (numeric value 0)\n\t\t\t\tThe object has been constructed.\n\n\t\t\t\tOPENED (numeric value 1)\n\t\t\t\tThe open() method has been successfully invoked. During this state request headers can be set using setRequestHeader() and the request can be made using the send() method.\n\n\t\t\t\tHEADERS_RECEIVED (numeric value 2)\n\t\t\t\tAll redirects (if any) have been followed and all HTTP headers of the final response have been received. Several response members of the object are now available.\n\n\t\t\t\tLOADING (numeric value 3)\n\t\t\t\tThe response entity body is being received.\n\n\t\t\t\tDONE (numeric value 4)\n\n\t\t\t\t@property readyState\n\t\t\t\t@type Number\n\t\t\t\t@default 0 (UNSENT)\n\t\t\t\t*/\n\t\t\t\treadyState: XMLHttpRequest.UNSENT,\n\n\t\t\t\t/**\n\t\t\t\tTrue when user credentials are to be included in a cross-origin request. False when they are to be excluded\n\t\t\t\tin a cross-origin request and when cookies are to be ignored in its response. Initially false.\n\n\t\t\t\t@property withCredentials\n\t\t\t\t@type Boolean\n\t\t\t\t@default false\n\t\t\t\t*/\n\t\t\t\twithCredentials: false,\n\n\t\t\t\t/**\n\t\t\t\tReturns the HTTP status code.\n\n\t\t\t\t@property status\n\t\t\t\t@type Number\n\t\t\t\t@default 0\n\t\t\t\t*/\n\t\t\t\tstatus: 0,\n\n\t\t\t\t/**\n\t\t\t\tReturns the HTTP status text.\n\n\t\t\t\t@property statusText\n\t\t\t\t@type String\n\t\t\t\t*/\n\t\t\t\tstatusText: \"\",\n\n\t\t\t\t/**\n\t\t\t\tReturns the response type. Can be set to change the response type. Values are:\n\t\t\t\tthe empty string (default), \"arraybuffer\", \"blob\", \"document\", \"json\", and \"text\".\n\t\t\t\t\n\t\t\t\t@property responseType\n\t\t\t\t@type String\n\t\t\t\t*/\n\t\t\t\tresponseType: \"\",\n\n\t\t\t\t/**\n\t\t\t\tReturns the document response entity body.\n\t\t\t\t\n\t\t\t\tThrows an \"InvalidStateError\" exception if responseType is not the empty string or \"document\".\n\n\t\t\t\t@property responseXML\n\t\t\t\t@type Document\n\t\t\t\t*/\n\t\t\t\tresponseXML: null,\n\n\t\t\t\t/**\n\t\t\t\tReturns the text response entity body.\n\t\t\t\t\n\t\t\t\tThrows an \"InvalidStateError\" exception if responseType is not the empty string or \"text\".\n\n\t\t\t\t@property responseText\n\t\t\t\t@type String\n\t\t\t\t*/\n\t\t\t\tresponseText: null,\n\n\t\t\t\t/**\n\t\t\t\tReturns the response entity body (http://www.w3.org/TR/XMLHttpRequest/#response-entity-body).\n\t\t\t\tCan become: ArrayBuffer, Blob, Document, JSON, Text\n\t\t\t\t\n\t\t\t\t@property response\n\t\t\t\t@type Mixed\n\t\t\t\t*/\n\t\t\t\tresponse: null\n\t\t\t},\n\n\t\t\t_async = true,\n\t\t\t_url,\n\t\t\t_method,\n\t\t\t_headers = {},\n\t\t\t_user,\n\t\t\t_password,\n\t\t\t_encoding = null,\n\t\t\t_mimeType = null,\n\n\t\t\t// flags\n\t\t\t_sync_flag = false,\n\t\t\t_send_flag = false,\n\t\t\t_upload_events_flag = false,\n\t\t\t_upload_complete_flag = false,\n\t\t\t_error_flag = false,\n\t\t\t_same_origin_flag = false,\n\n\t\t\t// times\n\t\t\t_start_time,\n\t\t\t_timeoutset_time,\n\n\t\t\t_finalMime = null,\n\t\t\t_finalCharset = null,\n\n\t\t\t_options = {},\n\t\t\t_xhr,\n\t\t\t_mode = NATIVE;\n\n\t\t\n\t\tBasic.extend(this, props, {\n\t\t\t/**\n\t\t\tUnique id of the component\n\n\t\t\t@property uid\n\t\t\t@type String\n\t\t\t*/\n\t\t\tuid: Basic.guid('uid_'),\n\t\t\t\n\t\t\t/**\n\t\t\tTarget for Upload events\n\n\t\t\t@property upload\n\t\t\t@type XMLHttpRequestUpload\n\t\t\t*/\n\t\t\tupload: new XMLHttpRequestUpload(),\n\t\t\t\n\n\t\t\t/**\n\t\t\tSets the request method, request URL, synchronous flag, request username, and request password.\n\n\t\t\tThrows a \"SyntaxError\" exception if one of the following is true:\n\n\t\t\tmethod is not a valid HTTP method.\n\t\t\turl cannot be resolved.\n\t\t\turl contains the \"user:password\" format in the userinfo production.\n\t\t\tThrows a \"SecurityError\" exception if method is a case-insensitive match for CONNECT, TRACE or TRACK.\n\n\t\t\tThrows an \"InvalidAccessError\" exception if one of the following is true:\n\n\t\t\tEither user or password is passed as argument and the origin of url does not match the XMLHttpRequest origin.\n\t\t\tThere is an associated XMLHttpRequest document and either the timeout attribute is not zero,\n\t\t\tthe withCredentials attribute is true, or the responseType attribute is not the empty string.\n\n\n\t\t\t@method open\n\t\t\t@param {String} method HTTP method to use on request\n\t\t\t@param {String} url URL to request\n\t\t\t@param {Boolean} [async=true] If false request will be done in synchronous manner. Asynchronous by default.\n\t\t\t@param {String} [user] Username to use in HTTP authentication process on server-side\n\t\t\t@param {String} [password] Password to use in HTTP authentication process on server-side\n\t\t\t*/\n\t\t\topen: function(method, url, async, user, password) {\n\t\t\t\tvar urlp;\n\t\t\t\t\n\t\t\t\t// first two arguments are required\n\t\t\t\tif (!method || !url) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.SYNTAX_ERR);\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t// 2 - check if any code point in method is higher than U+00FF or after deflating method it does not match the method\n\t\t\t\tif (/[\\u0100-\\uffff]/.test(method) || Encode.utf8_encode(method) !== method) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.SYNTAX_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 3\n\t\t\t\tif (!!~Basic.inArray(method.toUpperCase(), ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'TRACE', 'TRACK'])) {\n\t\t\t\t\t_method = method.toUpperCase();\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t\n\t\t\t\t// 4 - allowing these methods poses a security risk\n\t\t\t\tif (!!~Basic.inArray(_method, ['CONNECT', 'TRACE', 'TRACK'])) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.SECURITY_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 5\n\t\t\t\turl = Encode.utf8_encode(url);\n\t\t\t\t\n\t\t\t\t// 6 - Resolve url relative to the XMLHttpRequest base URL. If the algorithm returns an error, throw a \"SyntaxError\".\n\t\t\t\turlp = Url.parseUrl(url);\n\n\t\t\t\t_same_origin_flag = Url.hasSameOrigin(urlp);\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t// 7 - manually build up absolute url\n\t\t\t\t_url = Url.resolveUrl(url);\n\t\t\n\t\t\t\t// 9-10, 12-13\n\t\t\t\tif ((user || password) && !_same_origin_flag) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);\n\t\t\t\t}\n\n\t\t\t\t_user = user || urlp.user;\n\t\t\t\t_password = password || urlp.pass;\n\t\t\t\t\n\t\t\t\t// 11\n\t\t\t\t_async = async || true;\n\t\t\t\t\n\t\t\t\tif (_async === false && (_p('timeout') || _p('withCredentials') || _p('responseType') !== \"\")) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t// 14 - terminate abort()\n\t\t\t\t\n\t\t\t\t// 15 - terminate send()\n\n\t\t\t\t// 18\n\t\t\t\t_sync_flag = !_async;\n\t\t\t\t_send_flag = false;\n\t\t\t\t_headers = {};\n\t\t\t\t_reset.call(this);\n\n\t\t\t\t// 19\n\t\t\t\t_p('readyState', XMLHttpRequest.OPENED);\n\t\t\t\t\n\t\t\t\t// 20\n\t\t\t\tthis.convertEventPropsToHandlers(['readystatechange']); // unify event handlers\n\t\t\t\tthis.dispatchEvent('readystatechange');\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tAppends an header to the list of author request headers, or if header is already\n\t\t\tin the list of author request headers, combines its value with value.\n\n\t\t\tThrows an \"InvalidStateError\" exception if the state is not OPENED or if the send() flag is set.\n\t\t\tThrows a \"SyntaxError\" exception if header is not a valid HTTP header field name or if value\n\t\t\tis not a valid HTTP header field value.\n\t\t\t\n\t\t\t@method setRequestHeader\n\t\t\t@param {String} header\n\t\t\t@param {String|Number} value\n\t\t\t*/\n\t\t\tsetRequestHeader: function(header, value) {\n\t\t\t\tvar uaHeaders = [ // these headers are controlled by the user agent\n\t\t\t\t\t\t\"accept-charset\",\n\t\t\t\t\t\t\"accept-encoding\",\n\t\t\t\t\t\t\"access-control-request-headers\",\n\t\t\t\t\t\t\"access-control-request-method\",\n\t\t\t\t\t\t\"connection\",\n\t\t\t\t\t\t\"content-length\",\n\t\t\t\t\t\t\"cookie\",\n\t\t\t\t\t\t\"cookie2\",\n\t\t\t\t\t\t\"content-transfer-encoding\",\n\t\t\t\t\t\t\"date\",\n\t\t\t\t\t\t\"expect\",\n\t\t\t\t\t\t\"host\",\n\t\t\t\t\t\t\"keep-alive\",\n\t\t\t\t\t\t\"origin\",\n\t\t\t\t\t\t\"referer\",\n\t\t\t\t\t\t\"te\",\n\t\t\t\t\t\t\"trailer\",\n\t\t\t\t\t\t\"transfer-encoding\",\n\t\t\t\t\t\t\"upgrade\",\n\t\t\t\t\t\t\"user-agent\",\n\t\t\t\t\t\t\"via\"\n\t\t\t\t\t];\n\t\t\t\t\n\t\t\t\t// 1-2\n\t\t\t\tif (_p('readyState') !== XMLHttpRequest.OPENED || _send_flag) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 3\n\t\t\t\tif (/[\\u0100-\\uffff]/.test(header) || Encode.utf8_encode(header) !== header) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.SYNTAX_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 4\n\t\t\t\t/* this step is seemingly bypassed in browsers, probably to allow various unicode characters in header values\n\t\t\t\tif (/[\\u0100-\\uffff]/.test(value) || Encode.utf8_encode(value) !== value) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.SYNTAX_ERR);\n\t\t\t\t}*/\n\n\t\t\t\theader = Basic.trim(header).toLowerCase();\n\t\t\t\t\n\t\t\t\t// setting of proxy-* and sec-* headers is prohibited by spec\n\t\t\t\tif (!!~Basic.inArray(header, uaHeaders) || /^(proxy\\-|sec\\-)/.test(header)) {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t\t// camelize\n\t\t\t\t// browsers lowercase header names (at least for custom ones)\n\t\t\t\t// header = header.replace(/\\b\\w/g, function($1) { return $1.toUpperCase(); });\n\t\t\t\t\n\t\t\t\tif (!_headers[header]) {\n\t\t\t\t\t_headers[header] = value;\n\t\t\t\t} else {\n\t\t\t\t\t// http://tools.ietf.org/html/rfc2616#section-4.2 (last paragraph)\n\t\t\t\t\t_headers[header] += ', ' + value;\n\t\t\t\t}\n\t\t\t\treturn true;\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tSets the Content-Type header for the response to mime.\n\t\t\tThrows an \"InvalidStateError\" exception if the state is LOADING or DONE.\n\t\t\tThrows a \"SyntaxError\" exception if mime is not a valid media type.\n\n\t\t\t@method overrideMimeType\n\t\t\t@param String mime Mime type to set\n\t\t\t*/\n\t\t\toverrideMimeType: function(mime) {\n\t\t\t\tvar matches, charset;\n\t\t\t\n\t\t\t\t// 1\n\t\t\t\tif (!!~Basic.inArray(_p('readyState'), [XMLHttpRequest.LOADING, XMLHttpRequest.DONE])) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 2\n\t\t\t\tmime = Basic.trim(mime.toLowerCase());\n\n\t\t\t\tif (/;/.test(mime) && (matches = mime.match(/^([^;]+)(?:;\\scharset\\=)?(.*)$/))) {\n\t\t\t\t\tmime = matches[1];\n\t\t\t\t\tif (matches[2]) {\n\t\t\t\t\t\tcharset = matches[2];\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tif (!Mime.mimes[mime]) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.SYNTAX_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 3-4\n\t\t\t\t_finalMime = mime;\n\t\t\t\t_finalCharset = charset;\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tInitiates the request. The optional argument provides the request entity body.\n\t\t\tThe argument is ignored if request method is GET or HEAD.\n\n\t\t\tThrows an \"InvalidStateError\" exception if the state is not OPENED or if the send() flag is set.\n\n\t\t\t@method send\n\t\t\t@param {Blob|Document|String|FormData} [data] Request entity body\n\t\t\t@param {Object} [options] Set of requirements and pre-requisities for runtime initialization\n\t\t\t*/\n\t\t\tsend: function(data, options) {\n\t\t\t\tvar self = this;\n\t\t\t\t\t\n\t\t\t\tif (Basic.typeOf(options) === 'string') {\n\t\t\t\t\t_options = { ruid: options };\n\t\t\t\t} else if (!options) {\n\t\t\t\t\t_options = {};\n\t\t\t\t} else {\n\t\t\t\t\t_options = options;\n\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\tthis.convertEventPropsToHandlers(dispatches);\n\t\t\t\tthis.upload.convertEventPropsToHandlers(dispatches);\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t// 1-2\n\t\t\t\tif (this.readyState !== XMLHttpRequest.OPENED || _send_flag) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t// 3\n\t\t\t\tif  (!_canUseNativeXHR()) {\n\t\t\t\t\t\n\t\t\t\t\t// sending Blob\n\t\t\t\t\tif (data instanceof Blob) {\n\t\t\t\t\t\t_options.ruid = data.ruid;\n\t\t\t\t\t\t_mimeType = data.type;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t// FormData\n\t\t\t\t\telse if (data instanceof FormData) {\n\t\t\t\t\t\tif (data.hasBlob()) {\n\t\t\t\t\t\t\tvar blob = data.getBlob();\n\t\t\t\t\t\t\t_options.ruid = blob.ruid;\n\t\t\t\t\t\t\t_mimeType = blob.type;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t// DOMString\n\t\t\t\t\telse if (typeof data === 'string') {\n\t\t\t\t\t\t_encoding = 'UTF-8';\n\t\t\t\t\t\t_mimeType = 'text/plain;charset=UTF-8';\n\t\t\t\t\t\t\n\t\t\t\t\t\t// data should be converted to Unicode and encoded as UTF-8\n\t\t\t\t\t\tdata = Encode.utf8_encode(data);\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\t// 4 - storage mutex\n\t\t\t\t// 5\n\t\t\t\t_upload_events_flag = (!_sync_flag && this.upload.hasEventListener()); // DSAP\n\t\t\t\t// 6\n\t\t\t\t_error_flag = false;\n\t\t\t\t// 7\n\t\t\t\t_upload_complete_flag = !data;\n\t\t\t\t// 8 - Asynchronous steps\n\t\t\t\tif (!_sync_flag) {\n\t\t\t\t\t// 8.1\n\t\t\t\t\t_send_flag = true;\n\t\t\t\t\t// 8.2\n\t\t\t\t\tthis.dispatchEvent('readystatechange'); // for historical reasons\n\t\t\t\t\t// 8.3\n\t\t\t\t\t// this.dispatchEvent('loadstart'); // will be dispatched either by native or runtime xhr\n\t\t\t\t\t// 8.4\n\t\t\t\t\tif (!_upload_complete_flag) {\n\t\t\t\t\t\t// this.upload.dispatchEvent('loadstart');\t// will be dispatched either by native or runtime xhr\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t// 8.5 - Return the send() method call, but continue running the steps in this algorithm.\n\t\t\t\t_doXHR.call(self, data);\n\t\t\t},\n\t\t\t\n\t\t\t/**\n\t\t\tCancels any network activity.\n\t\t\t\n\t\t\t@method abort\n\t\t\t*/\n\t\t\tabort: function() {\n\t\t\t\tvar runtime;\n\n\t\t\t\t_error_flag = true;\n\t\t\t\t_sync_flag = false;\n\n\t\t\t\tif (!~Basic.inArray(_p('readyState'), [XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED, XMLHttpRequest.DONE])) {\n\t\t\t\t\t_p('readyState', XMLHttpRequest.DONE);\n\t\t\t\t\t_send_flag = false;\n\n\t\t\t\t\tif (_mode === NATIVE) {\n\t\t\t\t\t\t_xhr.abort();\n\t\t\t\t\t\tthis.dispatchEvent('readystatechange');\n\t\t\t\t\t\t// this.dispatchEvent('progress');\n\t\t\t\t\t\tthis.dispatchEvent('abort');\n\t\t\t\t\t\tthis.dispatchEvent('loadend');\n\n\t\t\t\t\t\tif (!_upload_complete_flag) {\n\t\t\t\t\t\t\t// this.dispatchEvent('progress');\n\t\t\t\t\t\t\tthis.upload.dispatchEvent('abort');\n\t\t\t\t\t\t\tthis.upload.dispatchEvent('loadend');\n\t\t\t\t\t\t}\n\t\t\t\t\t} else if (Basic.typeOf(_xhr.getRuntime) === 'function' && (runtime = _xhr.getRuntime())) {\n\t\t\t\t\t\truntime.exec.call(_xhr, 'XMLHttpRequest', 'abort', _upload_complete_flag);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t\t}\n\n\t\t\t\t\t_upload_complete_flag = true;\n\t\t\t\t} else {\n\t\t\t\t\t_p('readyState', XMLHttpRequest.UNSENT);\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tdestroy: function() {\n\t\t\t\tif (_xhr) {\n\t\t\t\t\tif (Basic.typeOf(_xhr.destroy) === 'function') {\n\t\t\t\t\t\t_xhr.destroy();\n\t\t\t\t\t}\n\t\t\t\t\t_xhr = null;\n\t\t\t\t}\n\n\t\t\t\tthis.unbindAll();\n\n\t\t\t\tif (this.upload) {\n\t\t\t\t\tthis.upload.unbindAll();\n\t\t\t\t\tthis.upload = null;\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\n\t\t/** this is nice, but maybe too lengthy\n\n\t\t// if supported by JS version, set getters/setters for specific properties\n\t\to.defineProperty(this, 'readyState', {\n\t\t\tconfigurable: false,\n\n\t\t\tget: function() {\n\t\t\t\treturn _p('readyState');\n\t\t\t}\n\t\t});\n\n\t\to.defineProperty(this, 'timeout', {\n\t\t\tconfigurable: false,\n\n\t\t\tget: function() {\n\t\t\t\treturn _p('timeout');\n\t\t\t},\n\n\t\t\tset: function(value) {\n\n\t\t\t\tif (_sync_flag) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);\n\t\t\t\t}\n\n\t\t\t\t// timeout still should be measured relative to the start time of request\n\t\t\t\t_timeoutset_time = (new Date).getTime();\n\n\t\t\t\t_p('timeout', value);\n\t\t\t}\n\t\t});\n\n\t\t// the withCredentials attribute has no effect when fetching same-origin resources\n\t\to.defineProperty(this, 'withCredentials', {\n\t\t\tconfigurable: false,\n\n\t\t\tget: function() {\n\t\t\t\treturn _p('withCredentials');\n\t\t\t},\n\n\t\t\tset: function(value) {\n\t\t\t\t// 1-2\n\t\t\t\tif (!~o.inArray(_p('readyState'), [XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED]) || _send_flag) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 3-4\n\t\t\t\tif (_anonymous_flag || _sync_flag) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 5\n\t\t\t\t_p('withCredentials', value);\n\t\t\t}\n\t\t});\n\n\t\to.defineProperty(this, 'status', {\n\t\t\tconfigurable: false,\n\n\t\t\tget: function() {\n\t\t\t\treturn _p('status');\n\t\t\t}\n\t\t});\n\n\t\to.defineProperty(this, 'statusText', {\n\t\t\tconfigurable: false,\n\n\t\t\tget: function() {\n\t\t\t\treturn _p('statusText');\n\t\t\t}\n\t\t});\n\n\t\to.defineProperty(this, 'responseType', {\n\t\t\tconfigurable: false,\n\n\t\t\tget: function() {\n\t\t\t\treturn _p('responseType');\n\t\t\t},\n\n\t\t\tset: function(value) {\n\t\t\t\t// 1\n\t\t\t\tif (!!~o.inArray(_p('readyState'), [XMLHttpRequest.LOADING, XMLHttpRequest.DONE])) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 2\n\t\t\t\tif (_sync_flag) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 3\n\t\t\t\t_p('responseType', value.toLowerCase());\n\t\t\t}\n\t\t});\n\n\t\to.defineProperty(this, 'responseText', {\n\t\t\tconfigurable: false,\n\n\t\t\tget: function() {\n\t\t\t\t// 1\n\t\t\t\tif (!~o.inArray(_p('responseType'), ['', 'text'])) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 2-3\n\t\t\t\tif (_p('readyState') !== XMLHttpRequest.DONE && _p('readyState') !== XMLHttpRequest.LOADING || _error_flag) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\treturn _p('responseText');\n\t\t\t}\n\t\t});\n\n\t\to.defineProperty(this, 'responseXML', {\n\t\t\tconfigurable: false,\n\n\t\t\tget: function() {\n\t\t\t\t// 1\n\t\t\t\tif (!~o.inArray(_p('responseType'), ['', 'document'])) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\t// 2-3\n\t\t\t\tif (_p('readyState') !== XMLHttpRequest.DONE || _error_flag) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\treturn _p('responseXML');\n\t\t\t}\n\t\t});\n\n\t\to.defineProperty(this, 'response', {\n\t\t\tconfigurable: false,\n\n\t\t\tget: function() {\n\t\t\t\tif (!!~o.inArray(_p('responseType'), ['', 'text'])) {\n\t\t\t\t\tif (_p('readyState') !== XMLHttpRequest.DONE && _p('readyState') !== XMLHttpRequest.LOADING || _error_flag) {\n\t\t\t\t\t\treturn '';\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tif (_p('readyState') !== XMLHttpRequest.DONE || _error_flag) {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\n\t\t\t\treturn _p('response');\n\t\t\t}\n\t\t});\n\n\t\t*/\n\n\t\tfunction _p(prop, value) {\n\t\t\tif (!props.hasOwnProperty(prop)) {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tif (arguments.length === 1) { // get\n\t\t\t\treturn Env.can('define_property') ? props[prop] : self[prop];\n\t\t\t} else { // set\n\t\t\t\tif (Env.can('define_property')) {\n\t\t\t\t\tprops[prop] = value;\n\t\t\t\t} else {\n\t\t\t\t\tself[prop] = value;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n/*\n\t\tfunction _toASCII(str, AllowUnassigned, UseSTD3ASCIIRules) {\n\t\t\t// TODO: http://tools.ietf.org/html/rfc3490#section-4.1\n\t\t\treturn str.toLowerCase();\n\t\t}\n\t\t*/\n\t\t\n\t\tfunction _getNativeXHR() {\n\t\t\tif (window.XMLHttpRequest && !(Env.browser === 'IE' && Env.version < 8)) { // IE7 has native XHR but it's buggy\n\t\t\t\treturn new window.XMLHttpRequest();\n\t\t\t} else {\n\t\t\t\treturn (function() {\n\t\t\t\t\tvar progIDs = ['Msxml2.XMLHTTP.6.0', 'Microsoft.XMLHTTP']; // if 6.0 available, use it, otherwise failback to default 3.0\n\t\t\t\t\tfor (var i = 0; i < progIDs.length; i++) {\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\treturn new ActiveXObject(progIDs[i]);\n\t\t\t\t\t\t} catch (ex) {}\n\t\t\t\t\t}\n\t\t\t\t})();\n\t\t\t}\n\t\t}\n\t\t\n\t\t// @credits Sergey Ilinsky\t(http://www.ilinsky.com/)\n\t\tfunction _getDocument(xhr) {\n\t\t\tvar rXML = xhr.responseXML;\n\t\t\tvar rText = xhr.responseText;\n\t\t\t\n\t\t\t// Try parsing responseText (@see: http://www.ilinsky.com/articles/XMLHttpRequest/#bugs-ie-responseXML-content-type)\n\t\t\tif (Env.browser === 'IE' && rText && rXML && !rXML.documentElement && /[^\\/]+\\/[^\\+]+\\+xml/.test(xhr.getResponseHeader(\"Content-Type\"))) {\n\t\t\t\trXML = new window.ActiveXObject(\"Microsoft.XMLDOM\");\n\t\t\t\trXML.async = false;\n\t\t\t\trXML.validateOnParse = false;\n\t\t\t\trXML.loadXML(rText);\n\t\t\t}\n\t\n\t\t\t// Check if there is no error in document\n\t\t\tif (rXML) {\n\t\t\t\tif ((Env.browser === 'IE' && rXML.parseError !== 0) || !rXML.documentElement || rXML.documentElement.tagName === \"parsererror\") {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn rXML;\n\t\t}\n\t\t\n\t\tfunction _doNativeXHR() {\n\t\t\tvar self = this,\n\t\t\t\ttotal = 0;\n\t\t\t\n\t\t\t_mode = NATIVE;\n\t\t\t_xhr = _getNativeXHR();\n\t\t\t\n\t\t\t_xhr.onreadystatechange = function onRSC() {\n\t\t\t\t\n\t\t\t\t// although it is against spec, reading status property for readyState < 3 produces an exception\n\t\t\t\tif (_p('readyState') > XMLHttpRequest.HEADERS_RECEIVED) {\n\t\t\t\t\t_p('status', _xhr.status);\n\t\t\t\t\t_p('statusText', _xhr.statusText);\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t_p('readyState', _xhr.readyState);\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\tself.dispatchEvent('readystatechange');\n\t\t\t\t\n\t\t\t\t// fake Level 2 events\n\t\t\t\tswitch (_p('readyState')) {\n\t\t\t\t\t\n\t\t\t\t\tcase XMLHttpRequest.OPENED:\n\t\t\t\t\t\t// readystatechanged is fired twice for OPENED state (in IE and Mozilla), but only the second one signals that request has been sent\n\t\t\t\t\t\tif (onRSC.loadstartDispatched === undef) {\n\t\t\t\t\t\t\tself.dispatchEvent('loadstart');\n\t\t\t\t\t\t\tonRSC.loadstartDispatched = true;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t\n\t\t\t\t\t// looks like HEADERS_RECEIVED (state 2) is not reported in Opera (or it's old versions), hence we can't really use it\n\t\t\t\t\tcase XMLHttpRequest.HEADERS_RECEIVED:\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\ttotal = _xhr.getResponseHeader('Content-Length') || 0; // old Safari throws an exception here\n\t\t\t\t\t\t} catch(ex) {}\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\n\t\t\t\t\tcase XMLHttpRequest.LOADING:\n\t\t\t\t\t\t// IEs lt 8 throw exception on accessing responseText for readyState < 4\n\t\t\t\t\t\tvar loaded = 0;\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tif (_xhr.responseText) { // responseText was introduced in IE7\n\t\t\t\t\t\t\t\tloaded = _xhr.responseText.length;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t} catch (ex) {\n\t\t\t\t\t\t\tloaded = 0;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tself.dispatchEvent({\n\t\t\t\t\t\t\ttype: 'progress',\n\t\t\t\t\t\t\tlengthComputable: !!total,\n\t\t\t\t\t\t\ttotal: parseInt(total, 10),\n\t\t\t\t\t\t\tloaded: loaded\n\t\t\t\t\t\t});\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\n\t\t\t\t\tcase XMLHttpRequest.DONE:\n\t\t\t\t\t\t// release readystatechange handler (mostly for IE)\n\t\t\t\t\t\t_xhr.onreadystatechange = function() {};\n\n\t\t\t\t\t\t// usually status 0 is returned when server is unreachable, but FF also fails to status 0 for 408 timeout\n\t\t\t\t\t\tif (_xhr.status === 0) {\n\t\t\t\t\t\t\t_error_flag = true;\n\t\t\t\t\t\t\tself.dispatchEvent('error');\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t_p('responseText', _xhr.responseText);\n\t\t\t\t\t\t\t_p('responseXML', _getDocument(_xhr));\n\t\t\t\t\t\t\t_p('response', (_p('responseType') === 'document' ? _p('responseXML') : _p('responseText')));\n\t\t\t\t\t\t\tself.dispatchEvent('load');\n\t\t\t\t\t\t}\n\t\t\t\t\t\t\n\t\t\t\t\t\t_xhr = null;\n\t\t\t\t\t\tself.dispatchEvent('loadend');\n\t\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t};\n\n\t\t\t_xhr.open(_method, _url, _async, _user, _password);\n\t\t\t\n\t\t\t// set request headers\n\t\t\tif (!Basic.isEmptyObj(_headers)) {\n\t\t\t\tBasic.each(_headers, function(value, header) {\n\t\t\t\t\t_xhr.setRequestHeader(header, value);\n\t\t\t\t});\n\t\t\t}\n\t\t\t\n\t\t\t_xhr.send();\n\t\t}\n\t\t\n\t\tfunction _doRuntimeXHR(data) {\n\t\t\tvar self = this;\n\t\t\t\t\n\t\t\t_mode = RUNTIME;\n\n\t\t\t_xhr = new RuntimeTarget();\n\n\t\t\tfunction loadEnd() {\n\t\t\t\t_xhr.destroy();\n\t\t\t\t_xhr = null;\n\t\t\t\tself.dispatchEvent('loadend');\n\t\t\t\tself = null;\n\t\t\t}\n\n\t\t\tfunction exec(runtime) {\n\t\t\t\t_xhr.bind('LoadStart', function(e) {\n\t\t\t\t\t_p('readyState', XMLHttpRequest.LOADING);\n\n\t\t\t\t\tself.dispatchEvent(e);\n\t\t\t\t\t\n\t\t\t\t\tif (_upload_events_flag) {\n\t\t\t\t\t\tself.upload.dispatchEvent(e);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t\t\n\t\t\t\t_xhr.bind('Progress', function(e) {\n\t\t\t\t\t_p('readyState', XMLHttpRequest.LOADING); // LoadStart unreliable (in Flash for example)\n\t\t\t\t\tself.dispatchEvent(e);\n\t\t\t\t});\n\t\t\t\t\n\t\t\t\t_xhr.bind('UploadProgress', function(e) {\n\t\t\t\t\tif (_upload_events_flag) {\n\t\t\t\t\t\tself.upload.dispatchEvent({\n\t\t\t\t\t\t\ttype: 'progress',\n\t\t\t\t\t\t\tlengthComputable: false,\n\t\t\t\t\t\t\ttotal: e.total,\n\t\t\t\t\t\t\tloaded: e.loaded\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t\t\n\t\t\t\t_xhr.bind('Load', function(e) {\n\t\t\t\t\t_p('readyState', XMLHttpRequest.DONE);\n\t\t\t\t\t_p('status', Number(runtime.exec.call(_xhr, 'XMLHttpRequest', 'getStatus') || 0));\n\t\t\t\t\t_p('statusText', httpCode[_p('status')] || \"\");\n\t\t\t\t\t\n\t\t\t\t\t_p('response', runtime.exec.call(_xhr, 'XMLHttpRequest', 'getResponse', _p('responseType')));\n\n\t\t\t\t\tif (!!~Basic.inArray(_p('responseType'), ['text', ''])) {\n\t\t\t\t\t\t_p('responseText', _p('response'));\n\t\t\t\t\t} else if (_p('responseType') === 'document') {\n\t\t\t\t\t\t_p('responseXML', _p('response'));\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\tif (_p('status') > 0) { // status 0 usually means that server is unreachable\n\t\t\t\t\t\tif (_upload_events_flag) {\n\t\t\t\t\t\t\tself.upload.dispatchEvent(e);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tself.dispatchEvent(e);\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_error_flag = true;\n\t\t\t\t\t\tself.dispatchEvent('error');\n\t\t\t\t\t}\n\t\t\t\t\tloadEnd();\n\t\t\t\t});\n\n\t\t\t\t_xhr.bind('Abort', function(e) {\n\t\t\t\t\tself.dispatchEvent(e);\n\t\t\t\t\tloadEnd();\n\t\t\t\t});\n\t\t\t\t\n\t\t\t\t_xhr.bind('Error', function(e) {\n\t\t\t\t\t_error_flag = true;\n\t\t\t\t\t_p('readyState', XMLHttpRequest.DONE);\n\t\t\t\t\tself.dispatchEvent('readystatechange');\n\t\t\t\t\t_upload_complete_flag = true;\n\t\t\t\t\tself.dispatchEvent(e);\n\t\t\t\t\tloadEnd();\n\t\t\t\t});\n\n\t\t\t\truntime.exec.call(_xhr, 'XMLHttpRequest', 'send', {\n\t\t\t\t\turl: _url,\n\t\t\t\t\tmethod: _method,\n\t\t\t\t\tasync: _async,\n\t\t\t\t\tuser: _user,\n\t\t\t\t\tpassword: _password,\n\t\t\t\t\theaders: _headers,\n\t\t\t\t\tmimeType: _mimeType,\n\t\t\t\t\tencoding: _encoding,\n\t\t\t\t\tresponseType: self.responseType,\n\t\t\t\t\toptions: _options\n\t\t\t\t}, data);\n\t\t\t}\n\n\t\t\t// clarify our requirements\n\t\t\t_options.required_caps = Basic.extend({}, _options.required_caps, {\n\t\t\t\treturn_response_type: self.responseType\n\t\t\t});\n\n\t\t\tif (_options.ruid) { // we do not need to wait if we can connect directly\n\t\t\t\texec(_xhr.connectRuntime(_options));\n\t\t\t} else {\n\t\t\t\t_xhr.bind('RuntimeInit', function(e, runtime) {\n\t\t\t\t\texec(runtime);\n\t\t\t\t});\n\t\t\t\t_xhr.bind('RuntimeError', function(e, err) {\n\t\t\t\t\tself.dispatchEvent('RuntimeError', err);\n\t\t\t\t});\n\t\t\t\t_xhr.connectRuntime(_options);\n\t\t\t}\n\t\t}\n\t\t\n\t\tfunction _doXHR(data) {\n\t\t\t// mark down start time\n\t\t\t_start_time = new Date().getTime();\n\n\t\t\t// if we can use native XHR Level 1, do\n\t\t\tif (_canUseNativeXHR.call(this)) {\n\t\t\t\t_doNativeXHR.call(this, data);\n\t\t\t} else {\n\t\t\t\t_doRuntimeXHR.call(this, data);\n\t\t\t}\n\t\t}\n\n\t\tfunction _canUseNativeXHR() {\n\t\t\treturn _method === 'HEAD' ||\n\t\t\t\t\t(_method === 'GET' && !!~Basic.inArray(_p('responseType'), [\"\", \"text\", \"document\"])) ||\n\t\t\t\t\t(_method === 'POST' && _headers['Content-Type'] === 'application/x-www-form-urlencoded');\n\t\t}\n\t\t\n\t\tfunction _reset() {\n\t\t\t_p('responseText', \"\");\n\t\t\t_p('responseXML', null);\n\t\t\t_p('response', null);\n\t\t\t_p('status', 0);\n\t\t\t_p('statusText', \"\");\n\t\t\t_start_time = undef;\n\t\t\t_timeoutset_time = undef;\n\t\t}\n\t}\n\n\tXMLHttpRequest.UNSENT = 0;\n\tXMLHttpRequest.OPENED = 1;\n\tXMLHttpRequest.HEADERS_RECEIVED = 2;\n\tXMLHttpRequest.LOADING = 3;\n\tXMLHttpRequest.DONE = 4;\n\t\n\tXMLHttpRequest.prototype = EventTarget.instance;\n\n\treturn XMLHttpRequest;\n});");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "385:27732");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "773:782");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "786:2118");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "2122:2190");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "2195:2248");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "2376:2466");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "2518:2545");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "2554:27501");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27505:27530");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27533:27558");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27561:27596");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27599:27625");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27628:27651");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27656:27703");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27707:27728");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "2158:2187");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "2584:5650");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "5658:16096");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19416:19738");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19908:20405");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20467:21214");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21221:23877");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23884:26764");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26771:27033");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27038:27291");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27298:27498");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "7203:7211");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "7262:7347");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "7480:7621");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "7637:7806");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "7878:8006");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8022:8051");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8184:8208");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8215:8258");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8323:8349");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8377:8495");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8502:8527");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8533:8566");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8587:8609");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8620:8787");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8873:8893");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8899:8917");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8923:8936");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8942:8959");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8976:9015");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "9036:9090");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "9120:9158");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "7290:7341");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "7564:7615");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "7770:7800");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "7947:8000");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8430:8489");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "8722:8781");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "9721:10237");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "10259:10392");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "10408:10549");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "10826:10867");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "10944:11045");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "11223:11407");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "11413:11424");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "10328:10386");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "10492:10543");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "11027:11039");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "11253:11277");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "11369:11401");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "11764:11784");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "11803:11961");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "11977:12014");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12021:12189");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12196:12283");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12301:12318");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12324:12347");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "11897:11955");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12108:12125");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12132:12183");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12156:12176");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12226:12277");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12837:12852");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12864:13030");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13050:13094");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13100:13151");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13184:13316");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13336:13961");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14002:14071");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14094:14113");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14128:14157");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14193:14599");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14699:14722");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12911:12939");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "12973:12986");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13006:13024");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13252:13310");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13396:13955");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13430:13455");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13463:13484");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13564:13690");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13593:13618");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13627:13652");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13661:13682");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13771:13790");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13798:13836");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "13917:13948");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14229:14246");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14265:14303");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14455:14593");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14828:14839");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14846:14864");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14870:14888");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "14895:15822");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15010:15047");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15054:15072");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15080:15721");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15729:15757");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15110:15122");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15130:15168");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15217:15244");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15252:15281");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15290:15456");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15369:15403");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15412:15448");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15561:15634");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15656:15714");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15777:15816");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15860:15977");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15984:16000");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "16007:16085");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15877:15953");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15960:15971");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "15932:15946");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "16031:16054");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "16061:16079");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19446:19496");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19501:19734");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19485:19491");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19542:19602");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19627:19729");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19666:19685");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19705:19723");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "19938:20401");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20054:20088");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20106:20396");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20132:20189");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20259:20386");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20308:20379");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20321:20357");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20499:20525");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20530:20558");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20687:20969");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21021:21194");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21199:21210");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20830:20881");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20887:20905");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20911:20939");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "20945:20964");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21037:21189");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21172:21183");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21250:21280");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21289:21303");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21308:21330");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21339:23622");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23628:23678");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23713:23853");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23862:23873");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21494:21628");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21639:21672");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21691:21729");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21767:23616");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21557:21582");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21589:21622");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "21979:22109");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22117:22122");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22029:22060");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22069:22101");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22303:22429");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22437:22442");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22316:22369");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22570:22584");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22592:22766");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22775:22920");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22928:22933");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22605:22718");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22676:22709");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "22748:22758");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23037:23076");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23197:23534");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23549:23560");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23568:23597");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23605:23610");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23229:23247");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23256:23283");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23307:23344");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23353:23390");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23399:23491");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23500:23526");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23752:23848");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23804:23840");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23918:23933");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23943:23958");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23964:23990");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "23996:24109");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24115:26252");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26289:26406");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26412:26760");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24021:24035");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24041:24052");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24058:24087");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24093:24104");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24144:24344");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24355:24519");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24530:24765");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24776:25604");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25611:25694");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25705:25937");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25944:26247");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24186:24226");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24234:24255");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24268:24336");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24301:24329");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24396:24436");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24490:24511");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24577:24757");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24610:24750");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24813:24850");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24857:24938");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "24945:24991");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25004:25096");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25104:25303");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25316:25580");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25587:25596");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25168:25202");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25263:25296");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25399:25469");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25477:25498");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25433:25461");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25520:25538");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25546:25573");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25649:25670");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25677:25686");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25743:25761");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25768:25805");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25812:25850");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25857:25885");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25892:25913");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "25920:25929");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26490:26525");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26543:26617");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26623:26720");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26726:26755");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26596:26609");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26673:26712");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26825:26859");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26908:27029");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26947:26976");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "26994:27024");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27071:27287");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27321:27343");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27348:27371");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27376:27396");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27401:27416");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27421:27441");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27446:27465");
__$coverInitRange("src/javascript/xhr/XMLHttpRequest.js", "27470:27494");
__$coverCall('src/javascript/xhr/XMLHttpRequest.js', '385:27732');
define('moxie/xhr/XMLHttpRequest', [
    'moxie/core/utils/Basic',
    'moxie/core/Exceptions',
    'moxie/core/EventTarget',
    'moxie/core/utils/Encode',
    'moxie/core/utils/Url',
    'moxie/runtime/RuntimeTarget',
    'moxie/file/Blob',
    'moxie/xhr/FormData',
    'moxie/core/utils/Env',
    'moxie/core/utils/Mime'
], function (Basic, x, EventTarget, Encode, Url, RuntimeTarget, Blob, FormData, Env, Mime) {
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '773:782');
    var undef;
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '786:2118');
    var httpCode = {
            100: 'Continue',
            101: 'Switching Protocols',
            102: 'Processing',
            200: 'OK',
            201: 'Created',
            202: 'Accepted',
            203: 'Non-Authoritative Information',
            204: 'No Content',
            205: 'Reset Content',
            206: 'Partial Content',
            207: 'Multi-Status',
            226: 'IM Used',
            300: 'Multiple Choices',
            301: 'Moved Permanently',
            302: 'Found',
            303: 'See Other',
            304: 'Not Modified',
            305: 'Use Proxy',
            306: 'Reserved',
            307: 'Temporary Redirect',
            400: 'Bad Request',
            401: 'Unauthorized',
            402: 'Payment Required',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            406: 'Not Acceptable',
            407: 'Proxy Authentication Required',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            411: 'Length Required',
            412: 'Precondition Failed',
            413: 'Request Entity Too Large',
            414: 'Request-URI Too Long',
            415: 'Unsupported Media Type',
            416: 'Requested Range Not Satisfiable',
            417: 'Expectation Failed',
            422: 'Unprocessable Entity',
            423: 'Locked',
            424: 'Failed Dependency',
            426: 'Upgrade Required',
            500: 'Internal Server Error',
            501: 'Not Implemented',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
            505: 'HTTP Version Not Supported',
            506: 'Variant Also Negotiates',
            507: 'Insufficient Storage',
            510: 'Not Extended'
        };
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '2122:2190');
    function XMLHttpRequestUpload() {
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '2158:2187');
        this.uid = Basic.guid('uid_');
    }
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '2195:2248');
    XMLHttpRequestUpload.prototype = EventTarget.instance;
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '2376:2466');
    var dispatches = [
            'loadstart',
            'progress',
            'abort',
            'error',
            'load',
            'timeout',
            'loadend'
        ];
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '2518:2545');
    var NATIVE = 1, RUNTIME = 2;
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '2554:27501');
    function XMLHttpRequest() {
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '2584:5650');
        var self = this, props = {
                timeout: 0,
                readyState: XMLHttpRequest.UNSENT,
                withCredentials: false,
                status: 0,
                statusText: '',
                responseType: '',
                responseXML: null,
                responseText: null,
                response: null
            }, _async = true, _url, _method, _headers = {}, _user, _password, _encoding = null, _mimeType = null, _sync_flag = false, _send_flag = false, _upload_events_flag = false, _upload_complete_flag = false, _error_flag = false, _same_origin_flag = false, _start_time, _timeoutset_time, _finalMime = null, _finalCharset = null, _options = {}, _xhr, _mode = NATIVE;
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '5658:16096');
        Basic.extend(this, props, {
            uid: Basic.guid('uid_'),
            upload: new XMLHttpRequestUpload(),
            open: function (method, url, async, user, password) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '7203:7211');
                var urlp;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '7262:7347');
                if (!method || !url) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '7290:7341');
                    throw new x.DOMException(x.DOMException.SYNTAX_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '7480:7621');
                if (/[\u0100-\uffff]/.test(method) || Encode.utf8_encode(method) !== method) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '7564:7615');
                    throw new x.DOMException(x.DOMException.SYNTAX_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '7637:7806');
                if (!!~Basic.inArray(method.toUpperCase(), [
                        'CONNECT',
                        'DELETE',
                        'GET',
                        'HEAD',
                        'OPTIONS',
                        'POST',
                        'PUT',
                        'TRACE',
                        'TRACK'
                    ])) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '7770:7800');
                    _method = method.toUpperCase();
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '7878:8006');
                if (!!~Basic.inArray(_method, [
                        'CONNECT',
                        'TRACE',
                        'TRACK'
                    ])) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '7947:8000');
                    throw new x.DOMException(x.DOMException.SECURITY_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8022:8051');
                url = Encode.utf8_encode(url);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8184:8208');
                urlp = Url.parseUrl(url);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8215:8258');
                _same_origin_flag = Url.hasSameOrigin(urlp);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8323:8349');
                _url = Url.resolveUrl(url);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8377:8495');
                if ((user || password) && !_same_origin_flag) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8430:8489');
                    throw new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8502:8527');
                _user = user || urlp.user;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8533:8566');
                _password = password || urlp.pass;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8587:8609');
                _async = async || true;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8620:8787');
                if (_async === false && (_p('timeout') || _p('withCredentials') || _p('responseType') !== '')) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8722:8781');
                    throw new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8873:8893');
                _sync_flag = !_async;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8899:8917');
                _send_flag = false;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8923:8936');
                _headers = {};
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8942:8959');
                _reset.call(this);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '8976:9015');
                _p('readyState', XMLHttpRequest.OPENED);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '9036:9090');
                this.convertEventPropsToHandlers(['readystatechange']);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '9120:9158');
                this.dispatchEvent('readystatechange');
            },
            setRequestHeader: function (header, value) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '9721:10237');
                var uaHeaders = [
                        'accept-charset',
                        'accept-encoding',
                        'access-control-request-headers',
                        'access-control-request-method',
                        'connection',
                        'content-length',
                        'cookie',
                        'cookie2',
                        'content-transfer-encoding',
                        'date',
                        'expect',
                        'host',
                        'keep-alive',
                        'origin',
                        'referer',
                        'te',
                        'trailer',
                        'transfer-encoding',
                        'upgrade',
                        'user-agent',
                        'via'
                    ];
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '10259:10392');
                if (_p('readyState') !== XMLHttpRequest.OPENED || _send_flag) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '10328:10386');
                    throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '10408:10549');
                if (/[\u0100-\uffff]/.test(header) || Encode.utf8_encode(header) !== header) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '10492:10543');
                    throw new x.DOMException(x.DOMException.SYNTAX_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '10826:10867');
                header = Basic.trim(header).toLowerCase();
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '10944:11045');
                if (!!~Basic.inArray(header, uaHeaders) || /^(proxy\-|sec\-)/.test(header)) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '11027:11039');
                    return false;
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '11223:11407');
                if (!_headers[header]) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '11253:11277');
                    _headers[header] = value;
                } else {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '11369:11401');
                    _headers[header] += ', ' + value;
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '11413:11424');
                return true;
            },
            overrideMimeType: function (mime) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '11764:11784');
                var matches, charset;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '11803:11961');
                if (!!~Basic.inArray(_p('readyState'), [
                        XMLHttpRequest.LOADING,
                        XMLHttpRequest.DONE
                    ])) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '11897:11955');
                    throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '11977:12014');
                mime = Basic.trim(mime.toLowerCase());
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12021:12189');
                if (/;/.test(mime) && (matches = mime.match(/^([^;]+)(?:;\scharset\=)?(.*)$/))) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12108:12125');
                    mime = matches[1];
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12132:12183');
                    if (matches[2]) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12156:12176');
                        charset = matches[2];
                    }
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12196:12283');
                if (!Mime.mimes[mime]) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12226:12277');
                    throw new x.DOMException(x.DOMException.SYNTAX_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12301:12318');
                _finalMime = mime;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12324:12347');
                _finalCharset = charset;
            },
            send: function (data, options) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12837:12852');
                var self = this;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12864:13030');
                if (Basic.typeOf(options) === 'string') {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12911:12939');
                    _options = { ruid: options };
                } else if (!options) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '12973:12986');
                    _options = {};
                } else {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13006:13024');
                    _options = options;
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13050:13094');
                this.convertEventPropsToHandlers(dispatches);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13100:13151');
                this.upload.convertEventPropsToHandlers(dispatches);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13184:13316');
                if (this.readyState !== XMLHttpRequest.OPENED || _send_flag) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13252:13310');
                    throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13336:13961');
                if (!_canUseNativeXHR()) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13396:13955');
                    if (data instanceof Blob) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13430:13455');
                        _options.ruid = data.ruid;
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13463:13484');
                        _mimeType = data.type;
                    } else if (data instanceof FormData) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13564:13690');
                        if (data.hasBlob()) {
                            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13593:13618');
                            var blob = data.getBlob();
                            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13627:13652');
                            _options.ruid = blob.ruid;
                            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13661:13682');
                            _mimeType = blob.type;
                        }
                    } else if (typeof data === 'string') {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13771:13790');
                        _encoding = 'UTF-8';
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13798:13836');
                        _mimeType = 'text/plain;charset=UTF-8';
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '13917:13948');
                        data = Encode.utf8_encode(data);
                    }
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14002:14071');
                _upload_events_flag = !_sync_flag && this.upload.hasEventListener();
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14094:14113');
                _error_flag = false;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14128:14157');
                _upload_complete_flag = !data;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14193:14599');
                if (!_sync_flag) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14229:14246');
                    _send_flag = true;
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14265:14303');
                    this.dispatchEvent('readystatechange');
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14455:14593');
                    if (!_upload_complete_flag) {
                    }
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14699:14722');
                _doXHR.call(self, data);
            },
            abort: function () {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14828:14839');
                var runtime;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14846:14864');
                _error_flag = true;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14870:14888');
                _sync_flag = false;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '14895:15822');
                if (!~Basic.inArray(_p('readyState'), [
                        XMLHttpRequest.UNSENT,
                        XMLHttpRequest.OPENED,
                        XMLHttpRequest.DONE
                    ])) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15010:15047');
                    _p('readyState', XMLHttpRequest.DONE);
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15054:15072');
                    _send_flag = false;
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15080:15721');
                    if (_mode === NATIVE) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15110:15122');
                        _xhr.abort();
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15130:15168');
                        this.dispatchEvent('readystatechange');
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15217:15244');
                        this.dispatchEvent('abort');
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15252:15281');
                        this.dispatchEvent('loadend');
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15290:15456');
                        if (!_upload_complete_flag) {
                            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15369:15403');
                            this.upload.dispatchEvent('abort');
                            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15412:15448');
                            this.upload.dispatchEvent('loadend');
                        }
                    } else if (Basic.typeOf(_xhr.getRuntime) === 'function' && (runtime = _xhr.getRuntime())) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15561:15634');
                        runtime.exec.call(_xhr, 'XMLHttpRequest', 'abort', _upload_complete_flag);
                    } else {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15656:15714');
                        throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
                    }
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15729:15757');
                    _upload_complete_flag = true;
                } else {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15777:15816');
                    _p('readyState', XMLHttpRequest.UNSENT);
                }
            },
            destroy: function () {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15860:15977');
                if (_xhr) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15877:15953');
                    if (Basic.typeOf(_xhr.destroy) === 'function') {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15932:15946');
                        _xhr.destroy();
                    }
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15960:15971');
                    _xhr = null;
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '15984:16000');
                this.unbindAll();
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '16007:16085');
                if (this.upload) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '16031:16054');
                    this.upload.unbindAll();
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '16061:16079');
                    this.upload = null;
                }
            }
        });
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19416:19738');
        function _p(prop, value) {
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19446:19496');
            if (!props.hasOwnProperty(prop)) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19485:19491');
                return;
            }
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19501:19734');
            if (arguments.length === 1) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19542:19602');
                return Env.can('define_property') ? props[prop] : self[prop];
            } else {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19627:19729');
                if (Env.can('define_property')) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19666:19685');
                    props[prop] = value;
                } else {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19705:19723');
                    self[prop] = value;
                }
            }
        }
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19908:20405');
        function _getNativeXHR() {
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '19938:20401');
            if (window.XMLHttpRequest && !(Env.browser === 'IE' && Env.version < 8)) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20054:20088');
                return new window.XMLHttpRequest();
            } else {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20106:20396');
                return function () {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20132:20189');
                    var progIDs = [
                            'Msxml2.XMLHTTP.6.0',
                            'Microsoft.XMLHTTP'
                        ];
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20259:20386');
                    for (var i = 0; i < progIDs.length; i++) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20308:20379');
                        try {
                            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20321:20357');
                            return new ActiveXObject(progIDs[i]);
                        } catch (ex) {
                        }
                    }
                }();
            }
        }
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20467:21214');
        function _getDocument(xhr) {
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20499:20525');
            var rXML = xhr.responseXML;
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20530:20558');
            var rText = xhr.responseText;
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20687:20969');
            if (Env.browser === 'IE' && rText && rXML && !rXML.documentElement && /[^\/]+\/[^\+]+\+xml/.test(xhr.getResponseHeader('Content-Type'))) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20830:20881');
                rXML = new window.ActiveXObject('Microsoft.XMLDOM');
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20887:20905');
                rXML.async = false;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20911:20939');
                rXML.validateOnParse = false;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '20945:20964');
                rXML.loadXML(rText);
            }
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21021:21194');
            if (rXML) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21037:21189');
                if (Env.browser === 'IE' && rXML.parseError !== 0 || !rXML.documentElement || rXML.documentElement.tagName === 'parsererror') {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21172:21183');
                    return null;
                }
            }
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21199:21210');
            return rXML;
        }
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21221:23877');
        function _doNativeXHR() {
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21250:21280');
            var self = this, total = 0;
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21289:21303');
            _mode = NATIVE;
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21308:21330');
            _xhr = _getNativeXHR();
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21339:23622');
            _xhr.onreadystatechange = function onRSC() {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21494:21628');
                if (_p('readyState') > XMLHttpRequest.HEADERS_RECEIVED) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21557:21582');
                    _p('status', _xhr.status);
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21589:21622');
                    _p('statusText', _xhr.statusText);
                }
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21639:21672');
                _p('readyState', _xhr.readyState);
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21691:21729');
                self.dispatchEvent('readystatechange');
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21767:23616');
                switch (_p('readyState')) {
                case XMLHttpRequest.OPENED:
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '21979:22109');
                    if (onRSC.loadstartDispatched === undef) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22029:22060');
                        self.dispatchEvent('loadstart');
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22069:22101');
                        onRSC.loadstartDispatched = true;
                    }
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22117:22122');
                    break;
                case XMLHttpRequest.HEADERS_RECEIVED:
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22303:22429');
                    try {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22316:22369');
                        total = _xhr.getResponseHeader('Content-Length') || 0;
                    } catch (ex) {
                    }
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22437:22442');
                    break;
                case XMLHttpRequest.LOADING:
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22570:22584');
                    var loaded = 0;
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22592:22766');
                    try {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22605:22718');
                        if (_xhr.responseText) {
                            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22676:22709');
                            loaded = _xhr.responseText.length;
                        }
                    } catch (ex) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22748:22758');
                        loaded = 0;
                    }
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22775:22920');
                    self.dispatchEvent({
                        type: 'progress',
                        lengthComputable: !!total,
                        total: parseInt(total, 10),
                        loaded: loaded
                    });
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '22928:22933');
                    break;
                case XMLHttpRequest.DONE:
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23037:23076');
                    _xhr.onreadystatechange = function () {
                    };
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23197:23534');
                    if (_xhr.status === 0) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23229:23247');
                        _error_flag = true;
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23256:23283');
                        self.dispatchEvent('error');
                    } else {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23307:23344');
                        _p('responseText', _xhr.responseText);
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23353:23390');
                        _p('responseXML', _getDocument(_xhr));
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23399:23491');
                        _p('response', _p('responseType') === 'document' ? _p('responseXML') : _p('responseText'));
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23500:23526');
                        self.dispatchEvent('load');
                    }
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23549:23560');
                    _xhr = null;
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23568:23597');
                    self.dispatchEvent('loadend');
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23605:23610');
                    break;
                }
            };
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23628:23678');
            _xhr.open(_method, _url, _async, _user, _password);
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23713:23853');
            if (!Basic.isEmptyObj(_headers)) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23752:23848');
                Basic.each(_headers, function (value, header) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23804:23840');
                    _xhr.setRequestHeader(header, value);
                });
            }
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23862:23873');
            _xhr.send();
        }
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23884:26764');
        function _doRuntimeXHR(data) {
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23918:23933');
            var self = this;
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23943:23958');
            _mode = RUNTIME;
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23964:23990');
            _xhr = new RuntimeTarget();
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '23996:24109');
            function loadEnd() {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24021:24035');
                _xhr.destroy();
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24041:24052');
                _xhr = null;
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24058:24087');
                self.dispatchEvent('loadend');
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24093:24104');
                self = null;
            }
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24115:26252');
            function exec(runtime) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24144:24344');
                _xhr.bind('LoadStart', function (e) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24186:24226');
                    _p('readyState', XMLHttpRequest.LOADING);
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24234:24255');
                    self.dispatchEvent(e);
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24268:24336');
                    if (_upload_events_flag) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24301:24329');
                        self.upload.dispatchEvent(e);
                    }
                });
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24355:24519');
                _xhr.bind('Progress', function (e) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24396:24436');
                    _p('readyState', XMLHttpRequest.LOADING);
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24490:24511');
                    self.dispatchEvent(e);
                });
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24530:24765');
                _xhr.bind('UploadProgress', function (e) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24577:24757');
                    if (_upload_events_flag) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24610:24750');
                        self.upload.dispatchEvent({
                            type: 'progress',
                            lengthComputable: false,
                            total: e.total,
                            loaded: e.loaded
                        });
                    }
                });
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24776:25604');
                _xhr.bind('Load', function (e) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24813:24850');
                    _p('readyState', XMLHttpRequest.DONE);
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24857:24938');
                    _p('status', Number(runtime.exec.call(_xhr, 'XMLHttpRequest', 'getStatus') || 0));
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '24945:24991');
                    _p('statusText', httpCode[_p('status')] || '');
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25004:25096');
                    _p('response', runtime.exec.call(_xhr, 'XMLHttpRequest', 'getResponse', _p('responseType')));
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25104:25303');
                    if (!!~Basic.inArray(_p('responseType'), [
                            'text',
                            ''
                        ])) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25168:25202');
                        _p('responseText', _p('response'));
                    } else if (_p('responseType') === 'document') {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25263:25296');
                        _p('responseXML', _p('response'));
                    }
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25316:25580');
                    if (_p('status') > 0) {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25399:25469');
                        if (_upload_events_flag) {
                            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25433:25461');
                            self.upload.dispatchEvent(e);
                        }
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25477:25498');
                        self.dispatchEvent(e);
                    } else {
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25520:25538');
                        _error_flag = true;
                        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25546:25573');
                        self.dispatchEvent('error');
                    }
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25587:25596');
                    loadEnd();
                });
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25611:25694');
                _xhr.bind('Abort', function (e) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25649:25670');
                    self.dispatchEvent(e);
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25677:25686');
                    loadEnd();
                });
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25705:25937');
                _xhr.bind('Error', function (e) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25743:25761');
                    _error_flag = true;
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25768:25805');
                    _p('readyState', XMLHttpRequest.DONE);
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25812:25850');
                    self.dispatchEvent('readystatechange');
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25857:25885');
                    _upload_complete_flag = true;
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25892:25913');
                    self.dispatchEvent(e);
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25920:25929');
                    loadEnd();
                });
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '25944:26247');
                runtime.exec.call(_xhr, 'XMLHttpRequest', 'send', {
                    url: _url,
                    method: _method,
                    async: _async,
                    user: _user,
                    password: _password,
                    headers: _headers,
                    mimeType: _mimeType,
                    encoding: _encoding,
                    responseType: self.responseType,
                    options: _options
                }, data);
            }
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26289:26406');
            _options.required_caps = Basic.extend({}, _options.required_caps, { return_response_type: self.responseType });
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26412:26760');
            if (_options.ruid) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26490:26525');
                exec(_xhr.connectRuntime(_options));
            } else {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26543:26617');
                _xhr.bind('RuntimeInit', function (e, runtime) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26596:26609');
                    exec(runtime);
                });
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26623:26720');
                _xhr.bind('RuntimeError', function (e, err) {
                    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26673:26712');
                    self.dispatchEvent('RuntimeError', err);
                });
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26726:26755');
                _xhr.connectRuntime(_options);
            }
        }
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26771:27033');
        function _doXHR(data) {
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26825:26859');
            _start_time = new Date().getTime();
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26908:27029');
            if (_canUseNativeXHR.call(this)) {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26947:26976');
                _doNativeXHR.call(this, data);
            } else {
                __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '26994:27024');
                _doRuntimeXHR.call(this, data);
            }
        }
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27038:27291');
        function _canUseNativeXHR() {
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27071:27287');
            return _method === 'HEAD' || _method === 'GET' && !!~Basic.inArray(_p('responseType'), [
                '',
                'text',
                'document'
            ]) || _method === 'POST' && _headers['Content-Type'] === 'application/x-www-form-urlencoded';
        }
        __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27298:27498');
        function _reset() {
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27321:27343');
            _p('responseText', '');
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27348:27371');
            _p('responseXML', null);
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27376:27396');
            _p('response', null);
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27401:27416');
            _p('status', 0);
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27421:27441');
            _p('statusText', '');
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27446:27465');
            _start_time = undef;
            __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27470:27494');
            _timeoutset_time = undef;
        }
    }
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27505:27530');
    XMLHttpRequest.UNSENT = 0;
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27533:27558');
    XMLHttpRequest.OPENED = 1;
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27561:27596');
    XMLHttpRequest.HEADERS_RECEIVED = 2;
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27599:27625');
    XMLHttpRequest.LOADING = 3;
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27628:27651');
    XMLHttpRequest.DONE = 4;
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27656:27703');
    XMLHttpRequest.prototype = EventTarget.instance;
    __$coverCall('src/javascript/xhr/XMLHttpRequest.js', '27707:27728');
    return XMLHttpRequest;
});

// Included from: src/javascript/file/FileReaderSync.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/file/FileReaderSync.js", "/**\n * FileReaderSync.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/file/FileReaderSync', [\n\t'moxie/core/utils/Basic',\n\t'moxie/runtime/RuntimeClient',\n\t'moxie/core/utils/Encode'\n], function(Basic, RuntimeClient, Encode) {\n\t/**\n\tSynchronous FileReader implementation. Something like this is available in WebWorkers environment, here\n\tit can be used to read only preloaded blobs/files and only below certain size (not yet sure what that'd be,\n\tbut probably < 1mb). Not meant to be used directly by user.\n\n\t@class FileReaderSync\n\t@private\n\t@constructor\n\t*/\n\treturn function() {\n\t\tRuntimeClient.call(this);\n\n\t\tBasic.extend(this, {\n\t\t\tuid: Basic.guid('uid_'),\n\n\t\t\treadAsBinaryString: function(blob) {\n\t\t\t\treturn _read.call(this, 'readAsBinaryString', blob);\n\t\t\t},\n\t\t\t\n\t\t\treadAsDataURL: function(blob) {\n\t\t\t\treturn _read.call(this, 'readAsDataURL', blob);\n\t\t\t},\n\t\t\t\n\t\t\t/*readAsArrayBuffer: function(blob) {\n\t\t\t\treturn _read.call(this, 'readAsArrayBuffer', blob);\n\t\t\t},*/\n\t\t\t\n\t\t\treadAsText: function(blob) {\n\t\t\t\treturn _read.call(this, 'readAsText', blob);\n\t\t\t}\n\t\t});\n\n\t\tfunction _read(op, blob) {\n\t\t\tif (blob.isDetached()) {\n\t\t\t\tvar src = blob.getSource();\n\t\t\t\tswitch (op) {\n\t\t\t\t\tcase 'readAsBinaryString':\n\t\t\t\t\t\treturn src;\n\t\t\t\t\tcase 'readAsDataURL':\n\t\t\t\t\t\treturn 'data:' + blob.type + ';base64,' + Encode.btoa(src);\n\t\t\t\t\tcase 'readAsText':\n\t\t\t\t\t\tvar txt = '';\n\t\t\t\t\t\tfor (var i = 0, length = src.length; i < length; i++) {\n\t\t\t\t\t\t\ttxt += String.fromCharCode(src[i]);\n\t\t\t\t\t\t}\n\t\t\t\t\t\treturn txt;\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tvar result = this.connectRuntime(blob.ruid).exec.call(this, 'FileReaderSync', 'read', op, blob);\n\t\t\t\tthis.disconnectRuntime();\n\t\t\t\treturn result;\n\t\t\t}\n\t\t}\n\t};\n});");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "352:1968");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "853:1964");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "875:899");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "904:1357");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1362:1960");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "998:1049");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1100:1146");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1303:1346");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1392:1956");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1421:1447");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1453:1789");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1505:1515");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1550:1608");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1640:1652");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1660:1765");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1773:1783");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1723:1757");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1807:1902");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1908:1932");
__$coverInitRange("src/javascript/file/FileReaderSync.js", "1938:1951");
__$coverCall('src/javascript/file/FileReaderSync.js', '352:1968');
define('moxie/file/FileReaderSync', [
    'moxie/core/utils/Basic',
    'moxie/runtime/RuntimeClient',
    'moxie/core/utils/Encode'
], function (Basic, RuntimeClient, Encode) {
    __$coverCall('src/javascript/file/FileReaderSync.js', '853:1964');
    return function () {
        __$coverCall('src/javascript/file/FileReaderSync.js', '875:899');
        RuntimeClient.call(this);
        __$coverCall('src/javascript/file/FileReaderSync.js', '904:1357');
        Basic.extend(this, {
            uid: Basic.guid('uid_'),
            readAsBinaryString: function (blob) {
                __$coverCall('src/javascript/file/FileReaderSync.js', '998:1049');
                return _read.call(this, 'readAsBinaryString', blob);
            },
            readAsDataURL: function (blob) {
                __$coverCall('src/javascript/file/FileReaderSync.js', '1100:1146');
                return _read.call(this, 'readAsDataURL', blob);
            },
            readAsText: function (blob) {
                __$coverCall('src/javascript/file/FileReaderSync.js', '1303:1346');
                return _read.call(this, 'readAsText', blob);
            }
        });
        __$coverCall('src/javascript/file/FileReaderSync.js', '1362:1960');
        function _read(op, blob) {
            __$coverCall('src/javascript/file/FileReaderSync.js', '1392:1956');
            if (blob.isDetached()) {
                __$coverCall('src/javascript/file/FileReaderSync.js', '1421:1447');
                var src = blob.getSource();
                __$coverCall('src/javascript/file/FileReaderSync.js', '1453:1789');
                switch (op) {
                case 'readAsBinaryString':
                    __$coverCall('src/javascript/file/FileReaderSync.js', '1505:1515');
                    return src;
                case 'readAsDataURL':
                    __$coverCall('src/javascript/file/FileReaderSync.js', '1550:1608');
                    return 'data:' + blob.type + ';base64,' + Encode.btoa(src);
                case 'readAsText':
                    __$coverCall('src/javascript/file/FileReaderSync.js', '1640:1652');
                    var txt = '';
                    __$coverCall('src/javascript/file/FileReaderSync.js', '1660:1765');
                    for (var i = 0, length = src.length; i < length; i++) {
                        __$coverCall('src/javascript/file/FileReaderSync.js', '1723:1757');
                        txt += String.fromCharCode(src[i]);
                    }
                    __$coverCall('src/javascript/file/FileReaderSync.js', '1773:1783');
                    return txt;
                }
            } else {
                __$coverCall('src/javascript/file/FileReaderSync.js', '1807:1902');
                var result = this.connectRuntime(blob.ruid).exec.call(this, 'FileReaderSync', 'read', op, blob);
                __$coverCall('src/javascript/file/FileReaderSync.js', '1908:1932');
                this.disconnectRuntime();
                __$coverCall('src/javascript/file/FileReaderSync.js', '1938:1951');
                return result;
            }
        }
    };
});

// Included from: src/javascript/runtime/Transporter.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/Transporter.js", "/**\n * Transporter.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine(\"moxie/runtime/Transporter\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/utils/Encode\",\n\t\"moxie/runtime/RuntimeClient\",\n\t\"moxie/core/EventTarget\"\n], function(Basic, Encode, RuntimeClient, EventTarget) {\n\tfunction Transporter() {\n\t\tvar mod, _runtime, _data, _size, _pos, _chunk_size;\n\n\t\tRuntimeClient.call(this);\n\n\t\tBasic.extend(this, {\n\t\t\tuid: Basic.guid('uid_'),\n\n\t\t\tstate: Transporter.IDLE,\n\n\t\t\tresult: null,\n\n\t\t\ttransport: function(data, type, options) {\n\t\t\t\tvar self = this;\n\n\t\t\t\toptions = Basic.extend({\n\t\t\t\t\tchunk_size: 204798\n\t\t\t\t}, options);\n\n\t\t\t\t// should divide by three, base64 requires this\n\t\t\t\tif ((mod = options.chunk_size % 3)) {\n\t\t\t\t\toptions.chunk_size += 3 - mod;\n\t\t\t\t}\n\n\t\t\t\t_chunk_size = options.chunk_size;\n\n\t\t\t\t_reset.call(this);\n\t\t\t\t_data = data;\n\t\t\t\t_size = data.length;\n\n\t\t\t\tif (Basic.typeOf(options) === 'string' || options.ruid) {\n\t\t\t\t\t_run.call(self, type, this.connectRuntime(options));\n\t\t\t\t} else {\n\t\t\t\t\t// we require this to run only once\n\t\t\t\t\tvar cb = function(e, runtime) {\n\t\t\t\t\t\tself.unbind(\"RuntimeInit\", cb);\n\t\t\t\t\t\t_run.call(self, type, runtime);\n\t\t\t\t\t};\n\t\t\t\t\tthis.bind(\"RuntimeInit\", cb);\n\t\t\t\t\tthis.connectRuntime(options);\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tabort: function() {\n\t\t\t\tvar self = this;\n\n\t\t\t\tself.state = Transporter.IDLE;\n\t\t\t\tif (_runtime) {\n\t\t\t\t\t_runtime.exec.call(self, 'Transporter', 'clear');\n\t\t\t\t\tself.trigger(\"TransportingAborted\");\n\t\t\t\t}\n\n\t\t\t\t_reset.call(self);\n\t\t\t},\n\n\n\t\t\tdestroy: function() {\n\t\t\t\tthis.unbindAll();\n\t\t\t\t_runtime = null;\n\t\t\t\tthis.disconnectRuntime();\n\t\t\t\t_reset.call(this);\n\t\t\t}\n\t\t});\n\n\t\tfunction _reset() {\n\t\t\t_size = _pos = 0;\n\t\t\t_data = this.result = null;\n\t\t}\n\n\t\tfunction _run(type, runtime) {\n\t\t\tvar self = this;\n\n\t\t\t_runtime = runtime;\n\n\t\t\t//self.unbind(\"RuntimeInit\");\n\n\t\t\tself.bind(\"TransportingProgress\", function(e) {\n\t\t\t\t_pos = e.loaded;\n\n\t\t\t\tif (_pos < _size && Basic.inArray(self.state, [Transporter.IDLE, Transporter.DONE]) === -1) {\n\t\t\t\t\t_transport.call(self);\n\t\t\t\t}\n\t\t\t}, 999);\n\n\t\t\tself.bind(\"TransportingComplete\", function() {\n\t\t\t\t_pos = _size;\n\t\t\t\tself.state = Transporter.DONE;\n\t\t\t\t_data = null; // clean a bit\n\t\t\t\tself.result = _runtime.exec.call(self, 'Transporter', 'getAsBlob', type || '');\n\t\t\t}, 999);\n\n\t\t\tself.state = Transporter.BUSY;\n\t\t\tself.trigger(\"TransportingStarted\");\n\t\t\t_transport.call(self);\n\t\t}\n\n\t\tfunction _transport() {\n\t\t\tvar self = this,\n\t\t\t\tchunk,\n\t\t\t\tbytesLeft = _size - _pos;\n\n\t\t\tif (_chunk_size > bytesLeft) {\n\t\t\t\t_chunk_size = bytesLeft;\n\t\t\t}\n\n\t\t\tchunk = Encode.btoa(_data.substr(_pos, _chunk_size));\n\t\t\t_runtime.exec.call(self, 'Transporter', 'receive', chunk, _size);\n\t\t}\n\t}\n\n\tTransporter.IDLE = 0;\n\tTransporter.BUSY = 1;\n\tTransporter.DONE = 2;\n\n\tTransporter.prototype = EventTarget.instance;\n\n\treturn Transporter;\n});");
__$coverInitRange("src/javascript/runtime/Transporter.js", "349:3073");
__$coverInitRange("src/javascript/runtime/Transporter.js", "558:2929");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2933:2953");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2956:2976");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2979:2999");
__$coverInitRange("src/javascript/runtime/Transporter.js", "3003:3047");
__$coverInitRange("src/javascript/runtime/Transporter.js", "3051:3069");
__$coverInitRange("src/javascript/runtime/Transporter.js", "585:635");
__$coverInitRange("src/javascript/runtime/Transporter.js", "640:664");
__$coverInitRange("src/javascript/runtime/Transporter.js", "669:1891");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1896:1970");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1975:2638");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2643:2926");
__$coverInitRange("src/javascript/runtime/Transporter.js", "816:831");
__$coverInitRange("src/javascript/runtime/Transporter.js", "838:902");
__$coverInitRange("src/javascript/runtime/Transporter.js", "961:1039");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1046:1078");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1085:1102");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1108:1120");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1126:1145");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1152:1517");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1004:1033");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1215:1266");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1327:1441");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1448:1476");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1483:1511");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1365:1395");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1403:1433");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1553:1568");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1575:1604");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1610:1727");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1734:1751");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1631:1679");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1686:1721");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1790:1806");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1812:1827");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1833:1857");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1863:1880");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1919:1935");
__$coverInitRange("src/javascript/runtime/Transporter.js", "1940:1966");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2009:2024");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2030:2048");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2088:2300");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2306:2533");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2539:2568");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2573:2608");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2613:2634");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2140:2155");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2162:2288");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2261:2282");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2357:2369");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2375:2404");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2410:2422");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2443:2521");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2670:2726");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2732:2795");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2801:2853");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2858:2922");
__$coverInitRange("src/javascript/runtime/Transporter.js", "2767:2790");
__$coverCall('src/javascript/runtime/Transporter.js', '349:3073');
define('moxie/runtime/Transporter', [
    'moxie/core/utils/Basic',
    'moxie/core/utils/Encode',
    'moxie/runtime/RuntimeClient',
    'moxie/core/EventTarget'
], function (Basic, Encode, RuntimeClient, EventTarget) {
    __$coverCall('src/javascript/runtime/Transporter.js', '558:2929');
    function Transporter() {
        __$coverCall('src/javascript/runtime/Transporter.js', '585:635');
        var mod, _runtime, _data, _size, _pos, _chunk_size;
        __$coverCall('src/javascript/runtime/Transporter.js', '640:664');
        RuntimeClient.call(this);
        __$coverCall('src/javascript/runtime/Transporter.js', '669:1891');
        Basic.extend(this, {
            uid: Basic.guid('uid_'),
            state: Transporter.IDLE,
            result: null,
            transport: function (data, type, options) {
                __$coverCall('src/javascript/runtime/Transporter.js', '816:831');
                var self = this;
                __$coverCall('src/javascript/runtime/Transporter.js', '838:902');
                options = Basic.extend({ chunk_size: 204798 }, options);
                __$coverCall('src/javascript/runtime/Transporter.js', '961:1039');
                if (mod = options.chunk_size % 3) {
                    __$coverCall('src/javascript/runtime/Transporter.js', '1004:1033');
                    options.chunk_size += 3 - mod;
                }
                __$coverCall('src/javascript/runtime/Transporter.js', '1046:1078');
                _chunk_size = options.chunk_size;
                __$coverCall('src/javascript/runtime/Transporter.js', '1085:1102');
                _reset.call(this);
                __$coverCall('src/javascript/runtime/Transporter.js', '1108:1120');
                _data = data;
                __$coverCall('src/javascript/runtime/Transporter.js', '1126:1145');
                _size = data.length;
                __$coverCall('src/javascript/runtime/Transporter.js', '1152:1517');
                if (Basic.typeOf(options) === 'string' || options.ruid) {
                    __$coverCall('src/javascript/runtime/Transporter.js', '1215:1266');
                    _run.call(self, type, this.connectRuntime(options));
                } else {
                    __$coverCall('src/javascript/runtime/Transporter.js', '1327:1441');
                    var cb = function (e, runtime) {
                        __$coverCall('src/javascript/runtime/Transporter.js', '1365:1395');
                        self.unbind('RuntimeInit', cb);
                        __$coverCall('src/javascript/runtime/Transporter.js', '1403:1433');
                        _run.call(self, type, runtime);
                    };
                    __$coverCall('src/javascript/runtime/Transporter.js', '1448:1476');
                    this.bind('RuntimeInit', cb);
                    __$coverCall('src/javascript/runtime/Transporter.js', '1483:1511');
                    this.connectRuntime(options);
                }
            },
            abort: function () {
                __$coverCall('src/javascript/runtime/Transporter.js', '1553:1568');
                var self = this;
                __$coverCall('src/javascript/runtime/Transporter.js', '1575:1604');
                self.state = Transporter.IDLE;
                __$coverCall('src/javascript/runtime/Transporter.js', '1610:1727');
                if (_runtime) {
                    __$coverCall('src/javascript/runtime/Transporter.js', '1631:1679');
                    _runtime.exec.call(self, 'Transporter', 'clear');
                    __$coverCall('src/javascript/runtime/Transporter.js', '1686:1721');
                    self.trigger('TransportingAborted');
                }
                __$coverCall('src/javascript/runtime/Transporter.js', '1734:1751');
                _reset.call(self);
            },
            destroy: function () {
                __$coverCall('src/javascript/runtime/Transporter.js', '1790:1806');
                this.unbindAll();
                __$coverCall('src/javascript/runtime/Transporter.js', '1812:1827');
                _runtime = null;
                __$coverCall('src/javascript/runtime/Transporter.js', '1833:1857');
                this.disconnectRuntime();
                __$coverCall('src/javascript/runtime/Transporter.js', '1863:1880');
                _reset.call(this);
            }
        });
        __$coverCall('src/javascript/runtime/Transporter.js', '1896:1970');
        function _reset() {
            __$coverCall('src/javascript/runtime/Transporter.js', '1919:1935');
            _size = _pos = 0;
            __$coverCall('src/javascript/runtime/Transporter.js', '1940:1966');
            _data = this.result = null;
        }
        __$coverCall('src/javascript/runtime/Transporter.js', '1975:2638');
        function _run(type, runtime) {
            __$coverCall('src/javascript/runtime/Transporter.js', '2009:2024');
            var self = this;
            __$coverCall('src/javascript/runtime/Transporter.js', '2030:2048');
            _runtime = runtime;
            __$coverCall('src/javascript/runtime/Transporter.js', '2088:2300');
            self.bind('TransportingProgress', function (e) {
                __$coverCall('src/javascript/runtime/Transporter.js', '2140:2155');
                _pos = e.loaded;
                __$coverCall('src/javascript/runtime/Transporter.js', '2162:2288');
                if (_pos < _size && Basic.inArray(self.state, [
                        Transporter.IDLE,
                        Transporter.DONE
                    ]) === -1) {
                    __$coverCall('src/javascript/runtime/Transporter.js', '2261:2282');
                    _transport.call(self);
                }
            }, 999);
            __$coverCall('src/javascript/runtime/Transporter.js', '2306:2533');
            self.bind('TransportingComplete', function () {
                __$coverCall('src/javascript/runtime/Transporter.js', '2357:2369');
                _pos = _size;
                __$coverCall('src/javascript/runtime/Transporter.js', '2375:2404');
                self.state = Transporter.DONE;
                __$coverCall('src/javascript/runtime/Transporter.js', '2410:2422');
                _data = null;
                __$coverCall('src/javascript/runtime/Transporter.js', '2443:2521');
                self.result = _runtime.exec.call(self, 'Transporter', 'getAsBlob', type || '');
            }, 999);
            __$coverCall('src/javascript/runtime/Transporter.js', '2539:2568');
            self.state = Transporter.BUSY;
            __$coverCall('src/javascript/runtime/Transporter.js', '2573:2608');
            self.trigger('TransportingStarted');
            __$coverCall('src/javascript/runtime/Transporter.js', '2613:2634');
            _transport.call(self);
        }
        __$coverCall('src/javascript/runtime/Transporter.js', '2643:2926');
        function _transport() {
            __$coverCall('src/javascript/runtime/Transporter.js', '2670:2726');
            var self = this, chunk, bytesLeft = _size - _pos;
            __$coverCall('src/javascript/runtime/Transporter.js', '2732:2795');
            if (_chunk_size > bytesLeft) {
                __$coverCall('src/javascript/runtime/Transporter.js', '2767:2790');
                _chunk_size = bytesLeft;
            }
            __$coverCall('src/javascript/runtime/Transporter.js', '2801:2853');
            chunk = Encode.btoa(_data.substr(_pos, _chunk_size));
            __$coverCall('src/javascript/runtime/Transporter.js', '2858:2922');
            _runtime.exec.call(self, 'Transporter', 'receive', chunk, _size);
        }
    }
    __$coverCall('src/javascript/runtime/Transporter.js', '2933:2953');
    Transporter.IDLE = 0;
    __$coverCall('src/javascript/runtime/Transporter.js', '2956:2976');
    Transporter.BUSY = 1;
    __$coverCall('src/javascript/runtime/Transporter.js', '2979:2999');
    Transporter.DONE = 2;
    __$coverCall('src/javascript/runtime/Transporter.js', '3003:3047');
    Transporter.prototype = EventTarget.instance;
    __$coverCall('src/javascript/runtime/Transporter.js', '3051:3069');
    return Transporter;
});

// Included from: src/javascript/core/JSON.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/JSON.js", "/**\n * JSON.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine(\"moxie/core/JSON\", [], function() {\n\t/**\n\tParse string into the JSON object in a safe way\n\t@credits Douglas Crockford: https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js\n\n\t@method parse\n\t@static\n\t@protected\n\t@param {Object} obj Object to add property to\n\t@param {String} prop Property name\n\t@param {Object} desc Set of key-value pairs defining descriptor for the property\n\t*/\n\treturn !!window.JSON && JSON.parse || (function() {\n\t    \"use strict\";\n\n\t// This is a function that can parse a JSON text, producing a JavaScript\n\t// data structure. It is a simple, recursive descent parser. It does not use\n\t// eval or regular expressions, so it can be used as a model for implementing\n\t// a JSON parser in other languages.\n\n\t// We are defining the function inside of another function to avoid creating\n\t// global variables.\n\n\t    var at,     // The index of the current character\n\t        ch,     // The current character\n\t        escapee = {\n\t            '\"':  '\"',\n\t            '\\\\': '\\\\',\n\t            '/':  '/',\n\t            b:    '\\b',\n\t            f:    '\\f',\n\t            n:    '\\n',\n\t            r:    '\\r',\n\t            t:    '\\t'\n\t        },\n\t        text,\n\n\t        error = function (m) {\n\n\t// Call error when something is wrong.\n\n\t            throw {\n\t                name:    'SyntaxError',\n\t                message: m,\n\t                at:      at,\n\t                text:    text\n\t            };\n\t        },\n\n\t        next = function (c) {\n\n\t// If a c parameter is provided, verify that it matches the current character.\n\n\t            if (c && c !== ch) {\n\t                error(\"Expected '\" + c + \"' instead of '\" + ch + \"'\");\n\t            }\n\n\t// Get the next character. When there are no more characters,\n\t// return the empty string.\n\n\t            ch = text.charAt(at);\n\t            at += 1;\n\t            return ch;\n\t        },\n\n\t        number = function () {\n\n\t// Parse a number value.\n\n\t            var number,\n\t                string = '';\n\n\t            if (ch === '-') {\n\t                string = '-';\n\t                next('-');\n\t            }\n\t            while (ch >= '0' && ch <= '9') {\n\t                string += ch;\n\t                next();\n\t            }\n\t            if (ch === '.') {\n\t                string += '.';\n\t                while (next() && ch >= '0' && ch <= '9') {\n\t                    string += ch;\n\t                }\n\t            }\n\t            if (ch === 'e' || ch === 'E') {\n\t                string += ch;\n\t                next();\n\t                if (ch === '-' || ch === '+') {\n\t                    string += ch;\n\t                    next();\n\t                }\n\t                while (ch >= '0' && ch <= '9') {\n\t                    string += ch;\n\t                    next();\n\t                }\n\t            }\n\t            number = +string;\n\t            if (!isFinite(number)) {\n\t                error(\"Bad number\");\n\t            } else {\n\t                return number;\n\t            }\n\t        },\n\n\t        string = function () {\n\n\t// Parse a string value.\n\n\t            var hex,\n\t                i,\n\t                string = '',\n\t                uffff;\n\n\t// When parsing for string values, we must look for \" and \\ characters.\n\n\t            if (ch === '\"') {\n\t                while (next()) {\n\t                    if (ch === '\"') {\n\t                        next();\n\t                        return string;\n\t                    } else if (ch === '\\\\') {\n\t                        next();\n\t                        if (ch === 'u') {\n\t                            uffff = 0;\n\t                            for (i = 0; i < 4; i += 1) {\n\t                                hex = parseInt(next(), 16);\n\t                                if (!isFinite(hex)) {\n\t                                    break;\n\t                                }\n\t                                uffff = uffff * 16 + hex;\n\t                            }\n\t                            string += String.fromCharCode(uffff);\n\t                        } else if (typeof escapee[ch] === 'string') {\n\t                            string += escapee[ch];\n\t                        } else {\n\t                            break;\n\t                        }\n\t                    } else {\n\t                        string += ch;\n\t                    }\n\t                }\n\t            }\n\t            error(\"Bad string\");\n\t        },\n\n\t        white = function () {\n\n\t// Skip whitespace.\n\n\t            while (ch && ch <= ' ') {\n\t                next();\n\t            }\n\t        },\n\n\t        word = function () {\n\n\t// true, false, or null.\n\n\t            switch (ch) {\n\t            case 't':\n\t                next('t');\n\t                next('r');\n\t                next('u');\n\t                next('e');\n\t                return true;\n\t            case 'f':\n\t                next('f');\n\t                next('a');\n\t                next('l');\n\t                next('s');\n\t                next('e');\n\t                return false;\n\t            case 'n':\n\t                next('n');\n\t                next('u');\n\t                next('l');\n\t                next('l');\n\t                return null;\n\t            }\n\t            error(\"Unexpected '\" + ch + \"'\");\n\t        },\n\n\t        value,  // Place holder for the value function.\n\n\t        array = function () {\n\n\t// Parse an array value.\n\n\t            var array = [];\n\n\t            if (ch === '[') {\n\t                next('[');\n\t                white();\n\t                if (ch === ']') {\n\t                    next(']');\n\t                    return array;   // empty array\n\t                }\n\t                while (ch) {\n\t                    array.push(value());\n\t                    white();\n\t                    if (ch === ']') {\n\t                        next(']');\n\t                        return array;\n\t                    }\n\t                    next(',');\n\t                    white();\n\t                }\n\t            }\n\t            error(\"Bad array\");\n\t        },\n\n\t        object = function () {\n\n\t// Parse an object value.\n\n\t            var key,\n\t                object = {};\n\n\t            if (ch === '{') {\n\t                next('{');\n\t                white();\n\t                if (ch === '}') {\n\t                    next('}');\n\t                    return object;   // empty object\n\t                }\n\t                while (ch) {\n\t                    key = string();\n\t                    white();\n\t                    next(':');\n\t                    if (Object.hasOwnProperty.call(object, key)) {\n\t                        error('Duplicate key \"' + key + '\"');\n\t                    }\n\t                    object[key] = value();\n\t                    white();\n\t                    if (ch === '}') {\n\t                        next('}');\n\t                        return object;\n\t                    }\n\t                    next(',');\n\t                    white();\n\t                }\n\t            }\n\t            error(\"Bad object\");\n\t        };\n\n\t    value = function () {\n\n\t// Parse a JSON value. It could be an object, an array, a string, a number,\n\t// or a word.\n\n\t        white();\n\t        switch (ch) {\n\t        case '{':\n\t            return object();\n\t        case '[':\n\t            return array();\n\t        case '\"':\n\t            return string();\n\t        case '-':\n\t            return number();\n\t        default:\n\t            return ch >= '0' && ch <= '9' ? number() : word();\n\t        }\n\t    };\n\n\t// Return the json_parse function. It will have access to all of the above\n\t// functions and variables.\n\n\t    return function (source, reviver) {\n\t        var result;\n\n\t        text = source;\n\t        at = 0;\n\t        ch = ' ';\n\t        result = value();\n\t        white();\n\t        if (ch) {\n\t            error(\"Syntax error\");\n\t        }\n\n\t// If there is a reviver function, we recursively walk the new structure,\n\t// passing each name/value pair to the reviver function for possible\n\t// transformation, starting with a temporary root object that holds the result\n\t// in an empty key. If there is not a reviver function, we simply return the\n\t// result.\n\n\t        return typeof reviver === 'function' ? (function walk(holder, key) {\n\t            var k, v, value = holder[key];\n\t            if (value && typeof value === 'object') {\n\t                for (k in value) {\n\t                    if (Object.prototype.hasOwnProperty.call(value, k)) {\n\t                        v = walk(value, k);\n\t                        if (v !== undefined) {\n\t                            value[k] = v;\n\t                        } else {\n\t                            delete value[k];\n\t                        }\n\t                    }\n\t                }\n\t            }\n\t            return reviver.call(holder, key, value);\n\t        }({'': result}, '')) : result;\n\t    };\n\t}());\n\n});\n");
__$coverInitRange("src/javascript/core/JSON.js", "342:9056");
__$coverInitRange("src/javascript/core/JSON.js", "745:9051");
__$coverInitRange("src/javascript/core/JSON.js", "802:814");
__$coverInitRange("src/javascript/core/JSON.js", "1193:7237");
__$coverInitRange("src/javascript/core/JSON.js", "7245:7696");
__$coverInitRange("src/javascript/core/JSON.js", "7810:9044");
__$coverInitRange("src/javascript/core/JSON.js", "1618:1771");
__$coverInitRange("src/javascript/core/JSON.js", "1912:2018");
__$coverInitRange("src/javascript/core/JSON.js", "2127:2147");
__$coverInitRange("src/javascript/core/JSON.js", "2162:2169");
__$coverInitRange("src/javascript/core/JSON.js", "2184:2193");
__$coverInitRange("src/javascript/core/JSON.js", "1950:2003");
__$coverInitRange("src/javascript/core/JSON.js", "2281:2321");
__$coverInitRange("src/javascript/core/JSON.js", "2337:2427");
__$coverInitRange("src/javascript/core/JSON.js", "2442:2544");
__$coverInitRange("src/javascript/core/JSON.js", "2559:2736");
__$coverInitRange("src/javascript/core/JSON.js", "2751:3117");
__$coverInitRange("src/javascript/core/JSON.js", "3132:3148");
__$coverInitRange("src/javascript/core/JSON.js", "3163:3293");
__$coverInitRange("src/javascript/core/JSON.js", "2372:2384");
__$coverInitRange("src/javascript/core/JSON.js", "2403:2412");
__$coverInitRange("src/javascript/core/JSON.js", "2492:2504");
__$coverInitRange("src/javascript/core/JSON.js", "2523:2529");
__$coverInitRange("src/javascript/core/JSON.js", "2594:2607");
__$coverInitRange("src/javascript/core/JSON.js", "2626:2721");
__$coverInitRange("src/javascript/core/JSON.js", "2690:2702");
__$coverInitRange("src/javascript/core/JSON.js", "2800:2812");
__$coverInitRange("src/javascript/core/JSON.js", "2831:2837");
__$coverInitRange("src/javascript/core/JSON.js", "2856:2969");
__$coverInitRange("src/javascript/core/JSON.js", "2988:3102");
__$coverInitRange("src/javascript/core/JSON.js", "2909:2921");
__$coverInitRange("src/javascript/core/JSON.js", "2944:2950");
__$coverInitRange("src/javascript/core/JSON.js", "3042:3054");
__$coverInitRange("src/javascript/core/JSON.js", "3077:3083");
__$coverInitRange("src/javascript/core/JSON.js", "3205:3224");
__$coverInitRange("src/javascript/core/JSON.js", "3265:3278");
__$coverInitRange("src/javascript/core/JSON.js", "3381:3462");
__$coverInitRange("src/javascript/core/JSON.js", "3552:4633");
__$coverInitRange("src/javascript/core/JSON.js", "4648:4667");
__$coverInitRange("src/javascript/core/JSON.js", "3587:4618");
__$coverInitRange("src/javascript/core/JSON.js", "3625:4599");
__$coverInitRange("src/javascript/core/JSON.js", "3668:3674");
__$coverInitRange("src/javascript/core/JSON.js", "3701:3714");
__$coverInitRange("src/javascript/core/JSON.js", "3788:3794");
__$coverInitRange("src/javascript/core/JSON.js", "3821:4507");
__$coverInitRange("src/javascript/core/JSON.js", "3868:3877");
__$coverInitRange("src/javascript/core/JSON.js", "3908:4220");
__$coverInitRange("src/javascript/core/JSON.js", "4251:4287");
__$coverInitRange("src/javascript/core/JSON.js", "3970:3996");
__$coverInitRange("src/javascript/core/JSON.js", "4031:4130");
__$coverInitRange("src/javascript/core/JSON.js", "4165:4189");
__$coverInitRange("src/javascript/core/JSON.js", "4090:4095");
__$coverInitRange("src/javascript/core/JSON.js", "4389:4410");
__$coverInitRange("src/javascript/core/JSON.js", "4475:4480");
__$coverInitRange("src/javascript/core/JSON.js", "4564:4576");
__$coverInitRange("src/javascript/core/JSON.js", "4749:4813");
__$coverInitRange("src/javascript/core/JSON.js", "4792:4798");
__$coverInitRange("src/javascript/core/JSON.js", "4899:5450");
__$coverInitRange("src/javascript/core/JSON.js", "5465:5497");
__$coverInitRange("src/javascript/core/JSON.js", "4953:4962");
__$coverInitRange("src/javascript/core/JSON.js", "4981:4990");
__$coverInitRange("src/javascript/core/JSON.js", "5009:5018");
__$coverInitRange("src/javascript/core/JSON.js", "5037:5046");
__$coverInitRange("src/javascript/core/JSON.js", "5065:5076");
__$coverInitRange("src/javascript/core/JSON.js", "5118:5127");
__$coverInitRange("src/javascript/core/JSON.js", "5146:5155");
__$coverInitRange("src/javascript/core/JSON.js", "5174:5183");
__$coverInitRange("src/javascript/core/JSON.js", "5202:5211");
__$coverInitRange("src/javascript/core/JSON.js", "5230:5239");
__$coverInitRange("src/javascript/core/JSON.js", "5258:5270");
__$coverInitRange("src/javascript/core/JSON.js", "5312:5321");
__$coverInitRange("src/javascript/core/JSON.js", "5340:5349");
__$coverInitRange("src/javascript/core/JSON.js", "5368:5377");
__$coverInitRange("src/javascript/core/JSON.js", "5396:5405");
__$coverInitRange("src/javascript/core/JSON.js", "5424:5435");
__$coverInitRange("src/javascript/core/JSON.js", "5642:5656");
__$coverInitRange("src/javascript/core/JSON.js", "5672:6215");
__$coverInitRange("src/javascript/core/JSON.js", "6230:6248");
__$coverInitRange("src/javascript/core/JSON.js", "5707:5716");
__$coverInitRange("src/javascript/core/JSON.js", "5735:5742");
__$coverInitRange("src/javascript/core/JSON.js", "5761:5880");
__$coverInitRange("src/javascript/core/JSON.js", "5899:6200");
__$coverInitRange("src/javascript/core/JSON.js", "5800:5809");
__$coverInitRange("src/javascript/core/JSON.js", "5832:5844");
__$coverInitRange("src/javascript/core/JSON.js", "5933:5952");
__$coverInitRange("src/javascript/core/JSON.js", "5975:5982");
__$coverInitRange("src/javascript/core/JSON.js", "6005:6119");
__$coverInitRange("src/javascript/core/JSON.js", "6142:6151");
__$coverInitRange("src/javascript/core/JSON.js", "6174:6181");
__$coverInitRange("src/javascript/core/JSON.js", "6048:6057");
__$coverInitRange("src/javascript/core/JSON.js", "6084:6096");
__$coverInitRange("src/javascript/core/JSON.js", "6337:6374");
__$coverInitRange("src/javascript/core/JSON.js", "6390:7191");
__$coverInitRange("src/javascript/core/JSON.js", "7206:7225");
__$coverInitRange("src/javascript/core/JSON.js", "6425:6434");
__$coverInitRange("src/javascript/core/JSON.js", "6453:6460");
__$coverInitRange("src/javascript/core/JSON.js", "6479:6600");
__$coverInitRange("src/javascript/core/JSON.js", "6619:7176");
__$coverInitRange("src/javascript/core/JSON.js", "6518:6527");
__$coverInitRange("src/javascript/core/JSON.js", "6550:6563");
__$coverInitRange("src/javascript/core/JSON.js", "6653:6667");
__$coverInitRange("src/javascript/core/JSON.js", "6690:6697");
__$coverInitRange("src/javascript/core/JSON.js", "6720:6729");
__$coverInitRange("src/javascript/core/JSON.js", "6752:6883");
__$coverInitRange("src/javascript/core/JSON.js", "6906:6927");
__$coverInitRange("src/javascript/core/JSON.js", "6950:6957");
__$coverInitRange("src/javascript/core/JSON.js", "6980:7095");
__$coverInitRange("src/javascript/core/JSON.js", "7118:7127");
__$coverInitRange("src/javascript/core/JSON.js", "7150:7157");
__$coverInitRange("src/javascript/core/JSON.js", "6824:6860");
__$coverInitRange("src/javascript/core/JSON.js", "7023:7032");
__$coverInitRange("src/javascript/core/JSON.js", "7059:7072");
__$coverInitRange("src/javascript/core/JSON.js", "7370:7377");
__$coverInitRange("src/javascript/core/JSON.js", "7388:7688");
__$coverInitRange("src/javascript/core/JSON.js", "7434:7449");
__$coverInitRange("src/javascript/core/JSON.js", "7483:7497");
__$coverInitRange("src/javascript/core/JSON.js", "7531:7546");
__$coverInitRange("src/javascript/core/JSON.js", "7580:7595");
__$coverInitRange("src/javascript/core/JSON.js", "7628:7677");
__$coverInitRange("src/javascript/core/JSON.js", "7855:7865");
__$coverInitRange("src/javascript/core/JSON.js", "7877:7890");
__$coverInitRange("src/javascript/core/JSON.js", "7901:7907");
__$coverInitRange("src/javascript/core/JSON.js", "7918:7926");
__$coverInitRange("src/javascript/core/JSON.js", "7937:7953");
__$coverInitRange("src/javascript/core/JSON.js", "7964:7971");
__$coverInitRange("src/javascript/core/JSON.js", "7982:8037");
__$coverInitRange("src/javascript/core/JSON.js", "8365:9036");
__$coverInitRange("src/javascript/core/JSON.js", "8005:8026");
__$coverInitRange("src/javascript/core/JSON.js", "8447:8476");
__$coverInitRange("src/javascript/core/JSON.js", "8491:8942");
__$coverInitRange("src/javascript/core/JSON.js", "8957:8996");
__$coverInitRange("src/javascript/core/JSON.js", "8550:8927");
__$coverInitRange("src/javascript/core/JSON.js", "8590:8908");
__$coverInitRange("src/javascript/core/JSON.js", "8669:8687");
__$coverInitRange("src/javascript/core/JSON.js", "8714:8885");
__$coverInitRange("src/javascript/core/JSON.js", "8766:8778");
__$coverInitRange("src/javascript/core/JSON.js", "8843:8858");
__$coverCall('src/javascript/core/JSON.js', '342:9056');
define('moxie/core/JSON', [], function () {
    __$coverCall('src/javascript/core/JSON.js', '745:9051');
    return !!window.JSON && JSON.parse || function () {
        __$coverCall('src/javascript/core/JSON.js', '802:814');
        'use strict';
        __$coverCall('src/javascript/core/JSON.js', '1193:7237');
        var at, ch, escapee = {
                '"': '"',
                '\\': '\\',
                '/': '/',
                b: '\b',
                f: '\f',
                n: '\n',
                r: '\r',
                t: '\t'
            }, text, error = function (m) {
                __$coverCall('src/javascript/core/JSON.js', '1618:1771');
                throw {
                    name: 'SyntaxError',
                    message: m,
                    at: at,
                    text: text
                };
            }, next = function (c) {
                __$coverCall('src/javascript/core/JSON.js', '1912:2018');
                if (c && c !== ch) {
                    __$coverCall('src/javascript/core/JSON.js', '1950:2003');
                    error('Expected \'' + c + '\' instead of \'' + ch + '\'');
                }
                __$coverCall('src/javascript/core/JSON.js', '2127:2147');
                ch = text.charAt(at);
                __$coverCall('src/javascript/core/JSON.js', '2162:2169');
                at += 1;
                __$coverCall('src/javascript/core/JSON.js', '2184:2193');
                return ch;
            }, number = function () {
                __$coverCall('src/javascript/core/JSON.js', '2281:2321');
                var number, string = '';
                __$coverCall('src/javascript/core/JSON.js', '2337:2427');
                if (ch === '-') {
                    __$coverCall('src/javascript/core/JSON.js', '2372:2384');
                    string = '-';
                    __$coverCall('src/javascript/core/JSON.js', '2403:2412');
                    next('-');
                }
                __$coverCall('src/javascript/core/JSON.js', '2442:2544');
                while (ch >= '0' && ch <= '9') {
                    __$coverCall('src/javascript/core/JSON.js', '2492:2504');
                    string += ch;
                    __$coverCall('src/javascript/core/JSON.js', '2523:2529');
                    next();
                }
                __$coverCall('src/javascript/core/JSON.js', '2559:2736');
                if (ch === '.') {
                    __$coverCall('src/javascript/core/JSON.js', '2594:2607');
                    string += '.';
                    __$coverCall('src/javascript/core/JSON.js', '2626:2721');
                    while (next() && ch >= '0' && ch <= '9') {
                        __$coverCall('src/javascript/core/JSON.js', '2690:2702');
                        string += ch;
                    }
                }
                __$coverCall('src/javascript/core/JSON.js', '2751:3117');
                if (ch === 'e' || ch === 'E') {
                    __$coverCall('src/javascript/core/JSON.js', '2800:2812');
                    string += ch;
                    __$coverCall('src/javascript/core/JSON.js', '2831:2837');
                    next();
                    __$coverCall('src/javascript/core/JSON.js', '2856:2969');
                    if (ch === '-' || ch === '+') {
                        __$coverCall('src/javascript/core/JSON.js', '2909:2921');
                        string += ch;
                        __$coverCall('src/javascript/core/JSON.js', '2944:2950');
                        next();
                    }
                    __$coverCall('src/javascript/core/JSON.js', '2988:3102');
                    while (ch >= '0' && ch <= '9') {
                        __$coverCall('src/javascript/core/JSON.js', '3042:3054');
                        string += ch;
                        __$coverCall('src/javascript/core/JSON.js', '3077:3083');
                        next();
                    }
                }
                __$coverCall('src/javascript/core/JSON.js', '3132:3148');
                number = +string;
                __$coverCall('src/javascript/core/JSON.js', '3163:3293');
                if (!isFinite(number)) {
                    __$coverCall('src/javascript/core/JSON.js', '3205:3224');
                    error('Bad number');
                } else {
                    __$coverCall('src/javascript/core/JSON.js', '3265:3278');
                    return number;
                }
            }, string = function () {
                __$coverCall('src/javascript/core/JSON.js', '3381:3462');
                var hex, i, string = '', uffff;
                __$coverCall('src/javascript/core/JSON.js', '3552:4633');
                if (ch === '"') {
                    __$coverCall('src/javascript/core/JSON.js', '3587:4618');
                    while (next()) {
                        __$coverCall('src/javascript/core/JSON.js', '3625:4599');
                        if (ch === '"') {
                            __$coverCall('src/javascript/core/JSON.js', '3668:3674');
                            next();
                            __$coverCall('src/javascript/core/JSON.js', '3701:3714');
                            return string;
                        } else if (ch === '\\') {
                            __$coverCall('src/javascript/core/JSON.js', '3788:3794');
                            next();
                            __$coverCall('src/javascript/core/JSON.js', '3821:4507');
                            if (ch === 'u') {
                                __$coverCall('src/javascript/core/JSON.js', '3868:3877');
                                uffff = 0;
                                __$coverCall('src/javascript/core/JSON.js', '3908:4220');
                                for (i = 0; i < 4; i += 1) {
                                    __$coverCall('src/javascript/core/JSON.js', '3970:3996');
                                    hex = parseInt(next(), 16);
                                    __$coverCall('src/javascript/core/JSON.js', '4031:4130');
                                    if (!isFinite(hex)) {
                                        __$coverCall('src/javascript/core/JSON.js', '4090:4095');
                                        break;
                                    }
                                    __$coverCall('src/javascript/core/JSON.js', '4165:4189');
                                    uffff = uffff * 16 + hex;
                                }
                                __$coverCall('src/javascript/core/JSON.js', '4251:4287');
                                string += String.fromCharCode(uffff);
                            } else if (typeof escapee[ch] === 'string') {
                                __$coverCall('src/javascript/core/JSON.js', '4389:4410');
                                string += escapee[ch];
                            } else {
                                __$coverCall('src/javascript/core/JSON.js', '4475:4480');
                                break;
                            }
                        } else {
                            __$coverCall('src/javascript/core/JSON.js', '4564:4576');
                            string += ch;
                        }
                    }
                }
                __$coverCall('src/javascript/core/JSON.js', '4648:4667');
                error('Bad string');
            }, white = function () {
                __$coverCall('src/javascript/core/JSON.js', '4749:4813');
                while (ch && ch <= ' ') {
                    __$coverCall('src/javascript/core/JSON.js', '4792:4798');
                    next();
                }
            }, word = function () {
                __$coverCall('src/javascript/core/JSON.js', '4899:5450');
                switch (ch) {
                case 't':
                    __$coverCall('src/javascript/core/JSON.js', '4953:4962');
                    next('t');
                    __$coverCall('src/javascript/core/JSON.js', '4981:4990');
                    next('r');
                    __$coverCall('src/javascript/core/JSON.js', '5009:5018');
                    next('u');
                    __$coverCall('src/javascript/core/JSON.js', '5037:5046');
                    next('e');
                    __$coverCall('src/javascript/core/JSON.js', '5065:5076');
                    return true;
                case 'f':
                    __$coverCall('src/javascript/core/JSON.js', '5118:5127');
                    next('f');
                    __$coverCall('src/javascript/core/JSON.js', '5146:5155');
                    next('a');
                    __$coverCall('src/javascript/core/JSON.js', '5174:5183');
                    next('l');
                    __$coverCall('src/javascript/core/JSON.js', '5202:5211');
                    next('s');
                    __$coverCall('src/javascript/core/JSON.js', '5230:5239');
                    next('e');
                    __$coverCall('src/javascript/core/JSON.js', '5258:5270');
                    return false;
                case 'n':
                    __$coverCall('src/javascript/core/JSON.js', '5312:5321');
                    next('n');
                    __$coverCall('src/javascript/core/JSON.js', '5340:5349');
                    next('u');
                    __$coverCall('src/javascript/core/JSON.js', '5368:5377');
                    next('l');
                    __$coverCall('src/javascript/core/JSON.js', '5396:5405');
                    next('l');
                    __$coverCall('src/javascript/core/JSON.js', '5424:5435');
                    return null;
                }
                __$coverCall('src/javascript/core/JSON.js', '5465:5497');
                error('Unexpected \'' + ch + '\'');
            }, value, array = function () {
                __$coverCall('src/javascript/core/JSON.js', '5642:5656');
                var array = [];
                __$coverCall('src/javascript/core/JSON.js', '5672:6215');
                if (ch === '[') {
                    __$coverCall('src/javascript/core/JSON.js', '5707:5716');
                    next('[');
                    __$coverCall('src/javascript/core/JSON.js', '5735:5742');
                    white();
                    __$coverCall('src/javascript/core/JSON.js', '5761:5880');
                    if (ch === ']') {
                        __$coverCall('src/javascript/core/JSON.js', '5800:5809');
                        next(']');
                        __$coverCall('src/javascript/core/JSON.js', '5832:5844');
                        return array;
                    }
                    __$coverCall('src/javascript/core/JSON.js', '5899:6200');
                    while (ch) {
                        __$coverCall('src/javascript/core/JSON.js', '5933:5952');
                        array.push(value());
                        __$coverCall('src/javascript/core/JSON.js', '5975:5982');
                        white();
                        __$coverCall('src/javascript/core/JSON.js', '6005:6119');
                        if (ch === ']') {
                            __$coverCall('src/javascript/core/JSON.js', '6048:6057');
                            next(']');
                            __$coverCall('src/javascript/core/JSON.js', '6084:6096');
                            return array;
                        }
                        __$coverCall('src/javascript/core/JSON.js', '6142:6151');
                        next(',');
                        __$coverCall('src/javascript/core/JSON.js', '6174:6181');
                        white();
                    }
                }
                __$coverCall('src/javascript/core/JSON.js', '6230:6248');
                error('Bad array');
            }, object = function () {
                __$coverCall('src/javascript/core/JSON.js', '6337:6374');
                var key, object = {};
                __$coverCall('src/javascript/core/JSON.js', '6390:7191');
                if (ch === '{') {
                    __$coverCall('src/javascript/core/JSON.js', '6425:6434');
                    next('{');
                    __$coverCall('src/javascript/core/JSON.js', '6453:6460');
                    white();
                    __$coverCall('src/javascript/core/JSON.js', '6479:6600');
                    if (ch === '}') {
                        __$coverCall('src/javascript/core/JSON.js', '6518:6527');
                        next('}');
                        __$coverCall('src/javascript/core/JSON.js', '6550:6563');
                        return object;
                    }
                    __$coverCall('src/javascript/core/JSON.js', '6619:7176');
                    while (ch) {
                        __$coverCall('src/javascript/core/JSON.js', '6653:6667');
                        key = string();
                        __$coverCall('src/javascript/core/JSON.js', '6690:6697');
                        white();
                        __$coverCall('src/javascript/core/JSON.js', '6720:6729');
                        next(':');
                        __$coverCall('src/javascript/core/JSON.js', '6752:6883');
                        if (Object.hasOwnProperty.call(object, key)) {
                            __$coverCall('src/javascript/core/JSON.js', '6824:6860');
                            error('Duplicate key "' + key + '"');
                        }
                        __$coverCall('src/javascript/core/JSON.js', '6906:6927');
                        object[key] = value();
                        __$coverCall('src/javascript/core/JSON.js', '6950:6957');
                        white();
                        __$coverCall('src/javascript/core/JSON.js', '6980:7095');
                        if (ch === '}') {
                            __$coverCall('src/javascript/core/JSON.js', '7023:7032');
                            next('}');
                            __$coverCall('src/javascript/core/JSON.js', '7059:7072');
                            return object;
                        }
                        __$coverCall('src/javascript/core/JSON.js', '7118:7127');
                        next(',');
                        __$coverCall('src/javascript/core/JSON.js', '7150:7157');
                        white();
                    }
                }
                __$coverCall('src/javascript/core/JSON.js', '7206:7225');
                error('Bad object');
            };
        __$coverCall('src/javascript/core/JSON.js', '7245:7696');
        value = function () {
            __$coverCall('src/javascript/core/JSON.js', '7370:7377');
            white();
            __$coverCall('src/javascript/core/JSON.js', '7388:7688');
            switch (ch) {
            case '{':
                __$coverCall('src/javascript/core/JSON.js', '7434:7449');
                return object();
            case '[':
                __$coverCall('src/javascript/core/JSON.js', '7483:7497');
                return array();
            case '"':
                __$coverCall('src/javascript/core/JSON.js', '7531:7546');
                return string();
            case '-':
                __$coverCall('src/javascript/core/JSON.js', '7580:7595');
                return number();
            default:
                __$coverCall('src/javascript/core/JSON.js', '7628:7677');
                return ch >= '0' && ch <= '9' ? number() : word();
            }
        };
        __$coverCall('src/javascript/core/JSON.js', '7810:9044');
        return function (source, reviver) {
            __$coverCall('src/javascript/core/JSON.js', '7855:7865');
            var result;
            __$coverCall('src/javascript/core/JSON.js', '7877:7890');
            text = source;
            __$coverCall('src/javascript/core/JSON.js', '7901:7907');
            at = 0;
            __$coverCall('src/javascript/core/JSON.js', '7918:7926');
            ch = ' ';
            __$coverCall('src/javascript/core/JSON.js', '7937:7953');
            result = value();
            __$coverCall('src/javascript/core/JSON.js', '7964:7971');
            white();
            __$coverCall('src/javascript/core/JSON.js', '7982:8037');
            if (ch) {
                __$coverCall('src/javascript/core/JSON.js', '8005:8026');
                error('Syntax error');
            }
            __$coverCall('src/javascript/core/JSON.js', '8365:9036');
            return typeof reviver === 'function' ? function walk(holder, key) {
                __$coverCall('src/javascript/core/JSON.js', '8447:8476');
                var k, v, value = holder[key];
                __$coverCall('src/javascript/core/JSON.js', '8491:8942');
                if (value && typeof value === 'object') {
                    __$coverCall('src/javascript/core/JSON.js', '8550:8927');
                    for (k in value) {
                        __$coverCall('src/javascript/core/JSON.js', '8590:8908');
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            __$coverCall('src/javascript/core/JSON.js', '8669:8687');
                            v = walk(value, k);
                            __$coverCall('src/javascript/core/JSON.js', '8714:8885');
                            if (v !== undefined) {
                                __$coverCall('src/javascript/core/JSON.js', '8766:8778');
                                value[k] = v;
                            } else {
                                __$coverCall('src/javascript/core/JSON.js', '8843:8858');
                                delete value[k];
                            }
                        }
                    }
                }
                __$coverCall('src/javascript/core/JSON.js', '8957:8996');
                return reviver.call(holder, key, value);
            }({ '': result }, '') : result;
        };
    }();
});

// Included from: src/javascript/image/Image.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/image/Image.js", "/**\n * Image.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true, laxcomma:true */\n/*global define:true */\n\ndefine(\"moxie/image/Image\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/utils/Dom\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/file/FileReaderSync\",\n\t\"moxie/xhr/XMLHttpRequest\",\n\t\"moxie/runtime/RuntimeClient\",\n\t\"moxie/runtime/Transporter\",\n\t\"moxie/core/utils/Env\",\n\t\"moxie/core/EventTarget\",\n\t\"moxie/file/Blob\",\n\t\"moxie/file/File\",\n\t\"moxie/core/utils/Encode\",\n\t\"moxie/core/JSON\"\n], function(Basic, Dom, x, FileReaderSync, XMLHttpRequest, RuntimeClient, Transporter, Env, EventTarget, Blob, File, Encode, parseJSON) {\n\t/**\n\tImage preloading and manipulation utility. Additionally it provides access to image meta info (Exif, GPS) and raw binary data.\n\n\t@class Image\n\t@constructor\n\t@extends EventTarget\n\t*/\n\tvar dispatches = [\n\t\t'progress',\n\n\t\t/**\n\t\tDispatched when loading is complete.\n\n\t\t@event load\n\t\t@param {Object} event\n\t\t*/\n\t\t'load',\n\n\t\t'error',\n\n\t\t/**\n\t\tDispatched when resize operation is complete.\n\t\t\n\t\t@event resize\n\t\t@param {Object} event\n\t\t*/\n\t\t'resize',\n\n\t\t/**\n\t\tDispatched when visual representation of the image is successfully embedded\n\t\tinto the corresponsing container.\n\n\t\t@event embedded\n\t\t@param {Object} event\n\t\t*/\n\t\t'embedded'\n\t];\n\t\n\tfunction Image() {\n\t\t\t\n\t\tRuntimeClient.call(this);\n\t\t\n\t\tBasic.extend(this, {\n\t\t\t/**\n\t\t\tUnique id of the component\n\n\t\t\t@property uid\n\t\t\t@type {String}\n\t\t\t*/\n\t\t\tuid: Basic.guid('uid_'),\n\n\t\t\t/**\n\t\t\tUnique id of the connected runtime, if any.\n\n\t\t\t@property ruid\n\t\t\t@type {String}\n\t\t\t*/\n\t\t\truid: null,\n\t\t\t\n\t\t\t/**\n\t\t\tName of the file, that was used to create an image, if available. If not equals to empty string.\n\n\t\t\t@property name\n\t\t\t@type {String}\n\t\t\t@default \"\"\n\t\t\t*/\n\t\t\tname: \"\",\n\t\t\t\n\t\t\t/**\n\t\t\tSize of the image in bytes. Actual value is set only after image is preloaded.\n\n\t\t\t@property size\n\t\t\t@type {Number}\n\t\t\t@default 0\n\t\t\t*/\n\t\t\tsize: 0,\n\n\t\t\t/**\n\t\t\tWidth of the image. Actual value is set only after image is preloaded.\n\n\t\t\t@property width\n\t\t\t@type {Number}\n\t\t\t@default 0\n\t\t\t*/\n\t\t\twidth: 0,\n\n\t\t\t/**\n\t\t\tHeight of the image. Actual value is set only after image is preloaded.\n\n\t\t\t@property height\n\t\t\t@type {Number}\n\t\t\t@default 0\n\t\t\t*/\n\t\t\theight: 0,\n\t\t\t\n\t\t\t/**\n\t\t\tMime type of the image. Currently only image/jpeg and image/png are supported. Actual value is set only after image is preloaded.\n\n\t\t\t@property type\n\t\t\t@type {String}\n\t\t\t@default \"\"\n\t\t\t*/\n\t\t\ttype: \"\",\n\n\t\t\t/**\n\t\t\tHolds meta info (Exif, GPS). Is populated only for image/jpeg. Actual value is set only after image is preloaded.\n\n\t\t\t@property meta\n\t\t\t@type {Object}\n\t\t\t@default {}\n\t\t\t*/\n\t\t\tmeta: {},\n\n\t\t\t/**\n\t\t\tAlias for load method, that takes another mOxie.Image object as a source (see load).\n\n\t\t\t@method clone\n\t\t\t@param {Image} src Source for the image\n\t\t\t@param {Boolean} [exact=false] Whether to activate in-depth clone mode\n\t\t\t*/\n\t\t\tclone: function() {\n\t\t\t\tthis.load.apply(this, arguments);\n\t\t\t},\n\n\t\t\t/**\n\t\t\tLoads image from various sources. Currently the source for new image can be: mOxie.Image, mOxie.Blob/mOxie.File, \n\t\t\tnative Blob/File, dataUrl or URL. Depending on the type of the source, arguments - differ. When source is URL, \n\t\t\tImage will be downloaded from remote destination and loaded in memory.\n\n\t\t\t@example\n\t\t\t\tvar img = new mOxie.Image();\n\t\t\t\timg.onload = function() {\n\t\t\t\t\tvar blob = img.getAsBlob();\n\t\t\t\t\t\n\t\t\t\t\tvar formData = new mOxie.FormData();\n\t\t\t\t\tformData.append('file', blob);\n\n\t\t\t\t\tvar xhr = new mOxie.XMLHttpRequest();\n\t\t\t\t\txhr.onload = function() {\n\t\t\t\t\t\t// upload complete\n\t\t\t\t\t};\n\t\t\t\t\txhr.open('post', 'upload.php');\n\t\t\t\t\txhr.send(formData);\n\t\t\t\t};\n\t\t\t\timg.load(\"http://www.moxiecode.com/images/mox-logo.jpg\"); // notice file extension (.jpg)\n\t\t\t\n\n\t\t\t@method load\n\t\t\t@param {Image|Blob|File|String} src Source for the image\n\t\t\t@param {Boolean|Object} [mixed]\n\t\t\t*/\n\t\t\tload: function(src) {\n\t\t\t\t// this is here because to bind properly we need an uid first, which is created above\n\t\t\t\tthis.bind('Load Resize', function(e) {\n\t\t\t\t\t_updateInfo.call(this);\n\t\t\t\t}, 999);\n\n\t\t\t\tthis.convertEventPropsToHandlers(dispatches);\n\n\t\t\t\t_load.apply(this, arguments);\n\t\t\t},\n\n\t\t\t/**\n\t\t\tResizes the image to fit the specified width/height. If crop is supplied, image will be cropped to exact dimensions.\n\n\t\t\t@method resize\n\t\t\t@param {Number} width Resulting width\n\t\t\t@param {Number} [height=width] Resulting height (optional, if not supplied will default to width)\n\t\t\t@param {Boolean} [crop=false] Whether to crop the image to exact dimensions\n\t\t\t@param {Boolean} [preserveHeaders=true] Whether to preserve meta headers (on JPEGs after resize)\n\t\t\t*/\n\t\t\tresize: function(width, height, crop, preserveHeaders) {\n\t\t\t\tvar runtime;\n\n\t\t\t\tif (!this.size) { // only preloaded image objects can be used as source\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\tif (!width) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.SYNTAX_ERR);\n\t\t\t\t}\n\n\t\t\t\tif (!height) {\n\t\t\t\t\theight = width;\n\t\t\t\t}\n\n\t\t\t\tcrop = (crop === undefined ? false : !!crop);\n\t\t\t\tpreserveHeaders = (Basic.typeOf(preserveHeaders) === 'undefined' ? true : !!preserveHeaders);\n\n\t\t\t\truntime = this.getRuntime();\n\t\t\t\truntime.exec.call(this, 'Image', 'resize', width, height, crop, preserveHeaders);\n\t\t\t},\n\n\t\t\t/**\n\t\t\tAlias for resize(width, height, true). (see resize)\n\t\t\t\n\t\t\t@method crop\n\t\t\t@param {Number} width Resulting width\n\t\t\t@param {Number} [height=width] Resulting height (optional, if not supplied will default to width)\n\t\t\t@param {Boolean} [preserveHeaders=true] Whether to preserve meta headers (on JPEGs after resize)\n\t\t\t*/\n\t\t\tcrop: function(width, height, preserveHeaders) {\n\t\t\t\tthis.resize(width, height, true, preserveHeaders);\n\t\t\t},\n\n\t\t\tgetAsCanvas: function() {\n\t\t\t\tif (!Env.can('create_canvas')) {\n\t\t\t\t\tthrow new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);\n\t\t\t\t}\n\n\t\t\t\tvar runtime = this.connectRuntime(this.ruid);\n\t\t\t\treturn runtime.exec.call(this, 'Image', 'getAsCanvas');\n\t\t\t},\n\n\t\t\t/**\n\t\t\tRetrieves image in it's current state as mOxie.Blob object. Cannot be run on empty or image in progress (throws\n\t\t\tDOMException.INVALID_STATE_ERR).\n\n\t\t\t@method getAsBlob\n\t\t\t@param {String} [type=\"image/jpeg\"] Mime type of resulting blob. Can either be image/jpeg or image/png\n\t\t\t@param {Number} [quality=90] Applicable only together with mime type image/jpeg\n\t\t\t@return {Blob} Image as Blob\n\t\t\t*/\n\t\t\tgetAsBlob: function(type, quality) {\n\t\t\t\tvar blob;\n\n\t\t\t\tif (!this.size) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\t\t\t\tif (!type) {\n\t\t\t\t\ttype = 'image/jpeg';\n\t\t\t\t}\n\n\t\t\t\tif (type === 'image/jpeg' && !quality) {\n\t\t\t\t\tquality = 90;\n\t\t\t\t}\n\n\t\t\t\treturn this.getRuntime().exec.call(this, 'Image', 'getAsBlob', type, quality);\n\t\t\t},\n\n\t\t\t/**\n\t\t\tRetrieves image in it's current state as dataURL string. Cannot be run on empty or image in progress (throws\n\t\t\tDOMException.INVALID_STATE_ERR).\n\n\t\t\t@method getAsDataURL\n\t\t\t@param {String} [type=\"image/jpeg\"] Mime type of resulting blob. Can either be image/jpeg or image/png\n\t\t\t@param {Number} [quality=90] Applicable only together with mime type image/jpeg\n\t\t\t@return {String} Image as dataURL string\n\t\t\t*/\n\t\t\tgetAsDataURL: function(type, quality) {\n\t\t\t\tvar dataUrl;\n\n\t\t\t\tif (!this.size) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\t\t\t\treturn this.getRuntime().exec.call(this, 'Image', 'getAsDataURL', type, quality);\n\t\t\t},\n\n\t\t\t/**\n\t\t\tRetrieves image in it's current state as binary string. Cannot be run on empty or image in progress (throws\n\t\t\tDOMException.INVALID_STATE_ERR).\n\n\t\t\t@method getAsBinaryString\n\t\t\t@param {String} [type=\"image/jpeg\"] Mime type of resulting blob. Can either be image/jpeg or image/png\n\t\t\t@param {Number} [quality=90] Applicable only together with mime type image/jpeg\n\t\t\t@return {String} Image as binary string\n\t\t\t*/\n\t\t\tgetAsBinaryString: function(type, quality) {\n\t\t\t\tvar dataUrl = this.getAsDataURL(type, quality);\n\t\t\t\treturn Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7));\n\t\t\t},\n\n\t\t\t/**\n\t\t\tEmbeds the image, or better to say, it's visual representation into the specified node. Depending on the runtime\n\t\t\tin use, might be a canvas, or image (actual ) element or shim object (Flash or SilverLight - very rare, used for\n\t\t\tlegacy browsers that do not have canvas or proper dataURI support).\n\n\t\t\t@method embed\n\t\t\t@param {DOMElement} el DOM element to insert the image object into\n\t\t\t@param {Object} options Set of key/value pairs controlling the mime type, dimensions and cropping factor of resulting\n\t\t\trepresentation\n\t\t\t*/\n\t\t\tembed: function(el) {\n\t\t\t\tvar self = this\n\t\t\t\t, imgCopy\n\t\t\t\t, type, quality, crop\n\t\t\t\t, options = arguments[1] || {}\n\t\t\t\t, width = this.width\n\t\t\t\t, height = this.height\n\t\t\t\t, runtime // this has to be outside of all the closures to contain proper runtime\n\t\t\t\t;\n\n\t\t\t\tfunction onResize() {\n\t\t\t\t\t// if possible, embed a canvas element directly\n\t\t\t\t\tif (Env.can('create_canvas')) {\n\t\t\t\t\t\tvar canvas = imgCopy.getAsCanvas();\n\t\t\t\t\t\tif (canvas) {\n\t\t\t\t\t\t\tel.appendChild(canvas);\n\t\t\t\t\t\t\tcanvas = null;\n\t\t\t\t\t\t\timgCopy.destroy();\n\t\t\t\t\t\t\tself.trigger('embedded');\n\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\tvar dataUrl = imgCopy.getAsDataURL(type, quality);\n\t\t\t\t\tif (!dataUrl) {\n\t\t\t\t\t\tthrow new x.ImageError(x.ImageError.WRONG_FORMAT);\n\t\t\t\t\t}\n\n\t\t\t\t\tif (Env.can('use_data_uri_of', dataUrl.length)) {\n\t\t\t\t\t\tel.innerHTML = '<img src=\"' + dataUrl + '\" width=\"' + imgCopy.width + '\" height=\"' + imgCopy.height + '\" />';\n\t\t\t\t\t\timgCopy.destroy();\n\t\t\t\t\t\tself.trigger('embedded');\n\t\t\t\t\t} else {\n\t\t\t\t\t\tvar tr = new Transporter();\n\n\t\t\t\t\t\ttr.bind(\"TransportingComplete\", function() {\n\t\t\t\t\t\t\truntime = self.connectRuntime(this.result.ruid);\n\t\t\t\t\t\t\n\t\t\t\t\t\t\tself.bind(\"Embedded\", function() {\n\t\t\t\t\t\t\t\t// position and size properly\n\t\t\t\t\t\t\t\tBasic.extend(runtime.getShimContainer().style, {\n\t\t\t\t\t\t\t\t\t//position: 'relative',\n\t\t\t\t\t\t\t\t\ttop: '0px',\n\t\t\t\t\t\t\t\t\tleft: '0px',\n\t\t\t\t\t\t\t\t\twidth: imgCopy.width + 'px',\n\t\t\t\t\t\t\t\t\theight: imgCopy.height + 'px'\n\t\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\t\t// some shims (Flash/SilverLight) reinitialize, if parent element is hidden, reordered or it's\n\t\t\t\t\t\t\t\t// position type changes (in Gecko), but since we basically need this only in IEs 6/7 and\n\t\t\t\t\t\t\t\t// sometimes 8 and they do not have this problem, we can comment this for now\n\t\t\t\t\t\t\t\t/*tr.bind(\"RuntimeInit\", function(e, runtime) {\n\t\t\t\t\t\t\t\t\ttr.destroy();\n\t\t\t\t\t\t\t\t\truntime.destroy();\n\t\t\t\t\t\t\t\t\tonResize.call(self); // re-feed our image data\n\t\t\t\t\t\t\t\t});*/\n\n\t\t\t\t\t\t\t\truntime = null;\n\t\t\t\t\t\t\t}, 999);\n\n\t\t\t\t\t\t\truntime.exec.call(self, \"ImageView\", \"display\", this.result.uid, width, height);\n\t\t\t\t\t\t\timgCopy.destroy();\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\ttr.transport(Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7)), type, Basic.extend({}, options, {\n\t\t\t\t\t\t\trequired_caps: {\n\t\t\t\t\t\t\t\tdisplay_media: true\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\truntime_order: 'flash,silverlight',\n\t\t\t\t\t\t\tcontainer: el\n\t\t\t\t\t\t}));\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tif (!(el = Dom.get(el))) {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_NODE_TYPE_ERR);\n\t\t\t\t}\n\n\t\t\t\tif (!this.size) { // only preloaded image objects can be used as source\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t}\n\n\n\t\t\t\ttype = options.type || this.type || 'image/jpeg';\n\t\t\t\tquality = options.quality || 90;\n\t\t\t\tcrop = options.crop !== undefined ? options.crop : false;\n\n\t\t\t\t// figure out dimensions for the thumb\n\t\t\t\tif (options.width) {\n\t\t\t\t\twidth = options.width;\n\t\t\t\t\theight = options.height || width;\n\t\t\t\t} else {\n\t\t\t\t\t// if container element has > 0 dimensions, take them\n\t\t\t\t\tvar dimensions = Dom.getSize(el);\n\t\t\t\t\tif (dimensions.w && dimensions.h) { // both should be > 0\n\t\t\t\t\t\twidth = dimensions.w;\n\t\t\t\t\t\theight = dimensions.h;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\timgCopy = new Image();\n\n\t\t\t\timgCopy.bind(\"Resize\", function() {\n\t\t\t\t\tonResize.call(self);\n\t\t\t\t});\n\n\t\t\t\timgCopy.bind(\"Load\", function() {\n\t\t\t\t\timgCopy.resize(width, height, crop, false);\n\t\t\t\t});\n\n\t\t\t\timgCopy.clone(this);\n\n\t\t\t\treturn imgCopy;\n\t\t\t},\n\n\t\t\t/**\n\t\t\tProperly destroys the image and frees resources in use. If any. Recommended way to dispose mOxie.Image object.\n\n\t\t\t@method destroy\n\t\t\t*/\n\t\t\tdestroy: function() {\n\t\t\t\tif (this.ruid) {\n\t\t\t\t\tthis.getRuntime().exec.call(this, 'Image', 'destroy');\n\t\t\t\t\tthis.disconnectRuntime();\n\t\t\t\t}\n\t\t\t\tthis.unbindAll();\n\t\t\t}\n\t\t});\n\n\n\t\tfunction _updateInfo(info) {\n\t\t\tif (!info) {\n\t\t\t\tinfo = this.getRuntime().exec.call(this, 'Image', 'getInfo');\n\t\t\t}\n\n\t\t\tif (info) {\n\t\t\t\tif (Basic.typeOf(info.meta) === 'string') { // might be a JSON string\n\t\t\t\t\ttry {\n\t\t\t\t\t\tthis.meta = parseJSON(info.meta);\n\t\t\t\t\t} catch(ex) {}\n\t\t\t\t} else {\n\t\t\t\t\tthis.meta = info.meta;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tBasic.extend(this, { // info object might be non-enumerable (as returned from SilverLight for example)\n\t\t\t\tsize: parseInt(info.size, 10),\n\t\t\t\twidth: parseInt(info.width, 10),\n\t\t\t\theight: parseInt(info.height, 10),\n\t\t\t\ttype: info.type\n\t\t\t});\n\n\t\t\t// update file name, only if empty\n\t\t\tif (this.name === '') {\n\t\t\t\tthis.name = info.name;\n\t\t\t}\n\t\t}\n\n\t\tfunction _load(src) {\n\t\t\tvar srcType = Basic.typeOf(src);\n\n\t\t\ttry {\n\t\t\t\t// if source is Image\n\t\t\t\tif (src instanceof Image) {\n\t\t\t\t\tif (!src.size) { // only preloaded image objects can be used as source\n\t\t\t\t\t\tthrow new x.DOMException(x.DOMException.INVALID_STATE_ERR);\n\t\t\t\t\t}\n\t\t\t\t\t_loadFromImage.apply(this, arguments);\n\t\t\t\t}\n\t\t\t\t// if source is o.Blob/o.File\n\t\t\t\telse if (src instanceof Blob) {\n\t\t\t\t\tif (!~Basic.inArray(src.type, ['image/jpeg', 'image/png'])) {\n\t\t\t\t\t\tthrow new x.ImageError(x.ImageError.WRONG_FORMAT);\n\t\t\t\t\t}\n\t\t\t\t\t_loadFromBlob.apply(this, arguments);\n\t\t\t\t}\n\t\t\t\t// if native blob/file\n\t\t\t\telse if (Basic.inArray(srcType, ['blob', 'file']) !== -1) {\n\t\t\t\t\t_load.call(this, new o.File(null, src), arguments[1]);\n\t\t\t\t}\n\t\t\t\t// if String\n\t\t\t\telse if (srcType === 'string') {\n\t\t\t\t\t// if dataUrl String\n\t\t\t\t\tif (/^data:[^;]*;base64,/.test(src)) {\n\t\t\t\t\t\t_load.call(this, new o.Blob(null, { data: src }), arguments[1]);\n\t\t\t\t\t}\n\t\t\t\t\t// else assume Url, either relative or absolute\n\t\t\t\t\telse {\n\t\t\t\t\t\t_loadFromUrl.apply(this, arguments);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t// if source seems to be an img node\n\t\t\t\telse if (srcType === 'node' && src.nodeName === 'img') {\n\t\t\t\t\t_load.call(this, src.src, arguments[1]);\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tthrow new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);\n\t\t\t\t}\n\t\t\t} catch(ex) {\n\t\t\t\t// for now simply trigger error event\n\t\t\t\tthis.trigger('error');\n\t\t\t}\n\t\t}\n\n\n\t\tfunction _loadFromImage(img, exact) {\n\t\t\tvar runtime = this.connectRuntime(img.ruid);\n\t\t\tthis.ruid = runtime.uid;\n\t\t\truntime.exec.call(this, 'Image', 'loadFromImage', img, (exact === undefined ? true : exact));\n\t\t}\n\n\n\t\tfunction _loadFromBlob(blob, options) {\n\t\t\tvar self = this;\n\n\t\t\tself.name = blob.name || '';\n\n\t\t\tfunction exec(runtime) {\n\t\t\t\tself.ruid = runtime.uid;\n\t\t\t\truntime.exec.call(self, 'Image', 'loadFromBlob', blob);\n\t\t\t}\n\n\t\t\tif (blob.isDetached()) {\n\t\t\t\tthis.bind('RuntimeInit', function(e, runtime) {\n\t\t\t\t\texec(runtime);\n\t\t\t\t});\n\t\t\t\tthis.connectRuntime(Basic.extend({\n\t\t\t\t\trequired_caps: {\n\t\t\t\t\t\taccess_image_binary: true,\n\t\t\t\t\t\tresize_image: true\n\t\t\t\t\t}\n\t\t\t\t}, options));\n\t\t\t} else {\n\t\t\t\texec(this.connectRuntime(blob.ruid));\n\t\t\t}\n\t\t}\n\n\n\t\tfunction _loadFromUrl(url, options) {\n\t\t\tvar self = this, xhr;\n\n\t\t\txhr = new XMLHttpRequest();\n\n\t\t\txhr.open('get', url);\n\t\t\txhr.responseType = 'blob';\n\n\t\t\txhr.onprogress = function(e) {\n\t\t\t\tself.trigger(e);\n\t\t\t};\n\n\t\t\txhr.onload = function() {\n\t\t\t\t_loadFromBlob.call(self, xhr.response, true);\n\t\t\t};\n\n\t\t\txhr.onerror = function(e) {\n\t\t\t\tself.trigger(e);\n\t\t\t};\n\n\t\t\txhr.onloadend = function() {\n\t\t\t\txhr.destroy();\n\t\t\t};\n\n\t\t\txhr.bind('RuntimeError', function(e, err) {\n\t\t\t\tself.trigger('RuntimeError', err);\n\t\t\t});\n\n\t\t\txhr.send(null, options);\n\t\t}\n\t}\n\t\n\tImage.prototype = EventTarget.instance;\n\n\treturn Image;\n});\n");
__$coverInitRange("src/javascript/image/Image.js", "359:15869");
__$coverInitRange("src/javascript/image/Image.js", "1054:1498");
__$coverInitRange("src/javascript/image/Image.js", "1503:15806");
__$coverInitRange("src/javascript/image/Image.js", "15811:15849");
__$coverInitRange("src/javascript/image/Image.js", "15853:15865");
__$coverInitRange("src/javascript/image/Image.js", "1528:1552");
__$coverInitRange("src/javascript/image/Image.js", "1559:12432");
__$coverInitRange("src/javascript/image/Image.js", "12438:13112");
__$coverInitRange("src/javascript/image/Image.js", "13117:14501");
__$coverInitRange("src/javascript/image/Image.js", "14507:14720");
__$coverInitRange("src/javascript/image/Image.js", "14726:15256");
__$coverInitRange("src/javascript/image/Image.js", "15262:15803");
__$coverInitRange("src/javascript/image/Image.js", "3128:3160");
__$coverInitRange("src/javascript/image/Image.js", "4187:4266");
__$coverInitRange("src/javascript/image/Image.js", "4273:4317");
__$coverInitRange("src/javascript/image/Image.js", "4324:4352");
__$coverInitRange("src/javascript/image/Image.js", "4231:4253");
__$coverInitRange("src/javascript/image/Image.js", "4898:4909");
__$coverInitRange("src/javascript/image/Image.js", "4916:5057");
__$coverInitRange("src/javascript/image/Image.js", "5064:5140");
__$coverInitRange("src/javascript/image/Image.js", "5147:5187");
__$coverInitRange("src/javascript/image/Image.js", "5194:5238");
__$coverInitRange("src/javascript/image/Image.js", "5244:5336");
__$coverInitRange("src/javascript/image/Image.js", "5343:5370");
__$coverInitRange("src/javascript/image/Image.js", "5376:5456");
__$coverInitRange("src/javascript/image/Image.js", "4993:5051");
__$coverInitRange("src/javascript/image/Image.js", "5083:5134");
__$coverInitRange("src/javascript/image/Image.js", "5167:5181");
__$coverInitRange("src/javascript/image/Image.js", "5851:5900");
__$coverInitRange("src/javascript/image/Image.js", "5942:6044");
__$coverInitRange("src/javascript/image/Image.js", "6051:6095");
__$coverInitRange("src/javascript/image/Image.js", "6101:6155");
__$coverInitRange("src/javascript/image/Image.js", "5980:6038");
__$coverInitRange("src/javascript/image/Image.js", "6615:6623");
__$coverInitRange("src/javascript/image/Image.js", "6630:6717");
__$coverInitRange("src/javascript/image/Image.js", "6724:6767");
__$coverInitRange("src/javascript/image/Image.js", "6774:6838");
__$coverInitRange("src/javascript/image/Image.js", "6845:6922");
__$coverInitRange("src/javascript/image/Image.js", "6653:6711");
__$coverInitRange("src/javascript/image/Image.js", "6742:6761");
__$coverInitRange("src/javascript/image/Image.js", "6820:6832");
__$coverInitRange("src/javascript/image/Image.js", "7397:7408");
__$coverInitRange("src/javascript/image/Image.js", "7415:7502");
__$coverInitRange("src/javascript/image/Image.js", "7508:7588");
__$coverInitRange("src/javascript/image/Image.js", "7438:7496");
__$coverInitRange("src/javascript/image/Image.js", "8071:8117");
__$coverInitRange("src/javascript/image/Image.js", "8123:8192");
__$coverInitRange("src/javascript/image/Image.js", "8773:9005");
__$coverInitRange("src/javascript/image/Image.js", "9006:9006");
__$coverInitRange("src/javascript/image/Image.js", "9013:11062");
__$coverInitRange("src/javascript/image/Image.js", "11069:11169");
__$coverInitRange("src/javascript/image/Image.js", "11176:11317");
__$coverInitRange("src/javascript/image/Image.js", "11325:11373");
__$coverInitRange("src/javascript/image/Image.js", "11379:11410");
__$coverInitRange("src/javascript/image/Image.js", "11416:11472");
__$coverInitRange("src/javascript/image/Image.js", "11522:11852");
__$coverInitRange("src/javascript/image/Image.js", "11863:11884");
__$coverInitRange("src/javascript/image/Image.js", "11891:11959");
__$coverInitRange("src/javascript/image/Image.js", "11966:12055");
__$coverInitRange("src/javascript/image/Image.js", "12062:12081");
__$coverInitRange("src/javascript/image/Image.js", "12088:12102");
__$coverInitRange("src/javascript/image/Image.js", "9093:9327");
__$coverInitRange("src/javascript/image/Image.js", "9335:9384");
__$coverInitRange("src/javascript/image/Image.js", "9391:9469");
__$coverInitRange("src/javascript/image/Image.js", "9477:11056");
__$coverInitRange("src/javascript/image/Image.js", "9131:9165");
__$coverInitRange("src/javascript/image/Image.js", "9173:9320");
__$coverInitRange("src/javascript/image/Image.js", "9194:9216");
__$coverInitRange("src/javascript/image/Image.js", "9225:9238");
__$coverInitRange("src/javascript/image/Image.js", "9247:9264");
__$coverInitRange("src/javascript/image/Image.js", "9273:9297");
__$coverInitRange("src/javascript/image/Image.js", "9306:9312");
__$coverInitRange("src/javascript/image/Image.js", "9413:9462");
__$coverInitRange("src/javascript/image/Image.js", "9533:9641");
__$coverInitRange("src/javascript/image/Image.js", "9649:9666");
__$coverInitRange("src/javascript/image/Image.js", "9674:9698");
__$coverInitRange("src/javascript/image/Image.js", "9720:9746");
__$coverInitRange("src/javascript/image/Image.js", "9755:10794");
__$coverInitRange("src/javascript/image/Image.js", "10803:11049");
__$coverInitRange("src/javascript/image/Image.js", "9807:9854");
__$coverInitRange("src/javascript/image/Image.js", "9870:10669");
__$coverInitRange("src/javascript/image/Image.js", "10679:10758");
__$coverInitRange("src/javascript/image/Image.js", "10767:10784");
__$coverInitRange("src/javascript/image/Image.js", "9951:10163");
__$coverInitRange("src/javascript/image/Image.js", "10639:10653");
__$coverInitRange("src/javascript/image/Image.js", "11101:11163");
__$coverInitRange("src/javascript/image/Image.js", "11253:11311");
__$coverInitRange("src/javascript/image/Image.js", "11548:11569");
__$coverInitRange("src/javascript/image/Image.js", "11576:11608");
__$coverInitRange("src/javascript/image/Image.js", "11687:11719");
__$coverInitRange("src/javascript/image/Image.js", "11726:11846");
__$coverInitRange("src/javascript/image/Image.js", "11790:11810");
__$coverInitRange("src/javascript/image/Image.js", "11818:11839");
__$coverInitRange("src/javascript/image/Image.js", "11932:11951");
__$coverInitRange("src/javascript/image/Image.js", "12005:12047");
__$coverInitRange("src/javascript/image/Image.js", "12287:12399");
__$coverInitRange("src/javascript/image/Image.js", "12405:12421");
__$coverInitRange("src/javascript/image/Image.js", "12309:12362");
__$coverInitRange("src/javascript/image/Image.js", "12369:12393");
__$coverInitRange("src/javascript/image/Image.js", "12470:12552");
__$coverInitRange("src/javascript/image/Image.js", "12558:12765");
__$coverInitRange("src/javascript/image/Image.js", "12771:13010");
__$coverInitRange("src/javascript/image/Image.js", "13054:13108");
__$coverInitRange("src/javascript/image/Image.js", "12487:12547");
__$coverInitRange("src/javascript/image/Image.js", "12574:12760");
__$coverInitRange("src/javascript/image/Image.js", "12649:12713");
__$coverInitRange("src/javascript/image/Image.js", "12661:12693");
__$coverInitRange("src/javascript/image/Image.js", "12733:12754");
__$coverInitRange("src/javascript/image/Image.js", "13082:13103");
__$coverInitRange("src/javascript/image/Image.js", "13142:13173");
__$coverInitRange("src/javascript/image/Image.js", "13179:14497");
__$coverInitRange("src/javascript/image/Image.js", "13215:14406");
__$coverInitRange("src/javascript/image/Image.js", "13248:13390");
__$coverInitRange("src/javascript/image/Image.js", "13397:13434");
__$coverInitRange("src/javascript/image/Image.js", "13325:13383");
__$coverInitRange("src/javascript/image/Image.js", "13517:13641");
__$coverInitRange("src/javascript/image/Image.js", "13648:13684");
__$coverInitRange("src/javascript/image/Image.js", "13585:13634");
__$coverInitRange("src/javascript/image/Image.js", "13788:13841");
__$coverInitRange("src/javascript/image/Image.js", "13934:14164");
__$coverInitRange("src/javascript/image/Image.js", "13979:14042");
__$coverInitRange("src/javascript/image/Image.js", "14122:14157");
__$coverInitRange("src/javascript/image/Image.js", "14279:14318");
__$coverInitRange("src/javascript/image/Image.js", "14342:14400");
__$coverInitRange("src/javascript/image/Image.js", "14471:14492");
__$coverInitRange("src/javascript/image/Image.js", "14548:14591");
__$coverInitRange("src/javascript/image/Image.js", "14596:14619");
__$coverInitRange("src/javascript/image/Image.js", "14624:14716");
__$coverInitRange("src/javascript/image/Image.js", "14769:14784");
__$coverInitRange("src/javascript/image/Image.js", "14790:14817");
__$coverInitRange("src/javascript/image/Image.js", "14823:14940");
__$coverInitRange("src/javascript/image/Image.js", "14946:15252");
__$coverInitRange("src/javascript/image/Image.js", "14852:14875");
__$coverInitRange("src/javascript/image/Image.js", "14881:14935");
__$coverInitRange("src/javascript/image/Image.js", "14975:15049");
__$coverInitRange("src/javascript/image/Image.js", "15055:15193");
__$coverInitRange("src/javascript/image/Image.js", "15028:15041");
__$coverInitRange("src/javascript/image/Image.js", "15211:15247");
__$coverInitRange("src/javascript/image/Image.js", "15303:15323");
__$coverInitRange("src/javascript/image/Image.js", "15329:15355");
__$coverInitRange("src/javascript/image/Image.js", "15361:15381");
__$coverInitRange("src/javascript/image/Image.js", "15386:15411");
__$coverInitRange("src/javascript/image/Image.js", "15417:15473");
__$coverInitRange("src/javascript/image/Image.js", "15479:15559");
__$coverInitRange("src/javascript/image/Image.js", "15565:15618");
__$coverInitRange("src/javascript/image/Image.js", "15624:15676");
__$coverInitRange("src/javascript/image/Image.js", "15682:15770");
__$coverInitRange("src/javascript/image/Image.js", "15776:15799");
__$coverInitRange("src/javascript/image/Image.js", "15452:15467");
__$coverInitRange("src/javascript/image/Image.js", "15509:15553");
__$coverInitRange("src/javascript/image/Image.js", "15597:15612");
__$coverInitRange("src/javascript/image/Image.js", "15657:15670");
__$coverInitRange("src/javascript/image/Image.js", "15730:15763");
__$coverCall('src/javascript/image/Image.js', '359:15869');
define('moxie/image/Image', [
    'moxie/core/utils/Basic',
    'moxie/core/utils/Dom',
    'moxie/core/Exceptions',
    'moxie/file/FileReaderSync',
    'moxie/xhr/XMLHttpRequest',
    'moxie/runtime/RuntimeClient',
    'moxie/runtime/Transporter',
    'moxie/core/utils/Env',
    'moxie/core/EventTarget',
    'moxie/file/Blob',
    'moxie/file/File',
    'moxie/core/utils/Encode',
    'moxie/core/JSON'
], function (Basic, Dom, x, FileReaderSync, XMLHttpRequest, RuntimeClient, Transporter, Env, EventTarget, Blob, File, Encode, parseJSON) {
    __$coverCall('src/javascript/image/Image.js', '1054:1498');
    var dispatches = [
            'progress',
            'load',
            'error',
            'resize',
            'embedded'
        ];
    __$coverCall('src/javascript/image/Image.js', '1503:15806');
    function Image() {
        __$coverCall('src/javascript/image/Image.js', '1528:1552');
        RuntimeClient.call(this);
        __$coverCall('src/javascript/image/Image.js', '1559:12432');
        Basic.extend(this, {
            uid: Basic.guid('uid_'),
            ruid: null,
            name: '',
            size: 0,
            width: 0,
            height: 0,
            type: '',
            meta: {},
            clone: function () {
                __$coverCall('src/javascript/image/Image.js', '3128:3160');
                this.load.apply(this, arguments);
            },
            load: function (src) {
                __$coverCall('src/javascript/image/Image.js', '4187:4266');
                this.bind('Load Resize', function (e) {
                    __$coverCall('src/javascript/image/Image.js', '4231:4253');
                    _updateInfo.call(this);
                }, 999);
                __$coverCall('src/javascript/image/Image.js', '4273:4317');
                this.convertEventPropsToHandlers(dispatches);
                __$coverCall('src/javascript/image/Image.js', '4324:4352');
                _load.apply(this, arguments);
            },
            resize: function (width, height, crop, preserveHeaders) {
                __$coverCall('src/javascript/image/Image.js', '4898:4909');
                var runtime;
                __$coverCall('src/javascript/image/Image.js', '4916:5057');
                if (!this.size) {
                    __$coverCall('src/javascript/image/Image.js', '4993:5051');
                    throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
                }
                __$coverCall('src/javascript/image/Image.js', '5064:5140');
                if (!width) {
                    __$coverCall('src/javascript/image/Image.js', '5083:5134');
                    throw new x.DOMException(x.DOMException.SYNTAX_ERR);
                }
                __$coverCall('src/javascript/image/Image.js', '5147:5187');
                if (!height) {
                    __$coverCall('src/javascript/image/Image.js', '5167:5181');
                    height = width;
                }
                __$coverCall('src/javascript/image/Image.js', '5194:5238');
                crop = crop === undefined ? false : !!crop;
                __$coverCall('src/javascript/image/Image.js', '5244:5336');
                preserveHeaders = Basic.typeOf(preserveHeaders) === 'undefined' ? true : !!preserveHeaders;
                __$coverCall('src/javascript/image/Image.js', '5343:5370');
                runtime = this.getRuntime();
                __$coverCall('src/javascript/image/Image.js', '5376:5456');
                runtime.exec.call(this, 'Image', 'resize', width, height, crop, preserveHeaders);
            },
            crop: function (width, height, preserveHeaders) {
                __$coverCall('src/javascript/image/Image.js', '5851:5900');
                this.resize(width, height, true, preserveHeaders);
            },
            getAsCanvas: function () {
                __$coverCall('src/javascript/image/Image.js', '5942:6044');
                if (!Env.can('create_canvas')) {
                    __$coverCall('src/javascript/image/Image.js', '5980:6038');
                    throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
                }
                __$coverCall('src/javascript/image/Image.js', '6051:6095');
                var runtime = this.connectRuntime(this.ruid);
                __$coverCall('src/javascript/image/Image.js', '6101:6155');
                return runtime.exec.call(this, 'Image', 'getAsCanvas');
            },
            getAsBlob: function (type, quality) {
                __$coverCall('src/javascript/image/Image.js', '6615:6623');
                var blob;
                __$coverCall('src/javascript/image/Image.js', '6630:6717');
                if (!this.size) {
                    __$coverCall('src/javascript/image/Image.js', '6653:6711');
                    throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
                }
                __$coverCall('src/javascript/image/Image.js', '6724:6767');
                if (!type) {
                    __$coverCall('src/javascript/image/Image.js', '6742:6761');
                    type = 'image/jpeg';
                }
                __$coverCall('src/javascript/image/Image.js', '6774:6838');
                if (type === 'image/jpeg' && !quality) {
                    __$coverCall('src/javascript/image/Image.js', '6820:6832');
                    quality = 90;
                }
                __$coverCall('src/javascript/image/Image.js', '6845:6922');
                return this.getRuntime().exec.call(this, 'Image', 'getAsBlob', type, quality);
            },
            getAsDataURL: function (type, quality) {
                __$coverCall('src/javascript/image/Image.js', '7397:7408');
                var dataUrl;
                __$coverCall('src/javascript/image/Image.js', '7415:7502');
                if (!this.size) {
                    __$coverCall('src/javascript/image/Image.js', '7438:7496');
                    throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
                }
                __$coverCall('src/javascript/image/Image.js', '7508:7588');
                return this.getRuntime().exec.call(this, 'Image', 'getAsDataURL', type, quality);
            },
            getAsBinaryString: function (type, quality) {
                __$coverCall('src/javascript/image/Image.js', '8071:8117');
                var dataUrl = this.getAsDataURL(type, quality);
                __$coverCall('src/javascript/image/Image.js', '8123:8192');
                return Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7));
            },
            embed: function (el) {
                __$coverCall('src/javascript/image/Image.js', '8773:9005');
                var self = this, imgCopy, type, quality, crop, options = arguments[1] || {}, width = this.width, height = this.height, runtime;
                __$coverCall('src/javascript/image/Image.js', '9006:9006');
                ;
                __$coverCall('src/javascript/image/Image.js', '9013:11062');
                function onResize() {
                    __$coverCall('src/javascript/image/Image.js', '9093:9327');
                    if (Env.can('create_canvas')) {
                        __$coverCall('src/javascript/image/Image.js', '9131:9165');
                        var canvas = imgCopy.getAsCanvas();
                        __$coverCall('src/javascript/image/Image.js', '9173:9320');
                        if (canvas) {
                            __$coverCall('src/javascript/image/Image.js', '9194:9216');
                            el.appendChild(canvas);
                            __$coverCall('src/javascript/image/Image.js', '9225:9238');
                            canvas = null;
                            __$coverCall('src/javascript/image/Image.js', '9247:9264');
                            imgCopy.destroy();
                            __$coverCall('src/javascript/image/Image.js', '9273:9297');
                            self.trigger('embedded');
                            __$coverCall('src/javascript/image/Image.js', '9306:9312');
                            return;
                        }
                    }
                    __$coverCall('src/javascript/image/Image.js', '9335:9384');
                    var dataUrl = imgCopy.getAsDataURL(type, quality);
                    __$coverCall('src/javascript/image/Image.js', '9391:9469');
                    if (!dataUrl) {
                        __$coverCall('src/javascript/image/Image.js', '9413:9462');
                        throw new x.ImageError(x.ImageError.WRONG_FORMAT);
                    }
                    __$coverCall('src/javascript/image/Image.js', '9477:11056');
                    if (Env.can('use_data_uri_of', dataUrl.length)) {
                        __$coverCall('src/javascript/image/Image.js', '9533:9641');
                        el.innerHTML = '<img src="' + dataUrl + '" width="' + imgCopy.width + '" height="' + imgCopy.height + '" />';
                        __$coverCall('src/javascript/image/Image.js', '9649:9666');
                        imgCopy.destroy();
                        __$coverCall('src/javascript/image/Image.js', '9674:9698');
                        self.trigger('embedded');
                    } else {
                        __$coverCall('src/javascript/image/Image.js', '9720:9746');
                        var tr = new Transporter();
                        __$coverCall('src/javascript/image/Image.js', '9755:10794');
                        tr.bind('TransportingComplete', function () {
                            __$coverCall('src/javascript/image/Image.js', '9807:9854');
                            runtime = self.connectRuntime(this.result.ruid);
                            __$coverCall('src/javascript/image/Image.js', '9870:10669');
                            self.bind('Embedded', function () {
                                __$coverCall('src/javascript/image/Image.js', '9951:10163');
                                Basic.extend(runtime.getShimContainer().style, {
                                    top: '0px',
                                    left: '0px',
                                    width: imgCopy.width + 'px',
                                    height: imgCopy.height + 'px'
                                });
                                __$coverCall('src/javascript/image/Image.js', '10639:10653');
                                runtime = null;
                            }, 999);
                            __$coverCall('src/javascript/image/Image.js', '10679:10758');
                            runtime.exec.call(self, 'ImageView', 'display', this.result.uid, width, height);
                            __$coverCall('src/javascript/image/Image.js', '10767:10784');
                            imgCopy.destroy();
                        });
                        __$coverCall('src/javascript/image/Image.js', '10803:11049');
                        tr.transport(Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7)), type, Basic.extend({}, options, {
                            required_caps: { display_media: true },
                            runtime_order: 'flash,silverlight',
                            container: el
                        }));
                    }
                }
                __$coverCall('src/javascript/image/Image.js', '11069:11169');
                if (!(el = Dom.get(el))) {
                    __$coverCall('src/javascript/image/Image.js', '11101:11163');
                    throw new x.DOMException(x.DOMException.INVALID_NODE_TYPE_ERR);
                }
                __$coverCall('src/javascript/image/Image.js', '11176:11317');
                if (!this.size) {
                    __$coverCall('src/javascript/image/Image.js', '11253:11311');
                    throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
                }
                __$coverCall('src/javascript/image/Image.js', '11325:11373');
                type = options.type || this.type || 'image/jpeg';
                __$coverCall('src/javascript/image/Image.js', '11379:11410');
                quality = options.quality || 90;
                __$coverCall('src/javascript/image/Image.js', '11416:11472');
                crop = options.crop !== undefined ? options.crop : false;
                __$coverCall('src/javascript/image/Image.js', '11522:11852');
                if (options.width) {
                    __$coverCall('src/javascript/image/Image.js', '11548:11569');
                    width = options.width;
                    __$coverCall('src/javascript/image/Image.js', '11576:11608');
                    height = options.height || width;
                } else {
                    __$coverCall('src/javascript/image/Image.js', '11687:11719');
                    var dimensions = Dom.getSize(el);
                    __$coverCall('src/javascript/image/Image.js', '11726:11846');
                    if (dimensions.w && dimensions.h) {
                        __$coverCall('src/javascript/image/Image.js', '11790:11810');
                        width = dimensions.w;
                        __$coverCall('src/javascript/image/Image.js', '11818:11839');
                        height = dimensions.h;
                    }
                }
                __$coverCall('src/javascript/image/Image.js', '11863:11884');
                imgCopy = new Image();
                __$coverCall('src/javascript/image/Image.js', '11891:11959');
                imgCopy.bind('Resize', function () {
                    __$coverCall('src/javascript/image/Image.js', '11932:11951');
                    onResize.call(self);
                });
                __$coverCall('src/javascript/image/Image.js', '11966:12055');
                imgCopy.bind('Load', function () {
                    __$coverCall('src/javascript/image/Image.js', '12005:12047');
                    imgCopy.resize(width, height, crop, false);
                });
                __$coverCall('src/javascript/image/Image.js', '12062:12081');
                imgCopy.clone(this);
                __$coverCall('src/javascript/image/Image.js', '12088:12102');
                return imgCopy;
            },
            destroy: function () {
                __$coverCall('src/javascript/image/Image.js', '12287:12399');
                if (this.ruid) {
                    __$coverCall('src/javascript/image/Image.js', '12309:12362');
                    this.getRuntime().exec.call(this, 'Image', 'destroy');
                    __$coverCall('src/javascript/image/Image.js', '12369:12393');
                    this.disconnectRuntime();
                }
                __$coverCall('src/javascript/image/Image.js', '12405:12421');
                this.unbindAll();
            }
        });
        __$coverCall('src/javascript/image/Image.js', '12438:13112');
        function _updateInfo(info) {
            __$coverCall('src/javascript/image/Image.js', '12470:12552');
            if (!info) {
                __$coverCall('src/javascript/image/Image.js', '12487:12547');
                info = this.getRuntime().exec.call(this, 'Image', 'getInfo');
            }
            __$coverCall('src/javascript/image/Image.js', '12558:12765');
            if (info) {
                __$coverCall('src/javascript/image/Image.js', '12574:12760');
                if (Basic.typeOf(info.meta) === 'string') {
                    __$coverCall('src/javascript/image/Image.js', '12649:12713');
                    try {
                        __$coverCall('src/javascript/image/Image.js', '12661:12693');
                        this.meta = parseJSON(info.meta);
                    } catch (ex) {
                    }
                } else {
                    __$coverCall('src/javascript/image/Image.js', '12733:12754');
                    this.meta = info.meta;
                }
            }
            __$coverCall('src/javascript/image/Image.js', '12771:13010');
            Basic.extend(this, {
                size: parseInt(info.size, 10),
                width: parseInt(info.width, 10),
                height: parseInt(info.height, 10),
                type: info.type
            });
            __$coverCall('src/javascript/image/Image.js', '13054:13108');
            if (this.name === '') {
                __$coverCall('src/javascript/image/Image.js', '13082:13103');
                this.name = info.name;
            }
        }
        __$coverCall('src/javascript/image/Image.js', '13117:14501');
        function _load(src) {
            __$coverCall('src/javascript/image/Image.js', '13142:13173');
            var srcType = Basic.typeOf(src);
            __$coverCall('src/javascript/image/Image.js', '13179:14497');
            try {
                __$coverCall('src/javascript/image/Image.js', '13215:14406');
                if (src instanceof Image) {
                    __$coverCall('src/javascript/image/Image.js', '13248:13390');
                    if (!src.size) {
                        __$coverCall('src/javascript/image/Image.js', '13325:13383');
                        throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
                    }
                    __$coverCall('src/javascript/image/Image.js', '13397:13434');
                    _loadFromImage.apply(this, arguments);
                } else if (src instanceof Blob) {
                    __$coverCall('src/javascript/image/Image.js', '13517:13641');
                    if (!~Basic.inArray(src.type, [
                            'image/jpeg',
                            'image/png'
                        ])) {
                        __$coverCall('src/javascript/image/Image.js', '13585:13634');
                        throw new x.ImageError(x.ImageError.WRONG_FORMAT);
                    }
                    __$coverCall('src/javascript/image/Image.js', '13648:13684');
                    _loadFromBlob.apply(this, arguments);
                } else if (Basic.inArray(srcType, [
                        'blob',
                        'file'
                    ]) !== -1) {
                    __$coverCall('src/javascript/image/Image.js', '13788:13841');
                    _load.call(this, new o.File(null, src), arguments[1]);
                } else if (srcType === 'string') {
                    __$coverCall('src/javascript/image/Image.js', '13934:14164');
                    if (/^data:[^;]*;base64,/.test(src)) {
                        __$coverCall('src/javascript/image/Image.js', '13979:14042');
                        _load.call(this, new o.Blob(null, { data: src }), arguments[1]);
                    } else {
                        __$coverCall('src/javascript/image/Image.js', '14122:14157');
                        _loadFromUrl.apply(this, arguments);
                    }
                } else if (srcType === 'node' && src.nodeName === 'img') {
                    __$coverCall('src/javascript/image/Image.js', '14279:14318');
                    _load.call(this, src.src, arguments[1]);
                } else {
                    __$coverCall('src/javascript/image/Image.js', '14342:14400');
                    throw new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);
                }
            } catch (ex) {
                __$coverCall('src/javascript/image/Image.js', '14471:14492');
                this.trigger('error');
            }
        }
        __$coverCall('src/javascript/image/Image.js', '14507:14720');
        function _loadFromImage(img, exact) {
            __$coverCall('src/javascript/image/Image.js', '14548:14591');
            var runtime = this.connectRuntime(img.ruid);
            __$coverCall('src/javascript/image/Image.js', '14596:14619');
            this.ruid = runtime.uid;
            __$coverCall('src/javascript/image/Image.js', '14624:14716');
            runtime.exec.call(this, 'Image', 'loadFromImage', img, exact === undefined ? true : exact);
        }
        __$coverCall('src/javascript/image/Image.js', '14726:15256');
        function _loadFromBlob(blob, options) {
            __$coverCall('src/javascript/image/Image.js', '14769:14784');
            var self = this;
            __$coverCall('src/javascript/image/Image.js', '14790:14817');
            self.name = blob.name || '';
            __$coverCall('src/javascript/image/Image.js', '14823:14940');
            function exec(runtime) {
                __$coverCall('src/javascript/image/Image.js', '14852:14875');
                self.ruid = runtime.uid;
                __$coverCall('src/javascript/image/Image.js', '14881:14935');
                runtime.exec.call(self, 'Image', 'loadFromBlob', blob);
            }
            __$coverCall('src/javascript/image/Image.js', '14946:15252');
            if (blob.isDetached()) {
                __$coverCall('src/javascript/image/Image.js', '14975:15049');
                this.bind('RuntimeInit', function (e, runtime) {
                    __$coverCall('src/javascript/image/Image.js', '15028:15041');
                    exec(runtime);
                });
                __$coverCall('src/javascript/image/Image.js', '15055:15193');
                this.connectRuntime(Basic.extend({
                    required_caps: {
                        access_image_binary: true,
                        resize_image: true
                    }
                }, options));
            } else {
                __$coverCall('src/javascript/image/Image.js', '15211:15247');
                exec(this.connectRuntime(blob.ruid));
            }
        }
        __$coverCall('src/javascript/image/Image.js', '15262:15803');
        function _loadFromUrl(url, options) {
            __$coverCall('src/javascript/image/Image.js', '15303:15323');
            var self = this, xhr;
            __$coverCall('src/javascript/image/Image.js', '15329:15355');
            xhr = new XMLHttpRequest();
            __$coverCall('src/javascript/image/Image.js', '15361:15381');
            xhr.open('get', url);
            __$coverCall('src/javascript/image/Image.js', '15386:15411');
            xhr.responseType = 'blob';
            __$coverCall('src/javascript/image/Image.js', '15417:15473');
            xhr.onprogress = function (e) {
                __$coverCall('src/javascript/image/Image.js', '15452:15467');
                self.trigger(e);
            };
            __$coverCall('src/javascript/image/Image.js', '15479:15559');
            xhr.onload = function () {
                __$coverCall('src/javascript/image/Image.js', '15509:15553');
                _loadFromBlob.call(self, xhr.response, true);
            };
            __$coverCall('src/javascript/image/Image.js', '15565:15618');
            xhr.onerror = function (e) {
                __$coverCall('src/javascript/image/Image.js', '15597:15612');
                self.trigger(e);
            };
            __$coverCall('src/javascript/image/Image.js', '15624:15676');
            xhr.onloadend = function () {
                __$coverCall('src/javascript/image/Image.js', '15657:15670');
                xhr.destroy();
            };
            __$coverCall('src/javascript/image/Image.js', '15682:15770');
            xhr.bind('RuntimeError', function (e, err) {
                __$coverCall('src/javascript/image/Image.js', '15730:15763');
                self.trigger('RuntimeError', err);
            });
            __$coverCall('src/javascript/image/Image.js', '15776:15799');
            xhr.send(null, options);
        }
    }
    __$coverCall('src/javascript/image/Image.js', '15811:15849');
    Image.prototype = EventTarget.instance;
    __$coverCall('src/javascript/image/Image.js', '15853:15865');
    return Image;
});

// Included from: src/javascript/runtime/html5/Runtime.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/Runtime.js", "/**\n * Runtime.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true, File:true */\n\n/**\nDefines constructor for HTML5 runtime.\n\n@class moxie/runtime/html5/Runtime\n@private\n*/\ndefine(\"moxie/runtime/html5/Runtime\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/runtime/Runtime\",\n\t\"moxie/core/utils/Env\"\n], function(Basic, x, Runtime, Env) {\n\t\n\tvar type = \"html5\", extensions = {};\n\t\n\tfunction Html5Runtime(options) {\n\t\tvar I = this, shim;\n\n\t\tRuntime.call(this, type, options, {\n\t\t\taccess_binary: !!(window.FileReader || window.File && window.File.getAsDataURL),\n\t\t\taccess_image_binary: function() {\n\t\t\t\treturn I.can('access_binary') && !!extensions.Image;\n\t\t\t},\n\t\t\tdisplay_media: Env.can('create_canvas') || Env.can('use_data_uri_over32kb'),\n\t\t\tdrag_and_drop: (function() {\n\t\t\t\t// this comes directly from Modernizr: http://www.modernizr.com/\n\t\t\t\tvar div = document.createElement('div');\n\t\t\t\t// IE has support for drag and drop since version 5, but doesn't support dropping files from desktop\n\t\t\t\treturn (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && (Env.browser !== 'IE' || Env.version > 9);\n\t\t\t}()),\n\t\t\treturn_response_type: function(responseType) {\n\t\t\t\tif (responseType === 'json') {\n\t\t\t\t\treturn true; // we can fake this one even if it's not supported\n\t\t\t\t} else {\n\t\t\t\t\treturn Env.can('return_response_type', responseType);\n\t\t\t\t}\n\t\t\t},\n\t\t\treport_upload_progress: function() {\n\t\t\t\treturn !!(window.XMLHttpRequest && new XMLHttpRequest().upload);\n\t\t\t},\n\t\t\tresize_image: function() {\n\t\t\t\treturn I.can('access_binary') && Env.can('create_canvas');\n\t\t\t},\n\t\t\tselect_folder: Env.browser === 'Chrome' && Env.version >= 21,\n\t\t\tselect_multiple: !(Env.browser === 'Safari' && Env.OS === 'Windows'),\n\t\t\tsend_binary_string:\n\t\t\t\t!!(window.XMLHttpRequest && (new XMLHttpRequest().sendAsBinary || (window.Uint8Array && window.ArrayBuffer))),\n\t\t\tsend_custom_headers: !!window.XMLHttpRequest,\n\t\t\tsend_multipart: function() {\n\t\t\t\treturn !!(window.XMLHttpRequest && new XMLHttpRequest().upload && window.FormData) || can('send_binary_string');\n\t\t\t},\n\t\t\tslice_blob: !!(window.File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)),\n\t\t\tstream_upload: function() {\n\t\t\t\treturn I.can('slice_blob') && I.can('send_multipart');\n\t\t\t},\n\t\t\tsummon_file_dialog: (function() { // yeah... some dirty sniffing here...\n\t\t\t\treturn  (Env.browser === 'Firefox' && Env.version >= 4)\t||\n\t\t\t\t\t\t(Env.browser === 'Opera' && Env.version >= 12)\t||\n\t\t\t\t\t\t!!~Basic.inArray(Env.browser, ['Chrome', 'Safari']);\n\t\t\t}()),\n\t\t\tupload_filesize: true\n\t\t});\n\n\n\t\tBasic.extend(this, {\n\n\t\t\tinit : function() {\n\t\t\t\tif (!window.File || !Env.can('use_fileinput')) { // minimal requirement\n\t\t\t\t\tthis.trigger(\"Error\", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\tthis.trigger(\"Init\");\n\t\t\t},\n\n\t\t\tgetShim: function() {\n\t\t\t\treturn shim;\n\t\t\t},\n\n\t\t\tshimExec: function(component, action) {\n\t\t\t\tvar args = [].slice.call(arguments, 2);\n\t\t\t\treturn I.getShim().exec.call(this, this.uid, component, action, args);\n\t\t\t},\n\n\t\t\tdestroy: (function(destroy) { // extend default destroy method\n\t\t\t\treturn function() {\n\t\t\t\t\tif (shim) {\n\t\t\t\t\t\tshim.removeAllInstances(I);\n\t\t\t\t\t}\n\t\t\t\t\tdestroy.call(I);\n\t\t\t\t\tdestroy = shim = I = null;\n\t\t\t\t};\n\t\t\t}(this.destroy))\n\n\t\t});\n\n\t\tshim = Basic.extend((function() {\n\t\t\tvar objpool = {};\n\n\t\t\treturn {\n\t\t\t\texec: function(uid, comp, fn, args) {\n\t\t\t\t\tif (shim[comp]) {\n\t\t\t\t\t\tif (!objpool[uid]) {\n\t\t\t\t\t\t\tobjpool[uid] = {\n\t\t\t\t\t\t\t\tcontext: this,\n\t\t\t\t\t\t\t\tinstance: new shim[comp]()\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (objpool[uid].instance[fn]) {\n\t\t\t\t\t\t\treturn objpool[uid].instance[fn].apply(this, args);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t},\n\n\t\t\t\tremoveInstance: function(uid) {\n\t\t\t\t\tdelete objpool[uid];\n\t\t\t\t},\n\n\t\t\t\tremoveAllInstances: function() {\n\t\t\t\t\tvar self = this;\n\t\t\t\t\t\n\t\t\t\t\tBasic.each(objpool, function(obj, uid) {\n\t\t\t\t\t\tif (Basic.typeOf(obj.instance.destroy) === 'function') {\n\t\t\t\t\t\t\tobj.instance.destroy.call(obj.context);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tself.removeInstance(uid);\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t};\n\t\t}()), extensions);\n\t}\n\n\tRuntime.addConstructor(type, Html5Runtime);\n\n\treturn extensions;\n});\n");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "448:4389");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "632:667");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "672:4318");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "4322:4364");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "4368:4385");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "707:725");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "730:2850");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "2856:3558");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3563:4315");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "891:942");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "1135:1174");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "1285:1404");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "1469:1645");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "1505:1516");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "1587:1639");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "1697:1760");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "1802:1859");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "2228:2339");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "2497:2550");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "2638:2810");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "2905:3071");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3077:3097");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "2982:3052");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3059:3065");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3135:3146");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3202:3240");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3246:3315");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3394:3531");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3419:3470");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3477:3492");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3499:3524");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3437:3463");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3600:3616");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3622:4294");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3678:3934");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3702:3820");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3829:3927");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3730:3819");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3869:3919");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "3985:4004");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "4056:4071");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "4084:4282");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "4131:4241");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "4249:4273");
__$coverInitRange("src/javascript/runtime/html5/Runtime.js", "4195:4233");
__$coverCall('src/javascript/runtime/html5/Runtime.js', '448:4389');
define('moxie/runtime/html5/Runtime', [
    'moxie/core/utils/Basic',
    'moxie/core/Exceptions',
    'moxie/runtime/Runtime',
    'moxie/core/utils/Env'
], function (Basic, x, Runtime, Env) {
    __$coverCall('src/javascript/runtime/html5/Runtime.js', '632:667');
    var type = 'html5', extensions = {};
    __$coverCall('src/javascript/runtime/html5/Runtime.js', '672:4318');
    function Html5Runtime(options) {
        __$coverCall('src/javascript/runtime/html5/Runtime.js', '707:725');
        var I = this, shim;
        __$coverCall('src/javascript/runtime/html5/Runtime.js', '730:2850');
        Runtime.call(this, type, options, {
            access_binary: !!(window.FileReader || window.File && window.File.getAsDataURL),
            access_image_binary: function () {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '891:942');
                return I.can('access_binary') && !!extensions.Image;
            },
            display_media: Env.can('create_canvas') || Env.can('use_data_uri_over32kb'),
            drag_and_drop: function () {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '1135:1174');
                var div = document.createElement('div');
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '1285:1404');
                return ('draggable' in div || 'ondragstart' in div && 'ondrop' in div) && (Env.browser !== 'IE' || Env.version > 9);
            }(),
            return_response_type: function (responseType) {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '1469:1645');
                if (responseType === 'json') {
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '1505:1516');
                    return true;
                } else {
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '1587:1639');
                    return Env.can('return_response_type', responseType);
                }
            },
            report_upload_progress: function () {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '1697:1760');
                return !!(window.XMLHttpRequest && new XMLHttpRequest().upload);
            },
            resize_image: function () {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '1802:1859');
                return I.can('access_binary') && Env.can('create_canvas');
            },
            select_folder: Env.browser === 'Chrome' && Env.version >= 21,
            select_multiple: !(Env.browser === 'Safari' && Env.OS === 'Windows'),
            send_binary_string: !!(window.XMLHttpRequest && (new XMLHttpRequest().sendAsBinary || window.Uint8Array && window.ArrayBuffer)),
            send_custom_headers: !!window.XMLHttpRequest,
            send_multipart: function () {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '2228:2339');
                return !!(window.XMLHttpRequest && new XMLHttpRequest().upload && window.FormData) || can('send_binary_string');
            },
            slice_blob: !!(window.File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)),
            stream_upload: function () {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '2497:2550');
                return I.can('slice_blob') && I.can('send_multipart');
            },
            summon_file_dialog: function () {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '2638:2810');
                return Env.browser === 'Firefox' && Env.version >= 4 || Env.browser === 'Opera' && Env.version >= 12 || !!~Basic.inArray(Env.browser, [
                    'Chrome',
                    'Safari'
                ]);
            }(),
            upload_filesize: true
        });
        __$coverCall('src/javascript/runtime/html5/Runtime.js', '2856:3558');
        Basic.extend(this, {
            init: function () {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '2905:3071');
                if (!window.File || !Env.can('use_fileinput')) {
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '2982:3052');
                    this.trigger('Error', new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '3059:3065');
                    return;
                }
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '3077:3097');
                this.trigger('Init');
            },
            getShim: function () {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '3135:3146');
                return shim;
            },
            shimExec: function (component, action) {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '3202:3240');
                var args = [].slice.call(arguments, 2);
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '3246:3315');
                return I.getShim().exec.call(this, this.uid, component, action, args);
            },
            destroy: function (destroy) {
                __$coverCall('src/javascript/runtime/html5/Runtime.js', '3394:3531');
                return function () {
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '3419:3470');
                    if (shim) {
                        __$coverCall('src/javascript/runtime/html5/Runtime.js', '3437:3463');
                        shim.removeAllInstances(I);
                    }
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '3477:3492');
                    destroy.call(I);
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '3499:3524');
                    destroy = shim = I = null;
                };
            }(this.destroy)
        });
        __$coverCall('src/javascript/runtime/html5/Runtime.js', '3563:4315');
        shim = Basic.extend(function () {
            __$coverCall('src/javascript/runtime/html5/Runtime.js', '3600:3616');
            var objpool = {};
            __$coverCall('src/javascript/runtime/html5/Runtime.js', '3622:4294');
            return {
                exec: function (uid, comp, fn, args) {
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '3678:3934');
                    if (shim[comp]) {
                        __$coverCall('src/javascript/runtime/html5/Runtime.js', '3702:3820');
                        if (!objpool[uid]) {
                            __$coverCall('src/javascript/runtime/html5/Runtime.js', '3730:3819');
                            objpool[uid] = {
                                context: this,
                                instance: new shim[comp]()
                            };
                        }
                        __$coverCall('src/javascript/runtime/html5/Runtime.js', '3829:3927');
                        if (objpool[uid].instance[fn]) {
                            __$coverCall('src/javascript/runtime/html5/Runtime.js', '3869:3919');
                            return objpool[uid].instance[fn].apply(this, args);
                        }
                    }
                },
                removeInstance: function (uid) {
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '3985:4004');
                    delete objpool[uid];
                },
                removeAllInstances: function () {
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '4056:4071');
                    var self = this;
                    __$coverCall('src/javascript/runtime/html5/Runtime.js', '4084:4282');
                    Basic.each(objpool, function (obj, uid) {
                        __$coverCall('src/javascript/runtime/html5/Runtime.js', '4131:4241');
                        if (Basic.typeOf(obj.instance.destroy) === 'function') {
                            __$coverCall('src/javascript/runtime/html5/Runtime.js', '4195:4233');
                            obj.instance.destroy.call(obj.context);
                        }
                        __$coverCall('src/javascript/runtime/html5/Runtime.js', '4249:4273');
                        self.removeInstance(uid);
                    });
                }
            };
        }(), extensions);
    }
    __$coverCall('src/javascript/runtime/html5/Runtime.js', '4322:4364');
    Runtime.addConstructor(type, Html5Runtime);
    __$coverCall('src/javascript/runtime/html5/Runtime.js', '4368:4385');
    return extensions;
});

// Included from: src/javascript/runtime/html5/file/Blob.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/file/Blob.js", "/**\n * Blob.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/file/Blob\n@private\n*/\ndefine(\"moxie/runtime/html5/file/Blob\", [\n\t\"moxie/runtime/html5/Runtime\",\n\t\"moxie/file/Blob\"\n], function(extensions, Blob) {\n\n\tfunction HTML5Blob() {\n\t\tfunction w3cBlobSlice(blob, start, end) {\n\t\t\tvar blobSlice;\n\n\t\t\tif (window.File.prototype.slice) {\n\t\t\t\ttry {\n\t\t\t\t\tblob.slice();\t// depricated version will throw WRONG_ARGUMENTS_ERR exception\n\t\t\t\t\treturn blob.slice(start, end);\n\t\t\t\t} catch (e) {\n\t\t\t\t\t// depricated slice method\n\t\t\t\t\treturn blob.slice(start, end - start);\n\t\t\t\t}\n\t\t\t// slice method got prefixed: https://bugzilla.mozilla.org/show_bug.cgi?id=649672\n\t\t\t} else if ((blobSlice = window.File.prototype.webkitSlice || window.File.prototype.mozSlice)) {\n\t\t\t\treturn blobSlice.call(blob, start, end);\n\t\t\t} else {\n\t\t\t\treturn null; // or throw some exception\n\t\t\t}\n\t\t}\n\n\t\tthis.slice = function() {\n\t\t\treturn new Blob(this.getRuntime().uid, w3cBlobSlice.apply(this, arguments));\n\t\t};\n\t}\n\n\treturn (extensions.Blob = HTML5Blob);\n});\n");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "395:1327");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "522:1283");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "1287:1323");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "547:1166");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "1171:1280");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "592:605");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "611:1162");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "650:872");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "661:673");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "743:772");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "829:866");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "1062:1101");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "1119:1130");
__$coverInitRange("src/javascript/runtime/html5/file/Blob.js", "1200:1275");
__$coverCall('src/javascript/runtime/html5/file/Blob.js', '395:1327');
define('moxie/runtime/html5/file/Blob', [
    'moxie/runtime/html5/Runtime',
    'moxie/file/Blob'
], function (extensions, Blob) {
    __$coverCall('src/javascript/runtime/html5/file/Blob.js', '522:1283');
    function HTML5Blob() {
        __$coverCall('src/javascript/runtime/html5/file/Blob.js', '547:1166');
        function w3cBlobSlice(blob, start, end) {
            __$coverCall('src/javascript/runtime/html5/file/Blob.js', '592:605');
            var blobSlice;
            __$coverCall('src/javascript/runtime/html5/file/Blob.js', '611:1162');
            if (window.File.prototype.slice) {
                __$coverCall('src/javascript/runtime/html5/file/Blob.js', '650:872');
                try {
                    __$coverCall('src/javascript/runtime/html5/file/Blob.js', '661:673');
                    blob.slice();
                    __$coverCall('src/javascript/runtime/html5/file/Blob.js', '743:772');
                    return blob.slice(start, end);
                } catch (e) {
                    __$coverCall('src/javascript/runtime/html5/file/Blob.js', '829:866');
                    return blob.slice(start, end - start);
                }
            } else if (blobSlice = window.File.prototype.webkitSlice || window.File.prototype.mozSlice) {
                __$coverCall('src/javascript/runtime/html5/file/Blob.js', '1062:1101');
                return blobSlice.call(blob, start, end);
            } else {
                __$coverCall('src/javascript/runtime/html5/file/Blob.js', '1119:1130');
                return null;
            }
        }
        __$coverCall('src/javascript/runtime/html5/file/Blob.js', '1171:1280');
        this.slice = function () {
            __$coverCall('src/javascript/runtime/html5/file/Blob.js', '1200:1275');
            return new Blob(this.getRuntime().uid, w3cBlobSlice.apply(this, arguments));
        };
    }
    __$coverCall('src/javascript/runtime/html5/file/Blob.js', '1287:1323');
    return extensions.Blob = HTML5Blob;
});

// Included from: src/javascript/core/utils/Events.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/core/utils/Events.js", "/**\n * Events.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\ndefine('moxie/core/utils/Events', [\n\t'moxie/core/utils/Basic'\n], function(o) {\n\tvar eventhash = {}, uid = 'moxie_' + o.guid();\n\t\n\t// IE W3C like event funcs\n\tfunction preventDefault() {\n\t\tthis.returnValue = false;\n\t}\n\n\tfunction stopPropagation() {\n\t\tthis.cancelBubble = true;\n\t}\n\n\t/**\n\tAdds an event handler to the specified object and store reference to the handler\n\tin objects internal Plupload registry (@see removeEvent).\n\t\n\t@method addEvent\n\t@static\n\t@param {Object} obj DOM element like object to add handler to.\n\t@param {String} name Name to add event listener to.\n\t@param {Function} callback Function to call when event occurs.\n\t@param {String} (optional) key that might be used to add specifity to the event record.\n\t*/\n\tvar addEvent = function(obj, name, callback) {\n\t\tvar func, events, key;\n\t\t\n\t\t// if passed in, event will be locked with this key - one would need to provide it to removeEvent\n\t\tkey = arguments[3];\n\t\t\t\t\t\n\t\tname = name.toLowerCase();\n\n\t\t// Add event listener\n\t\tif (obj.addEventListener) {\n\t\t\tfunc = callback;\n\t\t\t\n\t\t\tobj.addEventListener(name, func, false);\n\t\t} else if (obj.attachEvent) {\n\t\t\tfunc = function() {\n\t\t\t\tvar evt = window.event;\n\n\t\t\t\tif (!evt.target) {\n\t\t\t\t\tevt.target = evt.srcElement;\n\t\t\t\t}\n\n\t\t\t\tevt.preventDefault = preventDefault;\n\t\t\t\tevt.stopPropagation = stopPropagation;\n\n\t\t\t\tcallback(evt);\n\t\t\t};\n\n\t\t\tobj.attachEvent('on' + name, func);\n\t\t}\n\t\t\n\t\t// Log event handler to objects internal mOxie registry\n\t\tif (!obj[uid]) {\n\t\t\tobj[uid] = o.guid();\n\t\t}\n\t\t\n\t\tif (!eventhash.hasOwnProperty(obj[uid])) {\n\t\t\teventhash[obj[uid]] = {};\n\t\t}\n\t\t\n\t\tevents = eventhash[obj[uid]];\n\t\t\n\t\tif (!events.hasOwnProperty(name)) {\n\t\t\tevents[name] = [];\n\t\t}\n\t\t\t\t\n\t\tevents[name].push({\n\t\t\tfunc: func,\n\t\t\torig: callback, // store original callback for IE\n\t\t\tkey: key\n\t\t});\n\t};\n\t\n\t\n\t/**\n\tRemove event handler from the specified object. If third argument (callback)\n\tis not specified remove all events with the specified name.\n\t\n\t@method removeEvent\n\t@static\n\t@param {Object} obj DOM element to remove event listener(s) from.\n\t@param {String} name Name of event listener to remove.\n\t@param {Function|String} (optional) might be a callback or unique key to match.\n\t*/\n\tvar removeEvent = function(obj, name) {\n\t\tvar type, callback, key;\n\t\t\n\t\t// match the handler either by callback or by key\n\t\tif (typeof(arguments[2]) == \"function\") {\n\t\t\tcallback = arguments[2];\n\t\t} else {\n\t\t\tkey = arguments[2];\n\t\t}\n\t\t\t\t\t\n\t\tname = name.toLowerCase();\n\t\t\n\t\tif (obj[uid] && eventhash[obj[uid]] && eventhash[obj[uid]][name]) {\n\t\t\ttype = eventhash[obj[uid]][name];\n\t\t} else {\n\t\t\treturn;\n\t\t}\n\t\t\n\t\t\t\n\t\tfor (var i=type.length-1; i>=0; i--) {\n\t\t\t// undefined or not, key should match\n\t\t\tif (type[i].key === key || type[i].orig === callback) {\n\t\t\t\t\t\n\t\t\t\tif (obj.removeEventListener) {\n\t\t\t\t\tobj.removeEventListener(name, type[i].func, false);\n\t\t\t\t} else if (obj.detachEvent) {\n\t\t\t\t\tobj.detachEvent('on'+name, type[i].func);\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\ttype[i].orig = null;\n\t\t\t\ttype[i].func = null;\n\t\t\t\t\n\t\t\t\ttype.splice(i, 1);\n\t\t\t\t\n\t\t\t\t// If callback was passed we are done here, otherwise proceed\n\t\t\t\tif (callback !== undefined) {\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t\n\t\t// If event array got empty, remove it\n\t\tif (!type.length) {\n\t\t\tdelete eventhash[obj[uid]][name];\n\t\t}\n\t\t\n\t\t// If mOxie registry has become empty, remove it\n\t\tif (o.isEmptyObj(eventhash[obj[uid]])) {\n\t\t\tdelete eventhash[obj[uid]];\n\t\t\t\n\t\t\t// IE doesn't let you remove DOM object property with - delete\n\t\t\ttry {\n\t\t\t\tdelete obj[uid];\n\t\t\t} catch(e) {\n\t\t\t\tobj[uid] = undefined;\n\t\t\t}\n\t\t}\n\t};\n\t\n\t\n\t/**\n\tRemove all kind of events from the specified object\n\t\n\t@method removeAllEvents\n\t@static\n\t@param {Object} obj DOM element to remove event listeners from.\n\t@param {String} (optional) unique key to match, when removing events.\n\t*/\n\tvar removeAllEvents = function(obj) {\n\t\tvar key = arguments[1];\n\t\t\n\t\tif (!obj || !obj[uid]) {\n\t\t\treturn;\n\t\t}\n\t\t\n\t\to.each(eventhash[obj[uid]], function(events, name) {\n\t\t\tremoveEvent(obj, name, key);\n\t\t});\n\t};\n\n\treturn {\n\t\taddEvent: addEvent,\n\t\tremoveEvent: removeEvent,\n\t\tremoveAllEvents: removeAllEvents\n\t};\n});");
__$coverInitRange("src/javascript/core/utils/Events.js", "344:4419");
__$coverInitRange("src/javascript/core/utils/Events.js", "424:469");
__$coverInitRange("src/javascript/core/utils/Events.js", "502:559");
__$coverInitRange("src/javascript/core/utils/Events.js", "563:621");
__$coverInitRange("src/javascript/core/utils/Events.js", "1074:2137");
__$coverInitRange("src/javascript/core/utils/Events.js", "2528:3867");
__$coverInitRange("src/javascript/core/utils/Events.js", "4108:4315");
__$coverInitRange("src/javascript/core/utils/Events.js", "4319:4415");
__$coverInitRange("src/javascript/core/utils/Events.js", "532:556");
__$coverInitRange("src/javascript/core/utils/Events.js", "594:618");
__$coverInitRange("src/javascript/core/utils/Events.js", "1123:1144");
__$coverInitRange("src/javascript/core/utils/Events.js", "1251:1269");
__$coverInitRange("src/javascript/core/utils/Events.js", "1279:1304");
__$coverInitRange("src/javascript/core/utils/Events.js", "1333:1729");
__$coverInitRange("src/javascript/core/utils/Events.js", "1794:1837");
__$coverInitRange("src/javascript/core/utils/Events.js", "1844:1918");
__$coverInitRange("src/javascript/core/utils/Events.js", "1925:1953");
__$coverInitRange("src/javascript/core/utils/Events.js", "1960:2020");
__$coverInitRange("src/javascript/core/utils/Events.js", "2029:2133");
__$coverInitRange("src/javascript/core/utils/Events.js", "1364:1379");
__$coverInitRange("src/javascript/core/utils/Events.js", "1388:1427");
__$coverInitRange("src/javascript/core/utils/Events.js", "1464:1685");
__$coverInitRange("src/javascript/core/utils/Events.js", "1691:1725");
__$coverInitRange("src/javascript/core/utils/Events.js", "1488:1510");
__$coverInitRange("src/javascript/core/utils/Events.js", "1517:1574");
__$coverInitRange("src/javascript/core/utils/Events.js", "1581:1616");
__$coverInitRange("src/javascript/core/utils/Events.js", "1622:1659");
__$coverInitRange("src/javascript/core/utils/Events.js", "1666:1679");
__$coverInitRange("src/javascript/core/utils/Events.js", "1541:1568");
__$coverInitRange("src/javascript/core/utils/Events.js", "1814:1833");
__$coverInitRange("src/javascript/core/utils/Events.js", "1890:1914");
__$coverInitRange("src/javascript/core/utils/Events.js", "1999:2016");
__$coverInitRange("src/javascript/core/utils/Events.js", "2570:2593");
__$coverInitRange("src/javascript/core/utils/Events.js", "2652:2758");
__$coverInitRange("src/javascript/core/utils/Events.js", "2768:2793");
__$coverInitRange("src/javascript/core/utils/Events.js", "2800:2929");
__$coverInitRange("src/javascript/core/utils/Events.js", "2940:3477");
__$coverInitRange("src/javascript/core/utils/Events.js", "3525:3584");
__$coverInitRange("src/javascript/core/utils/Events.js", "3642:3863");
__$coverInitRange("src/javascript/core/utils/Events.js", "2697:2720");
__$coverInitRange("src/javascript/core/utils/Events.js", "2736:2754");
__$coverInitRange("src/javascript/core/utils/Events.js", "2871:2903");
__$coverInitRange("src/javascript/core/utils/Events.js", "2919:2925");
__$coverInitRange("src/javascript/core/utils/Events.js", "3023:3473");
__$coverInitRange("src/javascript/core/utils/Events.js", "3089:3262");
__$coverInitRange("src/javascript/core/utils/Events.js", "3273:3292");
__$coverInitRange("src/javascript/core/utils/Events.js", "3298:3317");
__$coverInitRange("src/javascript/core/utils/Events.js", "3328:3345");
__$coverInitRange("src/javascript/core/utils/Events.js", "3422:3468");
__$coverInitRange("src/javascript/core/utils/Events.js", "3125:3175");
__$coverInitRange("src/javascript/core/utils/Events.js", "3216:3256");
__$coverInitRange("src/javascript/core/utils/Events.js", "3457:3462");
__$coverInitRange("src/javascript/core/utils/Events.js", "3548:3580");
__$coverInitRange("src/javascript/core/utils/Events.js", "3686:3712");
__$coverInitRange("src/javascript/core/utils/Events.js", "3787:3859");
__$coverInitRange("src/javascript/core/utils/Events.js", "3797:3812");
__$coverInitRange("src/javascript/core/utils/Events.js", "3834:3854");
__$coverInitRange("src/javascript/core/utils/Events.js", "4148:4170");
__$coverInitRange("src/javascript/core/utils/Events.js", "4177:4215");
__$coverInitRange("src/javascript/core/utils/Events.js", "4222:4311");
__$coverInitRange("src/javascript/core/utils/Events.js", "4205:4211");
__$coverInitRange("src/javascript/core/utils/Events.js", "4278:4305");
__$coverCall('src/javascript/core/utils/Events.js', '344:4419');
define('moxie/core/utils/Events', ['moxie/core/utils/Basic'], function (o) {
    __$coverCall('src/javascript/core/utils/Events.js', '424:469');
    var eventhash = {}, uid = 'moxie_' + o.guid();
    __$coverCall('src/javascript/core/utils/Events.js', '502:559');
    function preventDefault() {
        __$coverCall('src/javascript/core/utils/Events.js', '532:556');
        this.returnValue = false;
    }
    __$coverCall('src/javascript/core/utils/Events.js', '563:621');
    function stopPropagation() {
        __$coverCall('src/javascript/core/utils/Events.js', '594:618');
        this.cancelBubble = true;
    }
    __$coverCall('src/javascript/core/utils/Events.js', '1074:2137');
    var addEvent = function (obj, name, callback) {
        __$coverCall('src/javascript/core/utils/Events.js', '1123:1144');
        var func, events, key;
        __$coverCall('src/javascript/core/utils/Events.js', '1251:1269');
        key = arguments[3];
        __$coverCall('src/javascript/core/utils/Events.js', '1279:1304');
        name = name.toLowerCase();
        __$coverCall('src/javascript/core/utils/Events.js', '1333:1729');
        if (obj.addEventListener) {
            __$coverCall('src/javascript/core/utils/Events.js', '1364:1379');
            func = callback;
            __$coverCall('src/javascript/core/utils/Events.js', '1388:1427');
            obj.addEventListener(name, func, false);
        } else if (obj.attachEvent) {
            __$coverCall('src/javascript/core/utils/Events.js', '1464:1685');
            func = function () {
                __$coverCall('src/javascript/core/utils/Events.js', '1488:1510');
                var evt = window.event;
                __$coverCall('src/javascript/core/utils/Events.js', '1517:1574');
                if (!evt.target) {
                    __$coverCall('src/javascript/core/utils/Events.js', '1541:1568');
                    evt.target = evt.srcElement;
                }
                __$coverCall('src/javascript/core/utils/Events.js', '1581:1616');
                evt.preventDefault = preventDefault;
                __$coverCall('src/javascript/core/utils/Events.js', '1622:1659');
                evt.stopPropagation = stopPropagation;
                __$coverCall('src/javascript/core/utils/Events.js', '1666:1679');
                callback(evt);
            };
            __$coverCall('src/javascript/core/utils/Events.js', '1691:1725');
            obj.attachEvent('on' + name, func);
        }
        __$coverCall('src/javascript/core/utils/Events.js', '1794:1837');
        if (!obj[uid]) {
            __$coverCall('src/javascript/core/utils/Events.js', '1814:1833');
            obj[uid] = o.guid();
        }
        __$coverCall('src/javascript/core/utils/Events.js', '1844:1918');
        if (!eventhash.hasOwnProperty(obj[uid])) {
            __$coverCall('src/javascript/core/utils/Events.js', '1890:1914');
            eventhash[obj[uid]] = {};
        }
        __$coverCall('src/javascript/core/utils/Events.js', '1925:1953');
        events = eventhash[obj[uid]];
        __$coverCall('src/javascript/core/utils/Events.js', '1960:2020');
        if (!events.hasOwnProperty(name)) {
            __$coverCall('src/javascript/core/utils/Events.js', '1999:2016');
            events[name] = [];
        }
        __$coverCall('src/javascript/core/utils/Events.js', '2029:2133');
        events[name].push({
            func: func,
            orig: callback,
            key: key
        });
    };
    __$coverCall('src/javascript/core/utils/Events.js', '2528:3867');
    var removeEvent = function (obj, name) {
        __$coverCall('src/javascript/core/utils/Events.js', '2570:2593');
        var type, callback, key;
        __$coverCall('src/javascript/core/utils/Events.js', '2652:2758');
        if (typeof arguments[2] == 'function') {
            __$coverCall('src/javascript/core/utils/Events.js', '2697:2720');
            callback = arguments[2];
        } else {
            __$coverCall('src/javascript/core/utils/Events.js', '2736:2754');
            key = arguments[2];
        }
        __$coverCall('src/javascript/core/utils/Events.js', '2768:2793');
        name = name.toLowerCase();
        __$coverCall('src/javascript/core/utils/Events.js', '2800:2929');
        if (obj[uid] && eventhash[obj[uid]] && eventhash[obj[uid]][name]) {
            __$coverCall('src/javascript/core/utils/Events.js', '2871:2903');
            type = eventhash[obj[uid]][name];
        } else {
            __$coverCall('src/javascript/core/utils/Events.js', '2919:2925');
            return;
        }
        __$coverCall('src/javascript/core/utils/Events.js', '2940:3477');
        for (var i = type.length - 1; i >= 0; i--) {
            __$coverCall('src/javascript/core/utils/Events.js', '3023:3473');
            if (type[i].key === key || type[i].orig === callback) {
                __$coverCall('src/javascript/core/utils/Events.js', '3089:3262');
                if (obj.removeEventListener) {
                    __$coverCall('src/javascript/core/utils/Events.js', '3125:3175');
                    obj.removeEventListener(name, type[i].func, false);
                } else if (obj.detachEvent) {
                    __$coverCall('src/javascript/core/utils/Events.js', '3216:3256');
                    obj.detachEvent('on' + name, type[i].func);
                }
                __$coverCall('src/javascript/core/utils/Events.js', '3273:3292');
                type[i].orig = null;
                __$coverCall('src/javascript/core/utils/Events.js', '3298:3317');
                type[i].func = null;
                __$coverCall('src/javascript/core/utils/Events.js', '3328:3345');
                type.splice(i, 1);
                __$coverCall('src/javascript/core/utils/Events.js', '3422:3468');
                if (callback !== undefined) {
                    __$coverCall('src/javascript/core/utils/Events.js', '3457:3462');
                    break;
                }
            }
        }
        __$coverCall('src/javascript/core/utils/Events.js', '3525:3584');
        if (!type.length) {
            __$coverCall('src/javascript/core/utils/Events.js', '3548:3580');
            delete eventhash[obj[uid]][name];
        }
        __$coverCall('src/javascript/core/utils/Events.js', '3642:3863');
        if (o.isEmptyObj(eventhash[obj[uid]])) {
            __$coverCall('src/javascript/core/utils/Events.js', '3686:3712');
            delete eventhash[obj[uid]];
            __$coverCall('src/javascript/core/utils/Events.js', '3787:3859');
            try {
                __$coverCall('src/javascript/core/utils/Events.js', '3797:3812');
                delete obj[uid];
            } catch (e) {
                __$coverCall('src/javascript/core/utils/Events.js', '3834:3854');
                obj[uid] = undefined;
            }
        }
    };
    __$coverCall('src/javascript/core/utils/Events.js', '4108:4315');
    var removeAllEvents = function (obj) {
        __$coverCall('src/javascript/core/utils/Events.js', '4148:4170');
        var key = arguments[1];
        __$coverCall('src/javascript/core/utils/Events.js', '4177:4215');
        if (!obj || !obj[uid]) {
            __$coverCall('src/javascript/core/utils/Events.js', '4205:4211');
            return;
        }
        __$coverCall('src/javascript/core/utils/Events.js', '4222:4311');
        o.each(eventhash[obj[uid]], function (events, name) {
            __$coverCall('src/javascript/core/utils/Events.js', '4278:4305');
            removeEvent(obj, name, key);
        });
    };
    __$coverCall('src/javascript/core/utils/Events.js', '4319:4415');
    return {
        addEvent: addEvent,
        removeEvent: removeEvent,
        removeAllEvents: removeAllEvents
    };
});

// Included from: src/javascript/runtime/html5/file/FileInput.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/file/FileInput.js", "/**\n * FileInput.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/file/FileInput\n@private\n*/\ndefine(\"moxie/runtime/html5/file/FileInput\", [\n\t\"moxie/runtime/html5/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/utils/Dom\",\n\t\"moxie/core/utils/Events\",\n\t\"moxie/core/utils/Mime\"\n], function(extensions, Basic, Dom, Events, Mime) {\n\t\n\tfunction FileInput() {\n\t\tvar _files = [], _options;\n\n\t\tBasic.extend(this, {\n\t\t\tinit: function(options) {\n\t\t\t\tvar comp = this, I = comp.getRuntime(), input, shimContainer, mimes;\n\n\t\t\t\t_options = options;\n\t\t\t\t_files = [];\n\n\t\t\t\t// figure out accept string\n\t\t\t\tmimes = _options.accept.mimes || Mime.extList2mimes(_options.accept);\n\n\t\t\t\tshimContainer = I.getShimContainer();\n\n\t\t\t\tshimContainer.innerHTML = '<input id=\"' + I.uid +'\" type=\"file\" style=\"font-size:999px;opacity:0;\"' +\n\t\t\t\t\t(_options.multiple && I.can('select_multiple') ? 'multiple' : '') + \n\t\t\t\t\t(_options.directory && I.can('select_folder') ? 'webkitdirectory directory' : '') + // Chrome 11+\n\t\t\t\t\t' accept=\"' + mimes.join(',') + '\" />';\n\n\t\t\t\tinput = Dom.get(I.uid);\n\n\t\t\t\t// prepare file input to be placed underneath the browse_button element\n\t\t\t\tBasic.extend(input.style, {\n\t\t\t\t\tposition: 'absolute',\n\t\t\t\t\ttop: 0,\n\t\t\t\t\tleft: 0,\n\t\t\t\t\twidth: '100%',\n\t\t\t\t\theight: '100%'\n\t\t\t\t});\n\n\t\t\t\t(function() {\n\t\t\t\t\tvar browseButton, zIndex, top;\n\n\t\t\t\t\tbrowseButton = Dom.get(_options.browse_button);\n\n\t\t\t\t\t// Route click event to the input[type=file] element for browsers that support such behavior\n\t\t\t\t\tif (I.can('summon_file_dialog')) {\n\t\t\t\t\t\tif (Dom.getStyle(browseButton, 'position') === 'static') {\n\t\t\t\t\t\t\tbrowseButton.style.position = 'relative';\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tzIndex = parseInt(Dom.getStyle(browseButton, 'z-index'), 10) || 1;\n\n\t\t\t\t\t\tbrowseButton.style.zIndex = zIndex;\n\t\t\t\t\t\tshimContainer.style.zIndex = zIndex - 1;\n\n\t\t\t\t\t\tEvents.addEvent(browseButton, 'click', function(e) {\n\t\t\t\t\t\t\tif (input && !input.disabled) { // for some reason FF (up to 8.0.1 so far) lets to click disabled input[type=file]\n\t\t\t\t\t\t\t\tinput.click();\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\te.preventDefault();\n\t\t\t\t\t\t}, comp.uid);\n\t\t\t\t\t}\n\n\t\t\t\t\t/* Since we have to place input[type=file] on top of the browse_button for some browsers,\n\t\t\t\t\tbrowse_button loses interactivity, so we restore it here */\n\t\t\t\t\ttop = I.can('summon_file_dialog') ? browseButton : shimContainer;\n\n\t\t\t\t\tEvents.addEvent(top, 'mouseover', function() {\n\t\t\t\t\t\tcomp.trigger('mouseenter');\n\t\t\t\t\t}, comp.uid);\n\n\t\t\t\t\tEvents.addEvent(top, 'mouseout', function() {\n\t\t\t\t\t\tcomp.trigger('mouseleave');\n\t\t\t\t\t}, comp.uid);\n\n\t\t\t\t\tEvents.addEvent(top, 'mousedown', function() {\n\t\t\t\t\t\tcomp.trigger('mousedown');\n\t\t\t\t\t}, comp.uid);\n\n\t\t\t\t\tEvents.addEvent(Dom.get(_options.container), 'mouseup', function() {\n\t\t\t\t\t\tcomp.trigger('mouseup');\n\t\t\t\t\t}, comp.uid);\n\n\t\t\t\t}());\n\n\t\t\t\tinput.onchange = function() { // there should be only one handler for this\n\t\t\t\t\t_files = [];\n\n\t\t\t\t\tif (_options.directory) {\n\t\t\t\t\t\t// folders are represented by dots, filter them out (Chrome 11+)\n\t\t\t\t\t\tBasic.each(this.files, function(file) {\n\t\t\t\t\t\t\tif (file.name !== \".\") { // if it doesn't looks like a folder\n\t\t\t\t\t\t\t\t_files.push(file);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t});\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_files = [].slice.call(this.files);\n\t\t\t\t\t}\n\n\t\t\t\t\t// Clearing the value enables the user to select the same file again if they want to\n\t\t\t\t\tthis.value = '';\n\t\t\t\t\tcomp.trigger('change');\n\t\t\t\t};\n\t\t\t},\n\n\t\t\tgetFiles: function() {\n\t\t\t\treturn _files;\n\t\t\t},\n\n\t\t\tdisable: function(state) {\n\t\t\t\tvar I = this.getRuntime(), input;\n\n\t\t\t\tif ((input = Dom.get(I.uid))) {\n\t\t\t\t\tinput.disabled = !!state;\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tdestroy: function() {\n\t\t\t\tvar I = this.getRuntime(), shimContainer = I.getShimContainer();\n\n\t\t\t\tEvents.removeAllEvents(shimContainer, this.uid);\n\t\t\t\tEvents.removeAllEvents(Dom.get(_options.container), this.uid);\n\t\t\t\tEvents.removeAllEvents(Dom.get(_options.browse_button), this.uid);\n\n\t\t\t\tshimContainer.innerHTML = '';\n\n\t\t\t\t_files = _options = null;\n\t\t\t}\n\t\t});\n\t}\n\n\treturn (extensions.FileInput = FileInput);\n});");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "405:4264");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "644:4215");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "4219:4260");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "669:694");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "699:4212");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "753:820");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "827:845");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "851:862");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "901:969");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "976:1012");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1019:1341");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1348:1370");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1453:1581");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1588:3067");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3074:3641");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1607:1636");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1644:1690");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1796:2383");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2551:2615");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2623:2721");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2729:2826");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2834:2931");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2939:3056");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1837:1951");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1960:2025");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2034:2068");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2076:2115");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2124:2376");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "1903:1943");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2184:2329");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2338:2356");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2307:2320");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2676:2702");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2781:2807");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "2887:2912");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3014:3037");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3154:3165");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3173:3492");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3590:3605");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3612:3634");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3276:3429");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3323:3419");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3393:3410");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3451:3485");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3680:3693");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3736:3768");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3775:3842");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3812:3836");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3880:3943");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "3950:3997");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "4003:4064");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "4070:4135");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "4142:4170");
__$coverInitRange("src/javascript/runtime/html5/file/FileInput.js", "4177:4201");
__$coverCall('src/javascript/runtime/html5/file/FileInput.js', '405:4264');
define('moxie/runtime/html5/file/FileInput', [
    'moxie/runtime/html5/Runtime',
    'moxie/core/utils/Basic',
    'moxie/core/utils/Dom',
    'moxie/core/utils/Events',
    'moxie/core/utils/Mime'
], function (extensions, Basic, Dom, Events, Mime) {
    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '644:4215');
    function FileInput() {
        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '669:694');
        var _files = [], _options;
        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '699:4212');
        Basic.extend(this, {
            init: function (options) {
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '753:820');
                var comp = this, I = comp.getRuntime(), input, shimContainer, mimes;
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '827:845');
                _options = options;
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '851:862');
                _files = [];
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '901:969');
                mimes = _options.accept.mimes || Mime.extList2mimes(_options.accept);
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '976:1012');
                shimContainer = I.getShimContainer();
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1019:1341');
                shimContainer.innerHTML = '<input id="' + I.uid + '" type="file" style="font-size:999px;opacity:0;"' + (_options.multiple && I.can('select_multiple') ? 'multiple' : '') + (_options.directory && I.can('select_folder') ? 'webkitdirectory directory' : '') + ' accept="' + mimes.join(',') + '" />';
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1348:1370');
                input = Dom.get(I.uid);
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1453:1581');
                Basic.extend(input.style, {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                });
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1588:3067');
                (function () {
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1607:1636');
                    var browseButton, zIndex, top;
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1644:1690');
                    browseButton = Dom.get(_options.browse_button);
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1796:2383');
                    if (I.can('summon_file_dialog')) {
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1837:1951');
                        if (Dom.getStyle(browseButton, 'position') === 'static') {
                            __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1903:1943');
                            browseButton.style.position = 'relative';
                        }
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '1960:2025');
                        zIndex = parseInt(Dom.getStyle(browseButton, 'z-index'), 10) || 1;
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2034:2068');
                        browseButton.style.zIndex = zIndex;
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2076:2115');
                        shimContainer.style.zIndex = zIndex - 1;
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2124:2376');
                        Events.addEvent(browseButton, 'click', function (e) {
                            __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2184:2329');
                            if (input && !input.disabled) {
                                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2307:2320');
                                input.click();
                            }
                            __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2338:2356');
                            e.preventDefault();
                        }, comp.uid);
                    }
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2551:2615');
                    top = I.can('summon_file_dialog') ? browseButton : shimContainer;
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2623:2721');
                    Events.addEvent(top, 'mouseover', function () {
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2676:2702');
                        comp.trigger('mouseenter');
                    }, comp.uid);
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2729:2826');
                    Events.addEvent(top, 'mouseout', function () {
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2781:2807');
                        comp.trigger('mouseleave');
                    }, comp.uid);
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2834:2931');
                    Events.addEvent(top, 'mousedown', function () {
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2887:2912');
                        comp.trigger('mousedown');
                    }, comp.uid);
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '2939:3056');
                    Events.addEvent(Dom.get(_options.container), 'mouseup', function () {
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3014:3037');
                        comp.trigger('mouseup');
                    }, comp.uid);
                }());
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3074:3641');
                input.onchange = function () {
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3154:3165');
                    _files = [];
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3173:3492');
                    if (_options.directory) {
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3276:3429');
                        Basic.each(this.files, function (file) {
                            __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3323:3419');
                            if (file.name !== '.') {
                                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3393:3410');
                                _files.push(file);
                            }
                        });
                    } else {
                        __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3451:3485');
                        _files = [].slice.call(this.files);
                    }
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3590:3605');
                    this.value = '';
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3612:3634');
                    comp.trigger('change');
                };
            },
            getFiles: function () {
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3680:3693');
                return _files;
            },
            disable: function (state) {
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3736:3768');
                var I = this.getRuntime(), input;
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3775:3842');
                if (input = Dom.get(I.uid)) {
                    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3812:3836');
                    input.disabled = !!state;
                }
            },
            destroy: function () {
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3880:3943');
                var I = this.getRuntime(), shimContainer = I.getShimContainer();
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '3950:3997');
                Events.removeAllEvents(shimContainer, this.uid);
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '4003:4064');
                Events.removeAllEvents(Dom.get(_options.container), this.uid);
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '4070:4135');
                Events.removeAllEvents(Dom.get(_options.browse_button), this.uid);
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '4142:4170');
                shimContainer.innerHTML = '';
                __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '4177:4201');
                _files = _options = null;
            }
        });
    }
    __$coverCall('src/javascript/runtime/html5/file/FileInput.js', '4219:4260');
    return extensions.FileInput = FileInput;
});

// Included from: src/javascript/runtime/html5/file/FileDrop.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/file/FileDrop.js", "/**\n * FileDrop.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/file/FileDrop\n@private\n*/\ndefine(\"moxie/runtime/html5/file/FileDrop\", [\n\t\"moxie/runtime/html5/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/utils/Dom\",\n\t\"moxie/core/utils/Events\",\n\t\"moxie/core/utils/Mime\"\n], function(extensions, Basic, Dom, Events, Mime) {\n\t\n\tfunction FileDrop() {\n\t\tvar _files = [], _options;\n\n\t\tBasic.extend(this, {\n\t\t\tinit: function(options) {\n\t\t\t\tvar comp = this, dropZone;\n\n\t\t\t\t_options = options;\n\t\t\t\tdropZone = _options.container;\n\n\t\t\t\tEvents.addEvent(dropZone, 'dragover', function(e) {\n\t\t\t\t\te.preventDefault();\n\t\t\t\t\te.stopPropagation();\n\t\t\t\t\te.dataTransfer.dropEffect = 'copy';\n\t\t\t\t}, comp.uid);\n\n\t\t\t\tEvents.addEvent(dropZone, 'drop', function(e) {\n\t\t\t\t\te.preventDefault();\n\t\t\t\t\te.stopPropagation();\n\n\t\t\t\t\t_files = [];\n\n\t\t\t\t\t// Chrome 21+ accepts folders via Drag'n'Drop\n\t\t\t\t\tif (e.dataTransfer.items && e.dataTransfer.items[0].webkitGetAsEntry) {\n\t\t\t\t\t\tvar entries = [];\n\t\t\t\t\t\tBasic.each(e.dataTransfer.items, function(item) {\n\t\t\t\t\t\t\tentries.push(item.webkitGetAsEntry());\n\t\t\t\t\t\t});\n\t\t\t\t\t\t_readEntries(entries, function() {\n\t\t\t\t\t\t\tcomp.trigger(\"drop\");\n\t\t\t\t\t\t});\n\t\t\t\t\t} else {\n\t\t\t\t\t\tBasic.each(e.dataTransfer.files, function(file) {\n\t\t\t\t\t\t\tif (_isAcceptable(file)) {\n\t\t\t\t\t\t\t\t_files.push(file);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t});\n\t\t\t\t\t\tcomp.trigger(\"drop\");\n\t\t\t\t\t}\n\t\t\t\t}, comp.uid);\n\n\t\t\t\tEvents.addEvent(dropZone, 'dragenter', function(e) {\n\t\t\t\t\te.preventDefault();\n\t\t\t\t\te.stopPropagation();\n\t\t\t\t\tcomp.trigger(\"dragenter\");\n\t\t\t\t}, comp.uid);\n\n\t\t\t\tEvents.addEvent(dropZone, 'dragleave', function(e) {\n\t\t\t\t\te.preventDefault();\n\t\t\t\t\te.stopPropagation();\n\t\t\t\t\tcomp.trigger(\"dragleave\");\n\t\t\t\t}, comp.uid);\n\t\t\t},\n\n\t\t\tgetFiles: function() {\n\t\t\t\treturn _files;\n\t\t\t}\n\t\t});\n\n\t\tfunction _isAcceptable(file) {\n\t\t\tvar mimes = _options.accept.mimes || Mime.extList2mimes(_options.accept)\n\t\t\t, type = file.type || Mime.getFileMime(file.name) || ''\n\t\t\t;\n\n\t\t\tif (!mimes.length || Basic.inArray(type, mimes) !== -1) {\n\t\t\t\treturn true;\n\t\t\t}\n\t\t\treturn false;\n\t\t}\n\n\t\tfunction _readEntries(entries, cb) {\n\t\t\tvar queue = [];\n\t\t\tBasic.each(entries, function(entry) {\n\t\t\t\tqueue.push(function(cbcb) {\n\t\t\t\t\t_readEntry(entry, cbcb);\n\t\t\t\t});\n\t\t\t});\n\t\t\tBasic.inSeries(queue, function(err) {\n\t\t\t\tcb();\n\t\t\t});\n\t\t}\n\n\t\tfunction _readEntry(entry, cb) {\n\t\t\tif (entry.isFile) {\n\t\t\t\tentry.file(function(file) {\n\t\t\t\t\tif (_isAcceptable(file)) {\n\t\t\t\t\t\t_files.push(file);\n\t\t\t\t\t}\n\t\t\t\t\tcb();\n\t\t\t\t}, function(err) {\n\t\t\t\t\t// fire an error event maybe\n\t\t\t\t\tcb();\n\t\t\t\t});\n\t\t\t} else if (entry.isDirectory) {\n\t\t\t\t_readDirEntry(entry, cb);\n\t\t\t} else {\n\t\t\t\tcb(); // not file, not directory? what then?..\n\t\t\t}\n\t\t}\n\n\t\tfunction _readDirEntry(dirEntry, cb) {\n\t\t\tvar entries = [], dirReader = dirEntry.createReader();\n\n\t\t\t// keep quering recursively till no more entries\n\t\t\tfunction getEntries(cbcb) {\n\t\t\t\tdirReader.readEntries(function(moreEntries) {\n\t\t\t\t\tif (moreEntries.length) {\n\t\t\t\t\t\t[].push.apply(entries, moreEntries);\n\t\t\t\t\t\tgetEntries(cbcb);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tcbcb();\n\t\t\t\t\t}\n\t\t\t\t}, cbcb);\n\t\t\t};\n\n\t\t\t// ...and you thought FileReader was crazy...\n\t\t\tgetEntries(function() {\n\t\t\t\t_readEntries(entries, cb);\n\t\t\t}); \n\t\t}\n\t}\n\n\treturn (extensions.FileDrop = FileDrop);\n});");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "403:3507");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "641:3460");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3464:3503");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "665:690");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "695:2053");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2058:2332");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2337:2571");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2576:2950");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2955:3457");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "749:774");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "781:799");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "805:834");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "841:1001");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1008:1672");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1679:1831");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1838:1990");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "898:916");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "923:942");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "949:983");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1061:1079");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1086:1105");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1113:1124");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1183:1654");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1261:1277");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1285:1389");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1397:1469");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1342:1379");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1439:1459");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1491:1619");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1627:1647");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1548:1609");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1583:1600");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1737:1755");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1762:1781");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1788:1813");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1896:1914");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1921:1940");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "1947:1972");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2029:2042");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2092:2226");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2227:2227");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2233:2311");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2316:2328");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2295:2306");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2377:2391");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2396:2509");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2514:2567");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2438:2502");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2471:2494");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2556:2560");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2612:2946");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2636:2813");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2669:2726");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2733:2737");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2702:2719");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2801:2805");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2854:2878");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2896:2900");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "2997:3050");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3108:3336");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3337:3337");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3392:3452");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3140:3331");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3191:3317");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3223:3258");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3266:3282");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3304:3310");
__$coverInitRange("src/javascript/runtime/html5/file/FileDrop.js", "3420:3445");
__$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '403:3507');
define('moxie/runtime/html5/file/FileDrop', [
    'moxie/runtime/html5/Runtime',
    'moxie/core/utils/Basic',
    'moxie/core/utils/Dom',
    'moxie/core/utils/Events',
    'moxie/core/utils/Mime'
], function (extensions, Basic, Dom, Events, Mime) {
    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '641:3460');
    function FileDrop() {
        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '665:690');
        var _files = [], _options;
        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '695:2053');
        Basic.extend(this, {
            init: function (options) {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '749:774');
                var comp = this, dropZone;
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '781:799');
                _options = options;
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '805:834');
                dropZone = _options.container;
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '841:1001');
                Events.addEvent(dropZone, 'dragover', function (e) {
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '898:916');
                    e.preventDefault();
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '923:942');
                    e.stopPropagation();
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '949:983');
                    e.dataTransfer.dropEffect = 'copy';
                }, comp.uid);
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1008:1672');
                Events.addEvent(dropZone, 'drop', function (e) {
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1061:1079');
                    e.preventDefault();
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1086:1105');
                    e.stopPropagation();
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1113:1124');
                    _files = [];
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1183:1654');
                    if (e.dataTransfer.items && e.dataTransfer.items[0].webkitGetAsEntry) {
                        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1261:1277');
                        var entries = [];
                        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1285:1389');
                        Basic.each(e.dataTransfer.items, function (item) {
                            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1342:1379');
                            entries.push(item.webkitGetAsEntry());
                        });
                        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1397:1469');
                        _readEntries(entries, function () {
                            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1439:1459');
                            comp.trigger('drop');
                        });
                    } else {
                        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1491:1619');
                        Basic.each(e.dataTransfer.files, function (file) {
                            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1548:1609');
                            if (_isAcceptable(file)) {
                                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1583:1600');
                                _files.push(file);
                            }
                        });
                        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1627:1647');
                        comp.trigger('drop');
                    }
                }, comp.uid);
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1679:1831');
                Events.addEvent(dropZone, 'dragenter', function (e) {
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1737:1755');
                    e.preventDefault();
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1762:1781');
                    e.stopPropagation();
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1788:1813');
                    comp.trigger('dragenter');
                }, comp.uid);
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1838:1990');
                Events.addEvent(dropZone, 'dragleave', function (e) {
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1896:1914');
                    e.preventDefault();
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1921:1940');
                    e.stopPropagation();
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '1947:1972');
                    comp.trigger('dragleave');
                }, comp.uid);
            },
            getFiles: function () {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2029:2042');
                return _files;
            }
        });
        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2058:2332');
        function _isAcceptable(file) {
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2092:2226');
            var mimes = _options.accept.mimes || Mime.extList2mimes(_options.accept), type = file.type || Mime.getFileMime(file.name) || '';
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2227:2227');
            ;
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2233:2311');
            if (!mimes.length || Basic.inArray(type, mimes) !== -1) {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2295:2306');
                return true;
            }
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2316:2328');
            return false;
        }
        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2337:2571');
        function _readEntries(entries, cb) {
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2377:2391');
            var queue = [];
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2396:2509');
            Basic.each(entries, function (entry) {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2438:2502');
                queue.push(function (cbcb) {
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2471:2494');
                    _readEntry(entry, cbcb);
                });
            });
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2514:2567');
            Basic.inSeries(queue, function (err) {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2556:2560');
                cb();
            });
        }
        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2576:2950');
        function _readEntry(entry, cb) {
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2612:2946');
            if (entry.isFile) {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2636:2813');
                entry.file(function (file) {
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2669:2726');
                    if (_isAcceptable(file)) {
                        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2702:2719');
                        _files.push(file);
                    }
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2733:2737');
                    cb();
                }, function (err) {
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2801:2805');
                    cb();
                });
            } else if (entry.isDirectory) {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2854:2878');
                _readDirEntry(entry, cb);
            } else {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2896:2900');
                cb();
            }
        }
        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2955:3457');
        function _readDirEntry(dirEntry, cb) {
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '2997:3050');
            var entries = [], dirReader = dirEntry.createReader();
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3108:3336');
            function getEntries(cbcb) {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3140:3331');
                dirReader.readEntries(function (moreEntries) {
                    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3191:3317');
                    if (moreEntries.length) {
                        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3223:3258');
                        [].push.apply(entries, moreEntries);
                        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3266:3282');
                        getEntries(cbcb);
                    } else {
                        __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3304:3310');
                        cbcb();
                    }
                }, cbcb);
            }
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3337:3337');
            ;
            __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3392:3452');
            getEntries(function () {
                __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3420:3445');
                _readEntries(entries, cb);
            });
        }
    }
    __$coverCall('src/javascript/runtime/html5/file/FileDrop.js', '3464:3503');
    return extensions.FileDrop = FileDrop;
});

// Included from: src/javascript/runtime/html5/file/FileReader.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/file/FileReader.js", "/**\n * FileReader.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/file/FileReader\n@private\n*/\ndefine(\"moxie/runtime/html5/file/FileReader\", [\n\t\"moxie/runtime/html5/Runtime\",\n\t\"moxie/core/utils/Basic\"\n], function(extensions, Basic) {\n\t\n\tfunction FileReader() {\n\t\t\n\t\tthis.read = function(op, blob) {\n\t\t\tvar target = this, fr = new window.FileReader();\n\n\t\t\t(function() {\n\t\t\t\tvar events = ['loadstart', 'progress', 'load', 'abort', 'error'];\n\n\t\t\t\tfunction reDispatch(e) {\n\t\t\t\t\tif (!!~Basic.inArray(e.type, ['progress', 'load'])) {\n\t\t\t\t\t\ttarget.result = fr.result;\n\t\t\t\t\t}\n\t\t\t\t\ttarget.trigger(e);\n\t\t\t\t}\n\n\t\t\t\tfunction removeEventListeners() {\n\t\t\t\t\tBasic.each(events, function(name) {\n\t\t\t\t\t\tfr.removeEventListener(name, reDispatch);\n\t\t\t\t\t});\n\t\t\t\t\tfr.removeEventListener('loadend', removeEventListeners);\n\t\t\t\t}\n\n\t\t\t\tBasic.each(events, function(name) {\n\t\t\t\t\tfr.addEventListener(name, reDispatch);\n\t\t\t\t});\n\t\t\t\tfr.addEventListener('loadend', removeEventListeners);\n\t\t\t}());\n\n\t\t\tif (Basic.typeOf(fr[op]) === 'function') {\n\t\t\t\tfr[op](blob.getSource());\n\t\t\t}\n\t\t};\n\t}\n\n\treturn (extensions.FileReader = FileReader);\n});\n");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "408:1415");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "550:1364");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "1368:1411");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "579:1361");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "615:662");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "668:1274");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "1280:1356");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "686:750");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "757:909");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "916:1114");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "1121:1207");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "1213:1265");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "787:879");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "886:903");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "847:872");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "955:1046");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "1053:1108");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "997:1037");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "1162:1199");
__$coverInitRange("src/javascript/runtime/html5/file/FileReader.js", "1327:1351");
__$coverCall('src/javascript/runtime/html5/file/FileReader.js', '408:1415');
define('moxie/runtime/html5/file/FileReader', [
    'moxie/runtime/html5/Runtime',
    'moxie/core/utils/Basic'
], function (extensions, Basic) {
    __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '550:1364');
    function FileReader() {
        __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '579:1361');
        this.read = function (op, blob) {
            __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '615:662');
            var target = this, fr = new window.FileReader();
            __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '668:1274');
            (function () {
                __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '686:750');
                var events = [
                        'loadstart',
                        'progress',
                        'load',
                        'abort',
                        'error'
                    ];
                __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '757:909');
                function reDispatch(e) {
                    __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '787:879');
                    if (!!~Basic.inArray(e.type, [
                            'progress',
                            'load'
                        ])) {
                        __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '847:872');
                        target.result = fr.result;
                    }
                    __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '886:903');
                    target.trigger(e);
                }
                __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '916:1114');
                function removeEventListeners() {
                    __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '955:1046');
                    Basic.each(events, function (name) {
                        __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '997:1037');
                        fr.removeEventListener(name, reDispatch);
                    });
                    __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '1053:1108');
                    fr.removeEventListener('loadend', removeEventListeners);
                }
                __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '1121:1207');
                Basic.each(events, function (name) {
                    __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '1162:1199');
                    fr.addEventListener(name, reDispatch);
                });
                __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '1213:1265');
                fr.addEventListener('loadend', removeEventListeners);
            }());
            __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '1280:1356');
            if (Basic.typeOf(fr[op]) === 'function') {
                __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '1327:1351');
                fr[op](blob.getSource());
            }
        };
    }
    __$coverCall('src/javascript/runtime/html5/file/FileReader.js', '1368:1411');
    return extensions.FileReader = FileReader;
});

// Included from: src/javascript/runtime/html5/xhr/XMLHttpRequest.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "/**\n * XMLHttpRequest.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true, laxcomma:true */\n/*global define:true, unescape:true */\n\n/**\n@class moxie/runtime/html5/xhr/XMLHttpRequest\n@private\n*/\ndefine(\"moxie/runtime/html5/xhr/XMLHttpRequest\", [\n\t\"moxie/runtime/html5/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/file/File\",\n\t\"moxie/file/Blob\",\n\t\"moxie/xhr/FormData\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/core/utils/Env\",\n\t\"moxie/core/JSON\"\n], function(extensions, Basic, File, Blob, FormData, x, Env, parseJSON) {\n\t\n\tfunction XMLHttpRequest() {\n\t\tvar self = this, _xhr2, filename;\n\n\t\tBasic.extend(this, {\n\t\t\tsend: function(meta, data) {\n\t\t\t\tvar target = this\n\t\t\t\t, mustSendAsBinary = false\n\t\t\t\t, fd\n\t\t\t\t;\n\n\t\t\t\t// Gecko 2/5/6 can't send blob in FormData: https://bugzilla.mozilla.org/show_bug.cgi?id=649150\n\t\t\t\t// Android browsers (default one and Dolphin) seem to have the same issue, see: #613\n\t\t\t\tvar blob, fr\n\t\t\t\t, isGecko2_5_6 = (Env.browser === 'Mozilla' && Env.version >= 4 && Env.version < 7)\n\t\t\t\t, isAndroidBrowser = Env.browser === 'Android Browser'\n\t\t\t\t;\n\t\t\t\t// here we go... ugly fix for ugly bug\n\t\t\t\tif ((isGecko2_5_6 || isAndroidBrowser) && data instanceof FormData && data.hasBlob() && !data.getBlob().isDetached()) {\n\t\t\t\t\t// get original blob\n\t\t\t\t\tblob = data.getBlob().getSource();\n\t\t\t\t\t// only Blobs have problem, Files seem ok\n\t\t\t\t\tif (blob instanceof window.Blob && window.FileReader) {\n\t\t\t\t\t\t// preload blob in memory to be sent as binary string\n\t\t\t\t\t\tfr = new window.FileReader();\n\t\t\t\t\t\tfr.onload = function() {\n\t\t\t\t\t\t\t// overwrite original blob\n\t\t\t\t\t\t\tdata.append(data.getBlobName(), new Blob(null, {\n\t\t\t\t\t\t\t\ttype: blob.type,\n\t\t\t\t\t\t\t\tdata: fr.result\n\t\t\t\t\t\t\t}));\n\t\t\t\t\t\t\t// invoke send operation again\n\t\t\t\t\t\t\tself.send.call(target, meta, data);\n\t\t\t\t\t\t};\n\t\t\t\t\t\tfr.readAsBinaryString(blob);\n\t\t\t\t\t\treturn; // do not proceed further\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\t_xhr2 = new window.XMLHttpRequest();\n\n\t\t\t\t// extract file name\n\t\t\t\tfilename = meta.url.replace(/^.+?\\/([\\w\\-\\.]+)$/, '$1').toLowerCase();\n\n\t\t\t\t_xhr2.open(meta.method, meta.url, meta.async, meta.user, meta.password);\n\n\t\t\t\t// set request headers\n\t\t\t\tif (!Basic.isEmptyObj(meta.headers)) {\n\t\t\t\t\tBasic.each(meta.headers, function(value, header) {\n\t\t\t\t\t\t_xhr2.setRequestHeader(header, value);\n\t\t\t\t\t});\n\t\t\t\t}\n\n\t\t\t\t// request response type\n\t\t\t\tif (\"\" !== meta.responseType) {\n\t\t\t\t\tif ('json' === meta.responseType && !Env.can('return_response_type', 'json')) { // we can fake this one\n\t\t\t\t\t\t_xhr2.responseType = 'text';\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_xhr2.responseType = meta.responseType;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\t// attach event handlers\n\t\t\t\t(function() {\n\t\t\t\t\tvar events = ['loadstart', 'progress', 'abort', 'error', 'load', 'timeout'];\n\n\t\t\t\t\tfunction reDispatch(e) {\n\t\t\t\t\t\ttarget.trigger(e);\n\t\t\t\t\t}\n\n\t\t\t\t\tfunction dispatchUploadProgress(e) {\n\t\t\t\t\t\ttarget.trigger({\n\t\t\t\t\t\t\ttype: 'UploadProgress',\n\t\t\t\t\t\t\tloaded: e.loaded,\n\t\t\t\t\t\t\ttotal: e.total\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\n\t\t\t\t\tfunction removeEventListeners() {\n\t\t\t\t\t\tBasic.each(events, function(name) {\n\t\t\t\t\t\t\t_xhr2.removeEventListener(name, reDispatch);\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\t_xhr2.removeEventListener('loadend', removeEventListeners);\n\n\t\t\t\t\t\tif (_xhr2.upload) {\n\t\t\t\t\t\t\t_xhr2.upload.removeEventListener('progress', dispatchUploadProgress);\n\t\t\t\t\t\t}\n\t\t\t\t\t\t_xhr2 = null;\n\t\t\t\t\t}\n\n\t\t\t\t\tBasic.each(events, function(name) {\n\t\t\t\t\t\t_xhr2.addEventListener(name, reDispatch);\n\t\t\t\t\t});\n\n\t\t\t\t\tif (_xhr2.upload) {\n\t\t\t\t\t\t_xhr2.upload.addEventListener('progress', dispatchUploadProgress);\n\t\t\t\t\t}\n\n\t\t\t\t\t_xhr2.addEventListener('loadend', removeEventListeners);\n\t\t\t\t}());\n\n\n\t\t\t\t// prepare data to be sent and convert if required\n\t\t\t\tif (data instanceof Blob) {\n\t\t\t\t\tif (data.isDetached()) {\n\t\t\t\t\t\tmustSendAsBinary = true;\n\t\t\t\t\t}\n\t\t\t\t\tdata = data.getSource();\n\t\t\t\t} else if (data instanceof FormData) {\n\t\t\t\t\tif (data.hasBlob() && data.getBlob().isDetached()) {\n\t\t\t\t\t\t// ... and here too\n\t\t\t\t\t\tdata = _prepareMultipart.call(target, data);\n\t\t\t\t\t\tmustSendAsBinary = true;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tfd = new window.FormData();\n\n\t\t\t\t\t\tdata.each(function(value, name) {\n\t\t\t\t\t\t\tif (value instanceof Blob) {\n\t\t\t\t\t\t\t\tfd.append(name, value.getSource());\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tfd.append(name, value);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t});\n\t\t\t\t\t\tdata = fd;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\t// send ...\n\t\t\t\tif (!mustSendAsBinary) {\n\t\t\t\t\t_xhr2.send(data);\n\t\t\t\t} else {\n\t\t\t\t\tif (_xhr2.sendAsBinary) { // Gecko\n\t\t\t\t\t\t_xhr2.sendAsBinary(data);\n\t\t\t\t\t} else { // other browsers having support for typed arrays\n\t\t\t\t\t\t(function() {\n\t\t\t\t\t\t\t// mimic Gecko's sendAsBinary\n\t\t\t\t\t\t\tvar ui8a = new Uint8Array(data.length);\n\t\t\t\t\t\t\tfor (var i = 0; i < data.length; i++) {\n\t\t\t\t\t\t\t\tui8a[i] = (data.charCodeAt(i) & 0xff);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t_xhr2.send(ui8a.buffer);\n\t\t\t\t\t\t}());\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tgetStatus: function() {\n\t\t\t\ttry {\n\t\t\t\t\tif (_xhr2) {\n\t\t\t\t\t\treturn _xhr2.status;\n\t\t\t\t\t}\n\t\t\t\t} catch(ex) {}\n\t\t\t},\n\n\t\t\tgetResponse: function(responseType) {\n\t\t\t\tvar I = this.getRuntime();\n\n\t\t\t\ttry {\n\t\t\t\t\tif (_xhr2) {\n\t\t\t\t\t\tif ('blob' === responseType) {\n\t\t\t\t\t\t\tvar file = new File(I.uid, _xhr2.response);\n\t\t\t\t\t\t\tfile.name = filename;\n\t\t\t\t\t\t\treturn file;\n\t\t\t\t\t\t} else if ('json' === responseType && !Env.can('return_response_type', 'json')) {\n\t\t\t\t\t\t\tif (_xhr2.status === 200) {\n\t\t\t\t\t\t\t\treturn parseJSON(_xhr2.response);\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\treturn null;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\treturn _xhr2.response;\n\t\t\t\t\t}\n\t\t\t\t} catch(ex) {}\n\t\t\t},\n\n\t\t\tabort: function() {\n\t\t\t\tif (_xhr2) {\n\t\t\t\t\t_xhr2.abort();\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tdestroy: function() {\n\t\t\t\tself = filename = null;\n\t\t\t}\n\t\t});\n\n\t\tfunction _prepareMultipart(fd) {\n\t\t\tvar boundary = '----moxieboundary' + new Date().getTime()\n\t\t\t, dashdash = '--'\n\t\t\t, crlf = '\\r\\n'\n\t\t\t, multipart = ''\n\t\t\t, I = this.getRuntime()\n\t\t\t;\n\n\t\t\tif (!I.can('send_binary_string')) {\n\t\t\t\tthrow new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);\n\t\t\t}\n\n\t\t\t_xhr2.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);\n\n\t\t\t// append multipart parameters\n\t\t\tfd.each(function(value, name) {\n\t\t\t\t// Firefox 3.6 failed to convert multibyte characters to UTF-8 in sendAsBinary(), \n\t\t\t\t// so we try it here ourselves with: unescape(encodeURIComponent(value))\n\t\t\t\tif (value instanceof Blob) {\n\t\t\t\t\t// Build RFC2388 blob\n\t\t\t\t\tmultipart += dashdash + boundary + crlf +\n\t\t\t\t\t\t'Content-Disposition: form-data; name=\"' + name + '\"; filename=\"' + unescape(encodeURIComponent(value.name || 'blob')) + '\"' + crlf +\n\t\t\t\t\t\t'Content-Type: ' + value.type + crlf + crlf +\n\t\t\t\t\t\tvalue.getSource() + crlf;\n\t\t\t\t} else {\n\t\t\t\t\tmultipart += dashdash + boundary + crlf +\n\t\t\t\t\t\t'Content-Disposition: form-data; name=\"' + name + '\"' + crlf + crlf +\n\t\t\t\t\t\tunescape(encodeURIComponent(value)) + crlf;\n\t\t\t\t}\n\t\t\t});\n\n\t\t\tmultipart += dashdash + boundary + dashdash + crlf;\n\n\t\t\treturn multipart;\n\t\t}\n\t}\n\n\treturn (extensions.XMLHttpRequest = XMLHttpRequest);\n});");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "445:6998");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "765:6939");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "6943:6994");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "795:827");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "832:5703");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5708:6936");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "889:950");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "951:951");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "1147:1310");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "1311:1311");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "1360:2108");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2115:2150");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2182:2251");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2258:2329");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2363:2516");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2552:2799");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2835:3781");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3844:4443");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4466:4925");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "1511:1544");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "1598:2102");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "1720:1748");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "1756:2020");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2028:2055");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2063:2069");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "1822:1930");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "1977:2011");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2407:2510");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2464:2501");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2589:2793");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2699:2726");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2748:2786");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2854:2929");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2937:2992");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3000:3153");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3161:3503");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3511:3602");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3610:3708");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3716:3771");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "2968:2985");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3043:3146");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3201:3297");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3306:3364");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3373:3476");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3484:3496");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3244:3287");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3400:3468");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3553:3593");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3636:3701");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3877:3938");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3945:3968");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "3908:3931");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4018:4437");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4103:4146");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4154:4177");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4199:4225");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4234:4413");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4421:4430");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4275:4403");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4312:4346");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4372:4394");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4496:4512");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4532:4919");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4573:4597");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4669:4912");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4727:4765");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4774:4868");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4877:4900");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4822:4859");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4965:5040");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4976:5021");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "4995:5014");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5094:5119");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5126:5559");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5137:5540");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5156:5504");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5512:5533");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5194:5236");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5245:5265");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5274:5285");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5382:5496");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5418:5450");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5476:5487");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5595:5632");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5613:5626");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5670:5692");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5744:5891");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5892:5892");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5898:6001");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "6007:6090");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "6130:6854");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "6860:6910");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "6916:6932");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "5938:5996");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "6330:6847");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "6391:6655");
__$coverInitRange("src/javascript/runtime/html5/xhr/XMLHttpRequest.js", "6675:6841");
__$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '445:6998');
define('moxie/runtime/html5/xhr/XMLHttpRequest', [
    'moxie/runtime/html5/Runtime',
    'moxie/core/utils/Basic',
    'moxie/file/File',
    'moxie/file/Blob',
    'moxie/xhr/FormData',
    'moxie/core/Exceptions',
    'moxie/core/utils/Env',
    'moxie/core/JSON'
], function (extensions, Basic, File, Blob, FormData, x, Env, parseJSON) {
    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '765:6939');
    function XMLHttpRequest() {
        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '795:827');
        var self = this, _xhr2, filename;
        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '832:5703');
        Basic.extend(this, {
            send: function (meta, data) {
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '889:950');
                var target = this, mustSendAsBinary = false, fd;
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '951:951');
                ;
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '1147:1310');
                var blob, fr, isGecko2_5_6 = Env.browser === 'Mozilla' && Env.version >= 4 && Env.version < 7, isAndroidBrowser = Env.browser === 'Android Browser';
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '1311:1311');
                ;
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '1360:2108');
                if ((isGecko2_5_6 || isAndroidBrowser) && data instanceof FormData && data.hasBlob() && !data.getBlob().isDetached()) {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '1511:1544');
                    blob = data.getBlob().getSource();
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '1598:2102');
                    if (blob instanceof window.Blob && window.FileReader) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '1720:1748');
                        fr = new window.FileReader();
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '1756:2020');
                        fr.onload = function () {
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '1822:1930');
                            data.append(data.getBlobName(), new Blob(null, {
                                type: blob.type,
                                data: fr.result
                            }));
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '1977:2011');
                            self.send.call(target, meta, data);
                        };
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2028:2055');
                        fr.readAsBinaryString(blob);
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2063:2069');
                        return;
                    }
                }
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2115:2150');
                _xhr2 = new window.XMLHttpRequest();
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2182:2251');
                filename = meta.url.replace(/^.+?\/([\w\-\.]+)$/, '$1').toLowerCase();
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2258:2329');
                _xhr2.open(meta.method, meta.url, meta.async, meta.user, meta.password);
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2363:2516');
                if (!Basic.isEmptyObj(meta.headers)) {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2407:2510');
                    Basic.each(meta.headers, function (value, header) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2464:2501');
                        _xhr2.setRequestHeader(header, value);
                    });
                }
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2552:2799');
                if ('' !== meta.responseType) {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2589:2793');
                    if ('json' === meta.responseType && !Env.can('return_response_type', 'json')) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2699:2726');
                        _xhr2.responseType = 'text';
                    } else {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2748:2786');
                        _xhr2.responseType = meta.responseType;
                    }
                }
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2835:3781');
                (function () {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2854:2929');
                    var events = [
                            'loadstart',
                            'progress',
                            'abort',
                            'error',
                            'load',
                            'timeout'
                        ];
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2937:2992');
                    function reDispatch(e) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '2968:2985');
                        target.trigger(e);
                    }
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3000:3153');
                    function dispatchUploadProgress(e) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3043:3146');
                        target.trigger({
                            type: 'UploadProgress',
                            loaded: e.loaded,
                            total: e.total
                        });
                    }
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3161:3503');
                    function removeEventListeners() {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3201:3297');
                        Basic.each(events, function (name) {
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3244:3287');
                            _xhr2.removeEventListener(name, reDispatch);
                        });
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3306:3364');
                        _xhr2.removeEventListener('loadend', removeEventListeners);
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3373:3476');
                        if (_xhr2.upload) {
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3400:3468');
                            _xhr2.upload.removeEventListener('progress', dispatchUploadProgress);
                        }
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3484:3496');
                        _xhr2 = null;
                    }
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3511:3602');
                    Basic.each(events, function (name) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3553:3593');
                        _xhr2.addEventListener(name, reDispatch);
                    });
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3610:3708');
                    if (_xhr2.upload) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3636:3701');
                        _xhr2.upload.addEventListener('progress', dispatchUploadProgress);
                    }
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3716:3771');
                    _xhr2.addEventListener('loadend', removeEventListeners);
                }());
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3844:4443');
                if (data instanceof Blob) {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3877:3938');
                    if (data.isDetached()) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3908:3931');
                        mustSendAsBinary = true;
                    }
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '3945:3968');
                    data = data.getSource();
                } else if (data instanceof FormData) {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4018:4437');
                    if (data.hasBlob() && data.getBlob().isDetached()) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4103:4146');
                        data = _prepareMultipart.call(target, data);
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4154:4177');
                        mustSendAsBinary = true;
                    } else {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4199:4225');
                        fd = new window.FormData();
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4234:4413');
                        data.each(function (value, name) {
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4275:4403');
                            if (value instanceof Blob) {
                                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4312:4346');
                                fd.append(name, value.getSource());
                            } else {
                                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4372:4394');
                                fd.append(name, value);
                            }
                        });
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4421:4430');
                        data = fd;
                    }
                }
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4466:4925');
                if (!mustSendAsBinary) {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4496:4512');
                    _xhr2.send(data);
                } else {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4532:4919');
                    if (_xhr2.sendAsBinary) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4573:4597');
                        _xhr2.sendAsBinary(data);
                    } else {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4669:4912');
                        (function () {
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4727:4765');
                            var ui8a = new Uint8Array(data.length);
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4774:4868');
                            for (var i = 0; i < data.length; i++) {
                                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4822:4859');
                                ui8a[i] = data.charCodeAt(i) & 255;
                            }
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4877:4900');
                            _xhr2.send(ui8a.buffer);
                        }());
                    }
                }
            },
            getStatus: function () {
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4965:5040');
                try {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4976:5021');
                    if (_xhr2) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '4995:5014');
                        return _xhr2.status;
                    }
                } catch (ex) {
                }
            },
            getResponse: function (responseType) {
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5094:5119');
                var I = this.getRuntime();
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5126:5559');
                try {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5137:5540');
                    if (_xhr2) {
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5156:5504');
                        if ('blob' === responseType) {
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5194:5236');
                            var file = new File(I.uid, _xhr2.response);
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5245:5265');
                            file.name = filename;
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5274:5285');
                            return file;
                        } else if ('json' === responseType && !Env.can('return_response_type', 'json')) {
                            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5382:5496');
                            if (_xhr2.status === 200) {
                                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5418:5450');
                                return parseJSON(_xhr2.response);
                            } else {
                                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5476:5487');
                                return null;
                            }
                        }
                        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5512:5533');
                        return _xhr2.response;
                    }
                } catch (ex) {
                }
            },
            abort: function () {
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5595:5632');
                if (_xhr2) {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5613:5626');
                    _xhr2.abort();
                }
            },
            destroy: function () {
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5670:5692');
                self = filename = null;
            }
        });
        __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5708:6936');
        function _prepareMultipart(fd) {
            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5744:5891');
            var boundary = '----moxieboundary' + new Date().getTime(), dashdash = '--', crlf = '\r\n', multipart = '', I = this.getRuntime();
            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5892:5892');
            ;
            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5898:6001');
            if (!I.can('send_binary_string')) {
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '5938:5996');
                throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
            }
            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '6007:6090');
            _xhr2.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '6130:6854');
            fd.each(function (value, name) {
                __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '6330:6847');
                if (value instanceof Blob) {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '6391:6655');
                    multipart += dashdash + boundary + crlf + 'Content-Disposition: form-data; name="' + name + '"; filename="' + unescape(encodeURIComponent(value.name || 'blob')) + '"' + crlf + 'Content-Type: ' + value.type + crlf + crlf + value.getSource() + crlf;
                } else {
                    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '6675:6841');
                    multipart += dashdash + boundary + crlf + 'Content-Disposition: form-data; name="' + name + '"' + crlf + crlf + unescape(encodeURIComponent(value)) + crlf;
                }
            });
            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '6860:6910');
            multipart += dashdash + boundary + dashdash + crlf;
            __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '6916:6932');
            return multipart;
        }
    }
    __$coverCall('src/javascript/runtime/html5/xhr/XMLHttpRequest.js', '6943:6994');
    return extensions.XMLHttpRequest = XMLHttpRequest;
});

// Included from: src/javascript/runtime/html5/utils/BinaryReader.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/utils/BinaryReader.js", "/**\n * BinaryReader.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/utils/BinaryReader\n@private\n*/\ndefine(\"moxie/runtime/html5/utils/BinaryReader\", [], function() {\n\treturn function() {\n\t\tvar II = false, bin;\n\n\t\t// Private functions\n\t\tfunction read(idx, size) {\n\t\t\tvar mv = II ? 0 : -8 * (size - 1), sum = 0, i;\n\n\t\t\tfor (i = 0; i < size; i++) {\n\t\t\t\tsum |= (bin.charCodeAt(idx + i) << Math.abs(mv + i*8));\n\t\t\t}\n\n\t\t\treturn sum;\n\t\t}\n\n\t\tfunction putstr(segment, idx, length) {\n\t\t\tlength = arguments.length === 3 ? length : bin.length - idx - 1;\n\t\t\tbin = bin.substr(0, idx) + segment + bin.substr(length + idx);\n\t\t}\n\n\t\tfunction write(idx, num, size) {\n\t\t\tvar str = '', mv = II ? 0 : -8 * (size - 1), i;\n\n\t\t\tfor (i = 0; i < size; i++) {\n\t\t\t\tstr += String.fromCharCode((num >> Math.abs(mv + i*8)) & 255);\n\t\t\t}\n\n\t\t\tputstr(str, idx, size);\n\t\t}\n\n\t\t// Public functions\n\t\treturn {\n\t\t\tII: function(order) {\n\t\t\t\tif (order === undefined) {\n\t\t\t\t\treturn II;\n\t\t\t\t} else {\n\t\t\t\t\tII = order;\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tinit: function(binData) {\n\t\t\t\tII = false;\n\t\t\t\tbin = binData;\n\t\t\t},\n\n\t\t\tSEGMENT: function(idx, length, segment) {\n\t\t\t\tswitch (arguments.length) {\n\t\t\t\t\tcase 1:\n\t\t\t\t\t\treturn bin.substr(idx, bin.length - idx - 1);\n\t\t\t\t\tcase 2:\n\t\t\t\t\t\treturn bin.substr(idx, length);\n\t\t\t\t\tcase 3:\n\t\t\t\t\t\tputstr(segment, idx, length);\n\t\t\t\t\t\tbreak;\n\t\t\t\t\tdefault: return bin;\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tBYTE: function(idx) {\n\t\t\t\treturn read(idx, 1);\n\t\t\t},\n\n\t\t\tSHORT: function(idx) {\n\t\t\t\treturn read(idx, 2);\n\t\t\t},\n\n\t\t\tLONG: function(idx, num) {\n\t\t\t\tif (num === undefined) {\n\t\t\t\t\treturn read(idx, 4);\n\t\t\t\t} else {\n\t\t\t\t\twrite(idx, num, 4);\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tSLONG: function(idx) { // 2's complement notation\n\t\t\t\tvar num = read(idx, 4);\n\n\t\t\t\treturn (num > 2147483647 ? num - 4294967296 : num);\n\t\t\t},\n\n\t\t\tSTRING: function(idx, size) {\n\t\t\t\tvar str = '';\n\n\t\t\t\tfor (size += idx; idx < size; idx++) {\n\t\t\t\t\tstr += String.fromCharCode(read(idx, 1));\n\t\t\t\t}\n\n\t\t\t\treturn str;\n\t\t\t}\n\t\t};\n\t};\n});\n");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "413:2240");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "480:2236");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "502:521");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "549:742");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "747:923");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "928:1147");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1174:2232");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "579:624");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "630:722");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "728:738");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "663:717");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "790:853");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "858:919");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "964:1010");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1016:1115");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1121:1143");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1049:1110");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1212:1289");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1244:1253");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1273:1283");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1331:1341");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1347:1360");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1418:1654");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1465:1509");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1530:1560");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1581:1609");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1617:1622");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1638:1648");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1692:1711");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1750:1769");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1812:1905");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1842:1861");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1881:1899");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "1971:1993");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "2000:2050");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "2096:2108");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "2115:2205");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "2212:2222");
__$coverInitRange("src/javascript/runtime/html5/utils/BinaryReader.js", "2159:2199");
__$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '413:2240');
define('moxie/runtime/html5/utils/BinaryReader', [], function () {
    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '480:2236');
    return function () {
        __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '502:521');
        var II = false, bin;
        __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '549:742');
        function read(idx, size) {
            __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '579:624');
            var mv = II ? 0 : -8 * (size - 1), sum = 0, i;
            __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '630:722');
            for (i = 0; i < size; i++) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '663:717');
                sum |= bin.charCodeAt(idx + i) << Math.abs(mv + i * 8);
            }
            __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '728:738');
            return sum;
        }
        __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '747:923');
        function putstr(segment, idx, length) {
            __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '790:853');
            length = arguments.length === 3 ? length : bin.length - idx - 1;
            __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '858:919');
            bin = bin.substr(0, idx) + segment + bin.substr(length + idx);
        }
        __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '928:1147');
        function write(idx, num, size) {
            __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '964:1010');
            var str = '', mv = II ? 0 : -8 * (size - 1), i;
            __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1016:1115');
            for (i = 0; i < size; i++) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1049:1110');
                str += String.fromCharCode(num >> Math.abs(mv + i * 8) & 255);
            }
            __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1121:1143');
            putstr(str, idx, size);
        }
        __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1174:2232');
        return {
            II: function (order) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1212:1289');
                if (order === undefined) {
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1244:1253');
                    return II;
                } else {
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1273:1283');
                    II = order;
                }
            },
            init: function (binData) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1331:1341');
                II = false;
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1347:1360');
                bin = binData;
            },
            SEGMENT: function (idx, length, segment) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1418:1654');
                switch (arguments.length) {
                case 1:
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1465:1509');
                    return bin.substr(idx, bin.length - idx - 1);
                case 2:
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1530:1560');
                    return bin.substr(idx, length);
                case 3:
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1581:1609');
                    putstr(segment, idx, length);
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1617:1622');
                    break;
                default:
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1638:1648');
                    return bin;
                }
            },
            BYTE: function (idx) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1692:1711');
                return read(idx, 1);
            },
            SHORT: function (idx) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1750:1769');
                return read(idx, 2);
            },
            LONG: function (idx, num) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1812:1905');
                if (num === undefined) {
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1842:1861');
                    return read(idx, 4);
                } else {
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1881:1899');
                    write(idx, num, 4);
                }
            },
            SLONG: function (idx) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '1971:1993');
                var num = read(idx, 4);
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '2000:2050');
                return num > 2147483647 ? num - 4294967296 : num;
            },
            STRING: function (idx, size) {
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '2096:2108');
                var str = '';
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '2115:2205');
                for (size += idx; idx < size; idx++) {
                    __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '2159:2199');
                    str += String.fromCharCode(read(idx, 1));
                }
                __$coverCall('src/javascript/runtime/html5/utils/BinaryReader.js', '2212:2222');
                return str;
            }
        };
    };
});

// Included from: src/javascript/runtime/html5/image/JPEGHeaders.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/image/JPEGHeaders.js", "/**\n * JPEGHeaders.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, sub:false */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/image/JPEGHeaders\n@private\n*/\ndefine(\"moxie/runtime/html5/image/JPEGHeaders\", [\n\t\"moxie/runtime/html5/utils/BinaryReader\"\n], function(BinaryReader) {\n\t\n\treturn function JPEGHeaders(data) {\n\t\tvar markers = {\n\t\t\t\t0xFFE1: {\n\t\t\t\t\tapp: 'EXIF',\n\t\t\t\t\tname: 'APP1',\n\t\t\t\t\tsignature: \"Exif\\0\"\n\t\t\t\t},\n\t\t\t\t0xFFE2: {\n\t\t\t\t\tapp: 'ICC',\n\t\t\t\t\tname: 'APP2',\n\t\t\t\t\tsignature: \"ICC_PROFILE\\0\"\n\t\t\t\t},\n\t\t\t\t0xFFED: {\n\t\t\t\t\tapp: 'IPTC',\n\t\t\t\t\tname: 'APP13',\n\t\t\t\t\tsignature: \"Photoshop 3.0\\0\"\n\t\t\t\t}\n\t\t\t},\n\t\t\theaders = [], read, idx, marker, length = 0, limit;\n\n\t\tread = new BinaryReader();\n\t\tread.init(data);\n\n\t\t// Check if data is jpeg\n\t\tif (read.SHORT(0) !== 0xFFD8) {\n\t\t\treturn;\n\t\t}\n\n\t\tidx = 2;\n\t\tlimit = Math.min(1048576, data.length);\n\n\t\twhile (idx <= limit) {\n\t\t\tmarker = read.SHORT(idx);\n\n\t\t\t// omit RST (restart) markers\n\t\t\tif (marker >= 0xFFD0 && marker <= 0xFFD7) {\n\t\t\t\tidx += 2;\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\t// no headers allowed after SOS marker\n\t\t\tif (marker === 0xFFDA || marker === 0xFFD9) {\n\t\t\t\tbreak;\n\t\t\t}\n\n\t\t\tlength = read.SHORT(idx + 2) + 2;\n\n\t\t\tif (markers[marker] && read.STRING(idx + 4, markers[marker].signature.length) === markers[marker].signature) {\n\t\t\t\theaders.push({\n\t\t\t\t\thex: marker,\n\t\t\t\t\tapp: markers[marker].app.toUpperCase(),\n\t\t\t\t\tname: markers[marker].name.toUpperCase(),\n\t\t\t\t\tstart: idx,\n\t\t\t\t\tlength: length,\n\t\t\t\t\tsegment: read.SEGMENT(idx, length)\n\t\t\t\t});\n\t\t\t}\n\t\t\tidx += length;\n\t\t}\n\n\t\tread.init(null); // free memory\n\n\t\treturn {\n\t\t\theaders: headers,\n\n\t\t\trestore: function(data) {\n\t\t\t\tread.init(data);\n\n\t\t\t\tvar max, i;\n\n\t\t\t\t// Check if data is jpeg\n\t\t\t\tvar jpegHeaders = new JPEGHeaders(data);\n\n\t\t\t\tif (!jpegHeaders.headers) {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t\t// Delete any existing headers that need to be replaced\n\t\t\t\tfor (i = jpegHeaders.headers.length; i > 0; i--) {\n\t\t\t\t\tvar hdr = jpegHeaders.headers[i - 1];\n\t\t\t\t\tread.SEGMENT(hdr.start, hdr.length, '');\n\t\t\t\t}\n\t\t\t\tjpegHeaders.purge();\n\n\t\t\t\tidx = read.SHORT(2) == 0xFFE0 ? 4 + read.SHORT(4) : 2;\n\n\t\t\t\tfor (i = 0, max = headers.length; i < max; i++) {\n\t\t\t\t\tread.SEGMENT(idx, 0, headers[i].segment);\n\t\t\t\t\tidx += headers[i].length;\n\t\t\t\t}\n\n\t\t\t\tdata = read.SEGMENT();\n\t\t\t\tread.init(null);\n\t\t\t\treturn data;\n\t\t\t},\n\n\t\t\tget: function(app) {\n\t\t\t\tvar array = [];\n\n\t\t\t\tfor (var i = 0, max = headers.length; i < max; i++) {\n\t\t\t\t\tif (headers[i].app === app.toUpperCase()) {\n\t\t\t\t\t\tarray.push(headers[i].segment);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn array;\n\t\t\t},\n\n\t\t\tset: function(app, segment) {\n\t\t\t\tvar array = [], i, ii, max;\n\n\t\t\t\tif (typeof(segment) === 'string') {\n\t\t\t\t\tarray.push(segment);\n\t\t\t\t} else {\n\t\t\t\t\tarray = segment;\n\t\t\t\t}\n\n\t\t\t\tfor (i = ii = 0, max = headers.length; i < max; i++) {\n\t\t\t\t\tif (headers[i].app === app.toUpperCase()) {\n\t\t\t\t\t\theaders[i].segment = array[ii];\n\t\t\t\t\t\theaders[i].length = array[ii].length;\n\t\t\t\t\t\tii++;\n\t\t\t\t\t}\n\t\t\t\t\tif (ii >= array.length) {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tpurge: function() {\n\t\t\t\theaders = [];\n\t\t\t\tread.init(null);\n\t\t\t\tread = null;\n\t\t\t}\n\t\t};\n\t};\n});\n");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "421:3322");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "544:3318");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "582:921");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "926:951");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "955:970");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1002:1047");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1052:1059");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1063:1101");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1106:1773");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1778:1793");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1813:3314");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1037:1043");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1132:1156");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1195:1270");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1318:1378");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1384:1416");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1422:1751");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1756:1769");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1243:1251");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1257:1265");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1368:1373");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1537:1746");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1877:1892");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1899:1909");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1945:1984");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "1991:2042");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2109:2253");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2259:2278");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2285:2338");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2345:2477");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2484:2505");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2511:2526");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2532:2543");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2024:2036");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2165:2201");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2208:2247");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2400:2440");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2447:2471");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2580:2594");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2601:2753");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2759:2771");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2660:2747");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2710:2740");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2817:2843");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2850:2951");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2958:3218");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2891:2910");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "2930:2945");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "3018:3161");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "3168:3212");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "3068:3098");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "3106:3142");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "3150:3154");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "3200:3205");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "3254:3266");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "3272:3287");
__$coverInitRange("src/javascript/runtime/html5/image/JPEGHeaders.js", "3293:3304");
__$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '421:3322');
define('moxie/runtime/html5/image/JPEGHeaders', ['moxie/runtime/html5/utils/BinaryReader'], function (BinaryReader) {
    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '544:3318');
    return function JPEGHeaders(data) {
        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '582:921');
        var markers = {
                65505: {
                    app: 'EXIF',
                    name: 'APP1',
                    signature: 'Exif\0'
                },
                65506: {
                    app: 'ICC',
                    name: 'APP2',
                    signature: 'ICC_PROFILE\0'
                },
                65517: {
                    app: 'IPTC',
                    name: 'APP13',
                    signature: 'Photoshop 3.0\0'
                }
            }, headers = [], read, idx, marker, length = 0, limit;
        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '926:951');
        read = new BinaryReader();
        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '955:970');
        read.init(data);
        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1002:1047');
        if (read.SHORT(0) !== 65496) {
            __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1037:1043');
            return;
        }
        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1052:1059');
        idx = 2;
        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1063:1101');
        limit = Math.min(1048576, data.length);
        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1106:1773');
        while (idx <= limit) {
            __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1132:1156');
            marker = read.SHORT(idx);
            __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1195:1270');
            if (marker >= 65488 && marker <= 65495) {
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1243:1251');
                idx += 2;
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1257:1265');
                continue;
            }
            __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1318:1378');
            if (marker === 65498 || marker === 65497) {
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1368:1373');
                break;
            }
            __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1384:1416');
            length = read.SHORT(idx + 2) + 2;
            __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1422:1751');
            if (markers[marker] && read.STRING(idx + 4, markers[marker].signature.length) === markers[marker].signature) {
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1537:1746');
                headers.push({
                    hex: marker,
                    app: markers[marker].app.toUpperCase(),
                    name: markers[marker].name.toUpperCase(),
                    start: idx,
                    length: length,
                    segment: read.SEGMENT(idx, length)
                });
            }
            __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1756:1769');
            idx += length;
        }
        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1778:1793');
        read.init(null);
        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1813:3314');
        return {
            headers: headers,
            restore: function (data) {
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1877:1892');
                read.init(data);
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1899:1909');
                var max, i;
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1945:1984');
                var jpegHeaders = new JPEGHeaders(data);
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '1991:2042');
                if (!jpegHeaders.headers) {
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2024:2036');
                    return false;
                }
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2109:2253');
                for (i = jpegHeaders.headers.length; i > 0; i--) {
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2165:2201');
                    var hdr = jpegHeaders.headers[i - 1];
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2208:2247');
                    read.SEGMENT(hdr.start, hdr.length, '');
                }
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2259:2278');
                jpegHeaders.purge();
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2285:2338');
                idx = read.SHORT(2) == 65504 ? 4 + read.SHORT(4) : 2;
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2345:2477');
                for (i = 0, max = headers.length; i < max; i++) {
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2400:2440');
                    read.SEGMENT(idx, 0, headers[i].segment);
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2447:2471');
                    idx += headers[i].length;
                }
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2484:2505');
                data = read.SEGMENT();
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2511:2526');
                read.init(null);
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2532:2543');
                return data;
            },
            get: function (app) {
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2580:2594');
                var array = [];
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2601:2753');
                for (var i = 0, max = headers.length; i < max; i++) {
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2660:2747');
                    if (headers[i].app === app.toUpperCase()) {
                        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2710:2740');
                        array.push(headers[i].segment);
                    }
                }
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2759:2771');
                return array;
            },
            set: function (app, segment) {
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2817:2843');
                var array = [], i, ii, max;
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2850:2951');
                if (typeof segment === 'string') {
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2891:2910');
                    array.push(segment);
                } else {
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2930:2945');
                    array = segment;
                }
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '2958:3218');
                for (i = ii = 0, max = headers.length; i < max; i++) {
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '3018:3161');
                    if (headers[i].app === app.toUpperCase()) {
                        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '3068:3098');
                        headers[i].segment = array[ii];
                        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '3106:3142');
                        headers[i].length = array[ii].length;
                        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '3150:3154');
                        ii++;
                    }
                    __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '3168:3212');
                    if (ii >= array.length) {
                        __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '3200:3205');
                        break;
                    }
                }
            },
            purge: function () {
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '3254:3266');
                headers = [];
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '3272:3287');
                read.init(null);
                __$coverCall('src/javascript/runtime/html5/image/JPEGHeaders.js', '3293:3304');
                read = null;
            }
        };
    };
});

// Included from: src/javascript/runtime/html5/image/ExifParser.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/image/ExifParser.js", "/**\n * ExifParser.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, sub:false */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/image/ExifParser\n@private\n*/\ndefine(\"moxie/runtime/html5/image/ExifParser\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/runtime/html5/utils/BinaryReader\"\n], function(Basic, BinaryReader) {\n\t\n\treturn function ExifParser() {\n\t\t// Private ExifParser fields\n\t\tvar data, tags, Tiff, offsets = {}, tagDescs;\n\n\t\tdata = new BinaryReader();\n\n\t\ttags = {\n\t\t\ttiff : {\n\t\t\t\t/*\n\t\t\t\tThe image orientation viewed in terms of rows and columns.\n\n\t\t\t\t1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.\n\t\t\t\t2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.\n\t\t\t\t3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.\n\t\t\t\t4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.\n\t\t\t\t5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.\n\t\t\t\t6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.\n\t\t\t\t7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.\n\t\t\t\t8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.\n\t\t\t\t*/\n\t\t\t\t0x0112: 'Orientation',\n\t\t\t\t0x010E: 'ImageDescription',\n\t\t\t\t0x010F: 'Make',\n\t\t\t\t0x0110: 'Model',\n\t\t\t\t0x0131: 'Software',\n\t\t\t\t0x8769: 'ExifIFDPointer',\n\t\t\t\t0x8825:\t'GPSInfoIFDPointer'\n\t\t\t},\n\t\t\texif : {\n\t\t\t\t0x9000: 'ExifVersion',\n\t\t\t\t0xA001: 'ColorSpace',\n\t\t\t\t0xA002: 'PixelXDimension',\n\t\t\t\t0xA003: 'PixelYDimension',\n\t\t\t\t0x9003: 'DateTimeOriginal',\n\t\t\t\t0x829A: 'ExposureTime',\n\t\t\t\t0x829D: 'FNumber',\n\t\t\t\t0x8827: 'ISOSpeedRatings',\n\t\t\t\t0x9201: 'ShutterSpeedValue',\n\t\t\t\t0x9202: 'ApertureValue'\t,\n\t\t\t\t0x9207: 'MeteringMode',\n\t\t\t\t0x9208: 'LightSource',\n\t\t\t\t0x9209: 'Flash',\n\t\t\t\t0x920A: 'FocalLength',\n\t\t\t\t0xA402: 'ExposureMode',\n\t\t\t\t0xA403: 'WhiteBalance',\n\t\t\t\t0xA406: 'SceneCaptureType',\n\t\t\t\t0xA404: 'DigitalZoomRatio',\n\t\t\t\t0xA408: 'Contrast',\n\t\t\t\t0xA409: 'Saturation',\n\t\t\t\t0xA40A: 'Sharpness'\n\t\t\t},\n\t\t\tgps : {\n\t\t\t\t0x0000: 'GPSVersionID',\n\t\t\t\t0x0001: 'GPSLatitudeRef',\n\t\t\t\t0x0002: 'GPSLatitude',\n\t\t\t\t0x0003: 'GPSLongitudeRef',\n\t\t\t\t0x0004: 'GPSLongitude'\n\t\t\t}\n\t\t};\n\n\t\ttagDescs = {\n\t\t\t'ColorSpace': {\n\t\t\t\t1: 'sRGB',\n\t\t\t\t0: 'Uncalibrated'\n\t\t\t},\n\n\t\t\t'MeteringMode': {\n\t\t\t\t0: 'Unknown',\n\t\t\t\t1: 'Average',\n\t\t\t\t2: 'CenterWeightedAverage',\n\t\t\t\t3: 'Spot',\n\t\t\t\t4: 'MultiSpot',\n\t\t\t\t5: 'Pattern',\n\t\t\t\t6: 'Partial',\n\t\t\t\t255: 'Other'\n\t\t\t},\n\n\t\t\t'LightSource': {\n\t\t\t\t1: 'Daylight',\n\t\t\t\t2: 'Fliorescent',\n\t\t\t\t3: 'Tungsten',\n\t\t\t\t4: 'Flash',\n\t\t\t\t9: 'Fine weather',\n\t\t\t\t10: 'Cloudy weather',\n\t\t\t\t11: 'Shade',\n\t\t\t\t12: 'Daylight fluorescent (D 5700 - 7100K)',\n\t\t\t\t13: 'Day white fluorescent (N 4600 -5400K)',\n\t\t\t\t14: 'Cool white fluorescent (W 3900 - 4500K)',\n\t\t\t\t15: 'White fluorescent (WW 3200 - 3700K)',\n\t\t\t\t17: 'Standard light A',\n\t\t\t\t18: 'Standard light B',\n\t\t\t\t19: 'Standard light C',\n\t\t\t\t20: 'D55',\n\t\t\t\t21: 'D65',\n\t\t\t\t22: 'D75',\n\t\t\t\t23: 'D50',\n\t\t\t\t24: 'ISO studio tungsten',\n\t\t\t\t255: 'Other'\n\t\t\t},\n\n\t\t\t'Flash': {\n\t\t\t\t0x0000: 'Flash did not fire.',\n\t\t\t\t0x0001: 'Flash fired.',\n\t\t\t\t0x0005: 'Strobe return light not detected.',\n\t\t\t\t0x0007: 'Strobe return light detected.',\n\t\t\t\t0x0009: 'Flash fired, compulsory flash mode',\n\t\t\t\t0x000D: 'Flash fired, compulsory flash mode, return light not detected',\n\t\t\t\t0x000F: 'Flash fired, compulsory flash mode, return light detected',\n\t\t\t\t0x0010: 'Flash did not fire, compulsory flash mode',\n\t\t\t\t0x0018: 'Flash did not fire, auto mode',\n\t\t\t\t0x0019: 'Flash fired, auto mode',\n\t\t\t\t0x001D: 'Flash fired, auto mode, return light not detected',\n\t\t\t\t0x001F: 'Flash fired, auto mode, return light detected',\n\t\t\t\t0x0020: 'No flash function',\n\t\t\t\t0x0041: 'Flash fired, red-eye reduction mode',\n\t\t\t\t0x0045: 'Flash fired, red-eye reduction mode, return light not detected',\n\t\t\t\t0x0047: 'Flash fired, red-eye reduction mode, return light detected',\n\t\t\t\t0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',\n\t\t\t\t0x004D: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',\n\t\t\t\t0x004F: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',\n\t\t\t\t0x0059: 'Flash fired, auto mode, red-eye reduction mode',\n\t\t\t\t0x005D: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',\n\t\t\t\t0x005F: 'Flash fired, auto mode, return light detected, red-eye reduction mode'\n\t\t\t},\n\n\t\t\t'ExposureMode': {\n\t\t\t\t0: 'Auto exposure',\n\t\t\t\t1: 'Manual exposure',\n\t\t\t\t2: 'Auto bracket'\n\t\t\t},\n\n\t\t\t'WhiteBalance': {\n\t\t\t\t0: 'Auto white balance',\n\t\t\t\t1: 'Manual white balance'\n\t\t\t},\n\n\t\t\t'SceneCaptureType': {\n\t\t\t\t0: 'Standard',\n\t\t\t\t1: 'Landscape',\n\t\t\t\t2: 'Portrait',\n\t\t\t\t3: 'Night scene'\n\t\t\t},\n\n\t\t\t'Contrast': {\n\t\t\t\t0: 'Normal',\n\t\t\t\t1: 'Soft',\n\t\t\t\t2: 'Hard'\n\t\t\t},\n\n\t\t\t'Saturation': {\n\t\t\t\t0: 'Normal',\n\t\t\t\t1: 'Low saturation',\n\t\t\t\t2: 'High saturation'\n\t\t\t},\n\n\t\t\t'Sharpness': {\n\t\t\t\t0: 'Normal',\n\t\t\t\t1: 'Soft',\n\t\t\t\t2: 'Hard'\n\t\t\t},\n\n\t\t\t// GPS related\n\t\t\t'GPSLatitudeRef': {\n\t\t\t\tN: 'North latitude',\n\t\t\t\tS: 'South latitude'\n\t\t\t},\n\n\t\t\t'GPSLongitudeRef': {\n\t\t\t\tE: 'East longitude',\n\t\t\t\tW: 'West longitude'\n\t\t\t}\n\t\t};\n\n\t\tfunction extractTags(IFD_offset, tags2extract) {\n\t\t\tvar length = data.SHORT(IFD_offset), i, ii,\n\t\t\t\ttag, type, count, tagOffset, offset, value, values = [], hash = {};\n\n\t\t\tfor (i = 0; i < length; i++) {\n\t\t\t\t// Set binary reader pointer to beginning of the next tag\n\t\t\t\toffset = tagOffset = IFD_offset + 12 * i + 2;\n\n\t\t\t\ttag = tags2extract[data.SHORT(offset)];\n\n\t\t\t\tif (tag === undefined) {\n\t\t\t\t\tcontinue; // Not the tag we requested\n\t\t\t\t}\n\n\t\t\t\ttype = data.SHORT(offset+=2);\n\t\t\t\tcount = data.LONG(offset+=2);\n\n\t\t\t\toffset += 4;\n\t\t\t\tvalues = [];\n\n\t\t\t\tswitch (type) {\n\t\t\t\t\tcase 1: // BYTE\n\t\t\t\t\tcase 7: // UNDEFINED\n\t\t\t\t\t\tif (count > 4) {\n\t\t\t\t\t\t\toffset = data.LONG(offset) + offsets.tiffHeader;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tfor (ii = 0; ii < count; ii++) {\n\t\t\t\t\t\t\tvalues[ii] = data.BYTE(offset + ii);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\tcase 2: // STRING\n\t\t\t\t\t\tif (count > 4) {\n\t\t\t\t\t\t\toffset = data.LONG(offset) + offsets.tiffHeader;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\thash[tag] = data.STRING(offset, count - 1);\n\n\t\t\t\t\t\tcontinue;\n\n\t\t\t\t\tcase 3: // SHORT\n\t\t\t\t\t\tif (count > 2) {\n\t\t\t\t\t\t\toffset = data.LONG(offset) + offsets.tiffHeader;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tfor (ii = 0; ii < count; ii++) {\n\t\t\t\t\t\t\tvalues[ii] = data.SHORT(offset + ii*2);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\tcase 4: // LONG\n\t\t\t\t\t\tif (count > 1) {\n\t\t\t\t\t\t\toffset = data.LONG(offset) + offsets.tiffHeader;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tfor (ii = 0; ii < count; ii++) {\n\t\t\t\t\t\t\tvalues[ii] = data.LONG(offset + ii*4);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\tcase 5: // RATIONAL\n\t\t\t\t\t\toffset = data.LONG(offset) + offsets.tiffHeader;\n\n\t\t\t\t\t\tfor (ii = 0; ii < count; ii++) {\n\t\t\t\t\t\t\tvalues[ii] = data.LONG(offset + ii*4) / data.LONG(offset + ii*4 + 4);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\tcase 9: // SLONG\n\t\t\t\t\t\toffset = data.LONG(offset) + offsets.tiffHeader;\n\n\t\t\t\t\t\tfor (ii = 0; ii < count; ii++) {\n\t\t\t\t\t\t\tvalues[ii] = data.SLONG(offset + ii*4);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\tcase 10: // SRATIONAL\n\t\t\t\t\t\toffset = data.LONG(offset) + offsets.tiffHeader;\n\n\t\t\t\t\t\tfor (ii = 0; ii < count; ii++) {\n\t\t\t\t\t\t\tvalues[ii] = data.SLONG(offset + ii*4) / data.SLONG(offset + ii*4 + 4);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\tdefault:\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tvalue = (count == 1 ? values[0] : values);\n\n\t\t\t\tif (tagDescs.hasOwnProperty(tag) && typeof value != 'object') {\n\t\t\t\t\thash[tag] = tagDescs[tag][value];\n\t\t\t\t} else {\n\t\t\t\t\thash[tag] = value;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn hash;\n\t\t}\n\n\t\tfunction getIFDOffsets() {\n\t\t\tvar idx = offsets.tiffHeader;\n\n\t\t\t// Set read order of multi-byte data\n\t\t\tdata.II(data.SHORT(idx) == 0x4949);\n\n\t\t\t// Check if always present bytes are indeed present\n\t\t\tif (data.SHORT(idx+=2) !== 0x002A) {\n\t\t\t\treturn false;\n\t\t\t}\n\n\t\t\toffsets.IFD0 = offsets.tiffHeader + data.LONG(idx += 2);\n\t\t\tTiff = extractTags(offsets.IFD0, tags.tiff);\n\n\t\t\tif ('ExifIFDPointer' in Tiff) {\n\t\t\t\toffsets.exifIFD = offsets.tiffHeader + Tiff.ExifIFDPointer;\n\t\t\t\tdelete Tiff.ExifIFDPointer;\n\t\t\t}\n\n\t\t\tif ('GPSInfoIFDPointer' in Tiff) {\n\t\t\t\toffsets.gpsIFD = offsets.tiffHeader + Tiff.GPSInfoIFDPointer;\n\t\t\t\tdelete Tiff.GPSInfoIFDPointer;\n\t\t\t}\n\t\t\treturn true;\n\t\t}\n\n\t\t// At the moment only setting of simple (LONG) values, that do not require offset recalculation, is supported\n\t\tfunction setTag(ifd, tag, value) {\n\t\t\tvar offset, length, tagOffset, valueOffset = 0;\n\n\t\t\t// If tag name passed translate into hex key\n\t\t\tif (typeof(tag) === 'string') {\n\t\t\t\tvar tmpTags = tags[ifd.toLowerCase()];\n\t\t\t\tfor (var hex in tmpTags) {\n\t\t\t\t\tif (tmpTags[hex] === tag) {\n\t\t\t\t\t\ttag = hex;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\toffset = offsets[ifd.toLowerCase() + 'IFD'];\n\t\t\tlength = data.SHORT(offset);\n\n\t\t\tfor (var i = 0; i < length; i++) {\n\t\t\t\ttagOffset = offset + 12 * i + 2;\n\n\t\t\t\tif (data.SHORT(tagOffset) == tag) {\n\t\t\t\t\tvalueOffset = tagOffset + 8;\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (!valueOffset) {\n\t\t\t\treturn false;\n\t\t\t}\n\n\t\t\tdata.LONG(valueOffset, value);\n\t\t\treturn true;\n\t\t}\n\n\n\t\t// Public functions\n\t\treturn {\n\t\t\tinit: function(segment) {\n\t\t\t\t// Reset internal data\n\t\t\t\toffsets = {\n\t\t\t\t\ttiffHeader: 10\n\t\t\t\t};\n\n\t\t\t\tif (segment === undefined || !segment.length) {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t\tdata.init(segment);\n\n\t\t\t\t// Check if that's APP1 and that it has EXIF\n\t\t\t\tif (data.SHORT(0) === 0xFFE1 && data.STRING(4, 5).toUpperCase() === \"EXIF\\0\") {\n\t\t\t\t\treturn getIFDOffsets();\n\t\t\t\t}\n\t\t\t\treturn false;\n\t\t\t},\n\n\t\t\tTIFF: function() {\n\t\t\t\treturn Tiff;\n\t\t\t},\n\n\t\t\tEXIF: function() {\n\t\t\t\tvar Exif;\n\n\t\t\t\t// Populate EXIF hash\n\t\t\t\tExif = extractTags(offsets.exifIFD, tags.exif);\n\n\t\t\t\t// Fix formatting of some tags\n\t\t\t\tif (Exif.ExifVersion && Basic.typeOf(Exif.ExifVersion) === 'array') {\n\t\t\t\t\tfor (var i = 0, exifVersion = ''; i < Exif.ExifVersion.length; i++) {\n\t\t\t\t\t\texifVersion += String.fromCharCode(Exif.ExifVersion[i]);\n\t\t\t\t\t}\n\t\t\t\t\tExif.ExifVersion = exifVersion;\n\t\t\t\t}\n\n\t\t\t\treturn Exif;\n\t\t\t},\n\n\t\t\tGPS: function() {\n\t\t\t\tvar GPS;\n\n\t\t\t\tGPS = extractTags(offsets.gpsIFD, tags.gps);\n\n\t\t\t\t// iOS devices (and probably some others) do not put in GPSVersionID tag (why?..)\n\t\t\t\tif (GPS.GPSVersionID && Basic.typeOf(GPS.GPSVersionID) === 'array') {\n\t\t\t\t\tGPS.GPSVersionID = GPS.GPSVersionID.join('.');\n\t\t\t\t}\n\n\t\t\t\treturn GPS;\n\t\t\t},\n\n\t\t\tsetExif: function(tag, value) {\n\t\t\t\t// Right now only setting of width/height is possible\n\t\t\t\tif (tag !== 'PixelXDimension' && tag !== 'PixelYDimension') {return false;}\n\n\t\t\t\treturn setTag('exif', tag, value);\n\t\t\t},\n\n\n\t\t\tgetBinary: function() {\n\t\t\t\treturn data.SEGMENT();\n\t\t\t},\n\n\t\t\tpurge: function() {\n\t\t\t\tdata.init(null);\n\t\t\t\tdata = Tiff = null;\n\t\t\t\toffsets = {};\n\t\t\t}\n\t\t};\n\t};\n});");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "419:10945");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "575:10941");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "639:683");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "688:713");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "718:2614");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "2619:5533");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "5538:7848");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7853:8521");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8638:9317");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9345:10937");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "5590:5704");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "5710:7827");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7833:7844");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "5807:5851");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "5858:5896");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "5903:5975");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "5982:6010");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6016:6044");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6051:6062");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6068:6079");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6086:7623");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7630:7671");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7678:7822");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "5933:5941");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6155:6234");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6243:6326");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6335:6340");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6179:6226");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6283:6318");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6372:6451");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6460:6502");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6511:6519");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6396:6443");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6550:6629");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6638:6724");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6733:6738");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6574:6621");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6678:6716");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6768:6847");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6856:6941");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6950:6955");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6792:6839");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6896:6933");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "6989:7036");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7045:7161");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7170:7175");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7085:7153");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7206:7253");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7262:7348");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7357:7362");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7302:7340");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7398:7445");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7454:7572");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7581:7586");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7494:7564");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7609:7617");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7747:7779");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7799:7816");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7883:7911");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "7957:7991");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8052:8110");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8116:8171");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8176:8219");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8225:8356");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8362:8501");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8506:8517");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8093:8105");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8261:8319");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8325:8351");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8401:8461");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8467:8496");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8676:8722");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8776:8961");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8966:9009");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9014:9041");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9047:9215");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9221:9262");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9268:9297");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9302:9313");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8812:8849");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8855:8956");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8887:8950");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8921:8930");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "8938:8943");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9086:9117");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9124:9210");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9165:9192");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9199:9204");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9245:9257");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9414:9451");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9458:9529");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9536:9554");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9610:9723");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9729:9741");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9511:9523");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9695:9717");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9776:9787");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9822:9830");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9863:9909");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "9951:10207");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10214:10225");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10026:10164");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10171:10201");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10102:10157");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10259:10266");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10273:10316");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10409:10535");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10542:10552");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10484:10529");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10658:10732");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10739:10772");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10719:10731");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10813:10834");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10870:10885");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10891:10909");
__$coverInitRange("src/javascript/runtime/html5/image/ExifParser.js", "10915:10927");
__$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '419:10945');
define('moxie/runtime/html5/image/ExifParser', [
    'moxie/core/utils/Basic',
    'moxie/runtime/html5/utils/BinaryReader'
], function (Basic, BinaryReader) {
    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '575:10941');
    return function ExifParser() {
        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '639:683');
        var data, tags, Tiff, offsets = {}, tagDescs;
        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '688:713');
        data = new BinaryReader();
        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '718:2614');
        tags = {
            tiff: {
                274: 'Orientation',
                270: 'ImageDescription',
                271: 'Make',
                272: 'Model',
                305: 'Software',
                34665: 'ExifIFDPointer',
                34853: 'GPSInfoIFDPointer'
            },
            exif: {
                36864: 'ExifVersion',
                40961: 'ColorSpace',
                40962: 'PixelXDimension',
                40963: 'PixelYDimension',
                36867: 'DateTimeOriginal',
                33434: 'ExposureTime',
                33437: 'FNumber',
                34855: 'ISOSpeedRatings',
                37377: 'ShutterSpeedValue',
                37378: 'ApertureValue',
                37383: 'MeteringMode',
                37384: 'LightSource',
                37385: 'Flash',
                37386: 'FocalLength',
                41986: 'ExposureMode',
                41987: 'WhiteBalance',
                41990: 'SceneCaptureType',
                41988: 'DigitalZoomRatio',
                41992: 'Contrast',
                41993: 'Saturation',
                41994: 'Sharpness'
            },
            gps: {
                0: 'GPSVersionID',
                1: 'GPSLatitudeRef',
                2: 'GPSLatitude',
                3: 'GPSLongitudeRef',
                4: 'GPSLongitude'
            }
        };
        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '2619:5533');
        tagDescs = {
            'ColorSpace': {
                1: 'sRGB',
                0: 'Uncalibrated'
            },
            'MeteringMode': {
                0: 'Unknown',
                1: 'Average',
                2: 'CenterWeightedAverage',
                3: 'Spot',
                4: 'MultiSpot',
                5: 'Pattern',
                6: 'Partial',
                255: 'Other'
            },
            'LightSource': {
                1: 'Daylight',
                2: 'Fliorescent',
                3: 'Tungsten',
                4: 'Flash',
                9: 'Fine weather',
                10: 'Cloudy weather',
                11: 'Shade',
                12: 'Daylight fluorescent (D 5700 - 7100K)',
                13: 'Day white fluorescent (N 4600 -5400K)',
                14: 'Cool white fluorescent (W 3900 - 4500K)',
                15: 'White fluorescent (WW 3200 - 3700K)',
                17: 'Standard light A',
                18: 'Standard light B',
                19: 'Standard light C',
                20: 'D55',
                21: 'D65',
                22: 'D75',
                23: 'D50',
                24: 'ISO studio tungsten',
                255: 'Other'
            },
            'Flash': {
                0: 'Flash did not fire.',
                1: 'Flash fired.',
                5: 'Strobe return light not detected.',
                7: 'Strobe return light detected.',
                9: 'Flash fired, compulsory flash mode',
                13: 'Flash fired, compulsory flash mode, return light not detected',
                15: 'Flash fired, compulsory flash mode, return light detected',
                16: 'Flash did not fire, compulsory flash mode',
                24: 'Flash did not fire, auto mode',
                25: 'Flash fired, auto mode',
                29: 'Flash fired, auto mode, return light not detected',
                31: 'Flash fired, auto mode, return light detected',
                32: 'No flash function',
                65: 'Flash fired, red-eye reduction mode',
                69: 'Flash fired, red-eye reduction mode, return light not detected',
                71: 'Flash fired, red-eye reduction mode, return light detected',
                73: 'Flash fired, compulsory flash mode, red-eye reduction mode',
                77: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
                79: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
                89: 'Flash fired, auto mode, red-eye reduction mode',
                93: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
                95: 'Flash fired, auto mode, return light detected, red-eye reduction mode'
            },
            'ExposureMode': {
                0: 'Auto exposure',
                1: 'Manual exposure',
                2: 'Auto bracket'
            },
            'WhiteBalance': {
                0: 'Auto white balance',
                1: 'Manual white balance'
            },
            'SceneCaptureType': {
                0: 'Standard',
                1: 'Landscape',
                2: 'Portrait',
                3: 'Night scene'
            },
            'Contrast': {
                0: 'Normal',
                1: 'Soft',
                2: 'Hard'
            },
            'Saturation': {
                0: 'Normal',
                1: 'Low saturation',
                2: 'High saturation'
            },
            'Sharpness': {
                0: 'Normal',
                1: 'Soft',
                2: 'Hard'
            },
            'GPSLatitudeRef': {
                N: 'North latitude',
                S: 'South latitude'
            },
            'GPSLongitudeRef': {
                E: 'East longitude',
                W: 'West longitude'
            }
        };
        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '5538:7848');
        function extractTags(IFD_offset, tags2extract) {
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '5590:5704');
            var length = data.SHORT(IFD_offset), i, ii, tag, type, count, tagOffset, offset, value, values = [], hash = {};
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '5710:7827');
            for (i = 0; i < length; i++) {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '5807:5851');
                offset = tagOffset = IFD_offset + 12 * i + 2;
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '5858:5896');
                tag = tags2extract[data.SHORT(offset)];
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '5903:5975');
                if (tag === undefined) {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '5933:5941');
                    continue;
                }
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '5982:6010');
                type = data.SHORT(offset += 2);
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6016:6044');
                count = data.LONG(offset += 2);
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6051:6062');
                offset += 4;
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6068:6079');
                values = [];
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6086:7623');
                switch (type) {
                case 1:
                case 7:
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6155:6234');
                    if (count > 4) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6179:6226');
                        offset = data.LONG(offset) + offsets.tiffHeader;
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6243:6326');
                    for (ii = 0; ii < count; ii++) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6283:6318');
                        values[ii] = data.BYTE(offset + ii);
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6335:6340');
                    break;
                case 2:
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6372:6451');
                    if (count > 4) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6396:6443');
                        offset = data.LONG(offset) + offsets.tiffHeader;
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6460:6502');
                    hash[tag] = data.STRING(offset, count - 1);
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6511:6519');
                    continue;
                case 3:
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6550:6629');
                    if (count > 2) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6574:6621');
                        offset = data.LONG(offset) + offsets.tiffHeader;
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6638:6724');
                    for (ii = 0; ii < count; ii++) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6678:6716');
                        values[ii] = data.SHORT(offset + ii * 2);
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6733:6738');
                    break;
                case 4:
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6768:6847');
                    if (count > 1) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6792:6839');
                        offset = data.LONG(offset) + offsets.tiffHeader;
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6856:6941');
                    for (ii = 0; ii < count; ii++) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6896:6933');
                        values[ii] = data.LONG(offset + ii * 4);
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6950:6955');
                    break;
                case 5:
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '6989:7036');
                    offset = data.LONG(offset) + offsets.tiffHeader;
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7045:7161');
                    for (ii = 0; ii < count; ii++) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7085:7153');
                        values[ii] = data.LONG(offset + ii * 4) / data.LONG(offset + ii * 4 + 4);
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7170:7175');
                    break;
                case 9:
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7206:7253');
                    offset = data.LONG(offset) + offsets.tiffHeader;
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7262:7348');
                    for (ii = 0; ii < count; ii++) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7302:7340');
                        values[ii] = data.SLONG(offset + ii * 4);
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7357:7362');
                    break;
                case 10:
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7398:7445');
                    offset = data.LONG(offset) + offsets.tiffHeader;
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7454:7572');
                    for (ii = 0; ii < count; ii++) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7494:7564');
                        values[ii] = data.SLONG(offset + ii * 4) / data.SLONG(offset + ii * 4 + 4);
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7581:7586');
                    break;
                default:
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7609:7617');
                    continue;
                }
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7630:7671');
                value = count == 1 ? values[0] : values;
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7678:7822');
                if (tagDescs.hasOwnProperty(tag) && typeof value != 'object') {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7747:7779');
                    hash[tag] = tagDescs[tag][value];
                } else {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7799:7816');
                    hash[tag] = value;
                }
            }
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7833:7844');
            return hash;
        }
        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7853:8521');
        function getIFDOffsets() {
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7883:7911');
            var idx = offsets.tiffHeader;
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '7957:7991');
            data.II(data.SHORT(idx) == 18761);
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8052:8110');
            if (data.SHORT(idx += 2) !== 42) {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8093:8105');
                return false;
            }
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8116:8171');
            offsets.IFD0 = offsets.tiffHeader + data.LONG(idx += 2);
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8176:8219');
            Tiff = extractTags(offsets.IFD0, tags.tiff);
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8225:8356');
            if ('ExifIFDPointer' in Tiff) {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8261:8319');
                offsets.exifIFD = offsets.tiffHeader + Tiff.ExifIFDPointer;
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8325:8351');
                delete Tiff.ExifIFDPointer;
            }
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8362:8501');
            if ('GPSInfoIFDPointer' in Tiff) {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8401:8461');
                offsets.gpsIFD = offsets.tiffHeader + Tiff.GPSInfoIFDPointer;
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8467:8496');
                delete Tiff.GPSInfoIFDPointer;
            }
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8506:8517');
            return true;
        }
        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8638:9317');
        function setTag(ifd, tag, value) {
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8676:8722');
            var offset, length, tagOffset, valueOffset = 0;
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8776:8961');
            if (typeof tag === 'string') {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8812:8849');
                var tmpTags = tags[ifd.toLowerCase()];
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8855:8956');
                for (var hex in tmpTags) {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8887:8950');
                    if (tmpTags[hex] === tag) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8921:8930');
                        tag = hex;
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8938:8943');
                        break;
                    }
                }
            }
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '8966:9009');
            offset = offsets[ifd.toLowerCase() + 'IFD'];
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9014:9041');
            length = data.SHORT(offset);
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9047:9215');
            for (var i = 0; i < length; i++) {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9086:9117');
                tagOffset = offset + 12 * i + 2;
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9124:9210');
                if (data.SHORT(tagOffset) == tag) {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9165:9192');
                    valueOffset = tagOffset + 8;
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9199:9204');
                    break;
                }
            }
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9221:9262');
            if (!valueOffset) {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9245:9257');
                return false;
            }
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9268:9297');
            data.LONG(valueOffset, value);
            __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9302:9313');
            return true;
        }
        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9345:10937');
        return {
            init: function (segment) {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9414:9451');
                offsets = { tiffHeader: 10 };
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9458:9529');
                if (segment === undefined || !segment.length) {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9511:9523');
                    return false;
                }
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9536:9554');
                data.init(segment);
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9610:9723');
                if (data.SHORT(0) === 65505 && data.STRING(4, 5).toUpperCase() === 'EXIF\0') {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9695:9717');
                    return getIFDOffsets();
                }
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9729:9741');
                return false;
            },
            TIFF: function () {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9776:9787');
                return Tiff;
            },
            EXIF: function () {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9822:9830');
                var Exif;
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9863:9909');
                Exif = extractTags(offsets.exifIFD, tags.exif);
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '9951:10207');
                if (Exif.ExifVersion && Basic.typeOf(Exif.ExifVersion) === 'array') {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10026:10164');
                    for (var i = 0, exifVersion = ''; i < Exif.ExifVersion.length; i++) {
                        __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10102:10157');
                        exifVersion += String.fromCharCode(Exif.ExifVersion[i]);
                    }
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10171:10201');
                    Exif.ExifVersion = exifVersion;
                }
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10214:10225');
                return Exif;
            },
            GPS: function () {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10259:10266');
                var GPS;
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10273:10316');
                GPS = extractTags(offsets.gpsIFD, tags.gps);
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10409:10535');
                if (GPS.GPSVersionID && Basic.typeOf(GPS.GPSVersionID) === 'array') {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10484:10529');
                    GPS.GPSVersionID = GPS.GPSVersionID.join('.');
                }
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10542:10552');
                return GPS;
            },
            setExif: function (tag, value) {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10658:10732');
                if (tag !== 'PixelXDimension' && tag !== 'PixelYDimension') {
                    __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10719:10731');
                    return false;
                }
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10739:10772');
                return setTag('exif', tag, value);
            },
            getBinary: function () {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10813:10834');
                return data.SEGMENT();
            },
            purge: function () {
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10870:10885');
                data.init(null);
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10891:10909');
                data = Tiff = null;
                __$coverCall('src/javascript/runtime/html5/image/ExifParser.js', '10915:10927');
                offsets = {};
            }
        };
    };
});

// Included from: src/javascript/runtime/html5/image/JPEG.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/image/JPEG.js", "/**\n * JPEG.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/image/JPEG\n@private\n*/\ndefine(\"moxie/runtime/html5/image/JPEG\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/runtime/html5/image/JPEGHeaders\",\n\t\"moxie/runtime/html5/utils/BinaryReader\",\n\t\"moxie/runtime/html5/image/ExifParser\"\n], function(Basic, x, JPEGHeaders, BinaryReader, ExifParser) {\n\t\n\tfunction JPEG(binstr) {\n\t\tvar _binstr, _br, _hm, _ep, _info, hasExif;\n\n\t\tfunction _getDimensions() {\n\t\t\tvar idx = 0, marker, length;\n\n\t\t\t// examine all through the end, since some images might have very large APP segments\n\t\t\twhile (idx <= _binstr.length) {\n\t\t\t\tmarker = _br.SHORT(idx += 2);\n\n\t\t\t\tif (marker >= 0xFFC0 && marker <= 0xFFC3) { // SOFn\n\t\t\t\t\tidx += 5; // marker (2 bytes) + length (2 bytes) + Sample precision (1 byte)\n\t\t\t\t\treturn {\n\t\t\t\t\t\theight: _br.SHORT(idx),\n\t\t\t\t\t\twidth: _br.SHORT(idx += 2)\n\t\t\t\t\t};\n\t\t\t\t}\n\t\t\t\tlength = _br.SHORT(idx += 2);\n\t\t\t\tidx += length - 2;\n\t\t\t}\n\t\t\treturn null;\n\t\t}\n\n\t\t_binstr = binstr;\n\n\t\t_br = new BinaryReader();\n\t\t_br.init(_binstr);\n\n\t\t// check if it is jpeg\n\t\tif (_br.SHORT(0) !== 0xFFD8) {\n\t\t\tthrow new x.ImageError(x.ImageError.WRONG_FORMAT);\n\t\t}\n\n\t\t// backup headers\n\t\t_hm = new JPEGHeaders(binstr);\n\n\t\t// extract exif info\n\t\t_ep = new ExifParser();\n\t\thasExif = !!_ep.init(_hm.get('exif')[0]);\n\n\t\t// get dimensions\n\t\t_info = _getDimensions.call(this);\n\n\t\tBasic.extend(this, {\n\t\t\ttype: 'image/jpeg',\n\n\t\t\tsize: _binstr.length,\n\n\t\t\twidth: _info && _info.width || 0,\n\n\t\t\theight: _info && _info.height || 0,\n\n\t\t\tsetExif: function(tag, value) {\n\t\t\t\tif (!hasExif) {\n\t\t\t\t\treturn false; // or throw an exception\n\t\t\t\t}\n\n\t\t\t\tif (Basic.typeOf(tag) === 'object') {\n\t\t\t\t\tBasic.each(tag, function(value, tag) {\n\t\t\t\t\t\t_ep.setExif(tag, value);\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\t_ep.setExif(tag, value);\n\t\t\t\t}\n\n\t\t\t\t// update internal headers\n\t\t\t\t_hm.set('exif', _ep.getBinary());\n\t\t\t},\n\n\t\t\twriteHeaders: function() {\n\t\t\t\tif (!arguments.length) {\n\t\t\t\t\t// if no arguments passed, update headers internally\n\t\t\t\t\treturn (_binstr = _hm.restore(_binstr));\n\t\t\t\t}\n\t\t\t\treturn _hm.restore(arguments[0]);\n\t\t\t},\n\n\t\t\tpurge: function() {\n\t\t\t\t_purge.call(this);\n\t\t\t}\n\t\t});\n\n\t\tif (hasExif) {\n\t\t\tthis.meta = {\n\t\t\t\ttiff: _ep.TIFF(),\n\t\t\t\texif: _ep.EXIF(),\n\t\t\t\tgps: _ep.GPS()\n\t\t\t};\n\t\t}\n\n\t\tfunction _purge() {\n\t\t\tif (!_ep || !_hm || !_br) { \n\t\t\t\treturn; // ignore any repeating purge requests\n\t\t\t}\n\t\t\t_ep.purge();\n\t\t\t_hm.purge();\n\t\t\t_br.init(null);\n\t\t\t_binstr = _info = _hm = _ep = _br = null;\n\t\t}\n\t}\n\n\treturn JPEG;\n});\n");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "396:2800");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "683:2781");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2785:2796");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "709:751");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "756:1284");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1289:1305");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1310:1334");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1338:1355");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1385:1472");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1497:1526");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1554:1576");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1580:1620");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1645:1678");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1683:2459");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2464:2567");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2572:2778");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "787:814");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "908:1264");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1269:1280");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "944:972");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "979:1202");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1208:1236");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1242:1259");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1036:1044");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1118:1196");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1419:1468");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1871:1935");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1942:2111");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2149:2181");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1892:1904");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "1985:2062");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2030:2053");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2082:2105");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2224:2357");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2363:2395");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2312:2351");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2431:2448");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2482:2563");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2595:2678");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2683:2694");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2699:2710");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2715:2729");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2734:2774");
__$coverInitRange("src/javascript/runtime/html5/image/JPEG.js", "2628:2634");
__$coverCall('src/javascript/runtime/html5/image/JPEG.js', '396:2800');
define('moxie/runtime/html5/image/JPEG', [
    'moxie/core/utils/Basic',
    'moxie/core/Exceptions',
    'moxie/runtime/html5/image/JPEGHeaders',
    'moxie/runtime/html5/utils/BinaryReader',
    'moxie/runtime/html5/image/ExifParser'
], function (Basic, x, JPEGHeaders, BinaryReader, ExifParser) {
    __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '683:2781');
    function JPEG(binstr) {
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '709:751');
        var _binstr, _br, _hm, _ep, _info, hasExif;
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '756:1284');
        function _getDimensions() {
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '787:814');
            var idx = 0, marker, length;
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '908:1264');
            while (idx <= _binstr.length) {
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '944:972');
                marker = _br.SHORT(idx += 2);
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '979:1202');
                if (marker >= 65472 && marker <= 65475) {
                    __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1036:1044');
                    idx += 5;
                    __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1118:1196');
                    return {
                        height: _br.SHORT(idx),
                        width: _br.SHORT(idx += 2)
                    };
                }
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1208:1236');
                length = _br.SHORT(idx += 2);
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1242:1259');
                idx += length - 2;
            }
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1269:1280');
            return null;
        }
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1289:1305');
        _binstr = binstr;
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1310:1334');
        _br = new BinaryReader();
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1338:1355');
        _br.init(_binstr);
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1385:1472');
        if (_br.SHORT(0) !== 65496) {
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1419:1468');
            throw new x.ImageError(x.ImageError.WRONG_FORMAT);
        }
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1497:1526');
        _hm = new JPEGHeaders(binstr);
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1554:1576');
        _ep = new ExifParser();
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1580:1620');
        hasExif = !!_ep.init(_hm.get('exif')[0]);
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1645:1678');
        _info = _getDimensions.call(this);
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1683:2459');
        Basic.extend(this, {
            type: 'image/jpeg',
            size: _binstr.length,
            width: _info && _info.width || 0,
            height: _info && _info.height || 0,
            setExif: function (tag, value) {
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1871:1935');
                if (!hasExif) {
                    __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1892:1904');
                    return false;
                }
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1942:2111');
                if (Basic.typeOf(tag) === 'object') {
                    __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '1985:2062');
                    Basic.each(tag, function (value, tag) {
                        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2030:2053');
                        _ep.setExif(tag, value);
                    });
                } else {
                    __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2082:2105');
                    _ep.setExif(tag, value);
                }
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2149:2181');
                _hm.set('exif', _ep.getBinary());
            },
            writeHeaders: function () {
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2224:2357');
                if (!arguments.length) {
                    __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2312:2351');
                    return _binstr = _hm.restore(_binstr);
                }
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2363:2395');
                return _hm.restore(arguments[0]);
            },
            purge: function () {
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2431:2448');
                _purge.call(this);
            }
        });
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2464:2567');
        if (hasExif) {
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2482:2563');
            this.meta = {
                tiff: _ep.TIFF(),
                exif: _ep.EXIF(),
                gps: _ep.GPS()
            };
        }
        __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2572:2778');
        function _purge() {
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2595:2678');
            if (!_ep || !_hm || !_br) {
                __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2628:2634');
                return;
            }
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2683:2694');
            _ep.purge();
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2699:2710');
            _hm.purge();
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2715:2729');
            _br.init(null);
            __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2734:2774');
            _binstr = _info = _hm = _ep = _br = null;
        }
    }
    __$coverCall('src/javascript/runtime/html5/image/JPEG.js', '2785:2796');
    return JPEG;
});

// Included from: src/javascript/runtime/html5/image/PNG.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/image/PNG.js", "/**\n * PNG.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/image/PNG\n@private\n*/\ndefine(\"moxie/runtime/html5/image/PNG\", [\n\t\"moxie/core/Exceptions\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/runtime/html5/utils/BinaryReader\"\n], function(x, Basic, BinaryReader) {\n\t\n\tfunction PNG(binstr) {\n\t\tvar _binstr, _br, _hm, _ep, _info;\n\n\t\t_binstr = binstr;\n\n\t\t_br = new BinaryReader();\n\t\t_br.init(_binstr);\n\n\t\t// check if it's png\n\t\t(function() {\n\t\t\tvar idx = 0, i = 0,\n\t\t\t    signature = [0x8950, 0x4E47, 0x0D0A, 0x1A0A];\n\n\t\t\tfor (i = 0; i < signature.length; i++, idx += 2) {\n\t\t\t\tif (signature[i] != _br.SHORT(idx)) {\n\t\t\t\t\tthrow new x.ImageError(x.ImageError.WRONG_FORMAT);\n\t\t\t\t}\n\t\t\t}\n\t\t}());\n\n\t\tfunction _getDimensions() {\n\t\t\tvar chunk, idx;\n\n\t\t\tchunk = _getChunkAt.call(this, 8);\n\n\t\t\tif (chunk.type == 'IHDR') {\n\t\t\t\tidx = chunk.start;\n\t\t\t\treturn {\n\t\t\t\t\twidth: _br.LONG(idx),\n\t\t\t\t\theight: _br.LONG(idx += 4)\n\t\t\t\t};\n\t\t\t}\n\t\t\treturn null;\n\t\t}\n\n\t\tfunction _purge() {\n\t\t\tif (!_br) {\n\t\t\t\treturn; // ignore any repeating purge requests\n\t\t\t}\n\t\t\t_br.init(null);\n\t\t\t_binstr = _info = _hm = _ep = _br = null;\n\t\t}\n\n\t\t_info = _getDimensions.call(this);\n\n\t\tBasic.extend(this, {\n\t\t\ttype: 'image/png',\n\n\t\t\tsize: _binstr.length,\n\n\t\t\twidth: _info.width,\n\n\t\t\theight: _info.height,\n\n\t\t\tpurge: function() {\n\t\t\t\t_purge.call(this);\n\t\t\t}\n\t\t});\n\n\t\t// for PNG we can safely trigger purge automatically, as we do not keep any data for later\n\t\t_purge.call(this);\n\n\t\tfunction _getChunkAt(idx) {\n\t\t\tvar length, type, start, CRC;\n\n\t\t\tlength = _br.LONG(idx);\n\t\t\ttype = _br.STRING(idx += 4, 4);\n\t\t\tstart = idx += 4;\n\t\t\tCRC = _br.LONG(idx + length);\n\n\t\t\treturn {\n\t\t\t\tlength: length,\n\t\t\t\ttype: type,\n\t\t\t\tstart: start,\n\t\t\t\tCRC: CRC\n\t\t\t};\n\t\t}\n\t}\n\n\treturn PNG;\n});");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "394:2024");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "572:2006");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "2010:2020");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "597:630");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "635:651");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "656:680");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "684:701");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "729:989");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "994:1237");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1242:1399");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1404:1437");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1442:1617");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1715:1732");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1737:2003");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "746:817");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "823:981");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "878:976");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "921:970");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1025:1039");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1045:1078");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1084:1217");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1222:1233");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1116:1133");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1139:1212");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1265:1331");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1336:1350");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1355:1395");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1281:1287");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1589:1606");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1768:1796");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1802:1824");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1829:1859");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1864:1880");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1885:1913");
__$coverInitRange("src/javascript/runtime/html5/image/PNG.js", "1919:1999");
__$coverCall('src/javascript/runtime/html5/image/PNG.js', '394:2024');
define('moxie/runtime/html5/image/PNG', [
    'moxie/core/Exceptions',
    'moxie/core/utils/Basic',
    'moxie/runtime/html5/utils/BinaryReader'
], function (x, Basic, BinaryReader) {
    __$coverCall('src/javascript/runtime/html5/image/PNG.js', '572:2006');
    function PNG(binstr) {
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '597:630');
        var _binstr, _br, _hm, _ep, _info;
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '635:651');
        _binstr = binstr;
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '656:680');
        _br = new BinaryReader();
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '684:701');
        _br.init(_binstr);
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '729:989');
        (function () {
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '746:817');
            var idx = 0, i = 0, signature = [
                    35152,
                    20039,
                    3338,
                    6666
                ];
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '823:981');
            for (i = 0; i < signature.length; i++, idx += 2) {
                __$coverCall('src/javascript/runtime/html5/image/PNG.js', '878:976');
                if (signature[i] != _br.SHORT(idx)) {
                    __$coverCall('src/javascript/runtime/html5/image/PNG.js', '921:970');
                    throw new x.ImageError(x.ImageError.WRONG_FORMAT);
                }
            }
        }());
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '994:1237');
        function _getDimensions() {
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1025:1039');
            var chunk, idx;
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1045:1078');
            chunk = _getChunkAt.call(this, 8);
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1084:1217');
            if (chunk.type == 'IHDR') {
                __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1116:1133');
                idx = chunk.start;
                __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1139:1212');
                return {
                    width: _br.LONG(idx),
                    height: _br.LONG(idx += 4)
                };
            }
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1222:1233');
            return null;
        }
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1242:1399');
        function _purge() {
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1265:1331');
            if (!_br) {
                __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1281:1287');
                return;
            }
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1336:1350');
            _br.init(null);
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1355:1395');
            _binstr = _info = _hm = _ep = _br = null;
        }
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1404:1437');
        _info = _getDimensions.call(this);
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1442:1617');
        Basic.extend(this, {
            type: 'image/png',
            size: _binstr.length,
            width: _info.width,
            height: _info.height,
            purge: function () {
                __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1589:1606');
                _purge.call(this);
            }
        });
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1715:1732');
        _purge.call(this);
        __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1737:2003');
        function _getChunkAt(idx) {
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1768:1796');
            var length, type, start, CRC;
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1802:1824');
            length = _br.LONG(idx);
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1829:1859');
            type = _br.STRING(idx += 4, 4);
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1864:1880');
            start = idx += 4;
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1885:1913');
            CRC = _br.LONG(idx + length);
            __$coverCall('src/javascript/runtime/html5/image/PNG.js', '1919:1999');
            return {
                length: length,
                type: type,
                start: start,
                CRC: CRC
            };
        }
    }
    __$coverCall('src/javascript/runtime/html5/image/PNG.js', '2010:2020');
    return PNG;
});

// Included from: src/javascript/runtime/html5/image/ImageInfo.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/image/ImageInfo.js", "/**\n * ImageInfo.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/image/ImageInfo\n@private\n*/\ndefine(\"moxie/runtime/html5/image/ImageInfo\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/runtime/html5/image/JPEG\",\n\t\"moxie/runtime/html5/image/PNG\"\n], function(Basic, x, JPEG, PNG) {\n\t/**\n\tOptional image investigation tool for HTML5 runtime. Provides the following features:\n\t - ability to distinguish image type (JPEG or PNG) by signature\n\t - ability to extract image width/height directly from it's internals, without preloading in memory (fast)\n\t - ability to extract APP headers from JPEGs (Exif, GPS, etc)\n\t - ability to replace width/height tags in extracted JPEG headers\n\t - ability to restore APP headers, that were for example stripped during image manipulation\n\n\t@class ImageInfo\n\t@constructor\n\t@param {String} binstr Image source as binary string\n\t*/\n\treturn function(binstr) {\n\t\tvar _cs = [JPEG, PNG], _img;\n\n\t\t// figure out the format, throw: ImageError.WRONG_FORMAT if not supported\n\t\t_img = (function() {\n\t\t\tfor (var i = 0; i < _cs.length; i++) {\n\t\t\t\ttry {\n\t\t\t\t\treturn new _cs[i](binstr);\n\t\t\t\t} catch (ex) {\n\t\t\t\t\t// console.info(ex);\n\t\t\t\t}\n\t\t\t}\n\t\t\tthrow new x.ImageError(x.ImageError.WRONG_FORMAT);\n\t\t}());\n\n\t\tBasic.extend(this, {\n\t\t\t/**\n\t\t\tImage Mime Type extracted from it's depths\n\n\t\t\t@property type\n\t\t\t@type {String}\n\t\t\t@default ''\n\t\t\t*/\n\t\t\ttype: '',\n\n\t\t\t/**\n\t\t\tImage size in bytes\n\n\t\t\t@property size\n\t\t\t@type {Number}\n\t\t\t@default 0\n\t\t\t*/\n\t\t\tsize: 0,\n\n\t\t\t/**\n\t\t\tImage width extracted from image source\n\n\t\t\t@property width\n\t\t\t@type {Number}\n\t\t\t@default 0\n\t\t\t*/\n\t\t\twidth: 0,\n\n\t\t\t/**\n\t\t\tImage height extracted from image source\n\n\t\t\t@property height\n\t\t\t@type {Number}\n\t\t\t@default 0\n\t\t\t*/\n\t\t\theight: 0,\n\n\t\t\t/**\n\t\t\tSets Exif tag. Currently applicable only for width and height tags. Obviously works only with JPEGs.\n\n\t\t\t@method setExif\n\t\t\t@param {String} tag Tag to set\n\t\t\t@param {Mixed} value Value to assign to the tag\n\t\t\t*/\n\t\t\tsetExif: function() {},\n\n\t\t\t/**\n\t\t\tRestores headers to the source.\n\n\t\t\t@method writeHeaders\n\t\t\t@param {String} data Image source as binary string\n\t\t\t@return {String} Updated binary string\n\t\t\t*/\n\t\t\twriteHeaders: function(data) {\n\t\t\t\treturn data;\n\t\t\t},\n\n\t\t\t/**\n\t\t\tDispose resources.\n\n\t\t\t@method purge\n\t\t\t*/\n\t\t\tpurge: function() {}\n\t\t});\n\n\t\tBasic.extend(this, _img);\n\n\t\tthis.purge = function() {\n\t\t\t_img.purge();\n\t\t\t_img = null;\n\t\t};\n\t};\n});\n");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "406:2707");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "1190:2703");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "1218:1245");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "1326:1547");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "1552:2603");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "2608:2632");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "2637:2699");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "1350:1485");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "1490:1539");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "1393:1480");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "1404:1429");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "2502:2513");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "2666:2678");
__$coverInitRange("src/javascript/runtime/html5/image/ImageInfo.js", "2683:2694");
__$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '406:2707');
define('moxie/runtime/html5/image/ImageInfo', [
    'moxie/core/utils/Basic',
    'moxie/core/Exceptions',
    'moxie/runtime/html5/image/JPEG',
    'moxie/runtime/html5/image/PNG'
], function (Basic, x, JPEG, PNG) {
    __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '1190:2703');
    return function (binstr) {
        __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '1218:1245');
        var _cs = [
                JPEG,
                PNG
            ], _img;
        __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '1326:1547');
        _img = function () {
            __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '1350:1485');
            for (var i = 0; i < _cs.length; i++) {
                __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '1393:1480');
                try {
                    __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '1404:1429');
                    return new _cs[i](binstr);
                } catch (ex) {
                }
            }
            __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '1490:1539');
            throw new x.ImageError(x.ImageError.WRONG_FORMAT);
        }();
        __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '1552:2603');
        Basic.extend(this, {
            type: '',
            size: 0,
            width: 0,
            height: 0,
            setExif: function () {
            },
            writeHeaders: function (data) {
                __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '2502:2513');
                return data;
            },
            purge: function () {
            }
        });
        __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '2608:2632');
        Basic.extend(this, _img);
        __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '2637:2699');
        this.purge = function () {
            __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '2666:2678');
            _img.purge();
            __$coverCall('src/javascript/runtime/html5/image/ImageInfo.js', '2683:2694');
            _img = null;
        };
    };
});

// Included from: src/javascript/runtime/html5/image/MegaPixel.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/image/MegaPixel.js", "/**\n(The MIT License)\n\nCopyright (c) 2012 Shinichi Tomita <shinichi.tomita@gmail.com>;\n\nPermission is hereby granted, free of charge, to any person obtaining\na copy of this software and associated documentation files (the\n'Software'), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\nThe above copyright notice and this permission notice shall be\nincluded in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\nIN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY\nCLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,\nTORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\nSOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n*/\n\n/**\n * Mega pixel image rendering library for iOS6 Safari\n *\n * Fixes iOS6 Safari's image file rendering issue for large size image (over mega-pixel),\n * which causes unexpected subsampling when drawing it in canvas.\n * By using this library, you can safely render the image with proper stretching.\n *\n * Copyright (c) 2012 Shinichi Tomita <shinichi.tomita@gmail.com>\n * Released under the MIT license\n */\n\n/**\n@class moxie/runtime/html5/image/MegaPixel\n@private\n*/\ndefine(\"moxie/runtime/html5/image/MegaPixel\", [], function() {\n\n\t/**\n\t * Rendering image element (with resizing) into the canvas element\n\t */\n\tfunction renderImageToCanvas(img, canvas, options) {\n\t\tvar iw = img.naturalWidth, ih = img.naturalHeight;\n\t\tvar width = options.width, height = options.height;\n\t\tvar x = options.x || 0, y = options.y || 0;\n\t\tvar ctx = canvas.getContext('2d');\n\t\tif (detectSubsampling(img)) {\n\t\t\tiw /= 2;\n\t\t\tih /= 2;\n\t\t}\n\t\tvar d = 1024; // size of tiling canvas\n\t\tvar tmpCanvas = document.createElement('canvas');\n\t\ttmpCanvas.width = tmpCanvas.height = d;\n\t\tvar tmpCtx = tmpCanvas.getContext('2d');\n\t\tvar vertSquashRatio = detectVerticalSquash(img, iw, ih);\n\t\tvar sy = 0;\n\t\twhile (sy < ih) {\n\t\t\tvar sh = sy + d > ih ? ih - sy : d;\n\t\t\tvar sx = 0;\n\t\t\twhile (sx < iw) {\n\t\t\t\tvar sw = sx + d > iw ? iw - sx : d;\n\t\t\t\ttmpCtx.clearRect(0, 0, d, d);\n\t\t\t\ttmpCtx.drawImage(img, -sx, -sy);\n\t\t\t\tvar dx = (sx * width / iw + x) << 0;\n\t\t\t\tvar dw = Math.ceil(sw * width / iw);\n\t\t\t\tvar dy = (sy * height / ih / vertSquashRatio + y) << 0;\n\t\t\t\tvar dh = Math.ceil(sh * height / ih / vertSquashRatio);\n\t\t\t\tctx.drawImage(tmpCanvas, 0, 0, sw, sh, dx, dy, dw, dh);\n\t\t\t\tsx += d;\n\t\t\t}\n\t\t\tsy += d;\n\t\t}\n\t\ttmpCanvas = tmpCtx = null;\n\t}\n\n\t/**\n\t * Detect subsampling in loaded image.\n\t * In iOS, larger images than 2M pixels may be subsampled in rendering.\n\t */\n\tfunction detectSubsampling(img) {\n\t\tvar iw = img.naturalWidth, ih = img.naturalHeight;\n\t\tif (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image\n\t\t\tvar canvas = document.createElement('canvas');\n\t\t\tcanvas.width = canvas.height = 1;\n\t\t\tvar ctx = canvas.getContext('2d');\n\t\t\tctx.drawImage(img, -iw + 1, 0);\n\t\t\t// subsampled image becomes half smaller in rendering size.\n\t\t\t// check alpha channel value to confirm image is covering edge pixel or not.\n\t\t\t// if alpha value is 0 image is not covering, hence subsampled.\n\t\t\treturn ctx.getImageData(0, 0, 1, 1).data[3] === 0;\n\t\t} else {\n\t\t\treturn false;\n\t\t}\n\t}\n\n\n\t/**\n\t * Detecting vertical squash in loaded image.\n\t * Fixes a bug which squash image vertically while drawing into canvas for some images.\n\t */\n\tfunction detectVerticalSquash(img, iw, ih) {\n\t\tvar canvas = document.createElement('canvas');\n\t\tcanvas.width = 1;\n\t\tcanvas.height = ih;\n\t\tvar ctx = canvas.getContext('2d');\n\t\tctx.drawImage(img, 0, 0);\n\t\tvar data = ctx.getImageData(0, 0, 1, ih).data;\n\t\t// search image edge pixel position in case it is squashed vertically.\n\t\tvar sy = 0;\n\t\tvar ey = ih;\n\t\tvar py = ih;\n\t\twhile (py > sy) {\n\t\t\tvar alpha = data[(py - 1) * 4 + 3];\n\t\t\tif (alpha === 0) {\n\t\t\t\tey = py;\n\t\t\t} else {\n\t\t\tsy = py;\n\t\t\t}\n\t\t\tpy = (ey + sy) >> 1;\n\t\t}\n\t\tcanvas = null;\n\t\tvar ratio = (py / ih);\n\t\treturn (ratio === 0) ? 1 : ratio;\n\t}\n\n\treturn {\n\t\tisSubsampled: detectSubsampling,\n\t\trenderTo: renderImageToCanvas\n\t};\n});\n");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "1581:4393");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "1724:2810");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2937:3559");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3710:4307");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4311:4389");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "1779:1828");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "1832:1882");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "1886:1928");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "1932:1965");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "1969:2025");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2029:2041");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2070:2118");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2122:2160");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2164:2203");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2207:2262");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2266:2276");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2280:2778");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2782:2807");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2002:2009");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2014:2021");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2301:2335");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2340:2350");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2355:2762");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2767:2774");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2377:2411");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2417:2445");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2451:2482");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2488:2523");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2529:2564");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2570:2624");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2630:2684");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2690:2744");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2750:2757");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "2973:3022");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3026:3556");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3105:3150");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3155:3187");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3192:3225");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3230:3260");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3475:3524");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3540:3552");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3757:3802");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3806:3822");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3826:3844");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3848:3881");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3885:3909");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "3913:3958");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4035:4045");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4049:4060");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4064:4075");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4079:4226");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4230:4243");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4247:4268");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4272:4304");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4100:4134");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4139:4198");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4203:4222");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4162:4169");
__$coverInitRange("src/javascript/runtime/html5/image/MegaPixel.js", "4186:4193");
__$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '1581:4393');
define('moxie/runtime/html5/image/MegaPixel', [], function () {
    __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '1724:2810');
    function renderImageToCanvas(img, canvas, options) {
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '1779:1828');
        var iw = img.naturalWidth, ih = img.naturalHeight;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '1832:1882');
        var width = options.width, height = options.height;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '1886:1928');
        var x = options.x || 0, y = options.y || 0;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '1932:1965');
        var ctx = canvas.getContext('2d');
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '1969:2025');
        if (detectSubsampling(img)) {
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2002:2009');
            iw /= 2;
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2014:2021');
            ih /= 2;
        }
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2029:2041');
        var d = 1024;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2070:2118');
        var tmpCanvas = document.createElement('canvas');
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2122:2160');
        tmpCanvas.width = tmpCanvas.height = d;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2164:2203');
        var tmpCtx = tmpCanvas.getContext('2d');
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2207:2262');
        var vertSquashRatio = detectVerticalSquash(img, iw, ih);
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2266:2276');
        var sy = 0;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2280:2778');
        while (sy < ih) {
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2301:2335');
            var sh = sy + d > ih ? ih - sy : d;
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2340:2350');
            var sx = 0;
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2355:2762');
            while (sx < iw) {
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2377:2411');
                var sw = sx + d > iw ? iw - sx : d;
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2417:2445');
                tmpCtx.clearRect(0, 0, d, d);
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2451:2482');
                tmpCtx.drawImage(img, -sx, -sy);
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2488:2523');
                var dx = sx * width / iw + x << 0;
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2529:2564');
                var dw = Math.ceil(sw * width / iw);
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2570:2624');
                var dy = sy * height / ih / vertSquashRatio + y << 0;
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2630:2684');
                var dh = Math.ceil(sh * height / ih / vertSquashRatio);
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2690:2744');
                ctx.drawImage(tmpCanvas, 0, 0, sw, sh, dx, dy, dw, dh);
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2750:2757');
                sx += d;
            }
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2767:2774');
            sy += d;
        }
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2782:2807');
        tmpCanvas = tmpCtx = null;
    }
    __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2937:3559');
    function detectSubsampling(img) {
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '2973:3022');
        var iw = img.naturalWidth, ih = img.naturalHeight;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3026:3556');
        if (iw * ih > 1024 * 1024) {
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3105:3150');
            var canvas = document.createElement('canvas');
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3155:3187');
            canvas.width = canvas.height = 1;
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3192:3225');
            var ctx = canvas.getContext('2d');
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3230:3260');
            ctx.drawImage(img, -iw + 1, 0);
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3475:3524');
            return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
        } else {
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3540:3552');
            return false;
        }
    }
    __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3710:4307');
    function detectVerticalSquash(img, iw, ih) {
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3757:3802');
        var canvas = document.createElement('canvas');
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3806:3822');
        canvas.width = 1;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3826:3844');
        canvas.height = ih;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3848:3881');
        var ctx = canvas.getContext('2d');
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3885:3909');
        ctx.drawImage(img, 0, 0);
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '3913:3958');
        var data = ctx.getImageData(0, 0, 1, ih).data;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4035:4045');
        var sy = 0;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4049:4060');
        var ey = ih;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4064:4075');
        var py = ih;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4079:4226');
        while (py > sy) {
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4100:4134');
            var alpha = data[(py - 1) * 4 + 3];
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4139:4198');
            if (alpha === 0) {
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4162:4169');
                ey = py;
            } else {
                __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4186:4193');
                sy = py;
            }
            __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4203:4222');
            py = ey + sy >> 1;
        }
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4230:4243');
        canvas = null;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4247:4268');
        var ratio = py / ih;
        __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4272:4304');
        return ratio === 0 ? 1 : ratio;
    }
    __$coverCall('src/javascript/runtime/html5/image/MegaPixel.js', '4311:4389');
    return {
        isSubsampled: detectSubsampling,
        renderTo: renderImageToCanvas
    };
});

// Included from: src/javascript/runtime/html5/image/Image.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html5/image/Image.js", "/**\n * Image.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true, laxcomma:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html5/image/Image\n@private\n*/\ndefine(\"moxie/runtime/html5/image/Image\", [\n\t\"moxie/runtime/html5/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/core/utils/Encode\",\n\t\"moxie/file/Blob\",\n\t\"moxie/runtime/html5/image/ImageInfo\",\n\t\"moxie/runtime/html5/image/MegaPixel\",\n\t\"moxie/core/utils/Mime\",\n\t\"moxie/core/utils/Env\"\n], function(extensions, Basic, x, Encode, Blob, ImageInfo, MegaPixel, Mime, Env) {\n\t\n\tfunction HTML5Image() {\n\t\tvar me = this\n\t\t, _img, _imgInfo, _canvas, _binStr, _srcBlob\n\t\t, _modified = false // is set true whenever image is modified\n\t\t, _preserveHeaders = true\n\t\t;\n\n\t\tBasic.extend(this, {\n\t\t\tloadFromBlob: function(blob) {\n\t\t\t\tvar comp = this, I = comp.getRuntime()\n\t\t\t\t, asBinary = arguments.length > 1 ? arguments[1] : true\n\t\t\t\t;\n\n\t\t\t\tif (!I.can('access_binary')) {\n\t\t\t\t\tthrow new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);\n\t\t\t\t}\n\n\t\t\t\tif (blob.isDetached()) {\n\t\t\t\t\t_srcBlob = {\n\t\t\t\t\t\tname: blob.name,\n\t\t\t\t\t\tsize: blob.size,\n\t\t\t\t\t\ttype: blob.type\n\t\t\t\t\t};\n\t\t\t\t\t_loadFromBinaryString.call(this, blob.getSource());\n\t\t\t\t\treturn;\n\t\t\t\t} else {\n\t\t\t\t\t_srcBlob = blob.getSource();\n\n\t\t\t\t\tif (asBinary) { // this will let us to hack the file internals\n\t\t\t\t\t\t_readAsBinaryString(_srcBlob, function(data) {\n\t\t\t\t\t\t\t_loadFromBinaryString.call(comp, data);\n\t\t\t\t\t\t});\n\t\t\t\t\t} else { // ... but this is faster\n\t\t\t\t\t\t_readAsDataUrl(_srcBlob, function(data) {\n\t\t\t\t\t\t\t_loadFromDataUrl.call(comp, data);\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tloadFromImage: function(img, exact) {\n\t\t\t\tthis.meta = img.meta;\n\n\t\t\t\t_srcBlob = {\n\t\t\t\t\tname: img.name,\n\t\t\t\t\tsize: img.size,\n\t\t\t\t\ttype: img.type\n\t\t\t\t};\n\n\t\t\t\tif (exact) {\n\t\t\t\t\t_loadFromBinaryString.call(this, img.getAsBinaryString());\n\t\t\t\t} else {\n\t\t\t\t\t_loadFromDataUrl.call(this, img.getAsDataURL());\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tgetInfo: function() {\n\t\t\t\tvar I = this.getRuntime(), info;\n\n\t\t\t\tif (!_imgInfo && _binStr && I.can('access_image_binary')) {\n\t\t\t\t\t_imgInfo = new ImageInfo(_binStr);\n\t\t\t\t}\n\n\t\t\t\tinfo = {\n\t\t\t\t\twidth: _getImg().width || 0,\n\t\t\t\t\theight: _getImg().height || 0,\n\t\t\t\t\ttype: _srcBlob.type || Mime.getFileMime(_srcBlob.name),\n\t\t\t\t\tsize: _binStr && _binStr.length || _srcBlob.size || 0,\n\t\t\t\t\tname: _srcBlob.name || '',\n\t\t\t\t\tmeta: _imgInfo && _imgInfo.meta || this.meta || {}\n\t\t\t\t};\n\n\t\t\t\treturn info;\n\t\t\t},\n\n\t\t\tresize: function() {\n\t\t\t\t_resize.apply(this, arguments);\n\t\t\t},\n\n\t\t\tgetAsCanvas: function() {\n\t\t\t\tif (_canvas) {\n\t\t\t\t\t_canvas.id = this.uid + '_canvas';\n\t\t\t\t}\n\t\t\t\treturn _canvas;\n\t\t\t},\n\n\t\t\tgetAsBlob: function(type, quality) {\n\t\t\t\tif (type !== this.type) {\n\t\t\t\t\t// if different mime type requested prepare image for conversion\n\t\t\t\t\t_resize.call(this, this.width, this.height, false);\n\t\t\t\t}\n\t\t\t\treturn new Blob(null, me.getAsDataURL.call(this, type, quality));\n\t\t\t},\n\n\t\t\tgetAsDataURL: function(type) {\n\t\t\t\tvar quality = arguments[1] || 90;\n\n\t\t\t\t// if image has not been modified, return the source right away\n\t\t\t\tif (!_modified) {\n\t\t\t\t\treturn _img.src;\n\t\t\t\t}\n\n\t\t\t\tif ('image/jpeg' !== type) {\n\t\t\t\t\treturn _canvas.toDataURL('image/png');\n\t\t\t\t} else {\n\t\t\t\t\ttry {\n\t\t\t\t\t\t// older Geckos used to result in an exception on quality argument\n\t\t\t\t\t\treturn _canvas.toDataURL('image/jpeg', quality/100);\n\t\t\t\t\t} catch (ex) {\n\t\t\t\t\t\treturn _canvas.toDataURL('image/jpeg');\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t},\n\n\t\t\tgetAsBinaryString: function(type, quality) {\n\t\t\t\t// if image has not been modified, return the source right away\n\t\t\t\tif (!_modified) {\n\t\t\t\t\t// if image was not loaded from binary string\n\t\t\t\t\tif (!_binStr) {\n\t\t\t\t\t\t_binStr = _convertToBinary(me.getAsDataURL(type, quality));\n\t\t\t\t\t}\n\t\t\t\t\treturn _binStr;\n\t\t\t\t}\n\n\t\t\t\tif ('image/jpeg' !== type) {\n\t\t\t\t\t_binStr = _convertToBinary(me.getAsDataURL(type, quality));\n\t\t\t\t} else {\n\t\t\t\t\tvar dataUrl;\n\n\t\t\t\t\t// if jpeg\n\t\t\t\t\tif (!quality) {\n\t\t\t\t\t\tquality = 90;\n\t\t\t\t\t}\n\n\t\t\t\t\ttry {\n\t\t\t\t\t\t// older Geckos used to result in an exception on quality argument\n\t\t\t\t\t\tdataUrl = _canvas.toDataURL('image/jpeg', quality/100);\n\t\t\t\t\t} catch (ex) {\n\t\t\t\t\t\tdataUrl = _canvas.toDataURL('image/jpeg');\n\t\t\t\t\t}\n\n\t\t\t\t\t_binStr = _convertToBinary(dataUrl);\n\n\t\t\t\t\tif (_imgInfo && _preserveHeaders) {\n\t\t\t\t\t\t// update dimensions info in exif\n\t\t\t\t\t\tif (_imgInfo.meta && _imgInfo.meta.exif) {\n\t\t\t\t\t\t\t_imgInfo.setExif({\n\t\t\t\t\t\t\t\tPixelXDimension: this.width,\n\t\t\t\t\t\t\t\tPixelYDimension: this.height\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t// re-inject the headers\n\t\t\t\t\t\t_binStr = _imgInfo.writeHeaders(_binStr);\n\n\t\t\t\t\t\t// will be re-created from fresh on next getInfo call\n\t\t\t\t\t\t_imgInfo.purge();\n\t\t\t\t\t\t_imgInfo = null;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\t_modified = false;\n\n\t\t\t\treturn _binStr;\n\t\t\t},\n\n\t\t\tdestroy: function() {\n\t\t\t\tme = null;\n\t\t\t\t_purge.call(this);\n\t\t\t\tthis.getRuntime().getShim().removeInstance(this.uid);\n\t\t\t}\n\t\t});\n\n\n\t\tfunction _getImg() {\n\t\t\tif (!_canvas && !_img) {\n\t\t\t\tthrow new x.ImageError(x.DOMException.INVALID_STATE_ERR);\n\t\t\t}\n\t\t\treturn _canvas || _img;\n\t\t}\n\n\n\t\tfunction _convertToBinary(dataUrl) {\n\t\t\treturn Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7));\n\t\t}\n\n\n\t\tfunction _loadFromBinaryString(binStr) {\n\t\t\tvar comp = this;\n\n\t\t\t_purge.call(this);\n\n\t\t\t_img = new Image();\n\t\t\t_img.onerror = function() {\n\t\t\t\t_purge.call(this);\n\t\t\t\tthrow new x.ImageError(x.ImageError.WRONG_FORMAT);\n\t\t\t};\n\t\t\t_img.onload = function() {\n\t\t\t\t_binStr = binStr;\n\t\t\t\tcomp.trigger('load');\n\t\t\t};\n\n\t\t\t_img.src = 'data:' + (_srcBlob.type || '') + ';base64,' + Encode.btoa(binStr);\n\t\t}\n\n\t\tfunction _loadFromDataUrl(dataUrl) {\n\t\t\tvar comp = this;\n\n\t\t\t_img = new Image();\n\t\t\t_img.onerror = function() {\n\t\t\t\t_purge.call(this);\n\t\t\t\tthrow new x.ImageError(x.ImageError.WRONG_FORMAT);\n\t\t\t};\n\t\t\t_img.onload = function() {\n\t\t\t\tcomp.trigger('load');\n\t\t\t};\n\t\t\t_img.src = dataUrl;\n\t\t}\n\n\t\tfunction _readAsBinaryString(file, callback) {\n\t\t\tvar fr;\n\n\t\t\t// use FileReader if it's available\n\t\t\tif (window.FileReader) {\n\t\t\t\tfr = new FileReader();\n\t\t\t\tfr.onload = function() {\n\t\t\t\t\tcallback(this.result);\n\t\t\t\t};\n\t\t\t\tfr.readAsBinaryString(file);\n\t\t\t} else {\n\t\t\t\treturn callback(file.getAsBinary());\n\t\t\t}\n\t\t}\n\n\t\tfunction _readAsDataUrl(file, callback) {\n\t\t\tvar fr;\n\n\t\t\t// use FileReader if it's available\n\t\t\tif (window.FileReader) {\n\t\t\t\tfr = new FileReader();\n\t\t\t\tfr.onload = function() {\n\t\t\t\t\tcallback(this.result);\n\t\t\t\t};\n\t\t\t\tfr.readAsDataURL(file);\n\t\t\t} else {\n\t\t\t\treturn callback(file.getAsDataURL());\n\t\t\t}\n\t\t}\n\n\t\tfunction _resize(width, height, crop, preserveHeaders) {\n\t\t\tvar self = this, ctx, scale, mathFn, x, y, img, imgWidth, imgHeight, orientation;\n\n\t\t\t_preserveHeaders = preserveHeaders; // we will need to check this on export\n\n\t\t\t// take into account orientation tag\n\t\t\torientation = (this.meta && this.meta.tiff && this.meta.tiff.Orientation) || 1;\n\n\t\t\tif (Basic.inArray(orientation, [5,6,7,8]) !== -1) { // values that require 90 degree rotation\n\t\t\t\t// swap dimensions\n\t\t\t\tvar mem = width;\n\t\t\t\twidth = height;\n\t\t\t\theight = mem;\n\t\t\t}\n\n\t\t\timg = _getImg();\n\n\t\t\t// unify dimensions\n\t\t\tmathFn = !crop ? Math.min : Math.max;\n\t\t\tscale = mathFn(width/img.width, height/img.height);\n\t\t\n\t\t\t// we only downsize here\n\t\t\tif (scale > 1 && (!crop || preserveHeaders)) { // when cropping one of dimensions may still exceed max, so process it anyway\n\t\t\t\tthis.trigger('Resize');\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\timgWidth = Math.round(img.width * scale);\n\t\t\timgHeight = Math.round(img.height * scale);\n\n\t\t\t// prepare canvas if necessary\n\t\t\tif (!_canvas) {\n\t\t\t\t_canvas = document.createElement(\"canvas\");\n\t\t\t}\n\n\t\t\tctx = _canvas.getContext('2d');\n\n\t\t\t// scale image and canvas\n\t\t\tif (crop) {\n\t\t\t\t_canvas.width = width;\n\t\t\t\t_canvas.height = height;\n\t\t\t} else {\n\t\t\t\t_canvas.width = imgWidth;\n\t\t\t\t_canvas.height = imgHeight;\n\t\t\t}\n\n\t\t\t// if dimensions of the resulting image still larger than canvas, center it\n\t\t\tx = imgWidth > _canvas.width ? Math.round((imgWidth - _canvas.width) / 2)  : 0;\n\t\t\ty = imgHeight > _canvas.height ? Math.round((imgHeight - _canvas.height) / 2) : 0;\n\n\t\t\tif (!_preserveHeaders) {\n\t\t\t\t_rotateToOrientaion(_canvas.width, _canvas.height, orientation);\n\t\t\t}\n\n\t\t\t_drawToCanvas.call(this, img, _canvas, -x, -y, imgWidth, imgHeight);\n\n\t\t\tthis.width = _canvas.width;\n\t\t\tthis.height = _canvas.height;\n\n\t\t\t_modified = true;\n\t\t\tself.trigger('Resize');\n\t\t}\n\n\n\t\tfunction _drawToCanvas(img, canvas, x, y, w, h) {\n\t\t\tif (Env.OS === 'iOS') { \n\t\t\t\t// avoid squish bug in iOS6\n\t\t\t\tMegaPixel.renderTo(img, canvas, { width: w, height: h, x: x, y: y });\n\t\t\t} else {\n\t\t\t\tvar ctx = canvas.getContext('2d');\n\t\t\t\tctx.drawImage(img, x, y, w, h);\n\t\t\t}\n\t\t}\n\n\n\t\t/**\n\t\t* Transform canvas coordination according to specified frame size and orientation\n\t\t* Orientation value is from EXIF tag\n\t\t* @author Shinichi Tomita <shinichi.tomita@gmail.com>\n\t\t*/\n\t\tfunction _rotateToOrientaion(width, height, orientation) {\n\t\t\tswitch (orientation) {\n\t\t\t\tcase 5:\n\t\t\t\tcase 6:\n\t\t\t\tcase 7:\n\t\t\t\tcase 8:\n\t\t\t\t\t_canvas.width = height;\n\t\t\t\t\t_canvas.height = width;\n\t\t\t\t\tbreak;\n\t\t\t\tdefault:\n\t\t\t\t\t_canvas.width = width;\n\t\t\t\t\t_canvas.height = height;\n\t\t\t}\n\n\t\t\t/**\n\t\t\t1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.\n\t\t\t2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.\n\t\t\t3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.\n\t\t\t4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.\n\t\t\t5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.\n\t\t\t6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.\n\t\t\t7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.\n\t\t\t8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.\n\t\t\t*/\n\n\t\t\tvar ctx = _canvas.getContext('2d');\n\t\t\tswitch (orientation) {\n\t\t\t\tcase 2:\n\t\t\t\t\t// horizontal flip\n\t\t\t\t\tctx.translate(width, 0);\n\t\t\t\t\tctx.scale(-1, 1);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 3:\n\t\t\t\t\t// 180 rotate left\n\t\t\t\t\tctx.translate(width, height);\n\t\t\t\t\tctx.rotate(Math.PI);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 4:\n\t\t\t\t\t// vertical flip\n\t\t\t\t\tctx.translate(0, height);\n\t\t\t\t\tctx.scale(1, -1);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 5:\n\t\t\t\t\t// vertical flip + 90 rotate right\n\t\t\t\t\tctx.rotate(0.5 * Math.PI);\n\t\t\t\t\tctx.scale(1, -1);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 6:\n\t\t\t\t\t// 90 rotate right\n\t\t\t\t\tctx.rotate(0.5 * Math.PI);\n\t\t\t\t\tctx.translate(0, -height);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 7:\n\t\t\t\t\t// horizontal flip + 90 rotate right\n\t\t\t\t\tctx.rotate(0.5 * Math.PI);\n\t\t\t\t\tctx.translate(width, -height);\n\t\t\t\t\tctx.scale(-1, 1);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 8:\n\t\t\t\t\t// 90 rotate left\n\t\t\t\t\tctx.rotate(-0.5 * Math.PI);\n\t\t\t\t\tctx.translate(-width, 0);\n\t\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\n\n\t\tfunction _purge() {\n\t\t\tif (_imgInfo) {\n\t\t\t\t_imgInfo.purge();\n\t\t\t\t_imgInfo = null;\n\t\t\t}\n\t\t\t_binStr = _img = _canvas = null;\n\t\t\t_modified = false;\n\t\t}\n\t}\n\n\treturn (extensions.Image = HTML5Image);\n});\n");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "414:11141");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "807:11095");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "11099:11137");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "833:987");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "988:988");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "993:5041");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5047:5192");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5198:5311");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5317:5709");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5714:5997");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6002:6312");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6317:6618");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6623:8456");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8462:8740");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8936:10939");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10945:11092");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1052:1154");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1155:1155");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1162:1262");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1269:1835");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1198:1256");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1299:1386");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1393:1443");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1450:1456");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1476:1503");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1511:1829");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1580:1682");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1634:1672");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1730:1822");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1779:1812");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1889:1909");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "1916:1996");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2003:2151");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2021:2078");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2098:2145");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2189:2220");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2227:2331");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2338:2631");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2638:2649");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2292:2325");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2686:2716");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2758:2817");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2823:2837");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2778:2811");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2890:3047");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3053:3117");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "2991:3041");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3164:3196");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3271:3315");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3322:3628");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3294:3309");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3356:3393");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3413:3622");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3498:3549");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3577:3615");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3757:3945");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3952:4857");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4864:4881");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4888:4902");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3831:3918");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3925:3939");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3853:3911");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "3986:4044");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4064:4075");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4099:4140");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4148:4363");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4371:4406");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4414:4851");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4121:4133");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4233:4287");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4315:4356");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4496:4656");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4696:4736");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4805:4821");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4829:4844");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4546:4648");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4940:4949");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4955:4972");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "4978:5030");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5071:5161");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5166:5188");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5100:5156");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5238:5307");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5361:5376");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5382:5399");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5405:5423");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5428:5538");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5543:5622");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5628:5705");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5460:5477");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5483:5532");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5574:5590");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5596:5616");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5754:5769");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5775:5793");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5798:5908");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5913:5970");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5975:5993");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5830:5847");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5853:5902");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "5944:5964");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6052:6058");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6103:6308");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6132:6153");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6159:6217");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6223:6250");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6189:6210");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6268:6303");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6362:6368");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6413:6614");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6442:6463");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6469:6527");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6533:6555");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6499:6520");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6573:6609");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6683:6763");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6769:6803");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6889:6967");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "6973:7152");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7158:7173");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7202:7238");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7243:7293");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7329:7497");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7503:7543");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7548:7590");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7630:7697");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7703:7733");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7768:7913");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7998:8076");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8081:8162");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8168:8265");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8271:8338");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8344:8370");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8375:8403");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8409:8425");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8430:8452");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7094:7109");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7115:7129");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7135:7147");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7458:7480");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7486:7492");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7650:7692");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7784:7805");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7811:7834");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7852:7876");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "7882:7908");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8197:8260");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8515:8736");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8576:8644");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8662:8695");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8701:8731");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "8998:9213");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10061:10095");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10100:10935");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "9074:9096");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "9103:9125");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "9132:9137");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "9157:9178");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "9185:9208");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10164:10187");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10194:10210");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10217:10222");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10265:10293");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10300:10319");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10326:10331");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10372:10396");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10403:10419");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10426:10431");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10490:10515");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10522:10538");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10545:10550");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10593:10618");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10625:10650");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10657:10662");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10723:10748");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10755:10784");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10791:10807");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10814:10819");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10861:10887");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10894:10918");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10925:10930");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10968:11030");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "11035:11066");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "11071:11088");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "10988:11004");
__$coverInitRange("src/javascript/runtime/html5/image/Image.js", "11010:11025");
__$coverCall('src/javascript/runtime/html5/image/Image.js', '414:11141');
define('moxie/runtime/html5/image/Image', [
    'moxie/runtime/html5/Runtime',
    'moxie/core/utils/Basic',
    'moxie/core/Exceptions',
    'moxie/core/utils/Encode',
    'moxie/file/Blob',
    'moxie/runtime/html5/image/ImageInfo',
    'moxie/runtime/html5/image/MegaPixel',
    'moxie/core/utils/Mime',
    'moxie/core/utils/Env'
], function (extensions, Basic, x, Encode, Blob, ImageInfo, MegaPixel, Mime, Env) {
    __$coverCall('src/javascript/runtime/html5/image/Image.js', '807:11095');
    function HTML5Image() {
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '833:987');
        var me = this, _img, _imgInfo, _canvas, _binStr, _srcBlob, _modified = false, _preserveHeaders = true;
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '988:988');
        ;
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '993:5041');
        Basic.extend(this, {
            loadFromBlob: function (blob) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '1052:1154');
                var comp = this, I = comp.getRuntime(), asBinary = arguments.length > 1 ? arguments[1] : true;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '1155:1155');
                ;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '1162:1262');
                if (!I.can('access_binary')) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '1198:1256');
                    throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
                }
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '1269:1835');
                if (blob.isDetached()) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '1299:1386');
                    _srcBlob = {
                        name: blob.name,
                        size: blob.size,
                        type: blob.type
                    };
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '1393:1443');
                    _loadFromBinaryString.call(this, blob.getSource());
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '1450:1456');
                    return;
                } else {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '1476:1503');
                    _srcBlob = blob.getSource();
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '1511:1829');
                    if (asBinary) {
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '1580:1682');
                        _readAsBinaryString(_srcBlob, function (data) {
                            __$coverCall('src/javascript/runtime/html5/image/Image.js', '1634:1672');
                            _loadFromBinaryString.call(comp, data);
                        });
                    } else {
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '1730:1822');
                        _readAsDataUrl(_srcBlob, function (data) {
                            __$coverCall('src/javascript/runtime/html5/image/Image.js', '1779:1812');
                            _loadFromDataUrl.call(comp, data);
                        });
                    }
                }
            },
            loadFromImage: function (img, exact) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '1889:1909');
                this.meta = img.meta;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '1916:1996');
                _srcBlob = {
                    name: img.name,
                    size: img.size,
                    type: img.type
                };
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '2003:2151');
                if (exact) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '2021:2078');
                    _loadFromBinaryString.call(this, img.getAsBinaryString());
                } else {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '2098:2145');
                    _loadFromDataUrl.call(this, img.getAsDataURL());
                }
            },
            getInfo: function () {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '2189:2220');
                var I = this.getRuntime(), info;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '2227:2331');
                if (!_imgInfo && _binStr && I.can('access_image_binary')) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '2292:2325');
                    _imgInfo = new ImageInfo(_binStr);
                }
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '2338:2631');
                info = {
                    width: _getImg().width || 0,
                    height: _getImg().height || 0,
                    type: _srcBlob.type || Mime.getFileMime(_srcBlob.name),
                    size: _binStr && _binStr.length || _srcBlob.size || 0,
                    name: _srcBlob.name || '',
                    meta: _imgInfo && _imgInfo.meta || this.meta || {}
                };
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '2638:2649');
                return info;
            },
            resize: function () {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '2686:2716');
                _resize.apply(this, arguments);
            },
            getAsCanvas: function () {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '2758:2817');
                if (_canvas) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '2778:2811');
                    _canvas.id = this.uid + '_canvas';
                }
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '2823:2837');
                return _canvas;
            },
            getAsBlob: function (type, quality) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '2890:3047');
                if (type !== this.type) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '2991:3041');
                    _resize.call(this, this.width, this.height, false);
                }
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '3053:3117');
                return new Blob(null, me.getAsDataURL.call(this, type, quality));
            },
            getAsDataURL: function (type) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '3164:3196');
                var quality = arguments[1] || 90;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '3271:3315');
                if (!_modified) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '3294:3309');
                    return _img.src;
                }
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '3322:3628');
                if ('image/jpeg' !== type) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '3356:3393');
                    return _canvas.toDataURL('image/png');
                } else {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '3413:3622');
                    try {
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '3498:3549');
                        return _canvas.toDataURL('image/jpeg', quality / 100);
                    } catch (ex) {
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '3577:3615');
                        return _canvas.toDataURL('image/jpeg');
                    }
                }
            },
            getAsBinaryString: function (type, quality) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '3757:3945');
                if (!_modified) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '3831:3918');
                    if (!_binStr) {
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '3853:3911');
                        _binStr = _convertToBinary(me.getAsDataURL(type, quality));
                    }
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '3925:3939');
                    return _binStr;
                }
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '3952:4857');
                if ('image/jpeg' !== type) {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '3986:4044');
                    _binStr = _convertToBinary(me.getAsDataURL(type, quality));
                } else {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '4064:4075');
                    var dataUrl;
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '4099:4140');
                    if (!quality) {
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '4121:4133');
                        quality = 90;
                    }
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '4148:4363');
                    try {
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '4233:4287');
                        dataUrl = _canvas.toDataURL('image/jpeg', quality / 100);
                    } catch (ex) {
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '4315:4356');
                        dataUrl = _canvas.toDataURL('image/jpeg');
                    }
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '4371:4406');
                    _binStr = _convertToBinary(dataUrl);
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '4414:4851');
                    if (_imgInfo && _preserveHeaders) {
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '4496:4656');
                        if (_imgInfo.meta && _imgInfo.meta.exif) {
                            __$coverCall('src/javascript/runtime/html5/image/Image.js', '4546:4648');
                            _imgInfo.setExif({
                                PixelXDimension: this.width,
                                PixelYDimension: this.height
                            });
                        }
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '4696:4736');
                        _binStr = _imgInfo.writeHeaders(_binStr);
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '4805:4821');
                        _imgInfo.purge();
                        __$coverCall('src/javascript/runtime/html5/image/Image.js', '4829:4844');
                        _imgInfo = null;
                    }
                }
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '4864:4881');
                _modified = false;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '4888:4902');
                return _binStr;
            },
            destroy: function () {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '4940:4949');
                me = null;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '4955:4972');
                _purge.call(this);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '4978:5030');
                this.getRuntime().getShim().removeInstance(this.uid);
            }
        });
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '5047:5192');
        function _getImg() {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5071:5161');
            if (!_canvas && !_img) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '5100:5156');
                throw new x.ImageError(x.DOMException.INVALID_STATE_ERR);
            }
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5166:5188');
            return _canvas || _img;
        }
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '5198:5311');
        function _convertToBinary(dataUrl) {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5238:5307');
            return Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7));
        }
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '5317:5709');
        function _loadFromBinaryString(binStr) {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5361:5376');
            var comp = this;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5382:5399');
            _purge.call(this);
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5405:5423');
            _img = new Image();
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5428:5538');
            _img.onerror = function () {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '5460:5477');
                _purge.call(this);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '5483:5532');
                throw new x.ImageError(x.ImageError.WRONG_FORMAT);
            };
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5543:5622');
            _img.onload = function () {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '5574:5590');
                _binStr = binStr;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '5596:5616');
                comp.trigger('load');
            };
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5628:5705');
            _img.src = 'data:' + (_srcBlob.type || '') + ';base64,' + Encode.btoa(binStr);
        }
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '5714:5997');
        function _loadFromDataUrl(dataUrl) {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5754:5769');
            var comp = this;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5775:5793');
            _img = new Image();
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5798:5908');
            _img.onerror = function () {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '5830:5847');
                _purge.call(this);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '5853:5902');
                throw new x.ImageError(x.ImageError.WRONG_FORMAT);
            };
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5913:5970');
            _img.onload = function () {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '5944:5964');
                comp.trigger('load');
            };
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '5975:5993');
            _img.src = dataUrl;
        }
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '6002:6312');
        function _readAsBinaryString(file, callback) {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '6052:6058');
            var fr;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '6103:6308');
            if (window.FileReader) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '6132:6153');
                fr = new FileReader();
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '6159:6217');
                fr.onload = function () {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '6189:6210');
                    callback(this.result);
                };
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '6223:6250');
                fr.readAsBinaryString(file);
            } else {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '6268:6303');
                return callback(file.getAsBinary());
            }
        }
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '6317:6618');
        function _readAsDataUrl(file, callback) {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '6362:6368');
            var fr;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '6413:6614');
            if (window.FileReader) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '6442:6463');
                fr = new FileReader();
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '6469:6527');
                fr.onload = function () {
                    __$coverCall('src/javascript/runtime/html5/image/Image.js', '6499:6520');
                    callback(this.result);
                };
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '6533:6555');
                fr.readAsDataURL(file);
            } else {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '6573:6609');
                return callback(file.getAsDataURL());
            }
        }
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '6623:8456');
        function _resize(width, height, crop, preserveHeaders) {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '6683:6763');
            var self = this, ctx, scale, mathFn, x, y, img, imgWidth, imgHeight, orientation;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '6769:6803');
            _preserveHeaders = preserveHeaders;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '6889:6967');
            orientation = this.meta && this.meta.tiff && this.meta.tiff.Orientation || 1;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '6973:7152');
            if (Basic.inArray(orientation, [
                    5,
                    6,
                    7,
                    8
                ]) !== -1) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7094:7109');
                var mem = width;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7115:7129');
                width = height;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7135:7147');
                height = mem;
            }
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7158:7173');
            img = _getImg();
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7202:7238');
            mathFn = !crop ? Math.min : Math.max;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7243:7293');
            scale = mathFn(width / img.width, height / img.height);
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7329:7497');
            if (scale > 1 && (!crop || preserveHeaders)) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7458:7480');
                this.trigger('Resize');
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7486:7492');
                return;
            }
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7503:7543');
            imgWidth = Math.round(img.width * scale);
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7548:7590');
            imgHeight = Math.round(img.height * scale);
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7630:7697');
            if (!_canvas) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7650:7692');
                _canvas = document.createElement('canvas');
            }
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7703:7733');
            ctx = _canvas.getContext('2d');
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7768:7913');
            if (crop) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7784:7805');
                _canvas.width = width;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7811:7834');
                _canvas.height = height;
            } else {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7852:7876');
                _canvas.width = imgWidth;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '7882:7908');
                _canvas.height = imgHeight;
            }
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '7998:8076');
            x = imgWidth > _canvas.width ? Math.round((imgWidth - _canvas.width) / 2) : 0;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '8081:8162');
            y = imgHeight > _canvas.height ? Math.round((imgHeight - _canvas.height) / 2) : 0;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '8168:8265');
            if (!_preserveHeaders) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '8197:8260');
                _rotateToOrientaion(_canvas.width, _canvas.height, orientation);
            }
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '8271:8338');
            _drawToCanvas.call(this, img, _canvas, -x, -y, imgWidth, imgHeight);
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '8344:8370');
            this.width = _canvas.width;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '8375:8403');
            this.height = _canvas.height;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '8409:8425');
            _modified = true;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '8430:8452');
            self.trigger('Resize');
        }
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '8462:8740');
        function _drawToCanvas(img, canvas, x, y, w, h) {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '8515:8736');
            if (Env.OS === 'iOS') {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '8576:8644');
                MegaPixel.renderTo(img, canvas, {
                    width: w,
                    height: h,
                    x: x,
                    y: y
                });
            } else {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '8662:8695');
                var ctx = canvas.getContext('2d');
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '8701:8731');
                ctx.drawImage(img, x, y, w, h);
            }
        }
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '8936:10939');
        function _rotateToOrientaion(width, height, orientation) {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '8998:9213');
            switch (orientation) {
            case 5:
            case 6:
            case 7:
            case 8:
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '9074:9096');
                _canvas.width = height;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '9103:9125');
                _canvas.height = width;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '9132:9137');
                break;
            default:
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '9157:9178');
                _canvas.width = width;
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '9185:9208');
                _canvas.height = height;
            }
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '10061:10095');
            var ctx = _canvas.getContext('2d');
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '10100:10935');
            switch (orientation) {
            case 2:
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10164:10187');
                ctx.translate(width, 0);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10194:10210');
                ctx.scale(-1, 1);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10217:10222');
                break;
            case 3:
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10265:10293');
                ctx.translate(width, height);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10300:10319');
                ctx.rotate(Math.PI);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10326:10331');
                break;
            case 4:
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10372:10396');
                ctx.translate(0, height);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10403:10419');
                ctx.scale(1, -1);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10426:10431');
                break;
            case 5:
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10490:10515');
                ctx.rotate(0.5 * Math.PI);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10522:10538');
                ctx.scale(1, -1);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10545:10550');
                break;
            case 6:
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10593:10618');
                ctx.rotate(0.5 * Math.PI);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10625:10650');
                ctx.translate(0, -height);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10657:10662');
                break;
            case 7:
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10723:10748');
                ctx.rotate(0.5 * Math.PI);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10755:10784');
                ctx.translate(width, -height);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10791:10807');
                ctx.scale(-1, 1);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10814:10819');
                break;
            case 8:
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10861:10887');
                ctx.rotate(-0.5 * Math.PI);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10894:10918');
                ctx.translate(-width, 0);
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10925:10930');
                break;
            }
        }
        __$coverCall('src/javascript/runtime/html5/image/Image.js', '10945:11092');
        function _purge() {
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '10968:11030');
            if (_imgInfo) {
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '10988:11004');
                _imgInfo.purge();
                __$coverCall('src/javascript/runtime/html5/image/Image.js', '11010:11025');
                _imgInfo = null;
            }
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '11035:11066');
            _binStr = _img = _canvas = null;
            __$coverCall('src/javascript/runtime/html5/image/Image.js', '11071:11088');
            _modified = false;
        }
    }
    __$coverCall('src/javascript/runtime/html5/image/Image.js', '11099:11137');
    return extensions.Image = HTML5Image;
});

// Included from: src/javascript/runtime/flash/Runtime.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/flash/Runtime.js", "/**\n * Runtime.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true, escape:true, ActiveXObject:true */\n\n/**\nDefines constructor for Flash runtime.\n\n@class moxie/runtime/flash/Runtime\n@private\n*/\ndefine(\"moxie/runtime/flash/Runtime\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/utils/Env\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/runtime/Runtime\"\n], function(Basic, Env, x, Runtime) {\n\t\n\tvar type = 'flash', extensions = {};\n\n\t/**\n\tConstructor for the Flash Runtime\n\n\t@class FlashRuntime\n\t@extends Runtime\n\t*/\n\tfunction FlashRuntime(options) {\n\t\tvar I = this, initTimer;\n\n\t\toptions = Basic.extend({ swf_url: Env.swf_url }, options);\n\n\t\tRuntime.call(this, type, options, (function() {\n\t\t\tfunction use_urlstream() {\n\t\t\t\tvar rc = options.required_features || {};\n\t\t\t\treturn rc.access_binary || rc.send_custom_headers || rc.send_browser_cookies;\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\taccess_binary: true,\n\t\t\t\taccess_image_binary: true,\n\t\t\t\tdisplay_media: true,\n\t\t\t\tdrag_and_drop: false,\n\t\t\t\treport_upload_progress: true,\n\t\t\t\tresize_image: true,\n\t\t\t\treturn_response_headers: false,\n\t\t\t\treturn_response_type: true,\n\t\t\t\treturn_status_code: true,\n\t\t\t\tselect_multiple: true,\n\t\t\t\tsend_binary_string: true,\n\t\t\t\tsend_browser_cookies: function() {\n\t\t\t\t\treturn use_urlstream();\n\t\t\t\t},\n\t\t\t\tsend_custom_headers: function() {\n\t\t\t\t\treturn use_urlstream();\n\t\t\t\t},\n\t\t\t\tsend_multipart: true,\n\t\t\t\tslice_blob: true,\n\t\t\t\tstream_upload: function(value) {\n\t\t\t\t\treturn !!value && !use_urlstream();\n\t\t\t\t},\n\t\t\t\tsummon_file_dialog: false,\n\t\t\t\tupload_filesize: function(size) {\n\t\t\t\t\tvar maxSize = use_urlstream() ? 2097152 : -1; // 200mb || unlimited\n\t\t\t\t\tif (!~maxSize || Basic.parseSizeStr(size) <= maxSize) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\t\t\t\t\treturn false;\n\t\t\t\t},\n\t\t\t\tuse_http_method: function(methods) {\n\t\t\t\t\treturn !Basic.arrayDiff(methods, ['GET', 'POST']);\n\t\t\t\t}\n\t\t\t};\n\t\t}()));\n\n\t\tBasic.extend(this, {\n\n\t\t\tinit: function() {\n\t\t\t\tvar html, el, container;\n\n\t\t\t\t// minimal requirement Flash Player 10\n\t\t\t\tif (getShimVersion() < 10) {\n\t\t\t\t\tthis.trigger(\"Error\", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tcontainer = this.getShimContainer();\n\n\t\t\t\t// if not the minimal height, shims are not initialized in older browsers (e.g FF3.6, IE6,7,8, Safari 4.0,5.0, etc)\n\t\t\t\tBasic.extend(container.style, {\n\t\t\t\t\tposition: 'absolute',\n\t\t\t\t\ttop: '-8px',\n\t\t\t\t\tleft: '-8px',\n\t\t\t\t\twidth: '9px',\n\t\t\t\t\theight: '9px',\n\t\t\t\t\toverflow: 'hidden'\n\t\t\t\t});\n\n\t\t\t\t// insert flash object\n\t\t\t\thtml = '<object id=\"' + this.uid + '\" type=\"application/x-shockwave-flash\" data=\"' +  options.swf_url + '\" ';\n\n\t\t\t\tif (Env.browser === 'IE') {\n\t\t\t\t\thtml += 'classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" ';\n\t\t\t\t}\n\n\t\t\t\thtml += 'width=\"100%\" height=\"100%\" style=\"outline:0\">'  +\n\t\t\t\t\t'<param name=\"movie\" value=\"' + options.swf_url + '\" />' +\n\t\t\t\t\t'<param name=\"flashvars\" value=\"uid=' + escape(this.uid) + '&target=' + Env.global_event_dispatcher + '\" />' +\n\t\t\t\t\t'<param name=\"wmode\" value=\"transparent\" />' +\n\t\t\t\t\t'<param name=\"allowscriptaccess\" value=\"always\" />' +\n\t\t\t\t'</object>';\n\n\t\t\t\tif (Env.browser === 'IE') {\n\t\t\t\t\tel = document.createElement('div');\n\t\t\t\t\tcontainer.appendChild(el);\n\t\t\t\t\tel.outerHTML = html;\n\t\t\t\t\tel = container = null; // just in case\n\t\t\t\t} else {\n\t\t\t\t\tcontainer.innerHTML = html;\n\t\t\t\t}\n\n\t\t\t\t// Init is dispatched by the shim\n\t\t\t\tinitTimer = setTimeout(function() {\n\t\t\t\t\tif (I && !I.initialized) { // runtime might be already destroyed by this moment\n\t\t\t\t\t\tI.trigger(\"Error\", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));\n\t\t\t\t\t}\n\t\t\t\t}, 5000);\n\t\t\t},\n\n\t\t\tdestroy: (function(destroy) { // extend default destroy method\n\t\t\t\treturn function() {\n\t\t\t\t\tdestroy.call(I);\n\t\t\t\t\tclearTimeout(initTimer); // initialization check might be still onwait\n\t\t\t\t\toptions = initTimer = destroy = I = null;\n\t\t\t\t};\n\t\t\t}(this.destroy))\n\n\t\t}, extensions);\n\n\t\t/**\n\t\tGet the version of the Flash Player\n\n\t\t@method getShimVersion\n\t\t@private\n\t\t@return {Number} Flash Player version\n\t\t*/\n\t\tfunction getShimVersion() {\n\t\t\tvar version;\n\n\t\t\ttry {\n\t\t\t\tversion = navigator.plugins['Shockwave Flash'];\n\t\t\t\tversion = version.description;\n\t\t\t} catch (e1) {\n\t\t\t\ttry {\n\t\t\t\t\tversion = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');\n\t\t\t\t} catch (e2) {\n\t\t\t\t\tversion = '0.0';\n\t\t\t\t}\n\t\t\t}\n\t\t\tversion = version.match(/\\d+/g);\n\t\t\treturn parseFloat(version[0] + '.' + version[1]);\n\t\t}\n\t}\n\n\tRuntime.addConstructor(type, FlashRuntime);\n\n\treturn extensions;\n});\n");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "470:4689");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "654:689");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "777:4618");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4622:4664");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4668:4685");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "812:835");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "840:897");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "902:2099");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2104:4081");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4212:4615");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "953:1111");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "1117:2090");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "984:1024");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "1030:1106");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "1490:1512");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "1564:1586");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "1685:1719");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "1802:1846");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "1875:1955");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "1962:1974");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "1937:1948");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2029:2078");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2152:2175");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2225:2348");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2355:2390");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2517:2682");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2716:2824");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2831:2933");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2940:3305");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3312:3533");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3578:3793");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2259:2329");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2336:2342");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "2864:2927");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3345:3379");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3386:3411");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3418:3437");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3444:3465");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3501:3527");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3619:3779");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3705:3772");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3872:4042");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3897:3912");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3919:3942");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "3995:4035");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4243:4254");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4260:4522");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4527:4558");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4563:4611");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4270:4316");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4322:4351");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4375:4517");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4386:4470");
__$coverInitRange("src/javascript/runtime/flash/Runtime.js", "4496:4511");
__$coverCall('src/javascript/runtime/flash/Runtime.js', '470:4689');
define('moxie/runtime/flash/Runtime', [
    'moxie/core/utils/Basic',
    'moxie/core/utils/Env',
    'moxie/core/Exceptions',
    'moxie/runtime/Runtime'
], function (Basic, Env, x, Runtime) {
    __$coverCall('src/javascript/runtime/flash/Runtime.js', '654:689');
    var type = 'flash', extensions = {};
    __$coverCall('src/javascript/runtime/flash/Runtime.js', '777:4618');
    function FlashRuntime(options) {
        __$coverCall('src/javascript/runtime/flash/Runtime.js', '812:835');
        var I = this, initTimer;
        __$coverCall('src/javascript/runtime/flash/Runtime.js', '840:897');
        options = Basic.extend({ swf_url: Env.swf_url }, options);
        __$coverCall('src/javascript/runtime/flash/Runtime.js', '902:2099');
        Runtime.call(this, type, options, function () {
            __$coverCall('src/javascript/runtime/flash/Runtime.js', '953:1111');
            function use_urlstream() {
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '984:1024');
                var rc = options.required_features || {};
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '1030:1106');
                return rc.access_binary || rc.send_custom_headers || rc.send_browser_cookies;
            }
            __$coverCall('src/javascript/runtime/flash/Runtime.js', '1117:2090');
            return {
                access_binary: true,
                access_image_binary: true,
                display_media: true,
                drag_and_drop: false,
                report_upload_progress: true,
                resize_image: true,
                return_response_headers: false,
                return_response_type: true,
                return_status_code: true,
                select_multiple: true,
                send_binary_string: true,
                send_browser_cookies: function () {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '1490:1512');
                    return use_urlstream();
                },
                send_custom_headers: function () {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '1564:1586');
                    return use_urlstream();
                },
                send_multipart: true,
                slice_blob: true,
                stream_upload: function (value) {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '1685:1719');
                    return !!value && !use_urlstream();
                },
                summon_file_dialog: false,
                upload_filesize: function (size) {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '1802:1846');
                    var maxSize = use_urlstream() ? 2097152 : -1;
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '1875:1955');
                    if (!~maxSize || Basic.parseSizeStr(size) <= maxSize) {
                        __$coverCall('src/javascript/runtime/flash/Runtime.js', '1937:1948');
                        return true;
                    }
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '1962:1974');
                    return false;
                },
                use_http_method: function (methods) {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '2029:2078');
                    return !Basic.arrayDiff(methods, [
                        'GET',
                        'POST'
                    ]);
                }
            };
        }());
        __$coverCall('src/javascript/runtime/flash/Runtime.js', '2104:4081');
        Basic.extend(this, {
            init: function () {
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '2152:2175');
                var html, el, container;
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '2225:2348');
                if (getShimVersion() < 10) {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '2259:2329');
                    this.trigger('Error', new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '2336:2342');
                    return;
                }
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '2355:2390');
                container = this.getShimContainer();
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '2517:2682');
                Basic.extend(container.style, {
                    position: 'absolute',
                    top: '-8px',
                    left: '-8px',
                    width: '9px',
                    height: '9px',
                    overflow: 'hidden'
                });
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '2716:2824');
                html = '<object id="' + this.uid + '" type="application/x-shockwave-flash" data="' + options.swf_url + '" ';
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '2831:2933');
                if (Env.browser === 'IE') {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '2864:2927');
                    html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                }
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '2940:3305');
                html += 'width="100%" height="100%" style="outline:0">' + '<param name="movie" value="' + options.swf_url + '" />' + '<param name="flashvars" value="uid=' + escape(this.uid) + '&target=' + Env.global_event_dispatcher + '" />' + '<param name="wmode" value="transparent" />' + '<param name="allowscriptaccess" value="always" />' + '</object>';
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '3312:3533');
                if (Env.browser === 'IE') {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '3345:3379');
                    el = document.createElement('div');
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '3386:3411');
                    container.appendChild(el);
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '3418:3437');
                    el.outerHTML = html;
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '3444:3465');
                    el = container = null;
                } else {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '3501:3527');
                    container.innerHTML = html;
                }
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '3578:3793');
                initTimer = setTimeout(function () {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '3619:3779');
                    if (I && !I.initialized) {
                        __$coverCall('src/javascript/runtime/flash/Runtime.js', '3705:3772');
                        I.trigger('Error', new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
                    }
                }, 5000);
            },
            destroy: function (destroy) {
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '3872:4042');
                return function () {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '3897:3912');
                    destroy.call(I);
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '3919:3942');
                    clearTimeout(initTimer);
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '3995:4035');
                    options = initTimer = destroy = I = null;
                };
            }(this.destroy)
        }, extensions);
        __$coverCall('src/javascript/runtime/flash/Runtime.js', '4212:4615');
        function getShimVersion() {
            __$coverCall('src/javascript/runtime/flash/Runtime.js', '4243:4254');
            var version;
            __$coverCall('src/javascript/runtime/flash/Runtime.js', '4260:4522');
            try {
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '4270:4316');
                version = navigator.plugins['Shockwave Flash'];
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '4322:4351');
                version = version.description;
            } catch (e1) {
                __$coverCall('src/javascript/runtime/flash/Runtime.js', '4375:4517');
                try {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '4386:4470');
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
                } catch (e2) {
                    __$coverCall('src/javascript/runtime/flash/Runtime.js', '4496:4511');
                    version = '0.0';
                }
            }
            __$coverCall('src/javascript/runtime/flash/Runtime.js', '4527:4558');
            version = version.match(/\d+/g);
            __$coverCall('src/javascript/runtime/flash/Runtime.js', '4563:4611');
            return parseFloat(version[0] + '.' + version[1]);
        }
    }
    __$coverCall('src/javascript/runtime/flash/Runtime.js', '4622:4664');
    Runtime.addConstructor(type, FlashRuntime);
    __$coverCall('src/javascript/runtime/flash/Runtime.js', '4668:4685');
    return extensions;
});

// Included from: src/javascript/runtime/flash/file/Blob.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/flash/file/Blob.js", "/**\n * Blob.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/flash/file/Blob\n@private\n*/\ndefine(\"moxie/runtime/flash/file/Blob\", [\n\t\"moxie/runtime/flash/Runtime\",\n\t\"moxie/file/Blob\"\n], function(extensions, Blob) {\n\n\tvar FlashBlob = {\n\t\tslice: function(blob, start, end, type) {\n\t\t\tvar self = this.getRuntime();\n\n\t\t\tif (start < 0) {\n\t\t\t\tstart = Math.max(blob.size + start, 0);\n\t\t\t} else if (start > 0) {\n\t\t\t\tstart = Math.min(start, blob.size);\n\t\t\t}\n\n\t\t\tif (end < 0) {\n\t\t\t\tend = Math.max(blob.size + end, 0);\n\t\t\t} else if (end > 0) {\n\t\t\t\tend = Math.min(end, blob.size);\n\t\t\t}\n\n\t\t\tblob = self.shimExec.call(this, 'Blob', 'slice', start, end, type || '');\n\n\t\t\tif (blob) {\n\t\t\t\tblob = new Blob(self.uid, blob);\n\t\t\t}\n\t\t\treturn blob;\n\t\t}\n\t};\n\n\treturn (extensions.Blob = FlashBlob);\n});");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "395:1081");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "522:1037");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "1041:1077");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "587:615");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "621:752");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "758:877");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "883:955");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "961:1013");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "1018:1029");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "642:680");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "713:747");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "777:811");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "842:872");
__$coverInitRange("src/javascript/runtime/flash/file/Blob.js", "977:1008");
__$coverCall('src/javascript/runtime/flash/file/Blob.js', '395:1081');
define('moxie/runtime/flash/file/Blob', [
    'moxie/runtime/flash/Runtime',
    'moxie/file/Blob'
], function (extensions, Blob) {
    __$coverCall('src/javascript/runtime/flash/file/Blob.js', '522:1037');
    var FlashBlob = {
            slice: function (blob, start, end, type) {
                __$coverCall('src/javascript/runtime/flash/file/Blob.js', '587:615');
                var self = this.getRuntime();
                __$coverCall('src/javascript/runtime/flash/file/Blob.js', '621:752');
                if (start < 0) {
                    __$coverCall('src/javascript/runtime/flash/file/Blob.js', '642:680');
                    start = Math.max(blob.size + start, 0);
                } else if (start > 0) {
                    __$coverCall('src/javascript/runtime/flash/file/Blob.js', '713:747');
                    start = Math.min(start, blob.size);
                }
                __$coverCall('src/javascript/runtime/flash/file/Blob.js', '758:877');
                if (end < 0) {
                    __$coverCall('src/javascript/runtime/flash/file/Blob.js', '777:811');
                    end = Math.max(blob.size + end, 0);
                } else if (end > 0) {
                    __$coverCall('src/javascript/runtime/flash/file/Blob.js', '842:872');
                    end = Math.min(end, blob.size);
                }
                __$coverCall('src/javascript/runtime/flash/file/Blob.js', '883:955');
                blob = self.shimExec.call(this, 'Blob', 'slice', start, end, type || '');
                __$coverCall('src/javascript/runtime/flash/file/Blob.js', '961:1013');
                if (blob) {
                    __$coverCall('src/javascript/runtime/flash/file/Blob.js', '977:1008');
                    blob = new Blob(self.uid, blob);
                }
                __$coverCall('src/javascript/runtime/flash/file/Blob.js', '1018:1029');
                return blob;
            }
        };
    __$coverCall('src/javascript/runtime/flash/file/Blob.js', '1041:1077');
    return extensions.Blob = FlashBlob;
});

// Included from: src/javascript/runtime/flash/file/FileInput.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/flash/file/FileInput.js", "/**\n * FileInput.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/flash/file/FileInput\n@private\n*/\ndefine(\"moxie/runtime/flash/file/FileInput\", [\n\t\"moxie/runtime/flash/Runtime\"\n], function(extensions) {\n\t\n\tvar FileInput = {\t\t\n\t\tinit: function(options) {\n\t\t\treturn this.getRuntime().shimExec.call(this, 'FileInput', 'init', {\n\t\t\t\tname: options.name,\n\t\t\t\taccept: options.accept,\n\t\t\t\tmultiple: options.multiple\n\t\t\t});\n\t\t}\n\t};\n\n\treturn (extensions.FileInput = FileInput);\n});\n\n");
__$coverInitRange("src/javascript/runtime/flash/file/FileInput.js", "405:776");
__$coverInitRange("src/javascript/runtime/flash/file/FileInput.js", "512:727");
__$coverInitRange("src/javascript/runtime/flash/file/FileInput.js", "731:772");
__$coverInitRange("src/javascript/runtime/flash/file/FileInput.js", "563:719");
__$coverCall('src/javascript/runtime/flash/file/FileInput.js', '405:776');
define('moxie/runtime/flash/file/FileInput', ['moxie/runtime/flash/Runtime'], function (extensions) {
    __$coverCall('src/javascript/runtime/flash/file/FileInput.js', '512:727');
    var FileInput = {
            init: function (options) {
                __$coverCall('src/javascript/runtime/flash/file/FileInput.js', '563:719');
                return this.getRuntime().shimExec.call(this, 'FileInput', 'init', {
                    name: options.name,
                    accept: options.accept,
                    multiple: options.multiple
                });
            }
        };
    __$coverCall('src/javascript/runtime/flash/file/FileInput.js', '731:772');
    return extensions.FileInput = FileInput;
});

// Included from: src/javascript/runtime/flash/file/FileReader.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/flash/file/FileReader.js", "/**\n * FileReader.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/flash/file/FileReader\n@private\n*/\ndefine(\"moxie/runtime/flash/file/FileReader\", [\n\t\"moxie/runtime/flash/Runtime\",\n\t\"moxie/core/utils/Encode\"\n], function(extensions, Encode) {\n\n\tfunction _formatData(data, op) {\n\t\tswitch (op) {\n\t\t\tcase 'readAsText':\n\t\t\tcase 'readAsBinaryString':\n\t\t\t\treturn Encode.atob(data);\n\n\t\t\tcase 'readAsDataURL':\n\t\t\t\treturn data;\n\n\t\t}\n\t\treturn null;\n\t}\n\n\tvar FileReader = {\n\t\tread: function(op, blob) {\n\t\t\tvar comp = this, self = comp.getRuntime();\n\n\t\t\t// special prefix for DataURL read mode\n\t\t\tif (op === 'readAsDataURL') {\n\t\t\t\tcomp.result = 'data:' + (blob.type || '') + ';base64,';\n\t\t\t}\n\n\t\t\tcomp.bind('Progress', function(e, data) {\n\t\t\t\tif (data) {\n\t\t\t\t\tcomp.result += _formatData(data, op);\n\t\t\t\t}\n\t\t\t}, 999);\n\n\t\t\treturn self.shimExec.call(this, 'FileReader', 'readAsBase64', blob.uid);\n\t\t}\n\t};\n\n\treturn (extensions.FileReader = FileReader);\n});");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "407:1242");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "550:745");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "749:1191");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "1195:1238");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "585:727");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "731:742");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "655:679");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "711:722");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "800:841");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "890:983");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "989:1106");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "1112:1183");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "924:978");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "1035:1094");
__$coverInitRange("src/javascript/runtime/flash/file/FileReader.js", "1052:1088");
__$coverCall('src/javascript/runtime/flash/file/FileReader.js', '407:1242');
define('moxie/runtime/flash/file/FileReader', [
    'moxie/runtime/flash/Runtime',
    'moxie/core/utils/Encode'
], function (extensions, Encode) {
    __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '550:745');
    function _formatData(data, op) {
        __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '585:727');
        switch (op) {
        case 'readAsText':
        case 'readAsBinaryString':
            __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '655:679');
            return Encode.atob(data);
        case 'readAsDataURL':
            __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '711:722');
            return data;
        }
        __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '731:742');
        return null;
    }
    __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '749:1191');
    var FileReader = {
            read: function (op, blob) {
                __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '800:841');
                var comp = this, self = comp.getRuntime();
                __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '890:983');
                if (op === 'readAsDataURL') {
                    __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '924:978');
                    comp.result = 'data:' + (blob.type || '') + ';base64,';
                }
                __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '989:1106');
                comp.bind('Progress', function (e, data) {
                    __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '1035:1094');
                    if (data) {
                        __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '1052:1088');
                        comp.result += _formatData(data, op);
                    }
                }, 999);
                __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '1112:1183');
                return self.shimExec.call(this, 'FileReader', 'readAsBase64', blob.uid);
            }
        };
    __$coverCall('src/javascript/runtime/flash/file/FileReader.js', '1195:1238');
    return extensions.FileReader = FileReader;
});

// Included from: src/javascript/runtime/flash/xhr/XMLHttpRequest.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "/**\n * XMLHttpRequest.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/flash/xhr/XMLHttpRequest\n@private\n*/\ndefine(\"moxie/runtime/flash/xhr/XMLHttpRequest\", [\n\t\"moxie/runtime/flash/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/file/Blob\",\n\t\"moxie/file/File\",\n\t\"moxie/file/FileReaderSync\",\n\t\"moxie/xhr/FormData\",\n\t\"moxie/runtime/Transporter\",\n\t\"moxie/core/JSON\"\n], function(extensions, Basic, Blob, File, FileReaderSync, FormData, Transporter, parseJSON) {\n\t\n\tvar XMLHttpRequest = {\n\n\t\tsend: function(meta, data) {\n\t\t\tvar target = this, self = target.getRuntime();\n\n\t\t\tfunction send() {\n\t\t\t\tmeta.transport = self.can('send_browser_cookies') ? 'browser' : 'client';\n\t\t\t\tself.shimExec.call(target, 'XMLHttpRequest', 'send', meta, data);\n\t\t\t}\n\n\t\t\tfunction appendBlob(name, blob) {\n\t\t\t\tself.shimExec.call(target, 'XMLHttpRequest', 'appendBlob', name, blob.uid);\n\t\t\t\tdata = null;\n\t\t\t\tsend();\n\t\t\t}\n\n\t\t\tfunction attachBlob(name, blob) {\n\t\t\t\tvar tr = new Transporter();\n\n\t\t\t\ttr.bind(\"TransportingComplete\", function() {\n\t\t\t\t\tappendBlob(name, this.result);\n\t\t\t\t});\n\n\t\t\t\ttr.transport(blob.getSource(), blob.type, {\n\t\t\t\t\truid: self.uid\n\t\t\t\t});\n\t\t\t}\n\n\t\t\t// copy over the headers if any\n\t\t\tif (!Basic.isEmptyObj(meta.headers)) {\n\t\t\t\tBasic.each(meta.headers, function(value, header) {\n\t\t\t\t\tself.shimExec.call(target, 'XMLHttpRequest', 'setRequestHeader', header, value.toString()); // Silverlight doesn't accept integers into the arguments of type object\n\t\t\t\t});\n\t\t\t}\n\n\t\t\t// transfer over multipart params and blob itself\n\t\t\tif (data instanceof FormData) {\n\t\t\t\tvar blobField;\n\t\t\t\tdata.each(function(value, name) {\n\t\t\t\t\tif (value instanceof Blob) {\n\t\t\t\t\t\tblobField = name;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tself.shimExec.call(target, 'XMLHttpRequest', 'append', name, value);\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\tif (!data.hasBlob()) {\n\t\t\t\t\tdata = null;\n\t\t\t\t\tsend();\n\t\t\t\t} else {\n\t\t\t\t\tvar blob = data.getBlob();\n\t\t\t\t\tif (blob.isDetached()) {\n\t\t\t\t\t\tattachBlob(blobField, blob);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tappendBlob(blobField, blob);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t} else if (data instanceof Blob) {\n\t\t\t\tdata = data.uid;\n\t\t\t\tsend();\n\t\t\t} else {\n\t\t\t\tsend();\n\t\t\t}\n\t\t},\n\n\t\tgetResponse: function(responseType) {\n\t\t\tvar frs, blob, self = this.getRuntime();\n\n\t\t\tblob = self.shimExec.call(this, 'XMLHttpRequest', 'getResponseAsBlob');\n\n\t\t\tif (blob) {\n\t\t\t\tblob = new File(self.uid, blob);\n\n\t\t\t\tif ('blob' === responseType) {\n\t\t\t\t\treturn blob;\n\t\t\t\t} else if (!!~Basic.inArray(responseType, [\"\", \"text\"])) {\n\t\t\t\t\tfrs = new FileReaderSync();\n\t\t\t\t\treturn frs.readAsText(blob);\n\t\t\t\t} else if ('arraybuffer' === responseType) {\n\n\t\t\t\t\t// do something\n\n\t\t\t\t} else if ('json' === responseType) {\n\t\t\t\t\tfrs = new FileReaderSync();\n\t\t\t\t\t\n\t\t\t\t\ttry {\n\t\t\t\t\t\treturn parseJSON(frs.readAsText(blob));\n\t\t\t\t\t} catch (ex) {\n\t\t\t\t\t\treturn null;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn null;\n\t\t},\n\n\t\tabort: function(upload_complete_flag) {\n\t\t\tvar self = this.getRuntime();\n\n\t\t\tself.shimExec.call(this, 'XMLHttpRequest', 'abort');\n\n\t\t\tthis.dispatchEvent('readystatechange');\n\t\t\t// this.dispatchEvent('progress');\n\t\t\tthis.dispatchEvent('abort');\n\n\t\t\tif (!upload_complete_flag) {\n\t\t\t\t// this.dispatchEvent('uploadprogress');\n\t\t\t}\n\t\t}\n\t};\n\n\treturn (extensions.XMLHttpRequest = XMLHttpRequest);\n});");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "415:3485");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "765:3426");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "3430:3481");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "823:868");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "874:1043");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1049:1195");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1201:1441");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1482:1757");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1816:2396");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "896:968");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "974:1038");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1087:1161");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1167:1178");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1184:1190");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1239:1265");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1272:1359");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1366:1436");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1322:1351");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1525:1752");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1581:1671");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1852:1865");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1871:2065");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2072:2296");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1910:2057");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1945:1961");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "1983:2050");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2100:2111");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2118:2124");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2144:2169");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2176:2290");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2207:2234");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2256:2283");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2340:2355");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2361:2367");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2385:2391");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2447:2486");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2492:2562");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2568:3066");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "3072:3083");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2584:2615");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2622:3061");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2658:2669");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2739:2765");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2772:2799");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2920:2946");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2959:3055");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "2971:3009");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "3037:3048");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "3136:3164");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "3170:3221");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "3227:3265");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "3308:3335");
__$coverInitRange("src/javascript/runtime/flash/xhr/XMLHttpRequest.js", "3341:3418");
__$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '415:3485');
define('moxie/runtime/flash/xhr/XMLHttpRequest', [
    'moxie/runtime/flash/Runtime',
    'moxie/core/utils/Basic',
    'moxie/file/Blob',
    'moxie/file/File',
    'moxie/file/FileReaderSync',
    'moxie/xhr/FormData',
    'moxie/runtime/Transporter',
    'moxie/core/JSON'
], function (extensions, Basic, Blob, File, FileReaderSync, FormData, Transporter, parseJSON) {
    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '765:3426');
    var XMLHttpRequest = {
            send: function (meta, data) {
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '823:868');
                var target = this, self = target.getRuntime();
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '874:1043');
                function send() {
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '896:968');
                    meta.transport = self.can('send_browser_cookies') ? 'browser' : 'client';
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '974:1038');
                    self.shimExec.call(target, 'XMLHttpRequest', 'send', meta, data);
                }
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1049:1195');
                function appendBlob(name, blob) {
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1087:1161');
                    self.shimExec.call(target, 'XMLHttpRequest', 'appendBlob', name, blob.uid);
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1167:1178');
                    data = null;
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1184:1190');
                    send();
                }
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1201:1441');
                function attachBlob(name, blob) {
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1239:1265');
                    var tr = new Transporter();
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1272:1359');
                    tr.bind('TransportingComplete', function () {
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1322:1351');
                        appendBlob(name, this.result);
                    });
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1366:1436');
                    tr.transport(blob.getSource(), blob.type, { ruid: self.uid });
                }
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1482:1757');
                if (!Basic.isEmptyObj(meta.headers)) {
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1525:1752');
                    Basic.each(meta.headers, function (value, header) {
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1581:1671');
                        self.shimExec.call(target, 'XMLHttpRequest', 'setRequestHeader', header, value.toString());
                    });
                }
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1816:2396');
                if (data instanceof FormData) {
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1852:1865');
                    var blobField;
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1871:2065');
                    data.each(function (value, name) {
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1910:2057');
                        if (value instanceof Blob) {
                            __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1945:1961');
                            blobField = name;
                        } else {
                            __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '1983:2050');
                            self.shimExec.call(target, 'XMLHttpRequest', 'append', name, value);
                        }
                    });
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2072:2296');
                    if (!data.hasBlob()) {
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2100:2111');
                        data = null;
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2118:2124');
                        send();
                    } else {
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2144:2169');
                        var blob = data.getBlob();
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2176:2290');
                        if (blob.isDetached()) {
                            __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2207:2234');
                            attachBlob(blobField, blob);
                        } else {
                            __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2256:2283');
                            appendBlob(blobField, blob);
                        }
                    }
                } else if (data instanceof Blob) {
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2340:2355');
                    data = data.uid;
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2361:2367');
                    send();
                } else {
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2385:2391');
                    send();
                }
            },
            getResponse: function (responseType) {
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2447:2486');
                var frs, blob, self = this.getRuntime();
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2492:2562');
                blob = self.shimExec.call(this, 'XMLHttpRequest', 'getResponseAsBlob');
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2568:3066');
                if (blob) {
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2584:2615');
                    blob = new File(self.uid, blob);
                    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2622:3061');
                    if ('blob' === responseType) {
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2658:2669');
                        return blob;
                    } else if (!!~Basic.inArray(responseType, [
                            '',
                            'text'
                        ])) {
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2739:2765');
                        frs = new FileReaderSync();
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2772:2799');
                        return frs.readAsText(blob);
                    } else if ('arraybuffer' === responseType) {
                    } else if ('json' === responseType) {
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2920:2946');
                        frs = new FileReaderSync();
                        __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2959:3055');
                        try {
                            __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '2971:3009');
                            return parseJSON(frs.readAsText(blob));
                        } catch (ex) {
                            __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '3037:3048');
                            return null;
                        }
                    }
                }
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '3072:3083');
                return null;
            },
            abort: function (upload_complete_flag) {
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '3136:3164');
                var self = this.getRuntime();
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '3170:3221');
                self.shimExec.call(this, 'XMLHttpRequest', 'abort');
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '3227:3265');
                this.dispatchEvent('readystatechange');
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '3308:3335');
                this.dispatchEvent('abort');
                __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '3341:3418');
                if (!upload_complete_flag) {
                }
            }
        };
    __$coverCall('src/javascript/runtime/flash/xhr/XMLHttpRequest.js', '3430:3481');
    return extensions.XMLHttpRequest = XMLHttpRequest;
});

// Included from: src/javascript/runtime/flash/file/FileReaderSync.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/flash/file/FileReaderSync.js", "/**\n * FileReaderSync.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/flash/file/FileReaderSync\n@private\n*/\ndefine(\"moxie/runtime/flash/file/FileReaderSync\", [\n\t\"moxie/runtime/flash/Runtime\",\n\t\"moxie/core/utils/Encode\"\n], function(extensions, Encode) {\n\t\n\tfunction _formatData(data, op) {\n\t\tswitch (op) {\n\t\t\tcase 'readAsText':\n\t\t\tcase 'readAsBinaryString':\n\t\t\t\treturn Encode.atob(data);\n\n\t\t\tcase 'readAsDataURL':\n\t\t\t\treturn data;\n\n\t\t}\n\t\treturn null;\n\t}\n\n\tvar FileReaderSync = {\n\t\tread: function(op, blob) {\n\t\t\tvar result, self = this.getRuntime();\n\n\t\t\tresult = self.shimExec.call(this, 'FileReaderSync', 'readAsBase64', blob.uid);\n\t\t\tif (!result) {\n\t\t\t\treturn null; // or throw ex\n\t\t\t}\n\n\t\t\t// special prefix for DataURL read mode\n\t\t\tif (op === 'readAsDataURL') {\n\t\t\t\tresult = 'data:' + (blob.type || '') + ';base64,' + result;\n\t\t\t}\n\n\t\t\treturn _formatData(result, op, blob.type);\n\t\t}\n\t};\n\n\treturn (extensions.FileReaderSync = FileReaderSync);\n});");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "415:1251");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "563:758");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "762:1192");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "1196:1247");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "598:740");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "744:755");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "668:692");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "724:735");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "817:853");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "859:936");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "941:991");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "1040:1137");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "1143:1184");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "960:971");
__$coverInitRange("src/javascript/runtime/flash/file/FileReaderSync.js", "1074:1132");
__$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '415:1251');
define('moxie/runtime/flash/file/FileReaderSync', [
    'moxie/runtime/flash/Runtime',
    'moxie/core/utils/Encode'
], function (extensions, Encode) {
    __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '563:758');
    function _formatData(data, op) {
        __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '598:740');
        switch (op) {
        case 'readAsText':
        case 'readAsBinaryString':
            __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '668:692');
            return Encode.atob(data);
        case 'readAsDataURL':
            __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '724:735');
            return data;
        }
        __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '744:755');
        return null;
    }
    __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '762:1192');
    var FileReaderSync = {
            read: function (op, blob) {
                __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '817:853');
                var result, self = this.getRuntime();
                __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '859:936');
                result = self.shimExec.call(this, 'FileReaderSync', 'readAsBase64', blob.uid);
                __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '941:991');
                if (!result) {
                    __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '960:971');
                    return null;
                }
                __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '1040:1137');
                if (op === 'readAsDataURL') {
                    __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '1074:1132');
                    result = 'data:' + (blob.type || '') + ';base64,' + result;
                }
                __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '1143:1184');
                return _formatData(result, op, blob.type);
            }
        };
    __$coverCall('src/javascript/runtime/flash/file/FileReaderSync.js', '1196:1247');
    return extensions.FileReaderSync = FileReaderSync;
});

// Included from: src/javascript/runtime/flash/runtime/Transporter.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/flash/runtime/Transporter.js", "/**\n * Transporter.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, laxcomma:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/flash/runtime/Transporter\n@private\n*/\ndefine(\"moxie/runtime/flash/runtime/Transporter\", [\n\t\"moxie/runtime/flash/Runtime\",\n\t\"moxie/file/Blob\"\n], function(extensions, Blob) {\n\n\tvar Transporter = {\n\t\tgetAsBlob: function(type) {\n\t\t\tvar self = this.getRuntime()\n\t\t\t, blob = self.shimExec.call(this, 'Transporter', 'getAsBlob', type)\n\t\t\t;\n\t\t\tif (blob) {\n\t\t\t\treturn new Blob(self.uid, blob);\n\t\t\t}\n\t\t\treturn null;\n\t\t}\n\t};\n\n\treturn (extensions.Transporter = Transporter);\n});");
__$coverInitRange("src/javascript/runtime/flash/runtime/Transporter.js", "427:854");
__$coverInitRange("src/javascript/runtime/flash/runtime/Transporter.js", "564:801");
__$coverInitRange("src/javascript/runtime/flash/runtime/Transporter.js", "805:850");
__$coverInitRange("src/javascript/runtime/flash/runtime/Transporter.js", "617:719");
__$coverInitRange("src/javascript/runtime/flash/runtime/Transporter.js", "720:720");
__$coverInitRange("src/javascript/runtime/flash/runtime/Transporter.js", "725:777");
__$coverInitRange("src/javascript/runtime/flash/runtime/Transporter.js", "782:793");
__$coverInitRange("src/javascript/runtime/flash/runtime/Transporter.js", "741:772");
__$coverCall('src/javascript/runtime/flash/runtime/Transporter.js', '427:854');
define('moxie/runtime/flash/runtime/Transporter', [
    'moxie/runtime/flash/Runtime',
    'moxie/file/Blob'
], function (extensions, Blob) {
    __$coverCall('src/javascript/runtime/flash/runtime/Transporter.js', '564:801');
    var Transporter = {
            getAsBlob: function (type) {
                __$coverCall('src/javascript/runtime/flash/runtime/Transporter.js', '617:719');
                var self = this.getRuntime(), blob = self.shimExec.call(this, 'Transporter', 'getAsBlob', type);
                __$coverCall('src/javascript/runtime/flash/runtime/Transporter.js', '720:720');
                ;
                __$coverCall('src/javascript/runtime/flash/runtime/Transporter.js', '725:777');
                if (blob) {
                    __$coverCall('src/javascript/runtime/flash/runtime/Transporter.js', '741:772');
                    return new Blob(self.uid, blob);
                }
                __$coverCall('src/javascript/runtime/flash/runtime/Transporter.js', '782:793');
                return null;
            }
        };
    __$coverCall('src/javascript/runtime/flash/runtime/Transporter.js', '805:850');
    return extensions.Transporter = Transporter;
});

// Included from: src/javascript/runtime/flash/image/Image.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/flash/image/Image.js", "/**\n * Image.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, laxcomma:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/flash/image/Image\n@private\n*/\ndefine(\"moxie/runtime/flash/image/Image\", [\n\t\"moxie/runtime/flash/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/runtime/Transporter\",\n\t\"moxie/file/Blob\",\n\t\"moxie/file/FileReaderSync\"\n], function(extensions, Basic, Transporter, Blob, FileReaderSync) {\n\t\n\tvar Image = {\n\t\tloadFromBlob: function(blob) {\n\t\t\tvar comp = this, self = comp.getRuntime();\n\n\t\t\tfunction exec(srcBlob) {\n\t\t\t\tself.shimExec.call(comp, 'Image', 'loadFromBlob', srcBlob.uid);\n\t\t\t\tcomp = self = null;\n\t\t\t}\n\n\t\t\tif (blob.isDetached()) { // binary string\n\t\t\t\tvar tr = new Transporter();\n\t\t\t\ttr.bind(\"TransportingComplete\", function() {\n\t\t\t\t\texec(tr.result.getSource());\n\t\t\t\t});\n\t\t\t\ttr.transport(blob.getSource(), blob.type, { ruid: self.uid });\n\t\t\t} else {\n\t\t\t\texec(blob.getSource());\n\t\t\t}\n\t\t},\n\n\t\tloadFromImage: function(img) {\n\t\t\tvar self = this.getRuntime();\n\t\t\treturn self.shimExec.call(this, 'Image', 'loadFromImage', img.uid);\n\t\t},\n\n\t\tgetAsBlob: function(type, quality) {\n\t\t\tvar self = this.getRuntime()\n\t\t\t, blob = self.shimExec.call(this, 'Image', 'getAsBlob', type, quality)\n\t\t\t;\n\t\t\tif (blob) {\n\t\t\t\treturn new Blob(self.uid, blob);\n\t\t\t}\n\t\t\treturn null;\n\t\t},\n\n\t\tgetAsDataURL: function() {\n\t\t\tvar self = this.getRuntime()\n\t\t\t, blob = self.Image.getAsBlob.apply(this, arguments)\n\t\t\t, frs\n\t\t\t;\n\t\t\tif (!blob) {\n\t\t\t\treturn null;\n\t\t\t}\n\t\t\tfrs = new FileReaderSync();\n\t\t\treturn frs.readAsDataURL(blob);\n\t\t}\n\t};\n\n\treturn (extensions.Image = Image);\n});");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "413:1826");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "666:1785");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1789:1822");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "716:757");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "763:883");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "889:1164");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "792:854");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "860:878");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "935:961");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "967:1052");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1058:1119");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1017:1044");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1137:1159");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1208:1236");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1241:1307");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1357:1462");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1463:1463");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1468:1520");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1525:1536");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1484:1515");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1576:1672");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1673:1673");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1678:1711");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1716:1742");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1747:1777");
__$coverInitRange("src/javascript/runtime/flash/image/Image.js", "1695:1706");
__$coverCall('src/javascript/runtime/flash/image/Image.js', '413:1826');
define('moxie/runtime/flash/image/Image', [
    'moxie/runtime/flash/Runtime',
    'moxie/core/utils/Basic',
    'moxie/runtime/Transporter',
    'moxie/file/Blob',
    'moxie/file/FileReaderSync'
], function (extensions, Basic, Transporter, Blob, FileReaderSync) {
    __$coverCall('src/javascript/runtime/flash/image/Image.js', '666:1785');
    var Image = {
            loadFromBlob: function (blob) {
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '716:757');
                var comp = this, self = comp.getRuntime();
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '763:883');
                function exec(srcBlob) {
                    __$coverCall('src/javascript/runtime/flash/image/Image.js', '792:854');
                    self.shimExec.call(comp, 'Image', 'loadFromBlob', srcBlob.uid);
                    __$coverCall('src/javascript/runtime/flash/image/Image.js', '860:878');
                    comp = self = null;
                }
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '889:1164');
                if (blob.isDetached()) {
                    __$coverCall('src/javascript/runtime/flash/image/Image.js', '935:961');
                    var tr = new Transporter();
                    __$coverCall('src/javascript/runtime/flash/image/Image.js', '967:1052');
                    tr.bind('TransportingComplete', function () {
                        __$coverCall('src/javascript/runtime/flash/image/Image.js', '1017:1044');
                        exec(tr.result.getSource());
                    });
                    __$coverCall('src/javascript/runtime/flash/image/Image.js', '1058:1119');
                    tr.transport(blob.getSource(), blob.type, { ruid: self.uid });
                } else {
                    __$coverCall('src/javascript/runtime/flash/image/Image.js', '1137:1159');
                    exec(blob.getSource());
                }
            },
            loadFromImage: function (img) {
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1208:1236');
                var self = this.getRuntime();
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1241:1307');
                return self.shimExec.call(this, 'Image', 'loadFromImage', img.uid);
            },
            getAsBlob: function (type, quality) {
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1357:1462');
                var self = this.getRuntime(), blob = self.shimExec.call(this, 'Image', 'getAsBlob', type, quality);
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1463:1463');
                ;
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1468:1520');
                if (blob) {
                    __$coverCall('src/javascript/runtime/flash/image/Image.js', '1484:1515');
                    return new Blob(self.uid, blob);
                }
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1525:1536');
                return null;
            },
            getAsDataURL: function () {
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1576:1672');
                var self = this.getRuntime(), blob = self.Image.getAsBlob.apply(this, arguments), frs;
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1673:1673');
                ;
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1678:1711');
                if (!blob) {
                    __$coverCall('src/javascript/runtime/flash/image/Image.js', '1695:1706');
                    return null;
                }
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1716:1742');
                frs = new FileReaderSync();
                __$coverCall('src/javascript/runtime/flash/image/Image.js', '1747:1777');
                return frs.readAsDataURL(blob);
            }
        };
    __$coverCall('src/javascript/runtime/flash/image/Image.js', '1789:1822');
    return extensions.Image = Image;
});

// Included from: src/javascript/runtime/silverlight/Runtime.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/silverlight/Runtime.js", "/**\n * RunTime.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true, ActiveXObject:true */\n\n/**\nDefines constructor for Silverlight runtime.\n\n@class moxie/runtime/silverlight/Runtime\n@private\n*/\ndefine(\"moxie/runtime/silverlight/Runtime\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/utils/Env\",\n\t\"moxie/core/utils/Dom\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/runtime/Runtime\"\n], function(Basic, Env, Dom, x, Runtime) {\n\t\n\tvar type = \"silverlight\", extensions = {};\n\n\t/**\n\tConstructor for the Silverlight Runtime\n\n\t@class SilverlightRuntime\n\t@extends Runtime\n\t*/\n\tfunction SilverlightRuntime(options) {\n\t\tvar I = this, initTimer;\n\n\t\toptions = Basic.extend({ xap_url: Env.xap_url }, options);\n\n\t\tRuntime.call(this, type, options, (function() {\t\t\t\n\t\t\tfunction use_clienthttp() {\n\t\t\t\tvar rc = options.required_caps || {};\n\t\t\t\treturn  rc.send_custom_headers || \n\t\t\t\t\trc.return_status_code && Basic.arrayDiff(rc.return_status_code, [200, 404]) ||\n\t\t\t\t\trc.use_http_method && Basic.arrayDiff(rc.use_http_method, ['GET', 'POST']); \n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\taccess_binary: true,\n\t\t\t\taccess_image_binary: true,\n\t\t\t\tdisplay_media: true,\n\t\t\t\tdrag_and_drop: false,\n\t\t\t\treport_upload_progress: true,\n\t\t\t\tresize_image: true,\n\t\t\t\treturn_response_headers: function() {\n\t\t\t\t\treturn use_clienthttp();\n\t\t\t\t},\n\t\t\t\treturn_response_type: true,\n\t\t\t\treturn_status_code: function(code) {\n\t\t\t\t\treturn use_clienthttp() || !Basic.arrayDiff(code, [200, 404]);\n\t\t\t\t},\n\t\t\t\tselect_multiple: true,\n\t\t\t\tsend_binary_string: true,\n\t\t\t\tsend_browser_cookies: function() {\n\t\t\t\t\treturn !use_clienthttp();\n\t\t\t\t},\n\t\t\t\tsend_custom_headers: function() {\n\t\t\t\t\treturn use_clienthttp();\n\t\t\t\t},\n\t\t\t\tsend_multipart: true,\n\t\t\t\tslice_blob: true,\n\t\t\t\tstream_upload: true,\n\t\t\t\tsummon_file_dialog: false,\n\t\t\t\tupload_filesize: true,\n\t\t\t\tuse_http_method: function(methods) {\n\t\t\t\t\treturn use_clienthttp() || !Basic.arrayDiff(methods, ['GET', 'POST']);\n\t\t\t\t}\n\t\t\t};\n\t\t}()));\n\n\n\t\tBasic.extend(this, {\n\n\t\t\tgetShim: function() {\n\t\t\t\treturn Dom.get(this.uid).content.Moxie;\n\t\t\t},\n\n\t\t\tinit : function() {\n\t\t\t\tvar container;\n\n\t\t\t\t// minimal requirement Flash Player 10\n\t\t\t\tif (!isInstalled('2.0.31005.0') || Env.browser === 'Opera') {\n\t\t\t\t\tthis.trigger(\"Error\", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tcontainer = this.getShimContainer();\n\n\t\t\t\tcontainer.innerHTML = '<object id=\"' + this.uid + '\" data=\"data:application/x-silverlight,\" type=\"application/x-silverlight-2\" width=\"100%\" height=\"100%\" style=\"outline:none;\">' +\n\t\t\t\t\t'<param name=\"source\" value=\"' + options.xap_url + '\"/>' +\n\t\t\t\t\t'<param name=\"background\" value=\"Transparent\"/>' +\n\t\t\t\t\t'<param name=\"windowless\" value=\"true\"/>' +\n\t\t\t\t\t'<param name=\"enablehtmlaccess\" value=\"true\"/>' +\n\t\t\t\t\t'<param name=\"initParams\" value=\"uid=' + this.uid + ',target=' + Env.global_event_dispatcher + '\"/>' +\n\t\t\t\t'</object>';\n\n\t\t\t\t// Init is dispatched by the shim\n\t\t\t\tinitTimer = setTimeout(function() {\n\t\t\t\t\tif (I && !I.initialized) { // runtime might be already destroyed by this moment\n\t\t\t\t\t\tI.trigger(\"Error\", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));\n\t\t\t\t\t}\n\t\t\t\t}, Env.OS !== 'Windows'? 10000 : 5000); // give it more time to initialize in non Windows OS (like Mac)\n\t\t\t},\n\n\t\t\tdestroy: (function(destroy) { // extend default destroy method\n\t\t\t\treturn function() {\n\t\t\t\t\tdestroy.call(I);\n\t\t\t\t\tclearTimeout(initTimer); // initialization check might be still onwait\n\t\t\t\t\toptions = initTimer = destroy = I = null;\n\t\t\t\t};\n\t\t\t}(this.destroy))\n\n\t\t}, extensions);\n\n\t\t\n\t\tfunction isInstalled(version) {\n\t\t\tvar isVersionSupported = false, control = null, actualVer,\n\t\t\t\tactualVerArray, reqVerArray, requiredVersionPart, actualVersionPart, index = 0;\n\n\t\t\ttry {\n\t\t\t\ttry {\n\t\t\t\t\tcontrol = new ActiveXObject('AgControl.AgControl');\n\n\t\t\t\t\tif (control.IsVersionSupported(version)) {\n\t\t\t\t\t\tisVersionSupported = true;\n\t\t\t\t\t}\n\n\t\t\t\t\tcontrol = null;\n\t\t\t\t} catch (e) {\n\t\t\t\t\tvar plugin = navigator.plugins[\"Silverlight Plug-In\"];\n\n\t\t\t\t\tif (plugin) {\n\t\t\t\t\t\tactualVer = plugin.description;\n\n\t\t\t\t\t\tif (actualVer === \"1.0.30226.2\") {\n\t\t\t\t\t\t\tactualVer = \"2.0.30226.2\";\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tactualVerArray = actualVer.split(\".\");\n\n\t\t\t\t\t\twhile (actualVerArray.length > 3) {\n\t\t\t\t\t\t\tactualVerArray.pop();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\twhile ( actualVerArray.length < 4) {\n\t\t\t\t\t\t\tactualVerArray.push(0);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treqVerArray = version.split(\".\");\n\n\t\t\t\t\t\twhile (reqVerArray.length > 4) {\n\t\t\t\t\t\t\treqVerArray.pop();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tdo {\n\t\t\t\t\t\t\trequiredVersionPart = parseInt(reqVerArray[index], 10);\n\t\t\t\t\t\t\tactualVersionPart = parseInt(actualVerArray[index], 10);\n\t\t\t\t\t\t\tindex++;\n\t\t\t\t\t\t} while (index < reqVerArray.length && requiredVersionPart === actualVersionPart);\n\n\t\t\t\t\t\tif (requiredVersionPart <= actualVersionPart && !isNaN(requiredVersionPart)) {\n\t\t\t\t\t\t\tisVersionSupported = true;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t} catch (e2) {\n\t\t\t\tisVersionSupported = false;\n\t\t\t}\n\n\t\t\treturn isVersionSupported;\n\t\t}\n\t}\n\n\tRuntime.addConstructor(type, SilverlightRuntime); \n\n\treturn extensions;\n});\n\n\n\n");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "468:5215");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "688:729");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "829:5137");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "5141:5189");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "5194:5211");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "870:893");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "898:955");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "960:2175");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "2181:3743");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3751:5134");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "1014:1292");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "1298:2166");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "1046:1082");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "1088:1286");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "1519:1542");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "1629:1690");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "1800:1824");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "1876:1899");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "2085:2154");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "2232:2270");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "2306:2319");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "2369:2525");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "2532:2567");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "2574:3101");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3146:3391");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "2436:2506");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "2513:2519");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3187:3347");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3273:3340");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3534:3704");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3559:3574");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3581:3604");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3657:3697");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3786:3927");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3933:5099");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "5105:5130");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3943:5044");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "3954:4004");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4012:4093");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4101:4115");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4061:4086");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4140:4193");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4201:5038");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4221:4251");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4260:4335");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4344:4381");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4390:4461");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4470:4544");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4553:4585");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4594:4659");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4668:4903");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4912:5031");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4302:4327");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4433:4453");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4514:4536");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4634:4651");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4680:4734");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4743:4798");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4807:4814");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "4998:5023");
__$coverInitRange("src/javascript/runtime/silverlight/Runtime.js", "5068:5094");
__$coverCall('src/javascript/runtime/silverlight/Runtime.js', '468:5215');
define('moxie/runtime/silverlight/Runtime', [
    'moxie/core/utils/Basic',
    'moxie/core/utils/Env',
    'moxie/core/utils/Dom',
    'moxie/core/Exceptions',
    'moxie/runtime/Runtime'
], function (Basic, Env, Dom, x, Runtime) {
    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '688:729');
    var type = 'silverlight', extensions = {};
    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '829:5137');
    function SilverlightRuntime(options) {
        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '870:893');
        var I = this, initTimer;
        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '898:955');
        options = Basic.extend({ xap_url: Env.xap_url }, options);
        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '960:2175');
        Runtime.call(this, type, options, function () {
            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '1014:1292');
            function use_clienthttp() {
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '1046:1082');
                var rc = options.required_caps || {};
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '1088:1286');
                return rc.send_custom_headers || rc.return_status_code && Basic.arrayDiff(rc.return_status_code, [
                    200,
                    404
                ]) || rc.use_http_method && Basic.arrayDiff(rc.use_http_method, [
                    'GET',
                    'POST'
                ]);
            }
            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '1298:2166');
            return {
                access_binary: true,
                access_image_binary: true,
                display_media: true,
                drag_and_drop: false,
                report_upload_progress: true,
                resize_image: true,
                return_response_headers: function () {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '1519:1542');
                    return use_clienthttp();
                },
                return_response_type: true,
                return_status_code: function (code) {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '1629:1690');
                    return use_clienthttp() || !Basic.arrayDiff(code, [
                        200,
                        404
                    ]);
                },
                select_multiple: true,
                send_binary_string: true,
                send_browser_cookies: function () {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '1800:1824');
                    return !use_clienthttp();
                },
                send_custom_headers: function () {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '1876:1899');
                    return use_clienthttp();
                },
                send_multipart: true,
                slice_blob: true,
                stream_upload: true,
                summon_file_dialog: false,
                upload_filesize: true,
                use_http_method: function (methods) {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '2085:2154');
                    return use_clienthttp() || !Basic.arrayDiff(methods, [
                        'GET',
                        'POST'
                    ]);
                }
            };
        }());
        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '2181:3743');
        Basic.extend(this, {
            getShim: function () {
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '2232:2270');
                return Dom.get(this.uid).content.Moxie;
            },
            init: function () {
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '2306:2319');
                var container;
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '2369:2525');
                if (!isInstalled('2.0.31005.0') || Env.browser === 'Opera') {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '2436:2506');
                    this.trigger('Error', new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '2513:2519');
                    return;
                }
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '2532:2567');
                container = this.getShimContainer();
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '2574:3101');
                container.innerHTML = '<object id="' + this.uid + '" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;">' + '<param name="source" value="' + options.xap_url + '"/>' + '<param name="background" value="Transparent"/>' + '<param name="windowless" value="true"/>' + '<param name="enablehtmlaccess" value="true"/>' + '<param name="initParams" value="uid=' + this.uid + ',target=' + Env.global_event_dispatcher + '"/>' + '</object>';
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3146:3391');
                initTimer = setTimeout(function () {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3187:3347');
                    if (I && !I.initialized) {
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3273:3340');
                        I.trigger('Error', new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
                    }
                }, Env.OS !== 'Windows' ? 10000 : 5000);
            },
            destroy: function (destroy) {
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3534:3704');
                return function () {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3559:3574');
                    destroy.call(I);
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3581:3604');
                    clearTimeout(initTimer);
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3657:3697');
                    options = initTimer = destroy = I = null;
                };
            }(this.destroy)
        }, extensions);
        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3751:5134');
        function isInstalled(version) {
            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3786:3927');
            var isVersionSupported = false, control = null, actualVer, actualVerArray, reqVerArray, requiredVersionPart, actualVersionPart, index = 0;
            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3933:5099');
            try {
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3943:5044');
                try {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '3954:4004');
                    control = new ActiveXObject('AgControl.AgControl');
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4012:4093');
                    if (control.IsVersionSupported(version)) {
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4061:4086');
                        isVersionSupported = true;
                    }
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4101:4115');
                    control = null;
                } catch (e) {
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4140:4193');
                    var plugin = navigator.plugins['Silverlight Plug-In'];
                    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4201:5038');
                    if (plugin) {
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4221:4251');
                        actualVer = plugin.description;
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4260:4335');
                        if (actualVer === '1.0.30226.2') {
                            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4302:4327');
                            actualVer = '2.0.30226.2';
                        }
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4344:4381');
                        actualVerArray = actualVer.split('.');
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4390:4461');
                        while (actualVerArray.length > 3) {
                            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4433:4453');
                            actualVerArray.pop();
                        }
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4470:4544');
                        while (actualVerArray.length < 4) {
                            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4514:4536');
                            actualVerArray.push(0);
                        }
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4553:4585');
                        reqVerArray = version.split('.');
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4594:4659');
                        while (reqVerArray.length > 4) {
                            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4634:4651');
                            reqVerArray.pop();
                        }
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4668:4903');
                        do {
                            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4680:4734');
                            requiredVersionPart = parseInt(reqVerArray[index], 10);
                            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4743:4798');
                            actualVersionPart = parseInt(actualVerArray[index], 10);
                            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4807:4814');
                            index++;
                        } while (index < reqVerArray.length && requiredVersionPart === actualVersionPart);
                        __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4912:5031');
                        if (requiredVersionPart <= actualVersionPart && !isNaN(requiredVersionPart)) {
                            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '4998:5023');
                            isVersionSupported = true;
                        }
                    }
                }
            } catch (e2) {
                __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '5068:5094');
                isVersionSupported = false;
            }
            __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '5105:5130');
            return isVersionSupported;
        }
    }
    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '5141:5189');
    Runtime.addConstructor(type, SilverlightRuntime);
    __$coverCall('src/javascript/runtime/silverlight/Runtime.js', '5194:5211');
    return extensions;
});

// Included from: src/javascript/runtime/silverlight/file/Blob.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/silverlight/file/Blob.js", "/**\n * Blob.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/silverlight/file/Blob\n@private\n*/\ndefine(\"moxie/runtime/silverlight/file/Blob\", [\n\t\"moxie/runtime/silverlight/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/runtime/flash/file/Blob\"\n], function(extensions, Basic, Blob) {\n\treturn (extensions.Blob = Basic.extend({}, Blob));\n});");
__$coverInitRange("src/javascript/runtime/silverlight/file/Blob.js", "401:640");
__$coverInitRange("src/javascript/runtime/silverlight/file/Blob.js", "587:636");
__$coverCall('src/javascript/runtime/silverlight/file/Blob.js', '401:640');
define('moxie/runtime/silverlight/file/Blob', [
    'moxie/runtime/silverlight/Runtime',
    'moxie/core/utils/Basic',
    'moxie/runtime/flash/file/Blob'
], function (extensions, Basic, Blob) {
    __$coverCall('src/javascript/runtime/silverlight/file/Blob.js', '587:636');
    return extensions.Blob = Basic.extend({}, Blob);
});

// Included from: src/javascript/runtime/silverlight/file/FileInput.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/silverlight/file/FileInput.js", "/**\n * FileInput.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/silverlight/file/FileInput\n@private\n*/\ndefine(\"moxie/runtime/silverlight/file/FileInput\", [\n\t\"moxie/runtime/silverlight/Runtime\"\n], function(extensions) {\n\t\n\tvar FileInput = {\n\t\tinit: function(options) {\n\t\t\tvar self = this.getRuntime();\n\n\t\t\tfunction toFilters(accept) {\n\t\t\t\tvar filter = '';\n\t\t\t\tfor (var i = 0; i < accept.length; i++) {\n\t\t\t\t\tfilter += (filter !== '' ? '|' : '') + accept[i].title + \" | *.\" + accept[i].extensions.replace(/,/g, ';*.');\n\t\t\t\t}\n\t\t\t\treturn filter;\n\t\t\t}\n\t\t\treturn self.shimExec.call(this, 'FileInput', 'init', toFilters(options.accept), options.name, options.multiple);\n\t\t}\n\t};\n\n\treturn (extensions.FileInput = FileInput);\n});");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "411:1025");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "530:976");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "980:1021");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "579:607");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "613:852");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "857:968");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "646:661");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "667:828");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "834:847");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileInput.js", "714:822");
__$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '411:1025');
define('moxie/runtime/silverlight/file/FileInput', ['moxie/runtime/silverlight/Runtime'], function (extensions) {
    __$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '530:976');
    var FileInput = {
            init: function (options) {
                __$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '579:607');
                var self = this.getRuntime();
                __$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '613:852');
                function toFilters(accept) {
                    __$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '646:661');
                    var filter = '';
                    __$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '667:828');
                    for (var i = 0; i < accept.length; i++) {
                        __$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '714:822');
                        filter += (filter !== '' ? '|' : '') + accept[i].title + ' | *.' + accept[i].extensions.replace(/,/g, ';*.');
                    }
                    __$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '834:847');
                    return filter;
                }
                __$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '857:968');
                return self.shimExec.call(this, 'FileInput', 'init', toFilters(options.accept), options.name, options.multiple);
            }
        };
    __$coverCall('src/javascript/runtime/silverlight/file/FileInput.js', '980:1021');
    return extensions.FileInput = FileInput;
});

// Included from: src/javascript/runtime/silverlight/file/FileDrop.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/silverlight/file/FileDrop.js", "/**\n * FileDrop.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/silverlight/file/FileDrop\n@private\n*/\ndefine(\"moxie/runtime/silverlight/file/FileDrop\", [\n\t\"moxie/runtime/silverlight/Runtime\",\n\t\"moxie/core/utils/Dom\", \n\t\"moxie/core/utils/Events\"\n], function(extensions, Dom, Events) {\n\n\t// not exactly useful, since works only in safari (...crickets...)\n\tvar FileDrop = {\n\t\tinit: function() {\n\t\t\tvar comp = this, self = comp.getRuntime(), dropZone;\n\n\t\t\tdropZone = self.getShimContainer();\n\n\t\t\tEvents.addEvent(dropZone, 'dragover', function(e) {\n\t\t\t\te.preventDefault();\n\t\t\t\te.stopPropagation();\n\t\t\t\te.dataTransfer.dropEffect = 'copy';\n\t\t\t}, comp.uid);\n\n\t\t\tEvents.addEvent(dropZone, 'dragenter', function(e) {\n\t\t\t\te.preventDefault();\n\t\t\t\tvar flag = Dom.get(self.uid).dragEnter(e);\n\t\t\t    // If handled, then stop propagation of event in DOM\n\t\t\t    if (flag) {e.stopPropagation();}\n\t\t\t}, comp.uid);\n\n\t\t\tEvents.addEvent(dropZone, 'drop', function(e) {\n\t\t\t\te.preventDefault();\n\t\t\t\tvar flag = Dom.get(self.uid).dragDrop(e);\n\t\t\t    // If handled, then stop propagation of event in DOM\n\t\t\t    if (flag) {e.stopPropagation();}\n\t\t\t}, comp.uid);\n\n\t\t\treturn self.shimExec.call(this, 'FileDrop', 'init');\n\t\t}\n\t};\n\n\treturn (extensions.FileDrop = FileDrop);\n});");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "409:1551");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "661:1504");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1508:1547");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "702:753");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "759:793");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "799:955");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "961:1200");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1206:1439");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1445:1496");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "855:873");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "879:898");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "904:938");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1018:1036");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1042:1083");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1152:1183");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1163:1182");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1258:1276");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1282:1322");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1391:1422");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileDrop.js", "1402:1421");
__$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '409:1551');
define('moxie/runtime/silverlight/file/FileDrop', [
    'moxie/runtime/silverlight/Runtime',
    'moxie/core/utils/Dom',
    'moxie/core/utils/Events'
], function (extensions, Dom, Events) {
    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '661:1504');
    var FileDrop = {
            init: function () {
                __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '702:753');
                var comp = this, self = comp.getRuntime(), dropZone;
                __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '759:793');
                dropZone = self.getShimContainer();
                __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '799:955');
                Events.addEvent(dropZone, 'dragover', function (e) {
                    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '855:873');
                    e.preventDefault();
                    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '879:898');
                    e.stopPropagation();
                    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '904:938');
                    e.dataTransfer.dropEffect = 'copy';
                }, comp.uid);
                __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '961:1200');
                Events.addEvent(dropZone, 'dragenter', function (e) {
                    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1018:1036');
                    e.preventDefault();
                    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1042:1083');
                    var flag = Dom.get(self.uid).dragEnter(e);
                    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1152:1183');
                    if (flag) {
                        __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1163:1182');
                        e.stopPropagation();
                    }
                }, comp.uid);
                __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1206:1439');
                Events.addEvent(dropZone, 'drop', function (e) {
                    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1258:1276');
                    e.preventDefault();
                    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1282:1322');
                    var flag = Dom.get(self.uid).dragDrop(e);
                    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1391:1422');
                    if (flag) {
                        __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1402:1421');
                        e.stopPropagation();
                    }
                }, comp.uid);
                __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1445:1496');
                return self.shimExec.call(this, 'FileDrop', 'init');
            }
        };
    __$coverCall('src/javascript/runtime/silverlight/file/FileDrop.js', '1508:1547');
    return extensions.FileDrop = FileDrop;
});

// Included from: src/javascript/runtime/silverlight/file/FileReader.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/silverlight/file/FileReader.js", "/**\n * FileReader.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/silverlight/file/FileReader\n@private\n*/\ndefine(\"moxie/runtime/silverlight/file/FileReader\", [\n\t\"moxie/runtime/silverlight/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/runtime/flash/file/FileReader\"\n], function(extensions, Basic, FileReader) {\n\treturn (extensions.FileReader = Basic.extend({}, FileReader));\n});");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileReader.js", "413:682");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileReader.js", "617:678");
__$coverCall('src/javascript/runtime/silverlight/file/FileReader.js', '413:682');
define('moxie/runtime/silverlight/file/FileReader', [
    'moxie/runtime/silverlight/Runtime',
    'moxie/core/utils/Basic',
    'moxie/runtime/flash/file/FileReader'
], function (extensions, Basic, FileReader) {
    __$coverCall('src/javascript/runtime/silverlight/file/FileReader.js', '617:678');
    return extensions.FileReader = Basic.extend({}, FileReader);
});

// Included from: src/javascript/runtime/silverlight/xhr/XMLHttpRequest.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/silverlight/xhr/XMLHttpRequest.js", "/**\n * XMLHttpRequest.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/silverlight/xhr/XMLHttpRequest\n@private\n*/\ndefine(\"moxie/runtime/silverlight/xhr/XMLHttpRequest\", [\n\t\"moxie/runtime/silverlight/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/runtime/flash/xhr/XMLHttpRequest\"\n], function(extensions, Basic, XMLHttpRequest) {\n\treturn (extensions.XMLHttpRequest = Basic.extend({}, XMLHttpRequest));\n});");
__$coverInitRange("src/javascript/runtime/silverlight/xhr/XMLHttpRequest.js", "420:707");
__$coverInitRange("src/javascript/runtime/silverlight/xhr/XMLHttpRequest.js", "634:703");
__$coverCall('src/javascript/runtime/silverlight/xhr/XMLHttpRequest.js', '420:707');
define('moxie/runtime/silverlight/xhr/XMLHttpRequest', [
    'moxie/runtime/silverlight/Runtime',
    'moxie/core/utils/Basic',
    'moxie/runtime/flash/xhr/XMLHttpRequest'
], function (extensions, Basic, XMLHttpRequest) {
    __$coverCall('src/javascript/runtime/silverlight/xhr/XMLHttpRequest.js', '634:703');
    return extensions.XMLHttpRequest = Basic.extend({}, XMLHttpRequest);
});

// Included from: src/javascript/runtime/silverlight/file/FileReaderSync.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/silverlight/file/FileReaderSync.js", "/**\n * FileReaderSync.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/silverlight/file/FileReaderSync\n@private\n*/\ndefine(\"moxie/runtime/silverlight/file/FileReaderSync\", [\n\t\"moxie/runtime/silverlight/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/runtime/flash/file/FileReaderSync\"\n], function(extensions, Basic, FileReaderSync) {\n\treturn (extensions.FileReaderSync = Basic.extend({}, FileReaderSync));\n});");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileReaderSync.js", "421:710");
__$coverInitRange("src/javascript/runtime/silverlight/file/FileReaderSync.js", "637:706");
__$coverCall('src/javascript/runtime/silverlight/file/FileReaderSync.js', '421:710');
define('moxie/runtime/silverlight/file/FileReaderSync', [
    'moxie/runtime/silverlight/Runtime',
    'moxie/core/utils/Basic',
    'moxie/runtime/flash/file/FileReaderSync'
], function (extensions, Basic, FileReaderSync) {
    __$coverCall('src/javascript/runtime/silverlight/file/FileReaderSync.js', '637:706');
    return extensions.FileReaderSync = Basic.extend({}, FileReaderSync);
});

// Included from: src/javascript/runtime/silverlight/runtime/Transporter.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/silverlight/runtime/Transporter.js", "/**\n * Transporter.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/silverlight/runtime/Transporter\n@private\n*/\ndefine(\"moxie/runtime/silverlight/runtime/Transporter\", [\n\t\"moxie/runtime/silverlight/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/runtime/flash/runtime/Transporter\"\n], function(extensions, Basic, Transporter) {\n\treturn (extensions.Transporter = Basic.extend({}, Transporter));\n});");
__$coverInitRange("src/javascript/runtime/silverlight/runtime/Transporter.js", "418:698");
__$coverInitRange("src/javascript/runtime/silverlight/runtime/Transporter.js", "631:694");
__$coverCall('src/javascript/runtime/silverlight/runtime/Transporter.js', '418:698');
define('moxie/runtime/silverlight/runtime/Transporter', [
    'moxie/runtime/silverlight/Runtime',
    'moxie/core/utils/Basic',
    'moxie/runtime/flash/runtime/Transporter'
], function (extensions, Basic, Transporter) {
    __$coverCall('src/javascript/runtime/silverlight/runtime/Transporter.js', '631:694');
    return extensions.Transporter = Basic.extend({}, Transporter);
});

// Included from: src/javascript/runtime/silverlight/image/Image.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/silverlight/image/Image.js", "/**\n * Image.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/silverlight/image/Image\n@private\n*/\ndefine(\"moxie/runtime/silverlight/image/Image\", [\n\t\"moxie/runtime/silverlight/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/runtime/flash/image/Image\"\n], function(extensions, Basic, Image) {\n\treturn (extensions.Image = Basic.extend({}, Image));\n});");
__$coverInitRange("src/javascript/runtime/silverlight/image/Image.js", "404:650");
__$coverInitRange("src/javascript/runtime/silverlight/image/Image.js", "595:646");
__$coverCall('src/javascript/runtime/silverlight/image/Image.js', '404:650');
define('moxie/runtime/silverlight/image/Image', [
    'moxie/runtime/silverlight/Runtime',
    'moxie/core/utils/Basic',
    'moxie/runtime/flash/image/Image'
], function (extensions, Basic, Image) {
    __$coverCall('src/javascript/runtime/silverlight/image/Image.js', '595:646');
    return extensions.Image = Basic.extend({}, Image);
});

// Included from: src/javascript/runtime/html4/Runtime.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html4/Runtime.js", "/**\n * Runtime.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:false, scripturl:true, browser:true */\n/*global define:true, File:true */\n\n/**\nDefines constructor for HTML4 runtime.\n\n@class moxie/runtime/html4/Runtime\n@private\n*/\ndefine(\"moxie/runtime/html4/Runtime\", [\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/runtime/Runtime\",\n\t\"moxie/core/utils/Env\"\n], function(Basic, x, Runtime, Env) {\n\t\n\tvar type = 'html4', extensions = {};\n\n\tfunction Html4Runtime(options) {\n\t\tvar I = this, shim;\n\n\t\tRuntime.call(this, type, options, {\n\t\t\taccess_binary: !!(window.FileReader || window.File && File.getAsDataURL),\n\t\t\taccess_image_binary: false,\n\t\t\tdisplay_media: extensions.Image && (Env.can('create_canvas') || Env.can('use_data_uri_over32kb')),\n\t\t\tdrag_and_drop: false,\n\t\t\tresize_image: function() {\n\t\t\t\treturn extensions.Image && can('access_binary') && Env.can('create_canvas');\n\t\t\t},\n\t\t\treport_upload_progress: false,\n\t\t\treturn_response_headers: false,\n\t\t\treturn_response_type: function(responseType) {\n\t\t\t\treturn !!~Basic.inArray(responseType, ['json', 'text', 'document', '']);\n\t\t\t},\n\t\t\treturn_status_code: function(code) {\n\t\t\t\treturn !Basic.arrayDiff(code, [200, 404]);\n\t\t\t},\n\t\t\tselect_multiple: false,\n\t\t\tsend_binary_string: false,\n\t\t\tsend_custom_headers: false,\n\t\t\tsend_multipart: true,\n\t\t\tslice_blob: false,\n\t\t\tstream_upload: true,\n\t\t\tsummon_file_dialog: (function() { // yeah... some dirty sniffing here...\n\t\t\t\treturn  (Env.browser === 'Firefox' && Env.version >= 4)\t||\n\t\t\t\t\t\t(Env.browser === 'Opera' && Env.version >= 12)\t||\n\t\t\t\t\t\t!!~Basic.inArray(Env.browser, ['Chrome', 'Safari']);\n\t\t\t}()),\n\t\t\tupload_filesize: true,\n\t\t\tuse_http_method: function(methods) {\n\t\t\t\treturn !Basic.arrayDiff(methods, ['GET', 'POST']);\n\t\t\t}\n\t\t});\n\n\t\tBasic.extend(this, {\n\n\t\t\tinit : function() {\n\t\t\t\tif (!Env.can('use_fileinput')) { // minimal requirement\n\t\t\t\t\tthis.trigger(\"Error\", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\tthis.trigger(\"Init\");\n\t\t\t},\n\n\t\t\tgetShim: function() {\n\t\t\t\treturn shim;\n\t\t\t},\n\n\t\t\tshimExec: function(component, action) {\n\t\t\t\tvar args = [].slice.call(arguments, 2);\n\t\t\t\treturn I.getShim().exec.call(this, this.uid, component, action, args);\n\t\t\t},\n\n\t\t\tdestroy: (function(destroy) { // extend default destroy method\n\t\t\t\treturn function() {\n\t\t\t\t\tif (shim) {\n\t\t\t\t\t\tshim.removeAllInstances(I);\n\t\t\t\t\t}\n\t\t\t\t\tdestroy.call(I);\n\t\t\t\t\tdestroy = shim = I = null;\n\t\t\t\t};\n\t\t\t}(this.destroy))\n\t\t});\n\n\t\tshim = Basic.extend((function() {\n\t\t\tvar objpool = {};\n\n\t\t\treturn {\n\t\t\t\texec: function(uid, comp, fn, args) {\n\t\t\t\t\tif (shim[comp]) {\n\t\t\t\t\t\tif (!objpool[uid]) {\n\t\t\t\t\t\t\tobjpool[uid] = {\n\t\t\t\t\t\t\t\tcontext: this,\n\t\t\t\t\t\t\t\tinstance: new shim[comp]()\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (objpool[uid].instance[fn]) {\n\t\t\t\t\t\t\treturn objpool[uid].instance[fn].apply(this, args);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t},\n\n\t\t\t\tremoveInstance: function(uid) {\n\t\t\t\t\tdelete objpool[uid];\n\t\t\t\t},\n\n\t\t\t\tremoveAllInstances: function() {\n\t\t\t\t\tvar self = this;\n\t\t\t\t\t\n\t\t\t\t\tBasic.each(objpool, function(obj, uid) {\n\t\t\t\t\t\tif (Basic.typeOf(obj.instance.destroy) === 'function') {\n\t\t\t\t\t\t\tobj.instance.destroy.call(obj.context);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tself.removeInstance(uid);\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t};\n\t\t}()), extensions);\n\t}\n\n\tRuntime.addConstructor(type, Html4Runtime);\n\n\treturn extensions;\n});\n");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "448:3485");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "632:667");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "671:3414");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "3418:3460");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "3464:3481");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "706:724");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "729:1964");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "1969:2654");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2659:3411");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "1034:1109");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "1240:1311");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "1363:1404");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "1651:1823");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "1904:1953");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2018:2168");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2174:2194");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2079:2149");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2156:2162");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2232:2243");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2299:2337");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2343:2412");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2491:2628");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2516:2567");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2574:2589");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2596:2621");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2534:2560");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2696:2712");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2718:3390");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2774:3030");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2798:2916");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2925:3023");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2826:2915");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "2965:3015");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "3081:3100");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "3152:3167");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "3180:3378");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "3227:3337");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "3345:3369");
__$coverInitRange("src/javascript/runtime/html4/Runtime.js", "3291:3329");
__$coverCall('src/javascript/runtime/html4/Runtime.js', '448:3485');
define('moxie/runtime/html4/Runtime', [
    'moxie/core/utils/Basic',
    'moxie/core/Exceptions',
    'moxie/runtime/Runtime',
    'moxie/core/utils/Env'
], function (Basic, x, Runtime, Env) {
    __$coverCall('src/javascript/runtime/html4/Runtime.js', '632:667');
    var type = 'html4', extensions = {};
    __$coverCall('src/javascript/runtime/html4/Runtime.js', '671:3414');
    function Html4Runtime(options) {
        __$coverCall('src/javascript/runtime/html4/Runtime.js', '706:724');
        var I = this, shim;
        __$coverCall('src/javascript/runtime/html4/Runtime.js', '729:1964');
        Runtime.call(this, type, options, {
            access_binary: !!(window.FileReader || window.File && File.getAsDataURL),
            access_image_binary: false,
            display_media: extensions.Image && (Env.can('create_canvas') || Env.can('use_data_uri_over32kb')),
            drag_and_drop: false,
            resize_image: function () {
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '1034:1109');
                return extensions.Image && can('access_binary') && Env.can('create_canvas');
            },
            report_upload_progress: false,
            return_response_headers: false,
            return_response_type: function (responseType) {
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '1240:1311');
                return !!~Basic.inArray(responseType, [
                    'json',
                    'text',
                    'document',
                    ''
                ]);
            },
            return_status_code: function (code) {
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '1363:1404');
                return !Basic.arrayDiff(code, [
                    200,
                    404
                ]);
            },
            select_multiple: false,
            send_binary_string: false,
            send_custom_headers: false,
            send_multipart: true,
            slice_blob: false,
            stream_upload: true,
            summon_file_dialog: function () {
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '1651:1823');
                return Env.browser === 'Firefox' && Env.version >= 4 || Env.browser === 'Opera' && Env.version >= 12 || !!~Basic.inArray(Env.browser, [
                    'Chrome',
                    'Safari'
                ]);
            }(),
            upload_filesize: true,
            use_http_method: function (methods) {
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '1904:1953');
                return !Basic.arrayDiff(methods, [
                    'GET',
                    'POST'
                ]);
            }
        });
        __$coverCall('src/javascript/runtime/html4/Runtime.js', '1969:2654');
        Basic.extend(this, {
            init: function () {
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '2018:2168');
                if (!Env.can('use_fileinput')) {
                    __$coverCall('src/javascript/runtime/html4/Runtime.js', '2079:2149');
                    this.trigger('Error', new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
                    __$coverCall('src/javascript/runtime/html4/Runtime.js', '2156:2162');
                    return;
                }
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '2174:2194');
                this.trigger('Init');
            },
            getShim: function () {
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '2232:2243');
                return shim;
            },
            shimExec: function (component, action) {
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '2299:2337');
                var args = [].slice.call(arguments, 2);
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '2343:2412');
                return I.getShim().exec.call(this, this.uid, component, action, args);
            },
            destroy: function (destroy) {
                __$coverCall('src/javascript/runtime/html4/Runtime.js', '2491:2628');
                return function () {
                    __$coverCall('src/javascript/runtime/html4/Runtime.js', '2516:2567');
                    if (shim) {
                        __$coverCall('src/javascript/runtime/html4/Runtime.js', '2534:2560');
                        shim.removeAllInstances(I);
                    }
                    __$coverCall('src/javascript/runtime/html4/Runtime.js', '2574:2589');
                    destroy.call(I);
                    __$coverCall('src/javascript/runtime/html4/Runtime.js', '2596:2621');
                    destroy = shim = I = null;
                };
            }(this.destroy)
        });
        __$coverCall('src/javascript/runtime/html4/Runtime.js', '2659:3411');
        shim = Basic.extend(function () {
            __$coverCall('src/javascript/runtime/html4/Runtime.js', '2696:2712');
            var objpool = {};
            __$coverCall('src/javascript/runtime/html4/Runtime.js', '2718:3390');
            return {
                exec: function (uid, comp, fn, args) {
                    __$coverCall('src/javascript/runtime/html4/Runtime.js', '2774:3030');
                    if (shim[comp]) {
                        __$coverCall('src/javascript/runtime/html4/Runtime.js', '2798:2916');
                        if (!objpool[uid]) {
                            __$coverCall('src/javascript/runtime/html4/Runtime.js', '2826:2915');
                            objpool[uid] = {
                                context: this,
                                instance: new shim[comp]()
                            };
                        }
                        __$coverCall('src/javascript/runtime/html4/Runtime.js', '2925:3023');
                        if (objpool[uid].instance[fn]) {
                            __$coverCall('src/javascript/runtime/html4/Runtime.js', '2965:3015');
                            return objpool[uid].instance[fn].apply(this, args);
                        }
                    }
                },
                removeInstance: function (uid) {
                    __$coverCall('src/javascript/runtime/html4/Runtime.js', '3081:3100');
                    delete objpool[uid];
                },
                removeAllInstances: function () {
                    __$coverCall('src/javascript/runtime/html4/Runtime.js', '3152:3167');
                    var self = this;
                    __$coverCall('src/javascript/runtime/html4/Runtime.js', '3180:3378');
                    Basic.each(objpool, function (obj, uid) {
                        __$coverCall('src/javascript/runtime/html4/Runtime.js', '3227:3337');
                        if (Basic.typeOf(obj.instance.destroy) === 'function') {
                            __$coverCall('src/javascript/runtime/html4/Runtime.js', '3291:3329');
                            obj.instance.destroy.call(obj.context);
                        }
                        __$coverCall('src/javascript/runtime/html4/Runtime.js', '3345:3369');
                        self.removeInstance(uid);
                    });
                }
            };
        }(), extensions);
    }
    __$coverCall('src/javascript/runtime/html4/Runtime.js', '3418:3460');
    Runtime.addConstructor(type, Html4Runtime);
    __$coverCall('src/javascript/runtime/html4/Runtime.js', '3464:3481');
    return extensions;
});

// Included from: src/javascript/runtime/html4/file/FileInput.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html4/file/FileInput.js", "/**\n * FileInput.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html4/file/FileInput\n@private\n*/\ndefine(\"moxie/runtime/html4/file/FileInput\", [\n\t\"moxie/runtime/html4/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/utils/Dom\",\n\t\"moxie/core/utils/Events\",\n\t\"moxie/core/utils/Mime\",\n\t\"moxie/core/utils/Env\"\n], function(extensions, Basic, Dom, Events, Mime, Env) {\n\t\n\tfunction FileInput() {\n\t\tvar _uid, _files = [], _mimes = [], _options;\n\n\t\tfunction addInput() {\n\t\t\tvar comp = this, I = comp.getRuntime(), shimContainer, browseButton, currForm, form, input, uid;\n\n\t\t\tuid = Basic.guid('uid_');\n\n\t\t\tshimContainer = I.getShimContainer(); // we get new ref everytime to avoid memory leaks in IE\n\n\t\t\tif (_uid) { // move previous form out of the view\n\t\t\t\tcurrForm = Dom.get(_uid + '_form');\n\t\t\t\tif (currForm) {\n\t\t\t\t\tBasic.extend(currForm.style, { top: '100%' });\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t// build form in DOM, since innerHTML version not able to submit file for some reason\n\t\t\tform = document.createElement('form');\n\t\t\tform.setAttribute('id', uid + '_form');\n\t\t\tform.setAttribute('method', 'post');\n\t\t\tform.setAttribute('enctype', 'multipart/form-data');\n\t\t\tform.setAttribute('encoding', 'multipart/form-data');\n\n\t\t\tBasic.extend(form.style, {\n\t\t\t\toverflow: 'hidden',\n\t\t\t\tposition: 'absolute',\n\t\t\t\ttop: 0,\n\t\t\t\tleft: 0,\n\t\t\t\twidth: '100%',\n\t\t\t\theight: '100%'\n\t\t\t});\n\n\t\t\tinput = document.createElement('input');\n\t\t\tinput.setAttribute('id', uid);\n\t\t\tinput.setAttribute('type', 'file');\n\t\t\tinput.setAttribute('name', 'Filedata');\n\t\t\tinput.setAttribute('accept', _mimes.join(','));\n\n\t\t\tBasic.extend(input.style, {\n\t\t\t\tfontSize: '999px',\n\t\t\t\topacity: 0\n\t\t\t});\n\n\t\t\tform.appendChild(input);\n\t\t\tshimContainer.appendChild(form);\n\n\t\t\t// prepare file input to be placed underneath the browse_button element\n\t\t\tBasic.extend(input.style, {\n\t\t\t\tposition: 'absolute',\n\t\t\t\ttop: 0,\n\t\t\t\tleft: 0,\n\t\t\t\twidth: '100%',\n\t\t\t\theight: '100%'\n\t\t\t});\n\n\t\t\tif (Env.browser === 'IE' && Env.version < 10) {\n\t\t\t\tBasic.extend(input.style, {\n\t\t\t\t\tfilter : \"progid:DXImageTransform.Microsoft.Alpha(opacity=0)\"\n\t\t\t\t});\n\t\t\t}\n\n\t\t\tinput.onchange = function() { // there should be only one handler for this\n\t\t\t\tvar file;\n\n\t\t\t\tif (!this.value) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tif (this.files) {\n\t\t\t\t\tfile = this.files[0];\n\t\t\t\t} else {\n\t\t\t\t\tfile = {\n\t\t\t\t\t\tname: this.value\n\t\t\t\t\t};\n\t\t\t\t}\n\n\t\t\t\t_files = [file];\n\n\t\t\t\tthis.onchange = function() {}; // clear event handler\n\t\t\t\taddInput.call(comp);\n\n\t\t\t\t// after file is initialized as o.File, we need to update form and input ids\n\t\t\t\tcomp.bind('change', function() {\n\t\t\t\t\tvar input = Dom.get(uid), form = Dom.get(uid + '_form'), file;\n\n\t\t\t\t\tif (comp.files.length && input && form) {\n\t\t\t\t\t\tfile = comp.files[0];\n\n\t\t\t\t\t\tinput.setAttribute('id', file.uid);\n\t\t\t\t\t\tform.setAttribute('id', file.uid + '_form');\n\n\t\t\t\t\t\t// set upload target\n\t\t\t\t\t\tform.setAttribute('target', file.uid + '_iframe');\n\t\t\t\t\t}\n\t\t\t\t\tinput = form = null;\n\t\t\t\t}, 998);\n\n\t\t\t\tinput = form = null;\n\t\t\t\tcomp.trigger('change');\n\t\t\t};\n\n\n\t\t\t// route click event to the input\n\t\t\tif (I.can('summon_file_dialog')) {\n\t\t\t\tbrowseButton = Dom.get(_options.browse_button);\n\t\t\t\tEvents.removeEvent(browseButton, 'click', comp.uid);\n\t\t\t\tEvents.addEvent(browseButton, 'click', function(e) {\n\t\t\t\t\tif (input && !input.disabled) { // for some reason FF (up to 8.0.1 so far) lets to click disabled input[type=file]\n\t\t\t\t\t\tinput.click();\n\t\t\t\t\t}\n\t\t\t\t\te.preventDefault();\n\t\t\t\t}, comp.uid);\n\t\t\t}\n\n\t\t\t_uid = uid;\n\n\t\t\tshimContainer = currForm = browseButton = null;\n\t\t}\n\n\t\tBasic.extend(this, {\n\t\t\tinit: function(options) {\n\t\t\t\tvar comp = this, I = comp.getRuntime(), shimContainer;\n\n\t\t\t\t// figure out accept string\n\t\t\t\t_options = options;\n\t\t\t\t_mimes = options.accept.mimes || Mime.extList2mimes(options.accept);\n\n\t\t\t\tshimContainer = I.getShimContainer();\n\n\t\t\t\t(function() {\n\t\t\t\t\tvar browseButton, zIndex, top;\n\n\t\t\t\t\tbrowseButton = Dom.get(options.browse_button);\n\n\t\t\t\t\t// Route click event to the input[type=file] element for browsers that support such behavior\n\t\t\t\t\tif (I.can('summon_file_dialog')) {\n\t\t\t\t\t\tif (Dom.getStyle(browseButton, 'position') === 'static') {\n\t\t\t\t\t\t\tbrowseButton.style.position = 'relative';\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tzIndex = parseInt(Dom.getStyle(browseButton, 'z-index'), 10) || 1;\n\n\t\t\t\t\t\tbrowseButton.style.zIndex = zIndex;\n\t\t\t\t\t\tshimContainer.style.zIndex = zIndex - 1;\n\t\t\t\t\t}\n\n\t\t\t\t\t/* Since we have to place input[type=file] on top of the browse_button for some browsers,\n\t\t\t\t\tbrowse_button loses interactivity, so we restore it here */\n\t\t\t\t\ttop = I.can('summon_file_dialog') ? browseButton : shimContainer;\n\n\t\t\t\t\tEvents.addEvent(top, 'mouseover', function() {\n\t\t\t\t\t\tcomp.trigger('mouseenter');\n\t\t\t\t\t}, comp.uid);\n\n\t\t\t\t\tEvents.addEvent(top, 'mouseout', function() {\n\t\t\t\t\t\tcomp.trigger('mouseleave');\n\t\t\t\t\t}, comp.uid);\n\n\t\t\t\t\tEvents.addEvent(top, 'mousedown', function() {\n\t\t\t\t\t\tcomp.trigger('mousedown');\n\t\t\t\t\t}, comp.uid);\n\n\t\t\t\t\tEvents.addEvent(Dom.get(options.container), 'mouseup', function() {\n\t\t\t\t\t\tcomp.trigger('mouseup');\n\t\t\t\t\t}, comp.uid);\n\t\t\t\t}());\n\n\t\t\t\taddInput.call(this);\n\n\t\t\t\tshimContainer = null;\n\t\t\t},\n\n\t\t\tgetFiles: function() {\n\t\t\t\treturn _files;\n\t\t\t},\n\n\t\t\tdisable: function(state) {\n\t\t\t\tvar input;\n\n\t\t\t\tif ((input = Dom.get(_uid))) {\n\t\t\t\t\tinput.disabled = !!state;\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t}\n\n\treturn (extensions.FileInput = FileInput);\n});");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "405:5588");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "674:5539");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5543:5584");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "699:743");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "748:3788");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3793:5536");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "773:868");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "874:898");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "904:940");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1002:1173");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1268:1305");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1310:1348");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1353:1388");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1393:1444");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1449:1501");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1507:1652");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1658:1697");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1702:1731");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1736:1770");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1775:1813");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1818:1864");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1870:1941");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1947:1970");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1975:2006");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2087:2209");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2215:2373");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2379:3277");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3321:3716");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3722:3732");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3738:3784");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1056:1090");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1096:1168");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "1117:1162");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2267:2368");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2458:2466");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2473:2509");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2516:2623");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2630:2645");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2652:2681");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2710:2729");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2817:3217");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3224:3243");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3249:3271");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2497:2503");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2539:2559");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2579:2617");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2855:2916");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2924:3178");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3185:3204");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "2972:2992");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3001:3035");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3043:3086");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3122:3171");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3360:3406");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3412:3463");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3469:3711");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3527:3668");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3675:3693");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3648:3661");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3847:3900");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3939:3957");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "3963:4030");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4037:4073");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4080:5295");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5302:5321");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5328:5348");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4099:4128");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4136:4181");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4287:4613");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4781:4845");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4853:4951");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4959:5056");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5064:5161");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5169:5285");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4328:4442");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4451:4516");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4525:4559");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4567:4606");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4394:4434");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "4906:4932");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5011:5037");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5117:5142");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5243:5266");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5387:5400");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5443:5452");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5459:5525");
__$coverInitRange("src/javascript/runtime/html4/file/FileInput.js", "5495:5519");
__$coverCall('src/javascript/runtime/html4/file/FileInput.js', '405:5588');
define('moxie/runtime/html4/file/FileInput', [
    'moxie/runtime/html4/Runtime',
    'moxie/core/utils/Basic',
    'moxie/core/utils/Dom',
    'moxie/core/utils/Events',
    'moxie/core/utils/Mime',
    'moxie/core/utils/Env'
], function (extensions, Basic, Dom, Events, Mime, Env) {
    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '674:5539');
    function FileInput() {
        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '699:743');
        var _uid, _files = [], _mimes = [], _options;
        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '748:3788');
        function addInput() {
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '773:868');
            var comp = this, I = comp.getRuntime(), shimContainer, browseButton, currForm, form, input, uid;
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '874:898');
            uid = Basic.guid('uid_');
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '904:940');
            shimContainer = I.getShimContainer();
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1002:1173');
            if (_uid) {
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1056:1090');
                currForm = Dom.get(_uid + '_form');
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1096:1168');
                if (currForm) {
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1117:1162');
                    Basic.extend(currForm.style, { top: '100%' });
                }
            }
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1268:1305');
            form = document.createElement('form');
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1310:1348');
            form.setAttribute('id', uid + '_form');
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1353:1388');
            form.setAttribute('method', 'post');
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1393:1444');
            form.setAttribute('enctype', 'multipart/form-data');
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1449:1501');
            form.setAttribute('encoding', 'multipart/form-data');
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1507:1652');
            Basic.extend(form.style, {
                overflow: 'hidden',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            });
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1658:1697');
            input = document.createElement('input');
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1702:1731');
            input.setAttribute('id', uid);
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1736:1770');
            input.setAttribute('type', 'file');
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1775:1813');
            input.setAttribute('name', 'Filedata');
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1818:1864');
            input.setAttribute('accept', _mimes.join(','));
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1870:1941');
            Basic.extend(input.style, {
                fontSize: '999px',
                opacity: 0
            });
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1947:1970');
            form.appendChild(input);
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '1975:2006');
            shimContainer.appendChild(form);
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2087:2209');
            Basic.extend(input.style, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            });
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2215:2373');
            if (Env.browser === 'IE' && Env.version < 10) {
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2267:2368');
                Basic.extend(input.style, { filter: 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)' });
            }
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2379:3277');
            input.onchange = function () {
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2458:2466');
                var file;
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2473:2509');
                if (!this.value) {
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2497:2503');
                    return;
                }
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2516:2623');
                if (this.files) {
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2539:2559');
                    file = this.files[0];
                } else {
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2579:2617');
                    file = { name: this.value };
                }
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2630:2645');
                _files = [file];
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2652:2681');
                this.onchange = function () {
                };
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2710:2729');
                addInput.call(comp);
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2817:3217');
                comp.bind('change', function () {
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2855:2916');
                    var input = Dom.get(uid), form = Dom.get(uid + '_form'), file;
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2924:3178');
                    if (comp.files.length && input && form) {
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '2972:2992');
                        file = comp.files[0];
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3001:3035');
                        input.setAttribute('id', file.uid);
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3043:3086');
                        form.setAttribute('id', file.uid + '_form');
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3122:3171');
                        form.setAttribute('target', file.uid + '_iframe');
                    }
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3185:3204');
                    input = form = null;
                }, 998);
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3224:3243');
                input = form = null;
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3249:3271');
                comp.trigger('change');
            };
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3321:3716');
            if (I.can('summon_file_dialog')) {
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3360:3406');
                browseButton = Dom.get(_options.browse_button);
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3412:3463');
                Events.removeEvent(browseButton, 'click', comp.uid);
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3469:3711');
                Events.addEvent(browseButton, 'click', function (e) {
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3527:3668');
                    if (input && !input.disabled) {
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3648:3661');
                        input.click();
                    }
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3675:3693');
                    e.preventDefault();
                }, comp.uid);
            }
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3722:3732');
            _uid = uid;
            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3738:3784');
            shimContainer = currForm = browseButton = null;
        }
        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3793:5536');
        Basic.extend(this, {
            init: function (options) {
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3847:3900');
                var comp = this, I = comp.getRuntime(), shimContainer;
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3939:3957');
                _options = options;
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '3963:4030');
                _mimes = options.accept.mimes || Mime.extList2mimes(options.accept);
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4037:4073');
                shimContainer = I.getShimContainer();
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4080:5295');
                (function () {
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4099:4128');
                    var browseButton, zIndex, top;
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4136:4181');
                    browseButton = Dom.get(options.browse_button);
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4287:4613');
                    if (I.can('summon_file_dialog')) {
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4328:4442');
                        if (Dom.getStyle(browseButton, 'position') === 'static') {
                            __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4394:4434');
                            browseButton.style.position = 'relative';
                        }
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4451:4516');
                        zIndex = parseInt(Dom.getStyle(browseButton, 'z-index'), 10) || 1;
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4525:4559');
                        browseButton.style.zIndex = zIndex;
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4567:4606');
                        shimContainer.style.zIndex = zIndex - 1;
                    }
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4781:4845');
                    top = I.can('summon_file_dialog') ? browseButton : shimContainer;
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4853:4951');
                    Events.addEvent(top, 'mouseover', function () {
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4906:4932');
                        comp.trigger('mouseenter');
                    }, comp.uid);
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '4959:5056');
                    Events.addEvent(top, 'mouseout', function () {
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5011:5037');
                        comp.trigger('mouseleave');
                    }, comp.uid);
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5064:5161');
                    Events.addEvent(top, 'mousedown', function () {
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5117:5142');
                        comp.trigger('mousedown');
                    }, comp.uid);
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5169:5285');
                    Events.addEvent(Dom.get(options.container), 'mouseup', function () {
                        __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5243:5266');
                        comp.trigger('mouseup');
                    }, comp.uid);
                }());
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5302:5321');
                addInput.call(this);
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5328:5348');
                shimContainer = null;
            },
            getFiles: function () {
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5387:5400');
                return _files;
            },
            disable: function (state) {
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5443:5452');
                var input;
                __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5459:5525');
                if (input = Dom.get(_uid)) {
                    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5495:5519');
                    input.disabled = !!state;
                }
            }
        });
    }
    __$coverCall('src/javascript/runtime/html4/file/FileInput.js', '5543:5584');
    return extensions.FileInput = FileInput;
});

// Included from: src/javascript/runtime/html4/file/FileReader.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html4/file/FileReader.js", "/**\n * FileReader.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html4/file/FileReader\n@private\n*/\ndefine(\"moxie/runtime/html4/file/FileReader\", [\n\t\"moxie/runtime/html4/Runtime\",\n\t\"moxie/runtime/html5/file/FileReader\"\n], function(extensions, FileReader) {\n\treturn (extensions.FileReader = FileReader);\n});\n");
__$coverInitRange("src/javascript/runtime/html4/file/FileReader.js", "407:612");
__$coverInitRange("src/javascript/runtime/html4/file/FileReader.js", "565:608");
__$coverCall('src/javascript/runtime/html4/file/FileReader.js', '407:612');
define('moxie/runtime/html4/file/FileReader', [
    'moxie/runtime/html4/Runtime',
    'moxie/runtime/html5/file/FileReader'
], function (extensions, FileReader) {
    __$coverCall('src/javascript/runtime/html4/file/FileReader.js', '565:608');
    return extensions.FileReader = FileReader;
});

// Included from: src/javascript/runtime/html4/xhr/XMLHttpRequest.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "/**\n * XMLHttpRequest.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true, laxcomma:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html4/xhr/XMLHttpRequest\n@private\n*/\ndefine(\"moxie/runtime/html4/xhr/XMLHttpRequest\", [\n\t\"moxie/runtime/html4/Runtime\",\n\t\"moxie/core/utils/Basic\",\n\t\"moxie/core/utils/Dom\",\n\t\"moxie/core/utils/Url\",\n\t\"moxie/core/Exceptions\",\n\t\"moxie/core/utils/Events\",\n\t\"moxie/file/Blob\",\n\t\"moxie/xhr/FormData\",\n\t\"moxie/core/JSON\"\n], function(extensions, Basic, Dom, Url, x, Events, Blob, FormData, parseJSON) {\n\t\n\tfunction XMLHttpRequest() {\n\t\tvar _status, _response, _iframe;\n\n\t\tfunction cleanup(cb) {\n\t\t\tvar target = this, uid, form, inputs, i, hasFile = false;\n\n\t\t\tif (!_iframe) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tuid = _iframe.id.replace(/_iframe$/, '');\n\n\t\t\tform = Dom.get(uid + '_form');\n\t\t\tif (form) {\n\t\t\t\tinputs = form.getElementsByTagName('input');\n\t\t\t\ti = inputs.length;\n\n\t\t\t\twhile (i--) {\n\t\t\t\t\tswitch (inputs[i].getAttribute('type')) {\n\t\t\t\t\t\tcase 'hidden':\n\t\t\t\t\t\t\tinputs[i].parentNode.removeChild(inputs[i]);\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\tcase 'file':\n\t\t\t\t\t\t\thasFile = true; // flag the case for later\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tinputs = [];\n\n\t\t\t\tif (!hasFile) { // we need to keep the form for sake of possible retries\n\t\t\t\t\tform.parentNode.removeChild(form);\n\t\t\t\t}\n\t\t\t\tform = null;\n\t\t\t}\n\n\t\t\t// without timeout, request is marked as canceled (in console)\n\t\t\tsetTimeout(function() {\n\t\t\t\tEvents.removeEvent(_iframe, 'load', target.uid);\n\t\t\t\tif (_iframe.parentNode) { // #382\n\t\t\t\t\t_iframe.parentNode.removeChild(_iframe);\n\t\t\t\t}\n\n\t\t\t\t// check if shim container has any other children, if - not, remove it as well\n\t\t\t\tvar shimContainer = target.getRuntime().getShimContainer();\n\t\t\t\tif (!shimContainer.children.length) {\n\t\t\t\t\tshimContainer.parentNode.removeChild(shimContainer);\n\t\t\t\t}\n\n\t\t\t\tshimContainer = _iframe = null;\n\t\t\t\tcb();\n\t\t\t}, 1);\n\t\t}\n\n\t\tBasic.extend(this, {\n\t\t\tsend: function(meta, data) {\n\t\t\t\tvar target = this, I = target.getRuntime(), uid, form, input, blob;\n\n\t\t\t\t_status = _response = null;\n\n\t\t\t\tfunction createIframe() {\n\t\t\t\t\tvar container = I.getShimContainer() || document.body\n\t\t\t\t\t, temp = document.createElement('div')\n\t\t\t\t\t;\n\n\t\t\t\t\t// IE 6 won't be able to set the name using setAttribute or iframe.name\n\t\t\t\t\ttemp.innerHTML = '<iframe id=\"' + uid + '_iframe\" name=\"' + uid + '_iframe\" src=\"javascript:&quot;&quot;\" style=\"display:none\"></iframe>';\n\t\t\t\t\t_iframe = temp.firstChild;\n\t\t\t\t\tcontainer.appendChild(_iframe);\n\n\t\t\t\t\t/* _iframe.onreadystatechange = function() {\n\t\t\t\t\t\tconsole.info(_iframe.readyState);\n\t\t\t\t\t};*/\n\n\t\t\t\t\tEvents.addEvent(_iframe, 'load', function() { // _iframe.onload doesn't work in IE lte 8\n\t\t\t\t\t\tvar el;\n\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\tel = _iframe.contentWindow.document || _iframe.contentDocument || window.frames[_iframe.id].document;\n\n\t\t\t\t\t\t\t// try to detect some standard error pages\n\t\t\t\t\t\t\tif (/^4\\d{2}\\s/.test(el.title) && el.getElementsByTagName('address').length) { // standard Apache style\n\t\t\t\t\t\t\t\t_status = el.title.replace(/^(\\d+).*$/, '$1');\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t_status = 200;\n\t\t\t\t\t\t\t\t// get result\n\t\t\t\t\t\t\t\t_response = Basic.trim(el.body.innerHTML);\n\n\t\t\t\t\t\t\t\ttarget.trigger({\n\t\t\t\t\t\t\t\t\ttype: 'uploadprogress',\n\t\t\t\t\t\t\t\t\tloaded: blob && blob.size || 1025,\n\t\t\t\t\t\t\t\t\ttotal: blob && blob.size || 1025\n\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t} catch (ex) {\n\t\t\t\t\t\t\tif (Url.hasSameOrigin(meta.url)) {\n\t\t\t\t\t\t\t\t// if response is sent with error code, iframe in IE gets redirected to res://ieframe.dll/http_x.htm\n\t\t\t\t\t\t\t\t// which obviously results to cross domain error (wtf?)\n\t\t\t\t\t\t\t\t_status = 404;\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tcleanup.call(target, function() {\n\t\t\t\t\t\t\t\t\ttarget.trigger('error');\n\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\t\n\t\t\t\t\t\n\t\t\t\t\t\tcleanup.call(target, function() {\n\t\t\t\t\t\t\ttarget.trigger('load');\n\t\t\t\t\t\t});\n\t\t\t\t\t}, target.uid);\n\t\t\t\t} // end createIframe\n\n\t\t\t\t// prepare data to be sent and convert if required\n\t\t\t\tif (data instanceof FormData && data.hasBlob()) {\n\t\t\t\t\tblob = data.getBlob();\n\t\t\t\t\tuid = blob.uid;\n\t\t\t\t\tinput = Dom.get(uid);\n\t\t\t\t\tform = Dom.get(uid + '_form');\n\t\t\t\t\tif (!form) {\n\t\t\t\t\t\tthrow new x.DOMException(x.DOMException.NOT_FOUND_ERR);\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tuid = Basic.guid('uid_');\n\n\t\t\t\t\tform = document.createElement('form');\n\t\t\t\t\tform.setAttribute('id', uid + '_form');\n\t\t\t\t\tform.setAttribute('method', meta.method);\n\t\t\t\t\tform.setAttribute('enctype', 'multipart/form-data');\n\t\t\t\t\tform.setAttribute('encoding', 'multipart/form-data');\n\t\t\t\t\tform.setAttribute('target', uid + '_iframe');\n\n\t\t\t\t\tI.getShimContainer().appendChild(form);\n\t\t\t\t}\n\n\t\t\t\tif (data instanceof FormData) {\n\t\t\t\t\tdata.each(function(value, name) {\n\t\t\t\t\t\tif (value instanceof Blob) {\n\t\t\t\t\t\t\tif (input) {\n\t\t\t\t\t\t\t\tinput.setAttribute('name', name);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tvar hidden = document.createElement('input');\n\n\t\t\t\t\t\t\tBasic.extend(hidden, {\n\t\t\t\t\t\t\t\ttype : 'hidden',\n\t\t\t\t\t\t\t\tname : name,\n\t\t\t\t\t\t\t\tvalue : value\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\tform.appendChild(hidden);\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\n\t\t\t\t// set destination url\n\t\t\t\tform.setAttribute(\"action\", meta.url);\n\n\t\t\t\tcreateIframe();\n\t\t\t\tform.submit();\n\t\t\t\ttarget.trigger('loadstart');\n\t\t\t},\n\n\t\t\tgetStatus: function() {\n\t\t\t\treturn _status;\n\t\t\t},\n\n\t\t\tgetResponse: function(responseType) {\n\t\t\t\tif ('json' === responseType) {\n\t\t\t\t\t// strip off <pre>..</pre> tags that might be enclosing the response\n\t\t\t\t\tif (Basic.typeOf(_response) === 'string') {\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\treturn parseJSON(_response.replace(/^\\s*<pre[^>]*>/, '').replace(/<\\/pre>\\s*$/, ''));\n\t\t\t\t\t\t} catch (ex) {\n\t\t\t\t\t\t\treturn null;\n\t\t\t\t\t\t}\n\t\t\t\t\t} \n\t\t\t\t} else if ('document' === responseType) {\n\n\t\t\t\t}\n\t\t\t\treturn _response;\n\t\t\t},\n\n\t\t\tabort: function() {\n\t\t\t\tvar target = this;\n\n\t\t\t\tif (_iframe && _iframe.contentWindow) {\n\t\t\t\t\tif (_iframe.contentWindow.stop) { // FireFox/Safari/Chrome\n\t\t\t\t\t\t_iframe.contentWindow.stop();\n\t\t\t\t\t} else if (_iframe.contentWindow.document.execCommand) { // IE\n\t\t\t\t\t\t_iframe.contentWindow.document.execCommand('Stop');\n\t\t\t\t\t} else {\n\t\t\t\t\t\t_iframe.src = \"about:blank\";\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tcleanup.call(this, function() {\n\t\t\t\t\t// target.dispatchEvent('readystatechange');\n\t\t\t\t\ttarget.dispatchEvent('abort');\n\t\t\t\t});\n\t\t\t}\n\t\t});\n\t}\n\n\treturn (extensions.XMLHttpRequest = XMLHttpRequest);\n});");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "429:6415");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "789:6356");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "6360:6411");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "819:850");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "855:2106");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2111:6353");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "881:937");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "943:974");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "980:1020");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1026:1055");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1060:1554");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1626:2102");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "963:969");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1076:1119");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1125:1142");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1149:1391");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1397:1408");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1415:1532");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1538:1549");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1168:1385");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1238:1281");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1290:1295");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1323:1337");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1373:1378");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1493:1526");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1654:1701");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1707:1791");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1881:1939");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1945:2045");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2052:2082");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2088:2092");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1746:1785");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "1988:2039");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2168:2234");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2241:2267");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2274:4037");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4119:4767");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4774:5184");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5218:5255");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5262:5276");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5282:5295");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5301:5328");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2305:2407");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2408:2408");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2493:2630");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2637:2662");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2669:2699");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2808:4031");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2903:2909");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2918:3922");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3937:4010");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "2931:3031");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3091:3526");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3203:3248");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3274:3287");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3319:3360");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3371:3517");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3556:3914");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3772:3785");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3811:3889");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3899:3905");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3854:3877");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "3978:4000");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4174:4195");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4202:4216");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4223:4243");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4250:4279");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4286:4366");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4305:4359");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4386:4410");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4418:4455");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4462:4500");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4507:4547");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4554:4605");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4612:4664");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4671:4715");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4723:4761");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4811:5178");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4851:5169");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4887:4949");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4908:4940");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "4973:5017");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5027:5127");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5137:5161");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5368:5382");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5436:5803");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5809:5825");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5546:5749");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5596:5742");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5609:5693");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5723:5734");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5861:5878");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5885:6211");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "6218:6342");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5930:6205");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "5995:6023");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "6099:6149");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "6171:6198");
__$coverInitRange("src/javascript/runtime/html4/xhr/XMLHttpRequest.js", "6305:6334");
__$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '429:6415');
define('moxie/runtime/html4/xhr/XMLHttpRequest', [
    'moxie/runtime/html4/Runtime',
    'moxie/core/utils/Basic',
    'moxie/core/utils/Dom',
    'moxie/core/utils/Url',
    'moxie/core/Exceptions',
    'moxie/core/utils/Events',
    'moxie/file/Blob',
    'moxie/xhr/FormData',
    'moxie/core/JSON'
], function (extensions, Basic, Dom, Url, x, Events, Blob, FormData, parseJSON) {
    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '789:6356');
    function XMLHttpRequest() {
        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '819:850');
        var _status, _response, _iframe;
        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '855:2106');
        function cleanup(cb) {
            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '881:937');
            var target = this, uid, form, inputs, i, hasFile = false;
            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '943:974');
            if (!_iframe) {
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '963:969');
                return;
            }
            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '980:1020');
            uid = _iframe.id.replace(/_iframe$/, '');
            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1026:1055');
            form = Dom.get(uid + '_form');
            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1060:1554');
            if (form) {
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1076:1119');
                inputs = form.getElementsByTagName('input');
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1125:1142');
                i = inputs.length;
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1149:1391');
                while (i--) {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1168:1385');
                    switch (inputs[i].getAttribute('type')) {
                    case 'hidden':
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1238:1281');
                        inputs[i].parentNode.removeChild(inputs[i]);
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1290:1295');
                        break;
                    case 'file':
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1323:1337');
                        hasFile = true;
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1373:1378');
                        break;
                    }
                }
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1397:1408');
                inputs = [];
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1415:1532');
                if (!hasFile) {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1493:1526');
                    form.parentNode.removeChild(form);
                }
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1538:1549');
                form = null;
            }
            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1626:2102');
            setTimeout(function () {
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1654:1701');
                Events.removeEvent(_iframe, 'load', target.uid);
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1707:1791');
                if (_iframe.parentNode) {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1746:1785');
                    _iframe.parentNode.removeChild(_iframe);
                }
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1881:1939');
                var shimContainer = target.getRuntime().getShimContainer();
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1945:2045');
                if (!shimContainer.children.length) {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '1988:2039');
                    shimContainer.parentNode.removeChild(shimContainer);
                }
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2052:2082');
                shimContainer = _iframe = null;
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2088:2092');
                cb();
            }, 1);
        }
        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2111:6353');
        Basic.extend(this, {
            send: function (meta, data) {
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2168:2234');
                var target = this, I = target.getRuntime(), uid, form, input, blob;
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2241:2267');
                _status = _response = null;
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2274:4037');
                function createIframe() {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2305:2407');
                    var container = I.getShimContainer() || document.body, temp = document.createElement('div');
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2408:2408');
                    ;
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2493:2630');
                    temp.innerHTML = '<iframe id="' + uid + '_iframe" name="' + uid + '_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>';
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2637:2662');
                    _iframe = temp.firstChild;
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2669:2699');
                    container.appendChild(_iframe);
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2808:4031');
                    Events.addEvent(_iframe, 'load', function () {
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2903:2909');
                        var el;
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2918:3922');
                        try {
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '2931:3031');
                            el = _iframe.contentWindow.document || _iframe.contentDocument || window.frames[_iframe.id].document;
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3091:3526');
                            if (/^4\d{2}\s/.test(el.title) && el.getElementsByTagName('address').length) {
                                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3203:3248');
                                _status = el.title.replace(/^(\d+).*$/, '$1');
                            } else {
                                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3274:3287');
                                _status = 200;
                                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3319:3360');
                                _response = Basic.trim(el.body.innerHTML);
                                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3371:3517');
                                target.trigger({
                                    type: 'uploadprogress',
                                    loaded: blob && blob.size || 1025,
                                    total: blob && blob.size || 1025
                                });
                            }
                        } catch (ex) {
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3556:3914');
                            if (Url.hasSameOrigin(meta.url)) {
                                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3772:3785');
                                _status = 404;
                            } else {
                                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3811:3889');
                                cleanup.call(target, function () {
                                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3854:3877');
                                    target.trigger('error');
                                });
                                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3899:3905');
                                return;
                            }
                        }
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3937:4010');
                        cleanup.call(target, function () {
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '3978:4000');
                            target.trigger('load');
                        });
                    }, target.uid);
                }
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4119:4767');
                if (data instanceof FormData && data.hasBlob()) {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4174:4195');
                    blob = data.getBlob();
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4202:4216');
                    uid = blob.uid;
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4223:4243');
                    input = Dom.get(uid);
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4250:4279');
                    form = Dom.get(uid + '_form');
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4286:4366');
                    if (!form) {
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4305:4359');
                        throw new x.DOMException(x.DOMException.NOT_FOUND_ERR);
                    }
                } else {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4386:4410');
                    uid = Basic.guid('uid_');
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4418:4455');
                    form = document.createElement('form');
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4462:4500');
                    form.setAttribute('id', uid + '_form');
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4507:4547');
                    form.setAttribute('method', meta.method);
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4554:4605');
                    form.setAttribute('enctype', 'multipart/form-data');
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4612:4664');
                    form.setAttribute('encoding', 'multipart/form-data');
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4671:4715');
                    form.setAttribute('target', uid + '_iframe');
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4723:4761');
                    I.getShimContainer().appendChild(form);
                }
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4774:5184');
                if (data instanceof FormData) {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4811:5178');
                    data.each(function (value, name) {
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4851:5169');
                        if (value instanceof Blob) {
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4887:4949');
                            if (input) {
                                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4908:4940');
                                input.setAttribute('name', name);
                            }
                        } else {
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '4973:5017');
                            var hidden = document.createElement('input');
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5027:5127');
                            Basic.extend(hidden, {
                                type: 'hidden',
                                name: name,
                                value: value
                            });
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5137:5161');
                            form.appendChild(hidden);
                        }
                    });
                }
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5218:5255');
                form.setAttribute('action', meta.url);
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5262:5276');
                createIframe();
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5282:5295');
                form.submit();
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5301:5328');
                target.trigger('loadstart');
            },
            getStatus: function () {
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5368:5382');
                return _status;
            },
            getResponse: function (responseType) {
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5436:5803');
                if ('json' === responseType) {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5546:5749');
                    if (Basic.typeOf(_response) === 'string') {
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5596:5742');
                        try {
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5609:5693');
                            return parseJSON(_response.replace(/^\s*<pre[^>]*>/, '').replace(/<\/pre>\s*$/, ''));
                        } catch (ex) {
                            __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5723:5734');
                            return null;
                        }
                    }
                } else if ('document' === responseType) {
                }
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5809:5825');
                return _response;
            },
            abort: function () {
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5861:5878');
                var target = this;
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5885:6211');
                if (_iframe && _iframe.contentWindow) {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5930:6205');
                    if (_iframe.contentWindow.stop) {
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '5995:6023');
                        _iframe.contentWindow.stop();
                    } else if (_iframe.contentWindow.document.execCommand) {
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '6099:6149');
                        _iframe.contentWindow.document.execCommand('Stop');
                    } else {
                        __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '6171:6198');
                        _iframe.src = 'about:blank';
                    }
                }
                __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '6218:6342');
                cleanup.call(this, function () {
                    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '6305:6334');
                    target.dispatchEvent('abort');
                });
            }
        });
    }
    __$coverCall('src/javascript/runtime/html4/xhr/XMLHttpRequest.js', '6360:6411');
    return extensions.XMLHttpRequest = XMLHttpRequest;
});

// Included from: src/javascript/runtime/html4/image/Image.js

if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	if (!__$coverObject[name]) __$coverObject[name] = {__code: code};
};
var __$coverInitRange = function(name, range){
	if (!__$coverObject[name][range]) __$coverObject[name][range] = 0;
};
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
};
__$coverInit("src/javascript/runtime/html4/image/Image.js", "/**\n * Image.js\n *\n * Copyright 2013, Moxiecode Systems AB\n * Released under GPL License.\n *\n * License: http://www.plupload.com/license\n * Contributing: http://www.plupload.com/contributing\n */\n\n/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */\n/*global define:true */\n\n/**\n@class moxie/runtime/html4/image/Image\n@private\n*/\ndefine(\"moxie/runtime/html4/image/Image\", [\n\t\"moxie/runtime/html4/Runtime\",\n\t\"moxie/runtime/html5/image/Image\"\n], function(extensions, Image) {\n\treturn (extensions.Image = Image);\n});");
__$coverInitRange("src/javascript/runtime/html4/image/Image.js", "398:580");
__$coverInitRange("src/javascript/runtime/html4/image/Image.js", "543:576");
__$coverCall('src/javascript/runtime/html4/image/Image.js', '398:580');
define('moxie/runtime/html4/image/Image', [
    'moxie/runtime/html4/Runtime',
    'moxie/runtime/html5/image/Image'
], function (extensions, Image) {
    __$coverCall('src/javascript/runtime/html4/image/Image.js', '543:576');
    return extensions.Image = Image;
});

expose(["moxie/core/utils/Basic","moxie/core/I18n","moxie/core/utils/Mime","moxie/core/utils/Env","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/core/EventTarget","moxie/core/utils/Encode","moxie/runtime/Runtime","moxie/runtime/RuntimeClient","moxie/file/Blob","moxie/file/File","moxie/file/FileInput","moxie/file/FileDrop","moxie/file/FileReader","moxie/core/utils/Url","moxie/runtime/RuntimeTarget","moxie/xhr/FormData","moxie/xhr/XMLHttpRequest","moxie/file/FileReaderSync","moxie/runtime/Transporter","moxie/core/JSON","moxie/image/Image","moxie/core/utils/Events"]);
})(this);