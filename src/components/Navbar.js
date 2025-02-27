import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.jpg'; // Import the logo image from src/assets/
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="BattleRoail Logo" className="navbar-logo" />
        BattleRoail
      </Link>
      
      <div className="navbar-links">
        {currentUser ? (
          <>
            <Link to="/matches" className={`navbar-link ${isActive('/matches')}`}>
              Available Matches
            </Link>
            <Link to="/leaderboard" className={`navbar-link ${isActive('/leaderboard')}`}>
              Leaderboard
            </Link>
            <Link to="/profile" className={`navbar-link ${isActive('/profile')}`}>
              Profile
            </Link>
            <Link to="/" className="navbar-link" onClick={logout}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className={`navbar-link ${isActive('/login')}`}>
              Login
            </Link>
            <Link to="/signup" className={`navbar-link ${isActive('/signup')}`}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 