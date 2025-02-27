import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import './Customize.css';

// Character model component using a pre-made 3D model
function CharacterModel({ customization }) {
  const group = useRef();
  
  // Load a 3D model - you'll need to add this file to your public folder
  // For testing, you can use a free model from Sketchfab or Mixamo
  const { scene, nodes, materials } = useGLTF('/models/character.glb');
  
  // Clone the scene to avoid modifying the cached original
  const model = scene.clone();
  
  useEffect(() => {
    // Apply customizations to the model
    if (model) {
      // Find the materials in the model and modify them based on customization
      model.traverse((object) => {
        if (object.isMesh) {
          // Example: Change shirt color
          if (object.name.includes('Shirt') || object.name.includes('Torso')) {
            const shirtColors = ["white", "black", "blue", "green", "red"];
            object.material.color.set(shirtColors[customization.shirtColor]);
          }
          
          // Example: Change pants color
          if (object.name.includes('Pants') || object.name.includes('Legs')) {
            const pantsColors = ["black", "blue", "#d2b48c", "#4b5320", "gray"];
            object.material.color.set(pantsColors[customization.pantsColor]);
          }
          
          // Hide/show vest based on selection
          if (object.name.includes('Vest')) {
            object.visible = customization.vest > 0;
            if (object.visible) {
              const vestColors = ["#2c3e50", "#34495e", "#7f8c8d"];
              object.material.color.set(vestColors[customization.vest - 1]);
            }
          }
          
          // Apply other customizations similarly
        }
      });
    }
  }, [model, customization]);
  
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
function FallbackModel({ customization }) {
  const group = useRef();
  
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group}>
      {/* Enhanced basic geometry with better materials */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.5, 2, 32]} />
        <meshStandardMaterial 
          color={customization.shirtColor === 0 ? "white" : 
                 customization.shirtColor === 1 ? "black" :
                 customization.shirtColor === 2 ? "blue" :
                 customization.shirtColor === 3 ? "green" : "red"}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Head with better skin material */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#f8d5c2" 
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      
      {/* Enhanced hair */}
      {customization.hairstyle > 0 && (
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color={customization.hairstyle === 1 ? "brown" : 
                   customization.hairstyle === 2 ? "black" :
                   customization.hairstyle === 3 ? "#f2a154" : "#4a2c2a"}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      )}
      
      {/* Enhanced vest */}
      {customization.vest > 0 && (
        <mesh position={[0, 0.2, 0.5]}>
          <boxGeometry args={[1.2, 1.5, 0.2]} />
          <meshStandardMaterial 
            color={customization.vest === 1 ? "#2c3e50" : 
                   customization.vest === 2 ? "#34495e" : "#7f8c8d"}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      )}
      
      {/* Enhanced legs */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 2, 32]} />
        <meshStandardMaterial 
          color={customization.pantsColor === 0 ? "black" : 
                 customization.pantsColor === 1 ? "blue" :
                 customization.pantsColor === 2 ? "#d2b48c" :
                 customization.pantsColor === 3 ? "#4b5320" : "gray"}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

// Enhanced scene setup
function Scene({ customization }) {
  return (
    <>
      {/* Better camera positioning */}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
      
      {/* Enhanced lighting */}
      <ambientLight intensity={0.4} />
      <spotLight 
        position={[5, 10, 7.5]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      
      {/* Add environment for reflections */}
      <Environment preset="city" />
      
      {/* Character model with error handling */}
      <Suspense fallback={<FallbackModel customization={customization} />}>
        <CharacterModel customization={customization} />
      </Suspense>
      
      {/* Controls with limits */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI/3}
        maxPolarAngle={Math.PI/1.5}
      />
    </>
  );
}

const Customize = () => {
  // Default character options
  const [character, setCharacter] = useState({
    hairstyle: 0,
    facePaint: 0,
    tattoos: 0,
    sleeves: 0,
    boots: 0,
    shirtColor: 0,
    pantsColor: 0,
    vest: 0,
    helmet: 0,
    scarf: 0
  });

  // Options for each customization category
  const options = {
    hairstyle: ['Short', 'Medium', 'Long', 'Buzz Cut', 'Ponytail'],
    facePaint: ['None', 'War Paint', 'Tactical', 'Camo'],
    tattoos: ['None', 'Sleeve', 'Minimal', 'Full Body'],
    sleeves: ['Full', 'Short', 'Rolled Up', 'None'],
    boots: ['Combat', 'Tactical', 'Casual', 'Formal'],
    shirtColor: ['White', 'Black', 'Blue', 'Green', 'Red'],
    pantsColor: ['Black', 'Blue', 'Khaki', 'Camo', 'Gray'],
    vest: ['None', 'Tactical', 'Formal', 'Utility'],
    helmet: ['None', 'Cap', 'Beret', 'Tactical'],
    scarf: ['None', 'Tactical', 'Formal', 'Bandana']
  };

  const handleOptionChange = (category, value) => {
    setCharacter({
      ...character,
      [category]: value
    });
  };

  const handleReset = () => {
    setCharacter({
      hairstyle: 0,
      facePaint: 0,
      tattoos: 0,
      sleeves: 0,
      boots: 0,
      shirtColor: 0,
      pantsColor: 0,
      vest: 0,
      helmet: 0,
      scarf: 0
    });
  };

  const renderCustomizationOptions = (category) => {
    return (
      <div className="customization-option">
        <h3>{category.toUpperCase()}</h3>
        <div className="option-buttons">
          {options[category].map((option, index) => (
            <button
              key={index}
              className={character[category] === index ? 'selected' : ''}
              onClick={() => handleOptionChange(category, index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="customize-container">
      <div className="customize-header">
        <h1>CHARACTER CUSTOMIZATION</h1>
      </div>
      
      <div className="customize-content">
        <div className="character-preview">
          <div className="character-model">
            <Canvas shadows>
              <Scene customization={character} />
            </Canvas>
          </div>
          <div className="preview-controls">
            <button className="rotate-btn">Rotate Left</button>
            <button className="rotate-btn">Rotate Right</button>
          </div>
        </div>
        
        <div className="customization-options">
          <div className="options-scroll">
            {renderCustomizationOptions('hairstyle')}
            {renderCustomizationOptions('facePaint')}
            {renderCustomizationOptions('tattoos')}
            {renderCustomizationOptions('sleeves')}
            {renderCustomizationOptions('boots')}
            {renderCustomizationOptions('shirtColor')}
            {renderCustomizationOptions('pantsColor')}
            {renderCustomizationOptions('vest')}
            {renderCustomizationOptions('helmet')}
            {renderCustomizationOptions('scarf')}
          </div>
          
          <div className="customization-actions">
            <button className="btn-secondary" onClick={handleReset}>Reset</button>
            <Link to="/profile" className="btn-primary">Save Changes</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize; 