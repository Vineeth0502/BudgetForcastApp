// config/database.js
/**
 * File name: database.js
 * Description: Configures and establishes a connection to a MongoDB database using Mongoose.
 */

// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the provided connection URI.
 * 
 * This asynchronous function attempts to connect to MongoDB and logs a success
 * message if the connection is established. In case of an error, it logs the error
 * message and exits the process with an error code.
 * 
 * @async
 * @function
 * @throws {Error} Throws an error if the connection fails.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection URI
        await mongoose.connect('mongodb+srv://vineethketham:BP4f2ZxsZuNifTk1@cluster0.7aigo7g.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
         // Log success message if connection is successful
        console.log('MongoDB connected...');
    } catch (err) {
         // Log error message and exit the process if connection fails
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
