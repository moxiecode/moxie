var utils = require("./utils");
var exec = require("child_process").exec;

var mkxap = function(params, cb) {
	var defaults = {
		exe: "msbuild",
		extra: ""
	};
	var cmd = "<exe> <extra> <input>";

	params = utils.extend(defaults, params);

	cmd = cmd.replace(/(<(output|input|src|exe|libs|extra)>)/g, function($0, $1, $2) {
		return params[$2] || '';
	});

	exec(cmd, function(error, stdout, stderr) {
		if (error) {
			console.log(stderr);
		}
		cb();
	});
};

module.exports = mkxap;