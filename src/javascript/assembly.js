define('assembly', [
		'o',
		//< Modules
		'file/FileInput',
		'file/FileReader',
		'xhr/XMLHttpRequest',
		'image/Image'
		//>
	], function(o) { 

	//< Runtimes
	var runtimes = "html5,flash,silverlight,html4";
	//>

	o.each(runtimes.split(/,/), function(runtime) {

		o.each(modules, function() {

		});

	});
});                                                                        