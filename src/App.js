import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleMapsProvider } from './components/GoogleMapsProvider';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AvailableMatches from './pages/AvailableMatches';
import ActiveMatch from './pages/ActiveMatch';
import islandMap from './assets/island-map.jpg';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <GoogleMapsProvider>
        <Router>
          <div className="app">
            <div className="global-background" style={{ backgroundImage: `url(${islandMap})` }}>
              <div className="global-overlay"></div>
            </div>
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/customize" element={<Navigate to="/profile" replace />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/matches" element={
                  <PrivateRoute>
                    <AvailableMatches />
                  </PrivateRoute>
                } />
                <Route path="/match/:id" element={
                  <PrivateRoute>
                    <ActiveMatch />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </GoogleMapsProvider>
    </AuthProvider>
  );
}

export default App; 