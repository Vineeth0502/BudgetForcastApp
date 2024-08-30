//components/ProfilePage.test.js
/*
 * File name: ProfilePage.test.js
 * Description: Unit tests for the Profile component.
 * Test suite that contain unit tests to ensure that the Profile component correctly renders
 * user data, handles loading and error states, and interacts with the fetch API.
 */


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../ProfilePage';

const mockNavigate = jest.fn();
const mockFetch = jest.fn();
const mockSetItem = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

global.fetch = mockFetch;
Storage.prototype.setItem = mockSetItem;

beforeEach(() => {
    jest.clearAllMocks();
});
/**
 * Test case: renders profile page with user data
 * - Mocks a successful fetch request that returns user data
 * - Renders the Profile component within a BrowserRouter
 * - Asserts that loading message is displayed initially
 * - Asserts that user data is rendered correctly after data fetch
 */
test('renders profile page with user data', async () => {
    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
            name: 'John Doe',
            email: 'john.doe@example.com',
            job: 'Developer',
            bio: 'Bio',
            age: 30,
            salary: 5000,
            accountBalance: 2000
        }),
    });

    render(
        <BrowserRouter>
            <Profile />
        </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
        expect(screen.getByText('Name:')).toBeInTheDocument();
    });
    
    await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    await waitFor(() => {
        expect(screen.getByText('Email:')).toBeInTheDocument();
    });
    
    await waitFor(() => {
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
});
/**
 * Test case: shows error message if profile fetch fails
 * - Mocks a failed fetch request
 * - Renders the Profile component within a BrowserRouter
 * - Asserts that error message is displayed
 */
test('shows error message if profile fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.reject(new Error('Failed to fetch user profile')),
    });

    render(
        <BrowserRouter>
            <Profile />
        </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Failed to fetch user profile')).toBeInTheDocument();
    });
});
