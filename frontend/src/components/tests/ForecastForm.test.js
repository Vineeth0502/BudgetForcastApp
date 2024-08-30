//components/ForecastForm.test.js

/*
 * File name: ForecastForm.test.js
 * Description: Test suite that contain Unit tests for the ForecastForm component. Tests include rendering the form, 
 *              submitting the form, showing forecast results, and handling logout and navigation.

 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForecastForm from '../ForecastForm';

// Mock functions for onForecast and saveForecast
const mockOnForecast = jest.fn();
const mockSaveForecast = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

beforeEach(() => {
    // Mock localStorage methods
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
    Storage.prototype.removeItem = jest.fn();
});

test('renders forecast form', () => {
    render(
        <BrowserRouter>
            <ForecastForm onForecast={mockOnForecast} saveForecast={mockSaveForecast} />
        </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Forecast Management', level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Target Amount:')).toBeInTheDocument();
    expect(screen.getByLabelText('Current Amount:')).toBeInTheDocument();
    expect(screen.getByLabelText('Monthly Income:')).toBeInTheDocument();
    expect(screen.getByLabelText('Allocation Percentage:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Forecast' })).toBeInTheDocument();
});
test('submits form and shows forecast result', async () => {
    mockOnForecast.mockResolvedValue({ months: 12 });

    render(
        <BrowserRouter>
            <ForecastForm onForecast={mockOnForecast} saveForecast={mockSaveForecast} />
        </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Test Forecast' } });
    fireEvent.change(screen.getByLabelText('Target Amount:'), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText('Current Amount:'), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Monthly Income:'), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText('Allocation Percentage:'), { target: { value: '25' } });
    fireEvent.click(screen.getByRole('button', { name: 'Forecast' }));

    await waitFor(() => {
        expect(screen.getByText('Months to achieve goal: 12')).toBeInTheDocument();
    });

    expect(mockOnForecast).toHaveBeenCalledWith({
        targetAmount: '5000',
        currentAmount: '1000',
        monthlyIncome: '2000',
        allocationPercentage: '25'
    });
    expect(mockSaveForecast).not.toHaveBeenCalled();
});

test('handles logout and navigation', () => {
    render(
        <BrowserRouter>
            <ForecastForm onForecast={mockOnForecast} saveForecast={mockSaveForecast} />
        </BrowserRouter>
    );

    const logoutButton = screen.getByRole('button', { name: 'Logout' }); // Updated
    fireEvent.click(logoutButton);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userId');
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
});