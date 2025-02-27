import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from '../components/WorldMap';
import './AvailableMatches.css';

// Mock data for available matches
const mockMatches = [
  {
    id: 1,
    title: "Ukraine-Russia Crisis",
    description: "Join the diplomatic efforts to resolve the ongoing conflict.",
    players: {
      team1: { name: "Ukraine", currentPlayers: 12, maxPlayers: 20 },
      team2: { name: "Russia", currentPlayers: 15, maxPlayers: 20 }
    },
    region: { lat: 49.4871968, lng: 31.2718321 },
    difficulty: "Hard",
    status: "In Progress",
    image: "https://source.unsplash.com/random/400x200/?ukraine,russia"
  },
  {
    id: 2,
    title: "South China Sea Dispute",
    description: "Navigate territorial claims and military tensions in Southeast Asia.",
    players: {
      team1: { name: "China", currentPlayers: 8, maxPlayers: 15 },
      team2: { name: "ASEAN Coalition", currentPlayers: 10, maxPlayers: 15 }
    },
    region: { lat: 12.0, lng: 115.0 },
    difficulty: "Medium",
    status: "Open",
    image: "https://source.unsplash.com/random/400x200/?china,sea"
  },
  {
    id: 3,
    title: "Middle East Peace Process",
    description: "Work towards a lasting peace agreement in this volatile region.",
    players: {
      team1: { name: "Israel", currentPlayers: 7, maxPlayers: 10 },
      team2: { name: "Palestine", currentPlayers: 6, maxPlayers: 10 }
    },
    region: { lat: 31.5, lng: 34.8 },
    difficulty: "Expert",
    status: "Open",
    image: "https://source.unsplash.com/random/400x200/?middle,east"
  },
  {
    id: 4,
    title: "North Korean Nuclear Crisis",
    description: "Defuse tensions on the Korean peninsula through diplomacy or force.",
    players: {
      team1: { name: "North Korea", currentPlayers: 5, maxPlayers: 10 },
      team2: { name: "United Nations", currentPlayers: 9, maxPlayers: 15 }
    },
    region: { lat: 40.3399, lng: 127.5101 },
    difficulty: "Hard",
    status: "Open",
    image: "https://source.unsplash.com/random/400x200/?korea"
  },
  {
    id: 5,
    title: "Venezuelan Political Crisis",
    description: "Address the humanitarian and political crisis in Venezuela.",
    players: {
      team1: { name: "Government", currentPlayers: 4, maxPlayers: 10 },
      team2: { name: "Opposition", currentPlayers: 6, maxPlayers: 10 }
    },
    region: { lat: 6.4238, lng: -66.5897 },
    difficulty: "Medium",
    status: "Open",
    image: "https://source.unsplash.com/random/400x200/?venezuela"
  }
];

const AvailableMatches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      setMatches(mockMatches);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
  };
  
  const handleJoinMatch = (matchId, team) => {
    navigate(`/match/${matchId}?team=${team}`);
  };
  
  return (
    <div className="matches-container">
      <div className="matches-header">
        <h1>Available Crisis Scenarios</h1>
        <p>Select a scenario from the map or list below to join</p>
      </div>
      
      <div className="matches-content">
        <div className="map-section" style={{ height: '400px', position: 'relative' }}>
          {!loading && (
            <WorldMap 
              matches={matches} 
              selectedMatch={selectedMatch}
              onSelectMatch={handleMatchSelect}
            />
          )}
          {loading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p>Loading scenarios...</p>
            </div>
          )}
        </div>
        
        <div className="matches-list-section">
          {loading ? (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p>Loading scenarios...</p>
            </div>
          ) : selectedMatch ? (
            <div className="match-details">
              <div className="match-header">
                <h2>{selectedMatch.title}</h2>
                <span className={`status-badge ${selectedMatch.status.toLowerCase().replace(' ', '-')}`}>
                  {selectedMatch.status}
                </span>
              </div>
              
              <div className="match-image">
                <img src={selectedMatch.image} alt={selectedMatch.title} />
              </div>
              
              <div className="match-description">
                <p>{selectedMatch.description}</p>
              </div>
              
              <div className="match-info">
                <div className="info-item">
                  <span className="info-label">Region:</span>
                  <span className="info-value">{selectedMatch.region.lat.toFixed(2)}, {selectedMatch.region.lng.toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Difficulty:</span>
                  <span className={`info-value difficulty-${selectedMatch.difficulty.toLowerCase()}`}>
                    {selectedMatch.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="match-teams">
                <h3>Teams</h3>
                <div className="teams-grid">
                  <div className="team-info">
                    <h4>{selectedMatch.players.team1.name}</h4>
                    <div className="team-players">
                      <span className="current-players">{selectedMatch.players.team1.currentPlayers}</span>
                      <span className="player-separator">/</span>
                      <span className="max-players">{selectedMatch.players.team1.maxPlayers}</span>
                      <span className="players-label">Players</span>
                    </div>
                    <button 
                      className="btn-join-team"
                      onClick={() => handleJoinMatch(selectedMatch.id, selectedMatch.players.team1.name)}
                    >
                      Join {selectedMatch.players.team1.name}
                    </button>
                  </div>
                  
                  <div className="team-info">
                    <h4>{selectedMatch.players.team2.name}</h4>
                    <div className="team-players">
                      <span className="current-players">{selectedMatch.players.team2.currentPlayers}</span>
                      <span className="player-separator">/</span>
                      <span className="max-players">{selectedMatch.players.team2.maxPlayers}</span>
                      <span className="players-label">Players</span>
                    </div>
                    <button 
                      className="btn-join-team"
                      onClick={() => handleJoinMatch(selectedMatch.id, selectedMatch.players.team2.name)}
                    >
                      Join {selectedMatch.players.team2.name}
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                className="btn-back"
                onClick={() => setSelectedMatch(null)}
              >
                Back to List
              </button>
            </div>
          ) : (
            <div className="matches-grid">
              {matches.map(match => (
                <div 
                  key={match.id} 
                  className="match-card"
                  onClick={() => handleMatchSelect(match)}
                >
                  <div className="match-card-image">
                    <img src={match.image} alt={match.title} />
                    <span className={`match-status-badge ${match.status.toLowerCase().replace(' ', '-')}`}>
                      {match.status}
                    </span>
                  </div>
                  <div className="match-card-content">
                    <h3>{match.title}</h3>
                    <p className="match-card-description">{match.description}</p>
                    <div className="match-card-footer">
                      <span className={`difficulty-badge difficulty-${match.difficulty.toLowerCase()}`}>
                        {match.difficulty}
                      </span>
                      <span className="players-count">
                        {match.players.team1.currentPlayers + match.players.team2.currentPlayers} Players
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableMatches; 