import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Results.css';
import { FaCrown, FaUserAlt, FaTrophy } from 'react-icons/fa';

const CandidateCard = ({ candidate, isWinner, totalVotes, rank }) => {
  const votePercentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;

  return (
    <div className={`candidate-card ${isWinner ? 'winner-card' : ''}`}>
      <div className="candidate-rank">{rank}</div>
      <div className="candidate-image-wrapper">
        {candidate.image ? (
          <img src={`http://localhost:3000/${candidate.image}`} alt={candidate.name} className="candidate-image" />
        ) : (
          <FaUserAlt className="candidate-icon" />
        )}
        {isWinner && <FaCrown className="winner-icon" />}
      </div>
      <h3 className="candidate-name">{candidate.name}</h3>
      <div className="vote-info">
        <span className="vote-count">{candidate.voteCount || 0}</span>
        <span className="vote-label">votes</span>
      </div>
      <div className="vote-percentage-wrapper">
        <div className="vote-percentage-bar" style={{ width: `${votePercentage}%` }}></div>
        <span className="vote-percentage-text">{votePercentage.toFixed(1)}%</span>
      </div>
      {isWinner && (
        <div className="winner-decorations">
          <FaTrophy className="trophy left" />
          <FaTrophy className="trophy right" />
          <div className="confetti-container">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="confetti"></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/results');
        setCandidates(response.data.candidates.sort((a, b) => b.voteCount - a.voteCount));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to fetch results. Please try again later.');
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="loading">Loading results...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);
  const hasVotes = totalVotes > 0;
  const hasMultipleCandidates = candidates.length > 1;

  return (
    <div className="results-container">
      <h1 className="results-title">Election Results</h1>
      {!hasVotes && <p className="no-votes-message">No votes have been cast yet.</p>}
      {hasVotes && !hasMultipleCandidates && (
        <p className="single-candidate-message">There is only one candidate. A winner cannot be declared.</p>
      )}
      <div className="candidates-grid">
        {candidates.map((candidate, index) => (
          <CandidateCard 
            key={candidate._id} 
            candidate={candidate} 
            isWinner={index === 0 && hasVotes && hasMultipleCandidates} 
            totalVotes={totalVotes}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Results;