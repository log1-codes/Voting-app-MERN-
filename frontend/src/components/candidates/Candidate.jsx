import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Candidate.css';

const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleVote = async (candidateId) => {
    // Implement voting logic here
    toast.info('Voting functionality not implemented yet');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!candidates || candidates.length === 0) return <div>No candidates available</div>;

  return (
    <div className="candidate-container">
      <ToastContainer />
      <h1>Candidates</h1>
      <div className="candidate-list">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="candidate-card">
            <img 
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${candidate.name}`} 
              alt={candidate.name} 
              className="candidate-image" 
            />
            <h2>{candidate.name}</h2>
            <p><strong>Username:</strong> {candidate.username}</p>
            <p><strong>Email:</strong> {candidate.email}</p>
            <p><strong>Contact:</strong> {candidate.contact}</p>
            <button onClick={() => handleVote(candidate._id)} className="vote-button">
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Candidate;