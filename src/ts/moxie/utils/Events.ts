/**
 * Events.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/utils/Events
@public
@static
*/

import Basic from './Basic';

let eventhash = {};
let uid = 'moxie_' + Basic.guid();

/**
Adds an event handler to the specified object and store reference to the handler
in objects internal Plupload registry (@see removeEvent).

@method addEvent
@static
@param {Object} obj DOM element like object to add handler to.
@param {String} name Name to add event listener to.
@param {Function} callback Function to call when event occurs.
@param {String} [key] that might be used to add specifity to the event record.
*/
const addEvent = function (obj, name, func, key) {
	let events;

	name = name.toLowerCase();

	// Add event listener
	obj.addEventListener(name, func, false);

	// Log event handler to objects internal mOxie registry
	if (!obj[uid]) {
		obj[uid] = Basic.guid();
	}

	if (!eventhash.hasOwnProperty(obj[uid])) {
		eventhash[obj[uid]] = {};
	}

	events = eventhash[obj[uid]];

	if (!events.hasOwnProperty(name)) {
		events[name] = [];
	}

	events[name].push({
		func,
		key
	});
};


/**
Remove event handler from the specified object. If third argument (callback)
is not specified remove all events with the specified name.

@method removeEvent
@static
@param {Object} obj DOM element to remove event listener(s) from.
@param {String} name Name of event listener to remove.
@param {Function|String} [callback] might be a callback or unique key to match.
*/
const removeEvent = function (obj, name, callback) {
	let type, undef;

	name = name.toLowerCase();

	if (obj[uid] && eventhash[obj[uid]] && eventhash[obj[uid]][name]) {
		type = eventhash[obj[uid]][name];
	} else {
		return;
	}

	for (let i = type.length - 1; i >= 0; i--) {
		// undefined or not, key should match
		if (type[i].func === callback || type[i].key === callback) {
			obj.removeEventListener(name, type[i].func, false);

			type[i].func = null;
			type.splice(i, 1);

			// If callback was passed we are done here, otherwise proceed
			if (callback !== undef) {
				break;
			}
		}
	}

	// If event array got empty, remove it
	if (!type.length) {
		delete eventhash[obj[uid]][name];
	}

	// If mOxie registry has become empty, remove it
	if (Basic.isEmptyObj(eventhash[obj[uid]])) {
		delete eventhash[obj[uid]];

		// IE doesn't let you remove DOM object property with - delete
		try {
			delete obj[uid];
		} catch (e) {
			obj[uid] = undef;
		}
	}
};


/**
Remove all kind of events from the specified object

@method removeAllEvents
@static
@param {Object} obj DOM element to remove event listeners from.
@param {String} [key] unique key to match, when removing events.
*/
const removeAllEvents = function (obj, key) {
	if (!obj || !obj[uid]) {
		return;
	}

	Basic.each(eventhash[obj[uid]], function (events, name) {
		removeEvent(obj, name, key);
	});
};

export default {
	addEvent,
	removeEvent,
	removeAllEvents
};
