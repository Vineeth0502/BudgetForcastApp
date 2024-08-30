// routes/categoryRoutes.js
/**
 * File name: categoryRoutes.js
 * Description: Defines routes for managing categories.
 
 */
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

/**
 * Route: GET /categories
 * Description: Retrieves all categories from the database.
 * Response:
 *   - 200: List of categories
 *   - 500: Internal server error
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
