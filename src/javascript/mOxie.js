define('mOxie', [
		'moxie/core/utils/Basic', 
		'moxie/core/iI18n', 
		'moxie/core/JSON', 
		'moxie/core/Exceptions', 
		'moxie/core/EventTarget'
	], function(utils, i18n, jsonParse, x, EventTarget) {
	

	utils.extend(o, {
		jsonParse: jsonParse,
		eventTarget: new EventTarget(),
		Exceptions: x
	}, i18n, utils);

	// until properly replaced everywhere
	o.JSON = {
		parse: jsonParse
	};

	return o;
});