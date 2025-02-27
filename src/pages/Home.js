import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>BattleRoail</h1>
          <p>Test your diplomatic and strategic skills in realistic global crisis scenarios</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </div>
      
      <div className="scenarios-section">
        <div className="scenarios-grid">
          <div className="scenario-card">
            <h3>Realistic Scenarios</h3>
            <p>Based on historical and potential future global crises</p>
          </div>
          <div className="scenario-card">
            <h3>Strategic Gameplay</h3>
            <p>Test your decision-making and diplomatic skills</p>
          </div>
          <div className="scenario-card">
            <h3>Multiplayer</h3>
            <p>Collaborate or compete with other players</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 