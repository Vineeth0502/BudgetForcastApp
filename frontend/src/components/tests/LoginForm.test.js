//components/LoginForm.test.js
/*
 * File name: LoginForm.test.js
 * Description: Test Suite that contain unit tests for the LoginForm component using React Testing Library and Jest. It tests rendering, form validation, form submission, and error handling.

 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';

// Mock the useNavigate hook
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
// Mock localStorage
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: jest.fn(key => store[key]),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: function() {
            store = {};
        }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
// Mock the fetch function
global.fetch = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('heading', { name: 'Budget Minder', level: 1 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Login', level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('validates email format', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Password:');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format.')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
        //const mockNavigate = jest.fn();
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'fake-token', userId: 'fake-user-id', message: 'Login successful' }),
        });

        render(
            <BrowserRouter>
                <LoginForm  />
            </BrowserRouter>
        );
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password12345' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Login successful')).toBeInTheDocument();
        });

        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
        expect(localStorage.setItem).toHaveBeenCalledWith('userId', 'fake-user-id');

        // Wait for navigation
        await waitFor(() => {
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
        }, { timeout: 5000 }); 
    });
  test('handles login error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Password:');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});