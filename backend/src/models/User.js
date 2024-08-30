// models/User.js
/**
 * File name: User.js
 * Description: Defines the schema and model for user accounts.

 */

// Import mongoose and Schema from mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;
// Define the schema for the User model
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: '',
    },
    job: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    age: {
        type: Number,
        default: 0,
    },
    salary: {
        type: Number,
        default: 0,
    },
    accountBalance: {
        type: Number,
        default: 0.0,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
