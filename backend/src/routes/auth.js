//routes/auth.js
/**
 * File name: userRoutes.js
 * Description: Defines routes for user registration, login, profile management, and balance retrieval.

 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const isValidObjectId = require('../utils/isValidObjectId');
const secretKey = 'Marvel##';

/**
 * Route: POST /register
 * Description: Registers a new user and returns a JWT token.
 * Request Body:
 *   - username: String
 *   - email: String
 *   - password: String
 *   - accountBalance: Number (optional)
 * Response:
 *   - 201: User registered successfully with a JWT token
 *   - 400: User already exists
 *   - 500: Internal server error
 */
router.post('/register', async (req, res) => {
    const { username, email, password, accountBalance } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with that email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            accountBalance: accountBalance || 0.0
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully.',
            token: jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' })
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

/**
 * Route: POST /login
 * Description: Authenticates a user and returns a JWT token.
 * Request Body:
 *   - email: String
 *   - password: String
 * Response:
 *   - 200: User logged in successfully with a JWT token and user details
 *   - 401: Invalid email or password
 *   - 500: Internal server error
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({
            message: 'User logged in successfully',
            token,
            userId: user._id,
            name: user.username,
            accountBalance: user.accountBalance
        });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

/**
 * Route: GET /user
 * Description: Fetches the details of the logged-in user.
 * Headers:
 *   - Authorization: Bearer [JWT Token]
 * Response:
 *   - 200: User details
 *   - 401: No token provided or token invalid
 *   - 404: User not found
 *   - 500: Internal server error
 */
router.get('/user', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id, 'id username email name job bio age salary accountBalance');

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});
/**
 * Route: PUT /user
 * Description: Updates the details of the logged-in user.
 * Headers:
 *   - Authorization: Bearer [JWT Token]
 * Request Body:
 *   - name: String (optional)
 *   - job: String (optional)
 *   - bio: String (optional)
 *   - age: Number (optional)
 *   - salary: Number (optional)
 *   - accountBalance: Number (optional)
 * Response:
 *   - 200: Updated user details
 *   - 401: No token provided or token invalid
 *   - 404: User not found
 *   - 500: Internal server error
 */
router.put('/user', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { name, job, bio, age, salary, accountBalance } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.name = name || user.name;
        user.job = job || user.job;
        user.bio = bio || user.bio;
        user.age = age || user.age;
        user.salary = salary || user.salary;
        user.accountBalance = accountBalance || user.accountBalance;

        await user.save();

        res.status(200).json(user);
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ error: 'Failed to update user profile.' });
    }
});

/**
 * Route: GET /:userId/balance
 * Description: Fetches the account balance of a specific user by userId.
 * Request Params:
 *   - userId: String
 * Response:
 *   - 200: User balance
 *   - 404: User not found
 *   - 500: Internal server error
 */
router.get('/:userId/balance', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ balance: user.accountBalance });
    } catch (error) {
        console.error('Error fetching user balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
