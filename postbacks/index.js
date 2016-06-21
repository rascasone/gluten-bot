fs = require('fs');

let methods = {};
exports.scan = function () {
	var methodFiles = fs.readdirSync(__dirname);
	for(var i = 0; i < methodFiles.length; i++) {
		var filename = methodFiles[i];
		if(filename === 'index.js') {
			continue;
		}
		let a = filename.split('.')
		a.pop()
		var method = require('./' + filename);
		methods[a.join('.')] = method;
	}
};

exports.scan();

exports.getCallback = function (name) {
	return methods[name];
}
