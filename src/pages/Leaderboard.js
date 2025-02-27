import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

// Mock leaderboard data
const mockLeaderboardData = [
  { rank: 1, username: "MasterDiplomat", score: 9850, matches: 32, winRate: "78%", avatar: "https://source.unsplash.com/random/40x40/?person,face,1" },
  { rank: 2, username: "GeoStrategist", score: 8720, matches: 29, winRate: "72%", avatar: "https://source.unsplash.com/random/40x40/?person,face,2" },
  { rank: 3, username: "PeaceMaker", score: 8150, matches: 27, winRate: "70%", avatar: "https://source.unsplash.com/random/40x40/?person,face,3" },
  { rank: 4, username: "GlobalLeader", score: 7920, matches: 30, winRate: "63%", avatar: "https://source.unsplash.com/random/40x40/?person,face,4" },
  { rank: 5, username: "NegotiationPro", score: 7710, matches: 25, winRate: "68%", avatar: "https://source.unsplash.com/random/40x40/?person,face,5" },
  { rank: 6, username: "Diplomat1", score: 7280, matches: 28, winRate: "61%", avatar: "https://source.unsplash.com/random/40x40/?person,face,6" },
  { rank: 7, username: "StrategyExpert", score: 6950, matches: 24, winRate: "58%", avatar: "https://source.unsplash.com/random/40x40/?person,face,7" },
  { rank: 8, username: "WorldPlayer", score: 6740, matches: 26, winRate: "54%", avatar: "https://source.unsplash.com/random/40x40/?person,face,8" },
  { rank: 9, username: "GeoPolitical", score: 6520, matches: 22, winRate: "59%", avatar: "https://source.unsplash.com/random/40x40/?person,face,9" },
  { rank: 10, username: "CrisisManager", score: 6320, matches: 20, winRate: "65%", avatar: "https://source.unsplash.com/random/40x40/?person,face,10" },
];

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('global'); // 'global', 'monthly', 'weekly'

  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      setLeaderboardData(mockLeaderboardData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setLoading(true);
    
    // This would be an API call with different params in a real application
    setTimeout(() => {
      // For demo purposes, just shuffle the array a bit for different filters
      if (newFilter === 'monthly') {
        const shuffled = [...mockLeaderboardData].sort(() => 0.5 - Math.random());
        setLeaderboardData(shuffled.map((item, index) => ({ ...item, rank: index + 1 })));
      } else if (newFilter === 'weekly') {
        const shuffled = [...mockLeaderboardData].sort(() => 0.5 - Math.random());
        setLeaderboardData(shuffled.map((item, index) => ({ ...item, rank: index + 1 })));
      } else {
        setLeaderboardData(mockLeaderboardData);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>GLOBAL LEADERBOARD</h1>
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'global' ? 'active' : ''}`}
            onClick={() => handleFilterChange('global')}
          >
            All Time
          </button>
          <button 
            className={`filter-tab ${filter === 'monthly' ? 'active' : ''}`}
            onClick={() => handleFilterChange('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`filter-tab ${filter === 'weekly' ? 'active' : ''}`}
            onClick={() => handleFilterChange('weekly')}
          >
            Weekly
          </button>
        </div>
      </div>
      
      <div className="leaderboard-content">
        {loading ? (
          <div className="loading-spinner">Loading leaderboard data...</div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Matches</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((player) => (
                <tr key={player.rank}>
                  <td className="rank-cell">
                    {player.rank <= 3 ? (
                      <div className={`rank-medal rank-${player.rank}`}>
                        {player.rank}
                      </div>
                    ) : (
                      player.rank
                    )}
                  </td>
                  <td className="player-cell">
                    <img src={player.avatar} alt={player.username} className="player-avatar" />
                    {player.username}
                  </td>
                  <td className="score-cell">{player.score}</td>
                  <td className="matches-cell">{player.matches}</td>
                  <td className="winrate-cell">{player.winRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 