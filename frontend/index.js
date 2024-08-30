//index.js
/*
 * File name: index.js
 * Description: Entry point for the React application. This file renders the main App component into the root element of the HTML document.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
