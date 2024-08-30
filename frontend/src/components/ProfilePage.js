/*
 * File name: ProfilePage.js
 * Description: The Profile component allows users to view and edit their profile information. 
 * Includes fetching user data, handling form submissions, and navigation.
 * Adding Map advanced data structure
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './ProfilePage.css';

/**
 * Represents a simple form fields map to manage form data dynamically.
 */
class FormFieldsMap {
    constructor() {
        this.fields = new Map();  // Map to store field names and values
    }

    // Add a field to the map
    addField(name, value) {
        this.fields.set(name, value);
    }

    // Get a field value by name
    getField(name) {
        return this.fields.get(name);
    }

    // Get all fields as an object
    getFields() {
        const fieldsObj = {};
        this.fields.forEach((value, key) => {
            fieldsObj[key] = value;
        });
        return fieldsObj;
    }

    // Update a field value
    updateField(name, value) {
        this.fields.set(name, value);
    }
}

// Initialize the form fields map with default values
const formFieldsMap = new FormFieldsMap();
formFieldsMap.addField('name', '');
formFieldsMap.addField('email', '');
formFieldsMap.addField('job', '');
formFieldsMap.addField('bio', '');
formFieldsMap.addField('age', '');
formFieldsMap.addField('salary', '');
formFieldsMap.addField('accountBalance', '');

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(formFieldsMap.getFields());
    const navigate = useNavigate();

    // Effect hook to fetch user profile data on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();
                setUser(data);
                setFormData(data); // Initialize form data with user data
                // Initialize formFieldsMap with user data
                Object.entries(data).forEach(([key, value]) => formFieldsMap.updateField(key, value));
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Handler for input changes in the profile form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        formFieldsMap.updateField(name, value);
        setFormData(formFieldsMap.getFields());
    };

    // Handler for form submission to update user profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formFieldsMap.getFields())
            });
            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }
            const updatedData = await response.json();
            setUser(updatedData);
            setEditMode(false);
        } catch (error) {
            setError(error.message);
        }
    };

    // Handler for logging out and navigating to login page
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
    };

    // Handler for navigating back to the dashboard
    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    // Conditional rendering based on loading, error, and user data
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="profile-container">
            <h1 style={{ 
                fontWeight: 'bold', 
                color: 'black', 
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', 
                transition: 'transform 0.2s' 
                }}>
                Profile
            </h1>
            <header className="profile-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    <ArrowBackIcon />
                </button>
                <h1></h1>
                <IconButton color="secondary" onClick={handleLogout} className="icon-button">
                    <ExitToAppIcon />
                </IconButton>
            </header>
            <div className="profile-avatar">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=007bff&color=fff`} alt="Avatar" />
            </div>
            <div className="profile-form">
                {user && (
                    editMode ? (
                        <form onSubmit={handleSubmit}>
                            {['name', 'email', 'job', 'bio', 'age', 'salary', 'accountBalance'].map(field => (
                                <div className="form-group2" key={field}>
                                    <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                    <input
                                        id={field}
                                        type={field === 'age' || field === 'salary' || field === 'accountBalance' ? 'number' : 'text'}
                                        name={field}
                                        value={formData[field] || ''}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                            ))}
                            <button type="submit" className="btn btn-success save-profile-button">Save</button>
                            <button type="button" onClick={() => setEditMode(false)} className="btn btn-danger cancel-profile-button">Cancel</button>
                        </form>
                    ) : (
                        <>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Job:</strong> {user.job}</p>
                            <p><strong>Bio:</strong> {user.bio}</p>
                            <p><strong>Age:</strong> {user.age}</p>
                            <p><strong>Salary:</strong> {user.salary}</p>
                            <p><strong>Account Balance:</strong> {user.accountBalance}</p>
                            <button onClick={() => setEditMode(true)} className="btn btn-primary edit-profile-button">Edit</button>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default Profile;
