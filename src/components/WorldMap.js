import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsProvider';
import './WorldMap.css';

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px'
};

// Default center position
const center = {
  lat: 30,
  lng: 0
};

// Map options
const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  mapTypeId: 'satellite',
  mapId: '5a38e7bd98e9ca5c',
  styles: [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#000000' }, { lightness: 13 }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#0e1626' }]
    }
  ]
};

const WorldMap = ({ matches, selectedMatch, onSelectMatch }) => {
  // Use the Google Maps context instead of loading it directly
  const { isLoaded, loadError } = useGoogleMaps();
  
  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  // Handle map load
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    console.log("Map loaded successfully");
    
    // Add markers after map is loaded
    if (matches.length > 0) {
      addMarkers();
    }
  }, [matches]);

  // Add markers to the map
  const addMarkers = useCallback(() => {
    if (!mapRef.current || !window.google) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      marker.map = null;
    });
    markersRef.current = {};
    
    // Add new markers
    matches.forEach(match => {
      // Use standard markers instead of advanced markers
      const marker = new window.google.maps.Marker({
        position: {
          lat: match.region.lat,
          lng: match.region.lng
        },
        map: mapRef.current,
        title: match.title,
        animation: selectedMatch && selectedMatch.id === match.id ? 
          window.google.maps.Animation.BOUNCE : null,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: selectedMatch && selectedMatch.id === match.id ? '#ff5722' : '#ffdd00',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
          scale: selectedMatch && selectedMatch.id === match.id ? 8 : 6
        }
      });
      
      marker.addListener('click', () => {
        handleMarkerClick(match);
      });
      
      markersRef.current[match.id] = marker;
    });
  }, [matches, selectedMatch]);

  // Update markers when matches or selected match changes
  useEffect(() => {
    if (isLoaded && mapRef.current && matches.length > 0) {
      addMarkers();
    }
  }, [isLoaded, matches, selectedMatch, addMarkers]);

  // Fly to selected match
  useEffect(() => {
    if (mapRef.current && selectedMatch) {
      mapRef.current.panTo({
        lat: selectedMatch.region.lat,
        lng: selectedMatch.region.lng
      });
      mapRef.current.setZoom(4);
      setActiveMarker(selectedMatch.id);
    }
  }, [selectedMatch]);

  // Handle marker click
  const handleMarkerClick = (match) => {
    onSelectMatch(match);
    setActiveMarker(match.id);
  };

  if (loadError) {
    return (
      <div className="map-error">
        <p>Error loading maps: {loadError.message}</p>
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      {!isLoaded ? (
        <div className="map-loading">
          <p>Loading map...</p>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={2}
          options={options}
          onLoad={onMapLoad}
        >
          {activeMarker && (
            <InfoWindow
              position={{
                lat: matches.find(m => m.id === activeMarker).region.lat,
                lng: matches.find(m => m.id === activeMarker).region.lng
              }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="map-info-window">
                <h3>{matches.find(m => m.id === activeMarker).title}</h3>
                <p>{matches.find(m => m.id === activeMarker).description}</p>
                <div className="info-window-footer">
                  <span className={`status-badge ${matches.find(m => m.id === activeMarker).status.toLowerCase().replace(' ', '-')}`}>
                    {matches.find(m => m.id === activeMarker).status}
                  </span>
                  <span className="players-count">
                    {matches.find(m => m.id === activeMarker).players.team1.currentPlayers + 
                     matches.find(m => m.id === activeMarker).players.team2.currentPlayers} Players
                  </span>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default WorldMap; 