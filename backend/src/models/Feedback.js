//models/Feedback.js
/**
 * File name: Feedback.js
 * Description: Defines the schema and model for feedback submitted by users.
 */

// Import mongoose and Schema from mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;
// Define the schema for the Feedback model
const feedbackSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comments: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Feedback', feedbackSchema);
