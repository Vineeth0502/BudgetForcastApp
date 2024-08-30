// controllers/forecastController.js
/**
 * File name: forecastController.js
 * Description: Contains functions for handling forecast operations including saving,
 * retrieving, and processing payments for forecasts.
 * Author(s): [Your Name]
 * Date created: [Current Date]
 */

// Import the Forecast and User models to interact with their respective collections
const Forecast = require('../models/Forecast');
const User = require('../models/User'); 
/**
 * Saves a new forecast to the database.
 * 
 * This asynchronous function extracts forecast details from the request body, 
 * creates a new Forecast instance, and saves it to the database. Responds with
 * the saved forecast data or an error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing forecast details in the body.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if saving the forecast fails.
 */
const saveForecast = async (req, res) => {
    const { name, targetAmount, currentAmount, monthlyIncome, allocationPercentage, months } = req.body;
    const userId = req.user.id; 

    try {
        const forecast = new Forecast({
            name,
            targetAmount,
            currentAmount,
            monthlyIncome,
            allocationPercentage,
            months,
            userId
        });
        await forecast.save();
        res.status(201).json(forecast);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save forecast' });
    }
};

/**
 * Retrieves all forecasts associated with the authenticated user.
 * 
 * This asynchronous function fetches forecasts from the database based on the
 * user ID provided in the request. Responds with the list of forecasts or an
 * error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if fetching forecasts fails.
 */
const getForecasts = async (req, res) => {
    try {
        const forecasts = await Forecast.find({ userId: req.user.id });
        res.status(200).json(forecasts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch forecasts' });
    }
};

const payForecast = async (req, res) => {
    const { forecastId, allocatedMoney, userId } = req.body;

    try {
        // Find the user and forecast by their IDs
        const forecast = await Forecast.findById(forecastId);
        const user = await User.findById(userId);
            console.log(forecast);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!forecast) {
            return res.status(404).json({ error: 'Forecast not found' });
        }

        // Check if the user's account balance is less than the allocated money
        if (user.accountBalance < allocatedMoney) {
            return res.status(400).json({ error: 'Cannot process transaction: Low balance' });
        }

        // Deduct the allocated money from the user's account balance and add to amount received
        user.accountBalance -= allocatedMoney;
        forecast.amountReceived += allocatedMoney;
        forecast.months -= 1;

        const paymentDetail = {
            amount: allocatedMoney,
            date: new Date()
        };
        forecast.paymentHistory.push(paymentDetail);
        // Save the updated forecast and user
        await forecast.save();
        await user.save();

        res.status(200).json(forecast);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process payment' });
    }
};

module.exports = { saveForecast, getForecasts,payForecast };
