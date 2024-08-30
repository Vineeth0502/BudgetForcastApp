//routes/transactionRoutes.js
/**
 * File name: transactionRoutes.js
 * Description: Defines routes for managing transactions including retrieving, adding, editing, and deleting transactions.

 */

const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, editTransaction, deleteTransaction } = require('../controllers/transactionController');
// Route to retrieve all transactions
/**
 * Route to get all transactions.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Array} - List of transactions.
 */
router.get('/transactions', getTransactions);
// Route to add a new transaction
/**
 * Route to add a new transaction.
 * @param {Object} req - Request object containing transaction data in the body.
 * @param {Object} res - Response object.
 * @returns {Object} - Result of the add operation.
 */
router.post('/transactions', addTransaction);
// Route to update an existing transaction
/**
 * Route to update an existing transaction by ID.
 * @param {Object} req - Request object containing transaction ID in the URL and updated data in the body.
 * @param {Object} res - Response object.
 * @returns {Object} - Result of the update operation.
 */
router.put('/transactions/:id', editTransaction);
// Route to delete a transaction by ID
/**
 * Route to delete a transaction by ID.
 * @param {Object} req - Request object containing transaction ID in the URL.
 * @param {Object} res - Response object.
 * @returns {Object} - Result of the delete operation.
 */

router.delete('/transactions/:id', deleteTransaction);

module.exports = router;
