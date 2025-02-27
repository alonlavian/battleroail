import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Avatar } from '../components/Avatar';
import './Profile.css';

// Mock data for user profile
const mockUserData = {
  username: "alonlavian",
  email: "lavian.alon@gmail.com",
  rank: "Senior Negotiator",
  achievements: [
    { id: 1, title: "Master Negotiator", description: "Successfully resolved 5 diplomatic crises", icon: "🏆" },
    { id: 2, title: "Team Player", description: "Participated in 10 team actions", icon: "👥" },
    { id: 3, title: "Strategic Mind", description: "Achieved victory in a hard difficulty scenario", icon: "🧠" }
  ],
  recentMatches: [
    { id: 1, title: "Ukraine-Russia Crisis", status: "Victory", score: 230 },
    { id: 2, title: "Middle East Peace Negotiations", status: "Ongoing", score: 185 },
    { id: 3, title: "South China Sea Dispute", status: "Defeat", score: 120 }
  ],
  skills: [
    { name: "Diplomacy", value: 85 },
    { name: "Negotiation", value: 78 },
    { name: "Strategy", value: 82 },
    { name: "Teamwork", value: 90 },
    { name: "Leadership", value: 75 }
  ]
};

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      setUserData(mockUserData);
      setLoading(false);
    }, 1000);
  }, [currentUser]);
  
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Left Column - Achievements */}
        <div className="profile-card achievements-card">
          <h2>Achievements</h2>
          <div className="achievements-list">
            {userData.achievements.map(achievement => (
              <div key={achievement.id} className="achievement-item">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <h2 className="recent-matches-title">Recent Matches</h2>
          <div className="recent-matches-list">
            {userData.recentMatches.map(match => (
              <div key={match.id} className="match-item">
                <div className="match-title">{match.title}</div>
                <div className={`match-status ${match.status.toLowerCase()}`}>
                  {match.status}
                </div>
                <div className="match-score">Score: {match.score}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Middle Column - 3D Avatar */}
        <div className="profile-card avatar-card">
          <div className="avatar-container">
            <Canvas 
              camera={{ position: [0, 0, 30], fov: 15 }}
              style={{ background: '#444444' }}
            >
              <color attach="background" args={['#444444']} />
              <ambientLight intensity={2.0} />
              <hemisphereLight intensity={1.5} color="#ffffff" groundColor="#bbbbff" />
              <directionalLight position={[0, 10, 5]} intensity={2} castShadow />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              <directionalLight position={[-5, 5, 5]} intensity={1.5} />
              <pointLight position={[0, 0, 3]} intensity={1.5} distance={10} />
              
              <Avatar position={[0, -1, 0]} />
              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>
          
          <div className="profile-info">
            <h2>{userData.email}</h2>
            <p className="profile-rank">Diplomatic Rank: {userData.rank}</p>
          </div>
        </div>
        
        {/* Right Column - Skill Stats */}
        <div className="profile-card skills-card">
          <h2>Skill Stats</h2>
          <div className="skills-list">
            {userData.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-value">{skill.value}</span>
                </div>
                <div className="skill-bar-container">
                  <div 
                    className="skill-bar" 
                    style={{ width: `${skill.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 