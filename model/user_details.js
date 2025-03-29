const jwt = require('jsonwebtoken');

module.exports = (Sequelize, Schema) => {
    // Define the user_details model
    const user_details = Schema.define('user_details', {
        
        // Column: First Name (Cannot be null)
        firstname: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        // Column: Last Name (Cannot be null)
        lastname: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        // Column: Email (Must be unique and cannot be null)
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },

        // Column: Password (Cannot be null)
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        // Column: Role (Either "customer" or "admin", cannot be null)
        role: {
            type: Sequelize.ENUM("customer", "admin"),
            allowNull: false,
        },

        // Column: Verification Status (Default is false)
        is_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },

        // Column: Email Verification Token (Used for email verification)
        verification_token: {
            type: Sequelize.STRING,
        },
    });

    // Sync the model with the database without forcing table recreation
    user_details.sync({ force: false, alter: true });

    return user_details;
};
