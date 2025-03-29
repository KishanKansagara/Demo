module.exports = function (Sequelize, Schema) {
    // Initialize an empty module object
    var module = {};

    // Load the user_details model and attach it to the module
    module.user_details = require("./user_details")(Sequelize, Schema);

    // Return the module containing all models
    return module;
};
