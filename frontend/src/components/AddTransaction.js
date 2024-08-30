//components/AddTransaction.js
/**
 * File name: AddTransaction.js
 * Description: Component for adding or editing a transaction.
 * Author(s): [Your Name]
 * Date created: [Current Date]
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddTransaction.css';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddTransaction = () => {
     // State variables
    const [initialData, setInitialData] = useState({});
    const [categories, setCategories] = useState([]);
     // Hooks for location and navigation
    const location = useLocation();
    const navigate = useNavigate();
    // Fetch transaction data and categories when component mounts or location state changes

    useEffect(() => {
        if (location.state && location.state.transaction) {
            setInitialData(location.state.transaction);
        }
        fetchCategories();
    }, [location.state]);
   // Fetch categories from the server
    const fetchCategories = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };
    // Handle form submission for adding or updating a transaction
    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        try {
            const method = initialData._id ? 'PUT' : 'POST';
            const url = initialData._id
                ? `http://localhost:3000/api/transactions/${initialData._id}`
                : 'http://localhost:3000/api/transactions';
            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...initialData, userId }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };
    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
    };
    // Navigate back to the dashboard
    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="transaction-container">
            <header className="transaction-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    &larr;
                </button>
                <h1>Add Transaction</h1>
                <IconButton color="secondary" onClick={handleLogout} style={{ position: 'absolute', right: 16 }}>
                    <ExitToAppIcon />
                </IconButton>
            </header>
            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group2">
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={initialData.amount || ''}
                        onChange={(e) => setInitialData({ ...initialData, amount: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={initialData.date || ''}
                        onChange={(e) => setInitialData({ ...initialData, date: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Description:</label>
                    <input
                        type="text"
                        value={initialData.description || ''}
                        onChange={(e) => setInitialData({ ...initialData, description: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Category:</label>
                    <select
                        value={initialData.categoryId || ''}
                        onChange={(e) => setInitialData({ ...initialData, categoryId: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="add-transaction-button">Submit</button>
            </form>
        </div>
    );
};

export default AddTransaction;
