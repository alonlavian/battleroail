import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock signup function
  async function signup(email, password, username) {
    // This would normally call an API
    const user = { uid: Date.now().toString(), email, username };
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }

  // Modified login function to always succeed
  async function login(email, password) {
    // Create a user object with the provided email or use a default one
    const user = { 
      uid: Date.now().toString(), 
      email: email || 'test@example.com', 
      username: email ? email.split('@')[0] : 'testuser' 
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }

  // Mock logout function
  async function logout() {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }

  // Mock update profile function
  async function updateUserProfile(data) {
    const user = { ...currentUser, ...data };
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }

  useEffect(() => {
    // Check for user in localStorage on app initialization
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user || null);
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 