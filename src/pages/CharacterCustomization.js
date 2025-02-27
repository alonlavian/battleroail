import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './CharacterCustomization.css';

// Mock data for customization options
const customizationOptions = {
  hairstyle: [
    { id: 1, name: "Default", thumbnail: "/assets/customization/hair_1.png" },
    { id: 2, name: "Short", thumbnail: "/assets/customization/hair_2.png" },
    { id: 3, name: "Long", thumbnail: "/assets/customization/hair_3.png" },
  ],
  tattoos: [
    { id: 1, name: "None", thumbnail: "/assets/customization/tattoo_1.png" },
    { id: 2, name: "Arm", thumbnail: "/assets/customization/tattoo_2.png" },
    { id: 3, name: "Full", thumbnail: "/assets/customization/tattoo_3.png" },
  ],
  // Add similar arrays for sleeves, boots, shirt colors, vest, helmet, pants color, face paint, scarf
};

const CharacterCustomization = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [selectedOptions, setSelectedOptions] = useState({
    hairstyle: 1,
    tattoos: 1,
    sleeves: 1,
    boots: 1,
    shirtColors: 1,
    vest: 1,
    helmet: 1,
    pantsColor: 1,
    facePaint: 1,
    scarf: 1,
  });
  
  const [activeCategory, setActiveCategory] = useState('hairstyle');
  
  const handleOptionSelect = (category, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [category]: optionId,
    });
  };
  
  const handleSaveCustomization = async () => {
    try {
      await updateUserProfile({ customization: selectedOptions });
      navigate('/profile');
    } catch (error) {
      console.error('Failed to save customization:', error);
    }
  };
  
  return (
    <div className="customization-container">
      <div className="customization-header">
        <h1>CHARACTER CUSTOMIZATION</h1>
      </div>
      
      <div className="customization-content">
        <div className="customization-sidebar left">
          {Object.keys(customizationOptions).slice(0, 5).map((category, index) => (
            <div 
              key={category}
              className={`category-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              <span className="category-number">#{index + 1}</span>
              <span className="category-name">{category.toUpperCase()}</span>
              <span className="category-icon">i</span>
            </div>
          ))}
        </div>
        
        <div className="character-preview">
          {/* Character 3D model would be rendered here */}
          <div className="character-model">
            {/* This would be replaced with a proper 3D rendering */}
            <div className="character-placeholder">
              <img src="/assets/character_preview.png" alt="Character Preview" />
            </div>
          </div>
        </div>
        
        <div className="customization-sidebar right">
          {Object.keys(customizationOptions).slice(5).map((category, index) => (
            <div 
              key={category}
              className={`category-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              <span className="category-number">#{index + 6}</span>
              <span className="category-name">{category.toUpperCase()}</span>
              <span className="category-icon">i</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="options-container">
        {customizationOptions[activeCategory]?.map(option => (
          <div 
            key={option.id}
            className={`option-item ${selectedOptions[activeCategory] === option.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(activeCategory, option.id)}
          >
            <img src={option.thumbnail} alt={option.name} />
          </div>
        ))}
      </div>
      
      <div className="customization-footer">
        <button className="btn-info">MORE INFO</button>
        <button className="btn-save" onClick={handleSaveCustomization}>SAVE</button>
        <button className="btn-back" onClick={() => navigate('/profile')}>BACK</button>
      </div>
    </div>
  );
};

export default CharacterCustomization; 