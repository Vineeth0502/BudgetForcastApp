//components/ForecastForm.js
/*
 * File name: ForecastForm.js
 * Description: React component for managing financial forecasts. Includes form for 
 *              inputting forecast data, fetching user data, and handling form submission.

 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForecastForm.css';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ForecastForm = ({ onForecast, saveForecast }) => {
    // State variables for form inputs and forecast result
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [allocationPercentage, setAllocationPercentage] = useState('');
    const [forecastResult, setForecastResult] = useState(null);
    const navigate = useNavigate();
     // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCurrentAmount(data.accountBalance);
            setMonthlyIncome(data.salary);
        };

        fetchUserData();
    }, []);
    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const forecastData = {
            targetAmount,
            currentAmount,
            monthlyIncome,
            allocationPercentage
        };

        const result = await onForecast(forecastData);
        setForecastResult(result);

        if (window.confirm("Do you want to record this forecast and get updates regarding it?")) {
            await saveForecast({ name, ...forecastData, months: result.months });
            setTimeout(() => {
                navigate('/add-goal');
            }, 3000);
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
        <div className="forecast-container">
            <header className="forecast-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    &larr;
                </button>
                <h1>Forecast Management</h1>
                <IconButton color="secondary" onClick={handleLogout} style={{ position: 'absolute', right: 16 }} aria-label="Logout">
                    <ExitToAppIcon />
                </IconButton>
            </header>
            <form onSubmit={handleSubmit} className="forecast-form">
                <div className="form-group2">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label htmlFor="targetAmount">Target Amount:</label>
                    <input
                        type="number"
                        id="targetAmount"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label htmlFor="currentAmount">Current Amount:</label>
                    <input
                        type="number"
                        id="currentAmount"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label htmlFor="monthlyIncome">Monthly Income:</label>
                    <input
                        type="number"
                        id="monthlyIncome"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label htmlFor="allocationPercentage">Allocation Percentage:</label>
                    <input
                        type="number"
                        id="allocationPercentage"
                        value={allocationPercentage}
                        onChange={(e) => setAllocationPercentage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="forecast-button">Forecast</button>
            </form>

            {forecastResult && (
                <div className="forecast-result">
                    <h3>Forecast Result</h3>
                    <p>Months to achieve goal: {forecastResult.months}</p>
                </div>
            )}
        </div>
    );
};

export default ForecastForm;
