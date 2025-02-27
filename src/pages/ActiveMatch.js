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
      options: [
        { id: 1, text: "Diplomatic Response", outcome: "Tensions reduced slightly." },
        { id: 2, text: "Military Response", outcome: "Tensions escalated significantly." },
        { id: 3, text: "Economic Sanctions", outcome: "Relations strained, economic impact on both sides." }
      ]
    },
    {
      id: 2,
      round: 2,
      title: "International Summit",
      description: "The UN has called for an emergency meeting to address the crisis.",
      options: [
        { id: 1, text: "Present Evidence", outcome: "International support increased." },
        { id: 2, text: "Boycott Summit", outcome: "International reputation damaged." },
        { id: 3, text: "Form Coalition", outcome: "New allies joined your cause." }
      ]
    },
    {
      id: 3,
      round: 3,
      title: "Cyber Attack",
      description: "Critical infrastructure has been compromised by a sophisticated cyber attack.",
      options: [
        { id: 1, text: "Counter Attack", outcome: "Pending..." },
        { id: 2, text: "Enhance Security", outcome: "Pending..." },
        { id: 3, text: "Public Accusation", outcome: "Pending..." }
      ]
    }
  ]
};

const ActiveMatch = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const team = searchParams.get('team');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userTeam, setUserTeam] = useState(team);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "Diplomat1", text: "We should focus on diplomatic solutions.", timestamp: "10:30 AM" },
    { id: 2, sender: "StrategyExpert", text: "I agree, but we need to maintain our military readiness.", timestamp: "10:32 AM" },
    { id: 3, sender: "GeoPlayer", text: "What's our stance on the border incident?", timestamp: "10:35 AM" }
  ]);
  
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      setScenario(mockScenario);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };
  
  const handleSubmitDecision = () => {
    if (!selectedOption) return;
    
    // This would be an API call in a real application
    alert(`Decision submitted: Option ${selectedOption}`);
    setSelectedOption(null);
  };
  
  const handleJoinTeam = (teamName) => {
    // Disable team joining functionality for now
    // setUserTeam(teamName);
    console.log("Team joining is currently disabled");
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      sender: currentUser.username,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessageInput('');
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading scenario...</p>
      </div>
    );
  }
  
  const currentEvent = scenario.events.find(event => event.round === scenario.currentRound);
  
  return (
    <div className="match-container">
      <div className="match-header">
        <h1>{scenario.title}</h1>
        <div className="match-progress">
          <span>Round {scenario.currentRound} of {scenario.totalRounds}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(scenario.currentRound / scenario.totalRounds) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="match-content">
        <div className="scenario-description">
          <h2>Current Situation</h2>
          <p>{scenario.description}</p>
          
          {currentEvent && (
            <div className="current-event">
              <h3>{currentEvent.title}</h3>
              <p>{currentEvent.description}</p>
              
              <div className="event-options">
                <h4>Your Options:</h4>
                {currentEvent.options.map(option => (
                  <div 
                    key={option.id}
                    className={`option-card ${selectedOption === option.id ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="option-text">{option.text}</div>
                    <div className="option-outcome">
                      Outcome: {option.outcome}
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="btn-submit-decision"
                disabled={!selectedOption}
                onClick={handleSubmitDecision}
              >
                Submit Decision
              </button>
            </div>
          )}
        </div>
        
        <div className="match-sidebar">
          <div className="teams-overview">
            <h3>Teams</h3>
            
            <div className="team-cards">
              <div className="team-card">
                <h4>{Object.keys(scenario.teams)[0]}</h4>
                <p>Players: {scenario.teams[Object.keys(scenario.teams)[0]].members.length}/20</p>
                <button 
                  className="btn-join disabled" 
                  onClick={() => {}} 
                  disabled={true}
                >
                  Join Team (Disabled)
                </button>
              </div>
              
              <div className="team-card">
                <h4>{Object.keys(scenario.teams)[1]}</h4>
                <p>Players: {scenario.teams[Object.keys(scenario.teams)[1]].members.length}/20</p>
                <button 
                  className="btn-join disabled" 
                  onClick={() => {}} 
                  disabled={true}
                >
                  Join Team (Disabled)
                </button>
              </div>
            </div>
          </div>
          
          <div className="team-chat">
            <h3>Team Chat</h3>
            <div className="chat-messages">
              {chatMessages.map(message => (
                <div key={message.id} className={`chat-message ${message.sender === currentUser.username ? 'own-message' : ''}`}>
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">{message.timestamp}</div>
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
          
          <div className="social-sharing">
            <h3>Share Your Achievements</h3>
            <div className="sharing-buttons">
              <button className="share-button twitter">Share on Twitter</button>
              <button className="share-button facebook">Share on Facebook</button>
              <button className="share-button discord">Share on Discord</button>
            </div>
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