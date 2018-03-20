/**
 * Basic.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/utils/Basic
@public
@static
*/

/**
Gets the true type of the built-in object (better version of typeof).
@author Angus Croll (http://javascriptweblog.wordpress.com/)

@method typeOf
@static
@param {Object} o Object to check.
@return {String} Object [[Class]]
*/
const typeOf = function (o) {
	if (o === undefined) {
		return 'undefined';
	} else if (o === null) {
		return 'null';
	} else if (o.nodeType) {
		return 'node';
	}

	// the snippet below is awesome, however it fails to detect null, undefined and arguments types in IE lte 8
	return ({}).toString.call(o).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}

/**
Extends the specified object with another object(s).

@method extend
@static
@param {Object} target Object to extend.
@param {Object} [obj]* Multiple objects to extend with.
@return {Object} Same as target, the extended object.
*/
const extend = function (...args) {
	return merge(false, false, arguments);
}


/**
Extends the specified object with another object(s), but only if the property exists in the target.

@method extendIf
@static
@param {Object} target Object to extend.
@param {Object} [obj]* Multiple objects to extend with.
@return {Object} Same as target, the extended object.
*/
const extendIf = function () {
	return merge(true, false, arguments);
}


const extendImmutable = function () {
	return merge(false, true, arguments);
}


const extendImmutableIf = function () {
	return merge(true, true, arguments);
}


const clone = function (value) {
	switch (typeOf(value)) {
		case 'array':
			return merge(false, true, [[], value]);

		case 'object':
			return merge(false, true, [{}, value]);

		default:
			return value;
	}
}


const shallowCopy = function (obj) {
	switch (typeOf(obj)) {
		case 'array':
			return Array.prototype.slice.call(obj);

		case 'object':
			return extend({}, obj);
	}
	return obj;
}


const merge = function (strict, immutable, args) {
	const undef = undefined;
	const target = args[0];

	each(args, function (arg, i) {
		if (i > 0) {
			each(arg, function (value, key) {
				const isComplex = inArray(typeOf(value), ['array', 'object']) !== -1;

				if (value === undef || strict && target[key] === undef) {
					return true;
				}

				if (isComplex && immutable) {
					value = shallowCopy(value);
				}

				if (typeOf(target[key]) === typeOf(value) && isComplex) {
					merge(strict, immutable, [target[key], value]);
				} else {
					target[key] = value;
				}
			});
		}
	});

	return target;
}


