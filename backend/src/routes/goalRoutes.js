// routes/goalRoutes.js
/**
 * File name: goalRoutes.js
 * Description: Defines routes for adding goals, forecasting goals, and retrieving goals.
 
 */
const express = require('express');
const router = express.Router();
const { addGoal, forecastGoal, saveForecast } = require('../controllers/goalController');
const jwt = require('jsonwebtoken');
const Goal = require('../models/Goal');
const secretKey = 'Marvel##'; 
// Middleware to authenticate access token
/**
 * Middleware to authenticate JWT access token.
 * Attaches decoded user data to the request object if the token is valid.
 */
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach the decoded user data to the request object
        next();
    } catch (err) {
        console.error('Failed to authenticate token:', err);
        res.status(500).json({ error: 'Failed to authenticate token.' });
    }
};
// Route to add a new goal
/**
 * Route to add a new goal for the authenticated user.
 * Requires authentication.
 * @param {Object} req - Request object containing goal data in the body.
 * @param {Object} res - Response object.
 * @returns {Object} - Result of the add operation.
 */
router.post('/goals', authenticateToken, addGoal);
router.post('/forecasts', authenticateToken, saveForecast);
/**
 * Route to forecast a specific goal for the authenticated user.
 * Requires authentication.
 * @param {Object} req - Request object containing goal forecast data in the body.
 * @param {Object} res - Response object.
 * @returns {Object} - Result of the forecast operation.
 */
router.post('/goals/forecast', authenticateToken, forecastGoal);
// Route to get all goals for the authenticated user
/**
 * Route to retrieve all goals for the authenticated user.
 * Requires authentication.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Array} - List of goals.
 */
router.get('/goals', authenticateToken, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id });
        res.status(200).json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
});

module.exports = router;
