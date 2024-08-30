//components/HomePage.js
/*
 * File name: Homepage.js
 * Description: This React component renders the homepage of the Budget Minder application, featuring a background video, a header with navigation, and a hero section with a call-to-action.

 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import logo from '../images/budget_background.png';
import backgroundVideo from '../images/gif_background.mp4';
/**
 * Homepage component
 * 
 * This component renders the main page for the Budget Minder application, including:
 * - A background video that plays automatically
 * - A sticky header with a logo, navigation links, and a "Get Started" button
 * - A hero section with a title, description, and a "Join Now" button
 * 
 * Uses React Router's `useNavigate` for navigation purposes.
 * 
 * @returns {JSX.Element} The Homepage component
 */
const Homepage = () => {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    navigate('/register');
  };

  return (
    <div className="Homepage">
      <div className="background-video">
        <video autoPlay muted loop className="background-video-element">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <header className="Homepage-header">
        <div className="logo">
          <img src={logo} alt="Budget Minder Logo" />
          <span className="logo-text">Budget Minder</span>
        </div>
        <nav className="navbar">
          <ul>
            <li><a href="#forecast">Forecast</a></li>
            <li><a href="#finances">Finances</a></li>
            <li><a href="#savings">Savings</a></li>
          </ul>
        </nav>
        <a href="/login" className="get-started">Get Started</a>
      </header>
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Smart Budgeting</h1>
            <p>Take control of your finances, smash your savings goals, and secure a brighter financial future with Budget Minder!</p>
            <button className="join-now" onClick={handleJoinNow}>Join Now</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Homepage;
