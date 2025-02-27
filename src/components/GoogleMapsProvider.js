import React, { createContext, useContext, useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

// Create a context for Google Maps
const GoogleMapsContext = createContext(null);

// Configuration for Google Maps
const libraries = ['places', 'marker'];
const googleMapsApiKey = 'AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU';
const mapIds = ['5a38e7bd98e9ca5c'];

// Create a provider component
export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey,
    libraries,
    mapIds
  });

  const value = { isLoaded, loadError };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

// Custom hook to use the Google Maps context
export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (context === null) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
}; 