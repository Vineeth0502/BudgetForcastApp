//App.js
/*
 * File name: App.js
 * Description: Main application component defining routes and handling API interactions for goals and forecasts.
 * 
 */

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Homepage from './components/HomePage';
import Dashboard from './components/Dashboard';
import CompleteProfile from './components/CompleteProfile';
import ProfilePage from './components/ProfilePage';
import AddTransaction from './components/AddTransaction';
import GoalForm from './components/GoalForm';
import ForecastForm from './components/ForecastForm';
import ParentComponent from './components/ParentComponent';

function App() {
// Function to add a new goal
  const addGoal = async (goal) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/goals', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(goal),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error adding goal:', error);
    }
  };
  // Function to fetch goals from the server
  const fetchGoals = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/goals', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching goals:', error);
        return [];
    }
  };
  // Function to handle forecasting goals
  const handleForecastGoal = async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/goals/forecast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  };
// Function to fetch forecasts from the server
  const fetchForecasts = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/forecasts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching forecasts:', error);
        return [];
    }
  };
// Function to save a forecast
  const saveForecast = async (forecastData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/forecasts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(forecastData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error saving forecast:', error);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/add-transaction" element={<AddTransaction />} />
      <Route path="/add-goal" element={<GoalForm onAdd={addGoal} fetchGoals={fetchGoals} fetchForecasts={fetchForecasts} />} />
      <Route path="/forecast" element={<ForecastForm onForecast={handleForecastGoal} saveForecast={saveForecast} />} />
      <Route path="/forcast" element={<ParentComponent />} />
    </Routes>
  );
}

export default App;
