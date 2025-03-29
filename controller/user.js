const { Op, where } = require("sequelize");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const student = require("../model/user_details");

module.exports = (schema, bcrypt) => {
    var module = {};

    // Render Admin Registration Page
    module.adminRegistration = (req, res) => {
        try {
            return res.render("admin-register");
        } catch (error) {
            console.log("Error", error);
            res.redirect("/");
        }
    };

    // Render Customer Registration Page
    module.customerRegistration = (req, res) => {
        try {
            return res.render("customer-register");
        } catch (error) {
            console.log("Error", error);
            res.redirect("/");
        }
    };

    // User Registration Logic
    module.register = async (req, res) => {
        let user_details = req.body;
        console.log(user_details);
    
        // Validate required fields
        if (!user_details.first_name || !user_details.last_name || !user_details.email || !user_details.password || !user_details.role) {
            return res.status(400).send("All fields are required.");
        }
    
        try {
            // Check if the email is already registered
            const existingUser = await schema.user_details.findOne({ where: { email: user_details.email } });
            if (existingUser) {
                return res.status(400).send("You are already registered.");
            }
    
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user_details.password, salt);
    
            // Generate verification token
            const verificationToken = Math.random().toString(36).substring(2, 15);
    
            // Determine role (Admin or Customer)
            let role = user_details.role === "admin" ? "admin" : "customer";  
    
            // Create new user
            const newUser = await schema.user_details.create({
                firstname: user_details.first_name,
                lastname: user_details.last_name,
                email: user_details.email,
                password: hashedPassword,
                role: role,
                is_verified: false, // Default: not verified
                verification_token: verificationToken
            });
    
            // Configure Nodemailer for sending verification email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.smtp_user,
                    pass: process.env.smtp_pass
                }
            });
    
            const verificationLink = `http://localhost:5555/verify-email?token=${verificationToken}`;
            const mailOptions = {
                from: process.env.smtp_user,
                to: user_details.email,
                subject: "Email Verification",
                html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
            };
    
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log("Error sending email:", err);
                    return res.status(500).send("Error sending verification email.");
                }
                res.status(200).send("Registration successful! Please check your email to verify your account.");
            });
    
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).send("Internal server error.");
        }
    };

    // Email Verification Logic
    module.verifyEmail = async (req, res) => {
        const { token } = req.query;
    
        if (!token) {
            return res.status(400).send("Invalid verification link.");
        }
    
        try {
            const user = await schema.user_details.findOne({ where: { verification_token: token } });
    
            if (!user) {
                return res.status(400).send("Invalid or expired verification token.");
            }
    
            // Update verification status
            await schema.user_details.update({ is_verified: true, verification_token: null }, { where: { id: user.id } });
            res.redirect("/login"); // Redirect to login page after verification
        } catch (error) {
            console.error("Email verification error:", error);
            res.status(500).send("Internal server error.");
        }
    };
    
    // Render Admin Login Page
    module.loginPage = (req, res) => {
        try {
            return res.render("admin_login");
        } catch (error) {
            console.log("Error", error);
            res.redirect("/");
        }
    };

    // Admin Login Logic
    module.adminLogin = async (req, res) => {
        const { email, password } = req.body;
    
        try {
            // Find user by email
            const user = await schema.user_details.findOne({ where: { email } });
    
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
    
            // Check if user is an admin
            if (user.role !== "admin") {
                return res.status(403).json({ message: "You are not allowed to login from here" });
            }
    
            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
    
            // Generate JWT Token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.jwtPrivateKey, { expiresIn: "1h" });
    
            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            console.error("Admin login error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    // Render Dashboard View
    module.dashbordview = (req, res) => {
        try {
            res.render('dashbord');
        } catch (error) {
            console.log("Error--->", error);
        }
    };

    return module;
};
