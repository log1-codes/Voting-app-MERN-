import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy, FaUserCircle, FaPoll } from 'react-icons/fa';
import './Results.css';

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log("Fetching results...");
        const response = await axios.get('http://localhost:3000/api/auth/results');
        console.log("Results received:", response.data);
        setCandidates(response.data.candidates);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results. Please try again.');
        setLoading(false);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  console.log("Current state:", { candidates, loading, error });

  if (loading) return <div className="loading">Loading results...</div>;
  if (error) return <div className="error">{error}</div>;

  const sortedCandidates = candidates.sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="results-container">
      <h1 className="results-title">Election Results</h1>
      <div className="results-list">
        {sortedCandidates.map((candidate, index) => (
          <div key={candidate._id} className={`result-card ${index === 0 ? 'winner' : ''}`}>
            <div className="result-card-inner">
              {index === 0 && <FaTrophy className="winner-icon" />}
              <img 
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${candidate.name}`} 
                alt={candidate.name} 
                className="candidate-image" 
              />
              <h2 className="candidate-name">{candidate.name}</h2>
              <p><FaUserCircle className="icon" /> {candidate.username}</p>
              <p className="vote-count"><FaPoll className="icon" /> Votes: {candidate.voteCount}</p>
              <div className="position">#{index + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;