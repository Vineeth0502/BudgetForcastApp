/*
 * File name: LoginForm.test.js
 * Description: Test Suite that contains unit tests for the LoginForm component using React Testing Library and Jest. It tests rendering of the form.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';

// Mock the useNavigate hook
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
   useNavigate: () => mockedUsedNavigate,
}));

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

      expect(screen.getByRole('heading', { name: 'Budget Finder', level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Login', level: 2 })).toBeInTheDocument();
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Password:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
   });
});
