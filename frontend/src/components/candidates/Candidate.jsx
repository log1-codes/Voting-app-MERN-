import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import './Candidate.css';

const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      console.log("Fetching candidates");
      const response = await axios.get('http://localhost:3000/api/auth/candidates');
      console.log("Candidates fetched successfully:", response.data);
      setCandidates(response.data.candidates);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      console.error('Error details:', err.response);
      setError('Failed to load candidates. Please try again.');
      setLoading(false);
    }
  };

  const handleVote = async (candidateAadharCardNumber) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    if (user.role !== 'voter') {
      toast.error('Only voters can cast votes');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/vote', {
        voterAadharCardNumber: user.aadharCardNumber,
        candidateAadharCardNumber: candidateAadharCardNumber
      });

      toast.success(response.data.message);
      fetchCandidates(); // Refresh the candidate list to update vote counts
      
      // Update local user data to reflect that they've voted
      const updatedUser = { ...user, hasVoted: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cast vote');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!candidates || candidates.length === 0) return <div className="no-candidates">No candidates available</div>;

  return (
    <div className="candidate-container">
      <ToastContainer />
      <h1 className="candidate-title">Candidates</h1>
      {!user && (
        <div className="login-message">
          Please <Link to="/login">log in</Link> to vote.
        </div>
      )}
      <div className="candidate-list">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="candidate-card">
            <img 
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${candidate.name}`} 
              alt={candidate.name} 
              className="candidate-image" 
            />
            <h2 className="candidate-name">{candidate.name}</h2>
            <p><strong>Username:</strong> {candidate.username}</p>
            <p><strong>Email:</strong> {candidate.email}</p>
            <p><strong>Contact:</strong> {candidate.contact}</p>
            <p><strong>Votes:</strong> {candidate.voteCount}</p>
            {user && user.role === 'voter' && !user.hasVoted && (
              <button onClick={() => handleVote(candidate.aadharCardNumber)} className="vote-button">
                Vote
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Candidate;