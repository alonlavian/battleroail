import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

// Character model component using the GLB model
function CharacterModel() {
  const group = useRef();
  
  // Load the 3D model from the public folder
  const { scene, nodes, materials } = useGLTF('/models/character.glb');
  
  // Clone the scene to avoid modifying the cached original
  const model = scene.clone();
  
  // Gentle rotation animation
  useFrame(() => {
    if (group.current) {
      // Smooth rotation
      const targetRotation = group.current.rotation.y + 0.002;
      group.current.rotation.y += (targetRotation - group.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]} scale={[1.5, 1.5, 1.5]}>
      <primitive object={model} />
    </group>
  );
}

// Fallback if 3D model fails to load
function FallbackModel() {
  const group = useRef();
  
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group}>
      {/* Basic character model using primitives */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.5, 2, 32]} />
        <meshStandardMaterial color="white" roughness={0.7} metalness={0.1} />
      </mesh>
      
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#f8d5c2" roughness={0.5} metalness={0.1} />
      </mesh>
      
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 2, 32]} />
        <meshStandardMaterial color="blue" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}

// Scene setup
function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 10, 7.5]} angle={0.15} penumbra={1} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      <Environment preset="city" />
      <Suspense fallback={<FallbackModel />}>
        <CharacterModel />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

const Profile = () => {
  const { currentUser } = useAuth();
  
  // Mock stats data
  const stats = {
    diplomacy: 78,
    strategy: 65,
    leadership: 82,
    negotiation: 70,
    teamwork: 85
  };
  
  // Mock recent matches
  const recentMatches = [
    { id: 1, title: "Ukraine-Russia Crisis", result: "Victory", score: 230, date: "2023-05-15" },
    { id: 2, title: "Middle East Peace Negotiations", result: "Ongoing", score: 185, date: "2023-05-12" },
    { id: 3, title: "South China Sea Dispute", result: "Defeat", score: 120, date: "2023-05-08" }
  ];
  
  // Mock achievements
  const achievements = [
    { 
      id: 1, 
      name: "Master Negotiator", 
      description: "Successfully resolved 5 diplomatic crises", 
      image: "https://source.unsplash.com/random/100x100/?diplomacy,handshake" 
    },
    { 
      id: 2, 
      name: "Team Player", 
      description: "Participated in 10 team actions", 
      image: "https://source.unsplash.com/random/100x100/?team,collaboration" 
    },
    { 
      id: 3, 
      name: "Strategic Mind", 
      description: "Achieved victory in a hard difficulty scenario", 
      image: "https://source.unsplash.com/random/100x100/?strategy,chess" 
    }
  ];

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Character and User Info */}
        <div className="profile-card character-card">
          <div className="avatar-container">
            <Canvas shadows>
              <Scene />
            </Canvas>
          </div>
          <div className="user-info">
            <h2>{currentUser?.email || "User"}</h2>
            <p>Diplomatic Rank: Senior Negotiator</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="profile-card stats-card">
          <h3>Skill Stats</h3>
          <div className="stats-grid">
            {Object.entries(stats).map(([stat, value]) => (
              <div key={stat} className="stat-item">
                <div className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                <div className="stat-bar-container">
                  <div className="stat-bar" style={{ width: `${value}%` }}></div>
                </div>
                <div className="stat-value">{value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Matches */}
        <div className="profile-card matches-card">
          <h3>Recent Matches</h3>
          <div className="matches-list">
            {recentMatches.map(match => (
              <div key={match.id} className="match-item">
                <div className="match-title">{match.title}</div>
                <div className={`match-result ${match.result.toLowerCase()}`}>{match.result}</div>
                <div className="match-score">Score: {match.score}</div>
              </div>
            ))}
          </div>
          <Link to="/matches" className="view-all-button">Find New Matches</Link>
        </div>
        
        {/* Achievements */}
        <div className="profile-card achievements-card">
          <h3>Achievements</h3>
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div key={achievement.id} className="achievement-item">
                <div className="achievement-icon">
                  <img src={achievement.image} alt={achievement.name} />
                </div>
                <div className="achievement-info">
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-description">{achievement.description}</div>
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