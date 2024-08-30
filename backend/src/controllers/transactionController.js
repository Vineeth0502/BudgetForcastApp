// controllers/transactionController.js
/**
 * File name: transactionController.js
 * Description: Contains functions for handling transaction operations including adding,
 * deleting, editing transactions, and fetching transactions for a user.
 
 */

// Import required models and utility functions
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Category = require('../models/Category');
const isValidObjectId = require('../utils/isValidObjectId');
const roundToTwoDecimals = require('../utils/roundToTwoDecimals');

/**
 * Adds a new transaction to the database.
 * 
 * This asynchronous function extracts transaction details from the request body, 
 * creates a new Transaction instance, and saves it to the database. It updates the 
 * user's balance based on the transaction category. Responds with the saved transaction 
 * or an error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing transaction details in the body.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if saving the transaction or updating the user fails.
 */
const addTransaction = async (req, res) => {
    const { userId, categoryId, amount, date, description } = req.body;

    if (!isValidObjectId(userId) || !isValidObjectId(categoryId)) {
        return res.status(400).json({ error: 'Invalid user ID or category ID' });
    }

    try {
        const transaction = new Transaction({
            userId: new mongoose.Types.ObjectId(userId),
            categoryId: new mongoose.Types.ObjectId(categoryId),
            amount,
            date,
            description,
        });

        await transaction.save();

        const user = await User.findById(userId);
        const category = await Category.findById(categoryId);

        if (!user || !category) {
            return res.status(404).json({ error: 'User or Category not found' });
        }

        // Update the user's balance based on transaction category
        if (category.name.toLowerCase() === 'income') {
            user.accountBalance += parseFloat(amount);
        } else if (category.name.toLowerCase() === 'expense') {
            user.accountBalance -= parseFloat(amount);
        }

        user.accountBalance = roundToTwoDecimals(user.accountBalance);
        await user.save();

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Failed to add transaction.' });
    }
};


/**
 * Deletes a transaction from the database.
 * 
 * This asynchronous function finds and deletes a transaction based on its ID,
 * updates the user's balance based on the transaction's category, and responds 
 * with a success message or an error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing the transaction ID in the parameters.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if deleting the transaction or updating the user fails.
 */
const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const user = await User.findById(transaction.userId);
        const category = await Category.findById(transaction.categoryId);

        if (!user || !category) {
            return res.status(404).json({ error: 'User or Category not found' });
        }

        // Revert the user's balance based on transaction category
        if (category.name.toLowerCase() === 'income') {
            user.accountBalance -= parseFloat(transaction.amount);
        } else if (category.name.toLowerCase() === 'expense') {
            user.accountBalance += parseFloat(transaction.amount);
        }

        user.accountBalance = roundToTwoDecimals(user.accountBalance);
        await transaction.deleteOne();
        await user.save();

        res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
};


/**
 * Fetches transactions for a specific user.
 * 
 * This asynchronous function retrieves all transactions for a user based on their
 * ID, populates the category information, and responds with the list of transactions 
 * or an error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing the user ID in the query parameters.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if fetching transactions fails.
 */
const getTransactions = async (req, res) => {
    const { userId } = req.query;

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const transactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('categoryId', 'name');
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};
/**
 * Edits an existing transaction in the database.
 * 
 * This asynchronous function updates a transaction's details, reverts the old balance
 * effect, and applies the new balance effect based on the updated category. Responds 
 * with the updated transaction or an error message if the operation fails.
 * 
 * @async
 * @function
 * @param {Object} req - The request object containing transaction details in the body
 * and transaction ID in the parameters.
 * @param {Object} res - The response object used to send a response back to the client.
 * @throws {Error} Throws an error if editing the transaction or updating the user fails.
 */
const editTransaction = async (req, res) => {
    const { id } = req.params;
    const { userId, categoryId, amount, date, description } = req.body;

    if (!isValidObjectId(id) || !isValidObjectId(userId) || !isValidObjectId(categoryId)) {
        return res.status(400).json({ error: 'Invalid ID(s)' });
    }

    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const user = await User.findById(userId);
        const oldCategory = await Category.findById(transaction.categoryId);
        const newCategory = await Category.findById(categoryId);

        if (!user || !oldCategory || !newCategory) {
            return res.status(404).json({ error: 'User or Category not found' });
        }

        // Revert old transaction's effect on balance
        if (oldCategory.name.toLowerCase() === 'income') {
            user.accountBalance -= parseFloat(transaction.amount);
        } else if (oldCategory.name.toLowerCase() === 'expense') {
            user.accountBalance += parseFloat(transaction.amount);
        }

        // Update transaction
        transaction.userId = new mongoose.Types.ObjectId(userId);
        transaction.categoryId = new mongoose.Types.ObjectId(categoryId);
        transaction.amount = amount;
        transaction.date = date;
        transaction.description = description;

        await transaction.save();

        // Apply new transaction's effect on balance
        if (newCategory.name.toLowerCase() === 'income') {
            user.accountBalance += parseFloat(amount);
        } else if (newCategory.name.toLowerCase() === 'expense') {
            user.accountBalance -= parseFloat(amount);
        }

        user.accountBalance = roundToTwoDecimals(user.accountBalance);
        await user.save();

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error editing transaction:', error);
        res.status(500).json({ error: 'Error editing transaction' });
    }
};

module.exports = {
    getTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
};
