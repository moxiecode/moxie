var utils = require("./utils");
var exec = require("child_process").exec;

var mkswf = function(params, cb) {
	var defaults = {
		exe: "mxmlc",
		target: "11.3",
		extra: ""
	};
	var cmd = "<exe> -target-player=<target> -compiler.source-path=<src> -output=<output> -static-link-runtime-shared-libraries=true <extra> <input>";

	params = utils.extend(defaults, params);

	if (params.libs) {
		if (typeof params.libs === 'string') {
			params.libs = [params.libs];
		}
		params.extra += " -library-path+=" + params.libs.join(',');
	}	

	cmd = cmd.replace(/(<(target|output|input|src|exe|libs|extra)>)/g, function($0, $1, $2) {
		return params[$2] || '';
	});

	exec(cmd, function(error, stdout, stderr) {
		if (error) {
			console.log(stderr);
		}
		cb();
	});
};

module.exports = mkswf;