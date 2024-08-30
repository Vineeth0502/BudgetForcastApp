// controllers/feedbackController.js
/**
 * File name: feedbackController.js
 * Description: Contains functions for handling feedback submissions and retrieval.

 */

// Import the Feedback model to interact with the feedback collection in the database
const Feedback = require('../models/Feedback');
/**
 * Handles the submission of feedback.
 * 
 * This asynchronous function extracts rating and comments from the request body,
 * associates the feedback with the user making the request, and saves it to the database.
 * Responds with a success message upon successful submission or an error message if
 * there is a problem.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing feedback data in the body.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if there is an issue saving the feedback to the database.
 */
const submitFeedback = async (req, res) => {
    const { rating, comments } = req.body;
    const userId = req.user.id;

    try {
        const feedback = new Feedback({ userId, rating, comments });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
/**
 * Retrieves all feedback from the database.
 * 
 * This asynchronous function fetches all feedback records from the database and populates
 * the userId field with the corresponding username. Responds with the feedback data or an
 * error message if there is a problem.
 * 
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if there is an issue fetching feedback from the database.
 */
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().populate('userId', 'username');
        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { submitFeedback, getAllFeedback };
