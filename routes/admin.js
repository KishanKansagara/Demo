module.exports = (app, schema, controller) => {
    // Load middleware module and pass schema
    var middleware = require('../middleware/index')(schema);

    // Route: Admin Registration Page
    app.get('/admin-register', middleware.user.isLogin, controller.user.adminRegistration);

    // Route: Customer Registration Page
    app.get('/customer-register', middleware.user.isLogin, controller.user.customerRegistration);

    // Route: User Registration (Handles form submission)
    app.post('/register', middleware.user.isLogin, controller.user.register);

    // Route: Email Verification
    app.get('/verify-email', middleware.user.isLogin, controller.user.verifyEmail);

    // Route: Login Page
    app.get('/login', middleware.user.isLogin, controller.user.loginPage);

    // Route: Admin Login (Handles login form submission)
    app.post('/admin-login', middleware.user.isLogin, controller.user.adminLogin);

    // Route: Dashboard View (Protected Route)
    app.get('/dashboard', middleware.user.isLogin, controller.user.dashbordview);
};
