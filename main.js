const express = require('express');
const app = express();
require("dotenv").config(); // Load environment variables from .env file
const port = 5555;
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Middleware to parse request bodies (JSON and URL-encoded)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static file serving from the "public" directory
app.use(express.static(__dirname + "/public"));

// Configure Nunjucks as the template engine
nunjucks.configure("views", {
    autoescape: true,
    express: app,
    watch: false,
});
app.set("view engine", "html");

// Set up session management
app.use(session({
    secret: 'keyboard cat', // Secret key for signing session ID cookies
    resave: false, // Prevent resaving session if unchanged
    saveUninitialized: true, // Save uninitialized sessions
}));

// Define the home route
app.get("/", async (req, res) => {
    res.send("Home Page");
});

// Initialize Sequelize for database connection
var Sequelize = require('sequelize');
global.Sequelize = Sequelize;
var sequelize = require('./config/database')(Sequelize);

// Load models, controllers, and routes
let schema = require('./model/index')(Sequelize, sequelize); // Load models
const controller = require('./controller/index')(schema, bcrypt); // Load controllers
require('./routes/index')(app, schema, controller); // Load routes

// Start the Express server
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
