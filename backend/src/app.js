//app.js
/**
 * File name: server.js
 * Description: Main server file that sets up and runs the Express application, connects to MongoDB, and configures middleware and routes.
 
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const goalRoutes = require('./routes/goalRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes'); // Add this line

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api', transactionRoutes);
app.use('/api', categoryRoutes);
app.use('/api', goalRoutes);
app.use('/api', forecastRoutes);
app.use('/api', feedbackRoutes); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
