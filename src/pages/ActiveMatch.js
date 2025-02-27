import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ActiveMatch.css';

// Mock data for match scenario
const mockScenario = {
  id: 1,
  title: "Ukraine-Russia Crisis",
  currentRound: 3,
  totalRounds: 10,
  description: "Diplomatic relations are deteriorating. Both sides are mobilizing troops at the border.",
  teams: {
    "Ukraine": {
      members: [
        { id: 1, username: "Diplomat1", score: 230, role: "Lead Negotiator" },
        { id: 2, username: "StrategyExpert", score: 185, role: "Military Advisor" },
        // more members...
      ],
      resources: {
        military: 65,
        economic: 48,
        diplomatic: 72
      }
    },
    "Russia": {
      members: [
        { id: 3, username: "GeoPlayer", score: 210, role: "President" },
        { id: 4, username: "TacticalMind", score: 195, role: "Chief of Military" },
        // more members...
      ],
      resources: {
        military: 80,
        economic: 70,
        diplomatic: 55
      }
    }
  },
  events: [
    {
      id: 1,
      round: 1,
      title: "Border Incident",
      description: "Military units from both sides engaged in a skirmish at the border.",
      timestamp: "Today"
    },
    {
      id: 2,
      round: 2,
      title: "Cyber Attack",
      description: "Critical infrastructure has been compromised by a sophisticated cyber attack.",
      timestamp: "Yesterday"
    },
    {
      id: 3,
      round: 2,
      title: "Diplomatic Tensions",
      description: "Diplomatic relations are deteriorating. Both sides are mobilizing troops at the border.",
      timestamp: "A week ago"
    }
  ],
  actions: [
    {
      id: 1,
      title: "A drone attack as retaliation",
      votes: 60
    },
    {
      id: 2,
      title: "Call for a ceasefire",
      votes: 5
    },
    {
      id: 3,
      title: "Meet the US president",
      votes: 35
    }
  ],
  scores: {
    categories: [
      { name: "Battlefield", ukraine: 40, russia: 60 },
      { name: "Economy", ukraine: 45, russia: 55 },
      { name: "PR", ukraine: 15, russia: 85 }
    ]
  }
};

const ActiveMatch = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const team = searchParams.get('team');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      setScenario(mockScenario);
      setLoading(false);
      
      // Mock chat messages
      setChatMessages([
        { id: 1, sender: "user1", text: "What's our next move?", timestamp: "10:15 AM" },
        { id: 2, sender: "alonlavian", text: "I think we should focus on diplomatic solutions", timestamp: "10:17 AM" },
        { id: 3, sender: currentUser?.username || "You", text: "Agreed, military action could escalate things", timestamp: "10:20 AM" },
      ]);
    }, 1000);
  }, [id, team, currentUser]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() === '') return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      sender: currentUser?.username || "You",
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessageInput('');
  };
  
  if (loading) {
    return (
      <div className="match-container">
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading scenario data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="match-container">
      <div className="match-header">
        <h1>{scenario.title}</h1>
        <div className="match-status">
          Round {scenario.currentRound} of {scenario.totalRounds}
        </div>
      </div>
      
      <div className="match-grid">
        {/* Live Stream of Events */}
        <div className="match-panel events-panel">
          <h2>Live stream of events</h2>
          <div className="events-timeline">
            {scenario.events.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-timestamp">{event.timestamp}</div>
                <div className="event-content">
                  <div className="event-title">{event.title}</div>
                  <div className="event-description">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Score Comparison */}
        <div className="match-panel score-panel">
          <h2>Score</h2>
          <div className="score-comparison">
            <div className="team-column ukraine">
              <div className="team-header">Ukraine</div>
            </div>
            <div className="team-column russia">
              <div className="team-header">Russia</div>
            </div>
            
            {scenario.scores.categories.map((category, index) => (
              <React.Fragment key={index}>
                <div className="score-row">
                  <div className="score-bar-wrapper ukraine">
                    <div 
                      className="score-bar ukraine" 
                      style={{ width: `${category.ukraine}%` }}
                    ></div>
                  </div>
                  <div className="category-label">{category.name}</div>
                  <div className="score-bar-wrapper russia">
                    <div 
                      className="score-bar russia" 
                      style={{ width: `${category.russia}%` }}
                    ></div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Group Chat */}
        <div className="match-panel chat-panel">
          <h2>Group chat</h2>
          <div className="chat-messages">
            {chatMessages.map(message => (
              <div key={message.id} className={`chat-message ${message.sender === currentUser?.username ? 'own-message' : ''}`}>
                <div className="message-sender">@{message.sender}</div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
        
        {/* Available Actions */}
        <div className="match-panel actions-panel">
          <h2>Set of tools</h2>
          <div className="actions-list">
            {scenario.actions.map(action => (
              <div key={action.id} className="action-item">
                <div className="action-title">{action.id}. {action.title}</div>
                <div className="action-votes">
                  <div className="vote-bar" style={{ width: `${action.votes}%` }}></div>
                  <div className="vote-percentage">{action.votes}%</div>
                  <div className="vote-number">{action.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="match-footer">
        <button className="btn-leave" onClick={() => navigate('/matches')}>
          Leave Match
        </button>
      </div>
    </div>
  );
};

export default ActiveMatch; 