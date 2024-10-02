import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { toast } from 'react-toastify';
import { useAuth } from '../../useAuth';
import { FaUser } from 'react-icons/fa';
const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    setTimeout(() => navigate('/'), 2000);
  }
  const handleProfileClick=()=>{
    navigate('/profile');
  }
  return (
    <div className='Navbar'>
      <div className="left-nav">
        <h2>Make The Right Choice</h2>
      </div>
      <div className="right-nav">
        {isLoggedIn ? (
          <>
            <button onClick={() => navigate("/")} className='buttons'>Home</button>
            <button onClick={() => navigate("/candidates")} className='buttons'>Candidates</button>
            <button onClick={handleProfileClick} className='buttons profile-button'>
              <FaUser /> Profile
            </button>
            <button onClick={handleLogout} className='buttons'>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/")} className='buttons'>Home</button>
            <button onClick={() => navigate("/candidates")} className='buttons'>Candidates</button>

            <button onClick={() => navigate("/login")} className='buttons'>Login</button>
            <button onClick={() => navigate("/signup")} className='buttons'>SignUp</button>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar