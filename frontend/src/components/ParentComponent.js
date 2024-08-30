// components/ParentComponent.js
/*
 * File name: ParentComponent.js
 * Description: This component serves as a parent for the ForecastForm component. It provides handlers for forecasting and saving forecast data.

 */
import React from 'react';
import ForecastForm from './ForecastForm';

const ParentComponent = () => {
      /*
     * Function: onForecast
     * Description: Simulates a forecast result based on the provided forecast data.
     * Parameters:
     *   forecastData - An object containing targetAmount, monthlyIncome, and allocationPercentage.
     * Returns: An object containing the number of months required to reach the targetAmount.
     */
    const onForecast = async (forecastData) => {
        // Simulate a forecast result
        const result = { months: Math.ceil(forecastData.targetAmount / (forecastData.monthlyIncome * (forecastData.allocationPercentage / 100))) };
        return result;
    };
     /*
     * Function: saveForecast
     * Description: Sends the forecast data to the backend API and returns the response.
     * Parameters:
     *   forecastData - An object containing forecast details to be saved.
     * Returns: The response from the backend API or logs an error if the request fails.
     */
    const saveForecast = async (forecastData) => {
        try {
            const response = await fetch('http://localhost:3000/api/forecasts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(forecastData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error saving forecast:', error);
        }
    };

    return (
        <div>
            <ForecastForm onForecast={onForecast} saveForecast={saveForecast} />
        </div>
    );
};

export default ParentComponent;
