module.exports = (app, schema, controller) => {
    // Load and apply admin-related routes
    require('./admin')(app, schema, controller);
};
