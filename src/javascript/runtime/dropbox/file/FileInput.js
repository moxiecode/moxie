/**
 * FileInput.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/dropbox/file/FileInput
@private
*/
define("moxie/runtime/dropbox/file/FileInput", [
	"moxie/runtime/dropbox/Runtime",
	"moxie/core/utils/Basic",
	"moxie/core/utils/Dom",
	"moxie/core/utils/Events",
	"moxie/core/utils/Mime",
	"moxie/core/utils/Env"
], function(extensions, Basic, Dom, Events, Mime, Env) {

	function FileInput() {
		var _files = [], _options, _disabled = false;

		Basic.extend(this, {
			init: function(options) {
				var comp = this, I = comp.getRuntime(), config, exts = [];

				_options = options;

				Basic.each(_options.accept, function(group) {
					if (/\*/.test(group.extensions)) {
						exts = [];
						return false;
					}

					var items = group.extensions.split(/\s*,\s*/);
					if (!items.length) {
						return true; // continue
					}

					// prefix extensions with dots
					[].push.apply(exts, ('.' + items.join(',.')).split(','));
				});


				config = {
					//iframe: true, // potentially there, but not working
					linkType: 'direct',
					extensions: exts,

					success: function(files) {
						_files = [];

						Basic.each(files, function(file) {
							_files.push({
								name: file.name,
								size: parseInt(file.bytes, 10),
								downloadUrl: file.link
							});
						});

						comp.trigger('change');
					}
				};

				if (_options.multiple) {
					config.multiselect = true;
				}
				

				Events.addEvent(Dom.get(_options.browse_button), 'click', function(e) {
					if (_disabled) {
						return;
					}

					Dropbox.choose(config);

					e.preventDefault();
				}, comp.uid);

				comp.trigger({
					type: 'ready',
					async: true
				});
			},


			getFiles: function() {
				return _files;
			},


			disable: function(state) {
				_disabled = state;
			},


			destroy: function() {
				var I = this.getRuntime()
				, shim = I.getShim()
				;

				Events.removeAllEvents(_options && Dom.get(_options.browse_button), this.uid);

				shim.removeInstance(this.uid);

				// destroy _picker

				_files = _options = shim = null;
			}
		});
	}

	return (extensions.FileInput = FileInput);
});