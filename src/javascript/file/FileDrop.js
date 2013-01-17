/**
 * FileDrop.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, scripturl:true, browser:true */
/*global define:true */

define('moxie/file/FileDrop', [
	'moxie/core/I18n',
	'moxie/core/utils/Dom',
	'moxie/core/Exceptions',
	'moxie/core/utils/Basic',
	'moxie/file/File',
	'moxie/runtime/RuntimeClient',
	'moxie/core/EventTarget',
	'moxie/core/utils/Mime'
], function(I18n, dom, x, Basic, File, RuntimeClient, EventTarget, Mime) {
	var dispatches = ['ready', 'dragleave', 'dragenter', 'drop', 'error'];

	function FileDrop(options) {
		var self = this, defaults;

		// if flat argument passed it should be drop_zone id
		if (typeof(options) === 'string') {
			options = { drop_zone : options };
		}

		// figure out the options
		defaults = {
			accept: [{
				title: I18n.translate('All Files'),
				extensions: '*'
			}],
			required_caps: {
				drag_and_drop: true
			}
		};
		
		options = typeof(options) === 'object' ? Basic.extend({}, defaults, options) : defaults;

		// this will help us to find proper default container
		options.container = dom.get(options.drop_zone) || document.body;

		// make container relative, if they're not
		if (dom.getStyle(options.container, 'position') === 'static') {
			options.container.style.position = 'relative';
		}
					
		// normalize accept option (could be list of mime types or array of title/extensions pairs)
		if (typeof(options.accept) === 'string') {
			options.accept = Mime.mimes2extList(options.accept);
		}

		RuntimeClient.call(self);

		Basic.extend(self, {
			uid: Basic.guid('uid_'),

			ruid: null,

			files: null,

			init: function() {
	
				self.convertEventPropsToHandlers(dispatches);
		
				self.bind('RuntimeInit', function(e, runtime) {
					self.ruid = runtime.uid;

					self.bind("Drop", function() {
						var files = runtime.exec.call(self, 'FileDrop', 'getFiles');

						self.files = [];

						Basic.each(files, function(file) {
							self.files.push(new File(self.ruid, file));
						});
					}, 999);

					runtime.exec.call(self, 'FileDrop', 'init');

					self.dispatchEvent('ready');
				});
							
				// runtime needs: options.required_features, options.runtime_order and options.container
				self.connectRuntime(options); // throws RuntimeError
			}
		});
	}

	FileDrop.prototype = new EventTarget();

	return FileDrop;
});
