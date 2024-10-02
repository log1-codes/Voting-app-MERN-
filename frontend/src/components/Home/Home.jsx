import React from 'react';
import './Home.css';
import { FaVoteYea, FaUserCheck, FaChartBar, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">Democracy in Action</h1>
        <p className="home-subtitle">Your vote shapes our future. Make it count.</p>
        <Link to="/signup" className="cta-button primary">
          Get Started <FaArrowRight className="arrow-icon" />
        </Link>
      </div>
      <div className="home-features">
        <div className="feature-card">
          <div className="feature-content">
            <div className="feature-icon-wrapper">
              <FaVoteYea className="feature-icon" />
            </div>
            <h2>Secure Voting</h2>
            <p>Cast your vote with confidence using our state-of-the-art secure voting system</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-content">
            <div className="feature-icon-wrapper">
              <FaUserCheck className="feature-icon" />
            </div>
            <h2>Candidate Profiles</h2>
            <p>Explore detailed candidate profiles and make an informed decision</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-content">
            <div className="feature-icon-wrapper">
              <FaChartBar className="feature-icon" />
            </div>
            <h2>Real-time Results</h2>
            <p>Watch the election unfold with our live result tracking dashboard</p>
          </div>
        </div>
      </div>
      <div className="home-cta">
        <h2>Be the change you want to see</h2>
        <Link to="/login" className="cta-button secondary">
          Login to Vote
        </Link>
      </div>
    </div>
  );
};

export default Home;