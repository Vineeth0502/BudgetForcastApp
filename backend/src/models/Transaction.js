// models/Transaction.js
/**
 * File name: Transaction.js
 * Description: Defines the schema and model for financial transactions.
 
 */

// Import mongoose
const mongoose = require('mongoose');
// Define the schema for the Transaction model
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
