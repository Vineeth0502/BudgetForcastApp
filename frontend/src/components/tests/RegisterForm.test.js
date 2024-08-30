//components/Register.test.js
/*
 * File name: RegisterForm.test.js
 * Description: Test suite that contain Unit tests for the RegisterForm component.
 * Tests include rendering the form, validating email input, and submitting the form with valid data.
 
 */

import React from 'react';
import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '../RegisterForm';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));
beforeAll(() => {
    // Mock localStorage methods
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
});
/**
 * Test case to ensure the RegisterForm component renders correctly.
 * It checks for the presence of the heading, input fields, and the submit button.
 */
test('renders register form', () => {
    render(
        <BrowserRouter>
            <RegisterForm />
        </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Budget Minder', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Register', level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
});

/**
 * Test case to validate the email format. 
 * It verifies that an invalid email format results in an appropriate error message.
 */
test('validates email format', async () => {
    render(
        <BrowserRouter>
            <RegisterForm />
        </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username:');
    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Password:');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText('Invalid email format.')).toBeInTheDocument();
    });
});
/**
 * Test case to simulate form submission with valid data.
 * It checks if the form submission succeeds, the correct success message is displayed,
 * the token is stored in localStorage, and the user is navigated to the '/complete-profile' route.
 */
test('submits form with valid data', async () => {
    jest.setTimeout(10000); 
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ token: 'fake-token', message: 'Registration successful' }),
        })
    );

    render(
        <BrowserRouter>
            <RegisterForm />
        </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username:');
    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Password:');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText('Registration successful')).toBeInTheDocument();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
    expect(mockNavigate).toHaveBeenCalledWith('/complete-profile');
});