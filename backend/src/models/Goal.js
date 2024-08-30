// models/Goal.js
/**
 * File name: Goal.js
 * Description: Defines the schema and model for financial goals set by users.
 
 */

// Import mongoose and Schema from mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;
// Define the schema for the Goal model
const goalSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    targetDate: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Goal', goalSchema);
