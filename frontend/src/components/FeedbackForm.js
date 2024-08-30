//components/FeedbackForm.js
/*
 * File name: FeedbackForm.js
 * Description: React component for submitting feedback. Includes rating selection 
 *              and a comments field. Handles form submission and error handling.

 */
import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackForm.css';

const FeedbackForm = () => {
    // State to hold the selected rating (1 to 5)
    const [rating, setRating] = useState(1);
    // State to hold the comments input
    const [comments, setComments] = useState('');
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Retrieve token from local storage
        const token = localStorage.getItem('token');

        if (!token) {
            alert('User is not authenticated');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/feedback', { rating, comments }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
            alert('Failed to submit feedback. Please check the console for more details.');
        }
    };

    return (
        <div className="feedback-form-container">
            <h2>Submit Your Feedback</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Rating:
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Comments:
                    <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
                </label>
                <button type="submit">Submit Feedback</button>
            </form>
        </div>
    );
};

export default FeedbackForm;
