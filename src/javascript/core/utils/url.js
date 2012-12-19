/**
 * url.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

define('core/utils/url', [], function() {

	/**
	Parse url into separate components and fill in absent parts with parts from current url,  
	based on https://raw.github.com/kvz/phpjs/master/functions/url/parse_url.js

	@method parseUrl
	@static
	@param {String} str Url to parse (defaults to empty string if undefined)
	@return {Object} Hash containing extracted uri components
	*/
	var parseUrl = function(str) {			
		var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment']
		, i = key.length
		, ports = {
			http: 80,
			https: 443
		}
		, uri = {}
		, regex = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/
		, m = regex.exec(str || '') // default to empty string if undefined
		;
							
		while (i--) {
			if (m[i]) {
			  uri[key[i]] = m[i];  
			}
		}

		if (/^[^\/]/.test(uri.path) && !uri.scheme) { // when url is relative, we need to figure out the path ourselves
			var path = document.location.pathname;	
			// if path ends with a filename, strip it
			if (!/(\/|\/[^\.]+)$/.test(path)) {
				path = path.replace(/[^\/]+$/, ''); 
			}
			uri.host = document.location.hostname;
			uri.path = path + (uri.path || ''); // site may reside at domain.com or domain.com/subdir
		}

		if (!uri.scheme) {
			uri.scheme = document.location.protocol.replace(/:$/, '');
		}

		if (!uri.host) {
			uri.host = document.location.hostname;
		}

		if (!uri.port) {
			uri.port = ports[uri.scheme];
		} else {
			uri.port = parseInt(uri.port, 10); 
		}

		if (!uri.path) {
			uri.path = "/";
		}
											
		delete uri.source;
		return uri;
	};

	/**
	Resolve url - among other things will turn relative url to absolute

	@method resolveUrl
	@static
	@param {String} url Either absolute or relative
	@return {String} Resolved, absolute url
	*/
	var resolveUrl = function(url) {
		var ports = { // we ignore default ports
			http: 80,
			https: 443
		}
		, urlp = parseUrl(url)
		;

		return urlp.scheme + '://' + urlp.host + (urlp.port !== ports[urlp.scheme] ? ':' + urlp.port : '') + urlp.path + (urlp.query ? urlp.query : '');
	};

	return {
		parseUrl: parseUrl,
		resolveUrl: resolveUrl
	};
});