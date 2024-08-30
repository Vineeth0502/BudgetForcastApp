//routes/userRoutes.js
/**
 * File name: userRoutes.js
 * Description: Defines routes for user management including registration, login, and fetching user details.

 */

const express = require('express');
const { registerUser, loginUser, getUserDetails } = require('../controllers/userController');
const router = express.Router();
// Route to register a new user
/**
 * Route to handle user registration.
 * @param {Object} req - Request object containing user registration data in the body.
 * @param {Object} res - Response object.
 * @returns {Object} - Result of the registration operation, including success message and token.
 */
router.post('/register', registerUser);
// Route to handle user login
/**
 * Route to handle user login.
 * @param {Object} req - Request object containing user login credentials in the body.
 * @param {Object} res - Response object.
 * @returns {Object} - Result of the login operation, including success message, token, and user details.
 */
router.post('/login', loginUser);
// Route to fetch user details
/**
 * Route to get user details for the authenticated user.
 * @param {Object} req - Request object with authorization header containing the token.
 * @param {Object} res - Response object.
 * @returns {Object} - User details for the authenticated user.
 */
router.get('/user', getUserDetails);


module.exports = router;
