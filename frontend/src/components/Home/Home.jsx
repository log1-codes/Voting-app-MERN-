import React from 'react';
import './Home.css';
import votingImage from '../../assets/election.jpg';
const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Your Voice Matters</h1>
      <p className="home-description">
        Be part of the democratic process. Discover upcoming elections, learn about
        important issues, and cast your vote to shape the future of your community.
      </p>
      <div className="home-cta-container">
        <p className="home-cta">Explore Upcoming Elections</p>
        <p className="home-cta">Learn About Voting Procedures</p>
        <p className="home-cta">Stay Informed on Current Issues</p>
      </div>
      <img src={votingImage} alt="Voting Image" className="home-image" />
    </div>
  );
};

export default Home;