/**
Executes the callback const for each item in array/object. If you return false in the = function
callback it will break the loop.

@method each
@static
@param {Object} obj Object to iterate.
@param {function} callback Callback const to execute for each item. = function
*/
const each = function (obj, callback) {
	let length, key, i;
	const undef = undefined;

	if (obj) {
		try {
			length = obj.length;
		} catch (ex) {
			length = undef;
		}

		if (length === undef || typeof (length) !== 'number') {
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
}

/**
Checks if object is empty.

@method isEmptyObj
@static
@param {Object} o Object to check.
@return {Boolean}
*/
const isEmptyObj = function (obj) {
	let prop;

	if (!obj || typeOf(obj) !== 'object') {
		return true;
	}

	for (prop in obj) {
		return false;
	}

	return true;
}

/**
Recieve an array of functions (usually async) to call in sequence, each  function
receives a callback as first argument that it should call, when it completes. Finally,
after everything is complete, main callback is called. Passing truthy value to the
callback as a first argument will interrupt the sequence and invoke main callback
immediately.

@method inSeries
@static
@param {Array} queue Array of functions to call in sequence
@param {Function} cb Main callback that is called in the end, or in case of error
*/
const inSeries = function (queue, cb) {
	const i = 0, length = queue.length;

	if (typeOf(cb) !== 'function') {
		cb = function () { };
	}

	if (!queue || !queue.length) {
		cb();
	}

	const callNext = function (i) {
		if (typeOf(queue[i]) === 'function') {
			queue[i](function (error) {
				/*jshint expr:true */
				++i < length && !error ? callNext(i) : cb(error);
			});
		}
	}
	callNext(i);
}


/**
Recieve an array of functions (usually async) to call in parallel, each  function
receives a callback as first argument that it should call, when it completes. After
everything is complete, main callback is called. Passing truthy value to the
callback as a first argument will interrupt the process and invoke main callback
immediately.

@method inParallel
@static
@param {Array} queue Array of functions to call in sequence
@param {Function} cb Main callback that is called in the end, or in case of erro
*/
const inParallel = function (queue, cb) {
	let count = 0;
	const num = queue.length, cbArgs = new Array(num);

	each(queue, function (fn, i) {
		fn(function (error) {
			if (error) {
				return cb(error);
			}

			const args = [].slice.call(arguments);
			args.shift(); // strip error - undefined or not

			cbArgs[i] = args;
			count++;

			if (count === num) {
				cbArgs.unshift(null);
				cb.apply(this, cbArgs);
			}
		});
	});
}


/**
Find an element in array and return it's index if present, otherwise return -1.

@method inArray
@static
@param {Mixed} needle Element to find
@param {Array} array
@return {Int} Index of the element, or -1 if not found
*/
const inArray = function (needle, array) {
	if (array) {
		if (Array.prototype.indexOf) {
			return Array.prototype.indexOf.call(array, needle);
		}

		for (let i = 0, length = array.length; i < length; i++) {
			if (array[i] === needle) {
				return i;
			}
		}
	}
	return -1;
}


/**
Returns elements of first array if they are not present in second. And false - otherwise.

@private
@method arrayDiff
@param {Array} needles
@param {Array} array
@return {Array|Boolean}
*/
const arrayDiff = function (needles, array) {
	const diff = [];

	if (typeOf(needles) !== 'array') {
		needles = [needles];
	}

	if (typeOf(array) !== 'array') {
		array = [array];
	}

	for (const i in needles) {
		if (inArray(needles[i], array) === -1) {
			diff.push(needles[i]);
		}
	}
	return diff.length ? diff : false;
}


/**
Find intersection of two arrays.

@private
@method arrayIntersect
@param {Array} array1
@param {Array} array2
@return {Array} Intersection of two arrays or null if there is none
*/
const arrayIntersect = function (array1, array2) {
	const result = [];
	each(array1, function (item) {
		if (inArray(item, array2) !== -1) {
			result.push(item);
		}
	});
	return result.length ? result : null;
}


/**
Forces anything into an array.

@method toArray
@static
@param {Object} obj Object with length field.
@return {Array} Array object containing all items.
*/
const toArray = function (obj) {
	let i;
	const arr = [];

	for (i = 0; i < obj.length; i++) {
		arr[i] = obj[i];
	}

	return arr;
}


/**
Generates an unique ID. The only way a user would be able to get the same ID is if the two persons
at the same exact millisecond manage to get the same 5 random numbers between 0-65535; it also uses
a counter so each ID is guaranteed to be unique for the given page. It is more probable for the earth
to be hit with an asteroid.

@method guid
@static
@param {String} prefix to prepend (by default 'o' will be prepended).
@method guid
@return {String} Virtually unique id.
*/
const guid = (function () {
	let counter = 0;

	return function (prefix = 'o_') {
		let guid = new Date().getTime().toString(32), i;

		for (i = 0; i < 5; i++) {
			guid += Math.floor(Math.random() * 65535).toString(32);
		}

		return prefix + guid + (counter++).toString(32);
	};
}());


/**
Trims white spaces around the string

@method trim
@static
@param {String} str
@return {String}
*/
const trim = function (str) {
	if (!str) {
		return str;
	}
	return String.prototype.trim ? String.prototype.trim.call(str) : str.toString().replace(/^\s*/, '').replace(/\s*$/, '');
}


/**
Parses the specified size string into a byte value. For example 10kb becomes 10240.

@method parseSizeStr
@static
@param {String/Number} size String to parse or number to just pass through.
@return {Number} Size in bytes.
*/
const parseSizeStr = function (size) {
	if (typeof (size) !== 'string') {
		return size;
	}

	const muls = {
		t: 1099511627776,
		g: 1073741824,
		m: 1048576,
		k: 1024
	};
	let mul;

	size = /^([0-9\.]+)([tmgk]?)$/.exec(size.toLowerCase().replace(/[^0-9\.tmkg]/g, ''));
	mul = size[2];
	size = +size[1];

	if (muls.hasOwnProperty(mul)) {
		size *= muls[mul];
	}
	return Math.floor(size);
}


/**
 * Pseudo sprintf implementation - simple way to replace tokens with specified values.
 *
 * @param {String} str String with tokens
 * @return {String} String with replaced tokens
 */
const sprintf = function (str) {
	const args = [].slice.call(arguments, 1);

	return str.replace(/%([a-z])/g, function ($0, $1) {
		const value = args.shift();

		switch ($1) {
			case 's':
				return value + '';

			case 'd':
				return parseInt(value, 10);

			case 'f':
				return parseFloat(value);

			case 'c':
				return '';

			default:
				return value;
		}
	});
}



const delay = function (cb, timeout) {
	const self = this;
	setTimeout(function () {
		cb.call(self);
	}, timeout || 1);
}


const verComp = function (v1, v2, operator) {
	// From: http://phpjs.org/functions
	// +      original by: Philippe Jausions (http://pear.php.net/user/jausions)
	// +      original by: Aidan Lister (http://aidanlister.com/)
	// + reimplemented by: Kankrelune (http://www.webfaktory.info/)
	// +      improved by: Brett Zamir (http://brett-zamir.me)
	// +      improved by: Scott Baker
	// +      improved by: Theriault
	// *        example 1: version_compare('8.2.5rc', '8.2.5a');
	// *        returns 1: 1
	// *        example 2: version_compare('8.2.50', '8.2.52', '<');
	// *        returns 2: true
	// *        example 3: version_compare('5.3.0-dev', '5.3.0');
	// *        returns 3: -1
	// *        example 4: version_compare('4.1.0.52','4.01.0.51');
	// *        returns 4: 1

		// vm maps textual PHP versions to negatives so they're less than 0.
		// PHP currently defines these as CASE-SENSITIVE. It is important to
		// leave these as negatives so that they can come before numerical versions
		// and as if no letters were there to begin with.
		// (1alpha is < 1 and < 1.1 but > 1dev1)
		// If a non-numerical value can't be mapped to this table, it receives
		// -7 as its value.
	const vm = {
			'dev': -6,
			'alpha': -5,
			'a': -5,
			'beta': -4,
			'b': -4,
			'RC': -3,
			'rc': -3,
			'#': -2,
			'p': 1,
			'pl': 1
		},
		// This function will be called to prepare each version argument.
		// It replaces every _, -, and + with a dot.
		// It surrounds any nonsequence of numbers/dots with dots.
		// It replaces sequences of dots with a single dot.
		//    version_compare('4..0', '4.0') == 0
		// Important: A string of 0 length needs to be converted into a value
		// even less than an unexisting value in vm (-7), hence [-8].
		// It's also important to not strip spaces because of this.
		//   version_compare('', ' ') == 1
		prepVersion = function (v) {
			v = ('' + v).replace(/[_\-+]/g, '.');
			v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.');
			return (!v.length ? [-8] : v.split('.'));
		},
		// This converts a version component to a number.
		// Empty component becomes 0.
		// Non-numerical component becomes a negative number.
		// Numerical component becomes itself as an integer.
		numVersion = function (v) {
			return !v ? 0 : (isNaN(v) ? vm[v] || -7 : parseInt(v, 10));
		};

	// Important: compare must be initialized at 0.
	let i = 0,
		x = 0,
		compare = 0;

	v1 = prepVersion(v1);
	v2 = prepVersion(v2);
	x = Math.max(v1.length, v2.length);
	for (i = 0; i < x; i++) {
		if (v1[i] === v2[i]) {
			continue;
		}
		v1[i] = numVersion(v1[i]);
		v2[i] = numVersion(v2[i]);
		if (v1[i] < v2[i]) {
			compare = -1;
			break;
		} else if (v1[i] > v2[i]) {
			compare = 1;
			break;
		}
	}
	if (!operator) {
		return compare;
	}

	// Important: operator is CASE-SENSITIVE.
	// "No operator" seems to be treated as "<."
	// Any other values seem to make the function return null.
	switch (operator) {
		case '>':
		case 'gt':
			return (compare > 0);
		case '>=':
		case 'ge':
			return (compare >= 0);
		case '<=':
		case 'le':
			return (compare <= 0);
		case '==':
		case '=':
		case 'eq':
			return (compare === 0);
		case '<>':
		case '!=':
		case 'ne':
			return (compare !== 0);
		case '':
		case '<':
		case 'lt':
			return (compare < 0);
		default:
			return null;
	}
}



export default {
	guid,
	typeOf,
	extend,
	extendIf,
	extendImmutable,
	extendImmutableIf,
	clone,
	each,
	isEmptyObj,
	inSeries,
	inParallel,
	inArray,
	arrayDiff,
	arrayIntersect,
	toArray,
	trim,
	sprintf,
	parseSizeStr,
	delay,
	verComp
};
