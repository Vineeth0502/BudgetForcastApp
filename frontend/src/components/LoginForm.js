//components/LoginForm.js

/*
 * File name: LoginForm.js
 * Description: This React component represents a login form where users can enter their email and password to log into the application. It includes input validation, sanitization, and loading state handling.

 */


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

// Utility functions for validation and sanitization

/**
 * Validates the email format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email format is valid, otherwise false.
 */
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Sanitizes input to prevent XSS attacks by escaping HTML characters.
 * @param {string} input - The input string to sanitize.
 * @returns {string} - The sanitized input string.
 */
const sanitizeInput = (input) => {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
};

const LoginForm = () => {
    // State hooks for form inputs and loading state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    /**
     * Handles form submission, including validation and API request.
     * @param {Event} event - The form submission event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate email
        if (!validateEmail(email)) {
            setMessage('Invalid email format.');
            return;
        }

        // Sanitize inputs
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);

        setLoading(true);

        // Send sanitized and validated data to backend
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: sanitizedEmail, 
                password: sanitizedPassword 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId); // Store userId in localStorage
            setMessage(data.message);
            setTimeout(() => navigate('/dashboard'), 3000);
        } else {
            setMessage(data.error);
            setLoading(false);
        }
    };

    return (
        <>
            <header className="header">
                <h1>Budget Minder</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/register">Sign Up</Link>
                </nav>
            </header>
            <div className={`form-container ${loading ? 'loading' : ''}`}>
                <div className="form-content">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="login-button" disabled={loading}>Login</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
                {loading && <div className="spinner-overlay"><div className="spinner"></div></div>}
            </div>
            <footer className="footer">
                <p>Budget Minder</p>
                <p>Managing your finances with ease</p>
            </footer>
        </>
    );
};

export default LoginForm;