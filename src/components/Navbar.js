import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img 
            src="https://source.unsplash.com/random/40x40/?globe,world" 
            alt="BattleRoail" 
            className="navbar-logo" 
          />
          BattleRoail
        </Link>
      </div>
      <div className="navbar-menu">
        {currentUser ? (
          <>
            <Link to="/matches" className="navbar-item">Available Matches</Link>
            <Link to="/leaderboard" className="navbar-item">Leaderboard</Link>
            <Link to="/profile" className="navbar-item">Profile</Link>
            <button onClick={handleLogout} className="navbar-item logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/signup" className="navbar-item">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 