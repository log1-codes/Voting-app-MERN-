import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { toast } from 'react-toastify';
import { FaUser, FaBars, FaPoll, FaTimes, FaHome, FaUsers, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    setTimeout(() => navigate('/login'), 2000);
  }

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  }

  const NavItems = () => (
    <>
      <li onClick={() => handleNavigation("/")}><FaHome /> Home</li>
      <li onClick={() => handleNavigation("/candidates")}><FaUsers /> Candidates</li>
      <li onClick={() => handleNavigation("/results")}><FaPoll /> Results</li>
      {isLoggedIn ? (
        <>
          <li onClick={() => handleNavigation("/profile")}><FaUser /> Profile</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </>
      ) : (
        <>
          <li onClick={() => handleNavigation("/login")}><FaSignInAlt /> Login</li>
          <li onClick={() => handleNavigation("/signup")}><FaUserPlus /> SignUp</li>
        </>
      )}
    </>
  )

  return (
    <nav className='Navbar'>
      <div className="nav-content">
        <div className="logo" onClick={() => handleNavigation("/")}>
          <h2>Make The Right Choice</h2>
        </div>
        <div className={`nav-items ${isMobileMenuOpen ? 'active' : ''}`}>
          <NavItems />
        </div>
        <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  )
}

export default Navbar