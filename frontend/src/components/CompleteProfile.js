//components/CompleteProfile.js
/**
 * File name: CompleteProfile.js
 * Description: This component allows users to complete their profile by entering details such as name, job, bio, age, salary, and account balance.
 *              It handles form submission and updates the user profile by sending a PUT request to the server.
 *              On successful submission, the user is redirected to the login page.
 
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CompleteProfile = () => {
     // State variables for form inputs 
    const [name, setName] = useState('');
    const [job, setJob] = useState('');
    const [bio, setBio] = useState('');
    const [age, setAge] = useState('');
    const [salary, setSalary] = useState('');
    const [accountBalance, setAccountBalance] = useState(''); // Added state for account balance
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
   // Handles form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('No token found, please login again.');
            navigate('/login');
            return;
        }

        const response = await fetch('http://localhost:3000/api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, job, bio, age, salary, accountBalance }), // Included account balance
        });

        const data = await response.json();

        if (response.ok) {
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setMessage(data.error);
        }
    };

    return (
        <>
            <header className="header">
                <h1>Complete Your Profile</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/login">Logout</Link>
                </nav>
            </header>
            <div className="form-container">
                <div className="form-content">
                    <h2>Profile Details</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Job:</label>
                            <input
                                type="text"
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bio:</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Age:</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Salary:</label>
                            <input
                                type="number"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Account Balance:</label>
                            <input
                                type="number"
                                value={accountBalance}
                                onChange={(e) => setAccountBalance(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="complete-profile-button">Complete Profile</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </>
    );
};

export default CompleteProfile;
