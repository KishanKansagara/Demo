module.exports = function (schema) {
	var module = {};


	module.user = require('./auth')(schema);
	return module;
}