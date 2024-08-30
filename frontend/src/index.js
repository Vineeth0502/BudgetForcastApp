//index.js
/*
 * File name: index.js
 * Description: Entry point of the React application. This file initializes the React app, sets up routing, and applies global styles.
 * 
 * Overview:
 * - Imports React, ReactDOM, and routing components.
 * - Imports the main App component and global CSS file.
 * - Renders the App component wrapped in a BrowserRouter for routing support.
 * - Includes error handling for the root element not found scenario.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';  // Ensure this file exists


const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
