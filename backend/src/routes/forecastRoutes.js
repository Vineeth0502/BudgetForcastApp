// routes/forecastRoutes.js
/**
 * File name: forecastRoutes.js
 * Description: Defines routes for saving, retrieving, and updating forecasts.
 
 */
const express = require('express');
const router = express.Router();
const { saveForecast, getForecasts,payForecast } = require('../controllers/forecastController');
const jwt = require('jsonwebtoken');
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
// Route to save a new forecast
/**
 * Route to save a new forecast for the authenticated user.
 * Requires authentication.
 * @param {Object} req - Request object containing forecast data in the body.
 * @param {Object} res - Response object.
 * @returns {Object} - Result of the save operation.
 */
router.post('/forecasts', authenticateToken, saveForecast);
router.get('/forecasts', authenticateToken, getForecasts);
router.post('/forecasts/update', authenticateToken, payForecast);
module.exports = router;
