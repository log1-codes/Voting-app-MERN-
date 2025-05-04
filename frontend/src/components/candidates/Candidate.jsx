import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import './Candidate.css';
import { FaVoteYea, FaUserCircle, FaEnvelope, FaPhone, FaPoll } from 'react-icons/fa';

const CandidateCard = ({ candidate, user, onVote }) => (
  <div className="candidate-card">
    <div className="candidate-card__image-container">
      <img 
        src={`https://api.dicebear.com/6.x/initials/svg?seed=${candidate.name}`} 
        alt={candidate.name} 
        className="candidate-card__image" 
      />
    </div>
    <div className="candidate-card__content">
      <h2 className="candidate-card__name">{candidate.name}</h2>
      <div className="candidate-card__info">
        <p><FaUserCircle /> {candidate.username}</p>
        <p><FaEnvelope /> {candidate.email}</p>
        <p><FaPhone /> {candidate.contact}</p>
      </div>
      <div className="candidate-card__votes">
        <FaPoll /> Votes: {candidate.voteCount}
      </div>
      {user && user.role === 'voter' && !user.hasVoted && (
        <button onClick={() => onVote(candidate.aadharCardNumber)} className="candidate-card__vote-btn">
          <FaVoteYea /> Vote
        </button>
      )}
    </div>
  </div>
);

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
      const response = await axios.get('https://voting-app-mern-backend-2.onrender.com/api/auth/candidates');
      setCandidates(response.data.candidates);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates. Please try again.');
      setLoading(false);
    }
  };

  const handleVote = async (candidateAadharCardNumber) => {
    if (!user) {
      toast.error('Plehey hdf fh  ase log in to vote');
      return;
    }

    if (user.role !== 'voter') {
      toast.error('Only voters can cast votes');
      return;
    }

    try {
      const response = await axios.post('https://voting-app-mern-backend-2.onrender.com/api/auth/vote', {
        voterAadharCardNumber: user.aadharCardNumber,
        candidateAadharCardNumber: candidateAadharCardNumber
      });

      toast.success(response.data.message);
      fetchCandidates();
      
      const updatedUser = { ...user, hasVoted: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cast vote');
    }
  };

  if (loading) return <div className="candidate-loading">Loading...</div>;
  if (error) return <div className="candidate-error">{error}</div>;
  if (!candidates || candidates.length === 0) return <div className="candidate-empty">No candidates available</div>;

  return (
    <div className="candidates-container">
      <ToastContainer />
      <h1 className="candidate-title">Candidates</h1>
      {!user && (
        <div className="candidate-login-message">
          Please <Link to="/login">log in</Link> to vote.
        </div>
      )}
      <div className="candidate-grid">
        {candidates.map((candidate) => (
          <CandidateCard 
            key={candidate._id} 
            candidate={candidate} 
            user={user} 
            onVote={handleVote} 
          />
        ))}
      </div>
    </div>
  );
};

export default Candidate;
