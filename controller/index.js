module.exports = function (schema, bcrypt) {
    var module = {};

    // Load the user module and pass the schema and bcrypt instance
    module.user = require('./user')(schema, bcrypt);

    return module;
};