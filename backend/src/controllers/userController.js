// controllers/authController.js
/**
 * File name: authController.js
 * Description: Contains functions for user authentication operations including registration,
 * login, and fetching user details. Handles password hashing, token generation, and validation.
 
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = 'Marvel##'; 

/**
 * Registers a new user.
 * 
 * This asynchronous function hashes the user's password, creates a new User instance, 
 * saves it to the database, and responds with a success message and user data or an error 
 * message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing user registration details in the body.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if hashing the password or saving the user fails.
 */
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
};

/**
 * Logs in a user.
 * 
 * This asynchronous function checks if the user's email exists, compares the provided password 
 * with the stored hashed password, generates a JWT token if the credentials are valid, and 
 * responds with a success message, token, and user name or an error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing user login details in the body.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if finding the user, comparing passwords, or generating the token fails.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: 'User logged in successfully', token, name: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
};


/**
 * Fetches user details based on the provided JWT token.
 * 
 * This asynchronous function verifies the JWT token, retrieves the user's data from the database, 
 * and responds with the user details or an error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing the authorization header.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if verifying the token or finding the user fails.
 */
const getUserDetails = async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ id: user._id, name: user.username, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to authenticate token' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserDetails,
};
