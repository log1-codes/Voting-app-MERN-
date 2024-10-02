import React from 'react';
import './Home.css';
import { FaVoteYea, FaUserCheck, FaChartBar } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">Make The Right Choice</h1>
        <p className="home-subtitle">Your vote is your voice in shaping our future</p>
      </div>
      <div className="home-features">
        <div className="feature-card">
          <FaVoteYea className="feature-icon" />
          <h2>Cast Your Vote</h2>
          <p>Securely vote for your preferred candidates</p>
        </div>
        <div className="feature-card">
          <FaUserCheck className="feature-icon" />
          <h2>View Candidates</h2>
          <p>Learn about the candidates and their platforms</p>
        </div>
        <div className="feature-card">
          <FaChartBar className="feature-icon" />
          <h2>Live Results</h2>
          <p>Stay updated with real-time election results</p>
        </div>
      </div>
      <div className="home-cta">
        <h2>Ready to make a difference?</h2>
        <button className="cta-button">Get Started</button>
      </div>
    </div>
  );
};

export default Home;