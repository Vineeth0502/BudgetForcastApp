// controllers/goalController.js
/**
 * File name: goalController.js
 * Description: Contains functions for handling goal operations including adding goals,
 * forecasting goal achievement, and saving forecasts.
 
 */

// Import the Goal and Forecast models to interact with their respective collections
const Goal = require('../models/Goal');
const Forecast = require('../models/Forecast');

/**
 * Adds a new goal to the database.
 * 
 * This asynchronous function extracts goal details from the request body, creates
 * a new Goal instance, and saves it to the database. Responds with the saved goal data
 * or an error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing goal details in the body.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if saving the goal fails.
 */
const addGoal = async (req, res) => {
    const { name, targetAmount, targetDate } = req.body;
    const userId = req.user.id; 

    try {
        const goal = new Goal({ name, targetAmount, targetDate, userId });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).json({ error: 'Failed to add goal' });
    }
};
/**
 * Forecasts the number of months required to achieve a goal based on provided data.
 * 
 * This asynchronous function calculates the number of months needed to reach the target
 * amount given the current amount, monthly income, and allocation percentage. Responds
 * with the calculated number of months or an error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing forecasting data in the body.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if forecasting fails.
 */
const forecastGoal = async (req, res) => {
    const { targetAmount, currentAmount, monthlyIncome, allocationPercentage } = req.body;

    try {
        const disposableIncome = (monthlyIncome * allocationPercentage) / 100;
        const remainingAmount = targetAmount - currentAmount;
        const monthsToGoal = Math.ceil(remainingAmount / disposableIncome);

        res.status(200).json({ months: monthsToGoal });
    } catch (error) {
        console.error('Error forecasting goal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
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
        console.error('Error saving forecast:', error);
        res.status(500).json({ error: 'Failed to save forecast' });
    }
};

module.exports = { addGoal, forecastGoal, saveForecast };
