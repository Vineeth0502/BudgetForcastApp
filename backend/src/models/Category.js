//models/Category.js
/**
 * File name: Category.js
 * Description: Defines the schema and model for categories used in transactions.

 */

// Import mongoose for schema and model creation
const mongoose = require('mongoose');
// Define the schema for the Category model
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Category', CategorySchema);
