test("HTML5::send() - responseType = json", function(){
	var xhr,
		x = o.Exceptions,
		startTime, endTime;

	// 1
	xhr = new this.XHR;
	xhr.responseType = 'json';
	stop();

	xhr.onload = function(e) {
		start();
		endTime = (new Date).getTime();
		//console.info([this.status, this.statusText]);

		deepEqual(this.response.OK, 1, "responseType JSON (in: " + (endTime - startTime) + " ms)");
	};
	xhr.open('get', 'XMLHttpRequest/json.php');
	
	startTime = (new Date).getTime();
	
	try {
		xhr.send(null, {
			runtime_order: 'html5',
			required_caps: {
				receive_response_type: 'json'
			}
		});
	} catch(ex) {
		start();
		deepEqual(ex, new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR), "Runtime cannot be initialized");
	}
});


test("Flash::send() - responseType = 'json'", function(){

	// for now we support only GET/POST http methods

	// test responseType exceptions if setters/getters supported

	// test JSON responseType
	var xhr,
		startTime, endTime;

	// 1
	xhr = new this.XHR;
	xhr.responseType = 'json';
	stop();

	xhr.onload = function(e) {
		start();
		endTime = (new Date).getTime();
		//console.info([this.status, this.statusText]);

		deepEqual(this.response.OK, 1, "responseType JSON (in: " + (endTime - startTime) + " ms)");
	};
	xhr.open('get', 'XMLHttpRequest/json.php');
	
	startTime = (new Date).getTime();

	try {
		xhr.send(null, {
			swf_url: "../js/Moxie.swf",
			container: "qunit-fixture"
		});
	} catch(ex) {
		deepEqual(ex, new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR), "Runtime cannot be initialized");
	}
});

test("Flash::send() - responseType = 'blob'", function(){
	var xhr;

	// 2
	xhr = new this.XHR;
	xhr.responseType = 'blob';
	stop();

	xhr.onload = function(e) {
		var fr;

		fr = new o.FileReader;
		fr.onload = function(e) {
			var img = new Image;
			img.onload = function() {
				start();
				endTime = (new Date).getTime();
				deepEqual({ w: img.width, h: img.height}, { w: 460, h: 670}, "responseType Blob (in: " + (endTime - startTime) + " ms)");
			}
			img.src = this.result;
		};
		fr.readAsDataURL(this.response);

		endTime = (new Date).getTime();
		
	};
	xhr.open('get', 'XMLHttpRequest/image.jpg');
	
	startTime = (new Date).getTime();
	xhr.send(null, {
		swf_url: "../js/Moxie.swf",
		container: "qunit-fixture"
	});
});

test("Flash::send() - upload file (preloaded)", function() {
	var xhr;

	// 2
	xhr = new this.XHR;
	xhr.responseType = 'blob';
	stop();

	xhr.onloadstart = function(e) {

	};

	xhr.onload = function(e) {
		var fd, blob = this.response;

		xhr.unbindAll();

		xhr.onload = function() {
			start();
		};

		xhr.open('post', 'XMLHttpRequest/upload.php');

		fd = new o.FormData;
		fd.append('file', blob);

		xhr.send(fd, {
			swf_url: "../js/Moxie.swf",
			container: "qunit-fixture"
		});
	};

	xhr.onprogress = function(e) {
		//console.info(e);
	};

	xhr.open('get', 'XMLHttpRequest/poster.jpg');
	startTime = (new Date).getTime();
	xhr.send(null, {
		swf_url: "../js/Moxie.swf",
		container: "qunit-fixture"
	});

});