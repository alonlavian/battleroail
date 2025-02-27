import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function Avatar(props) {
  const group = useRef();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  
  // Use the useGLTF hook to load the GLB file
  const { scene, nodes, materials, animations } = useGLTF('/models/character.glb', 
    // Progress callback
    (xhr) => {
      const progress = (xhr.loaded / xhr.total) * 100;
      setLoadingProgress(progress);
      console.log(`${progress.toFixed(2)}% loaded`);
    },
    // Error callback
    (error) => {
      console.error('Error loading GLB model:', error);
      setError(`Failed to load model: ${error.message}`);
    }
  );
  
  // Clone the scene to avoid issues with multiple instances
  const model = scene.clone();
  
  useEffect(() => {
    console.log("GLB model loaded:", model);
    
    if (model) {
      // Scale the model down dramatically to fit in the window
      model.scale.set(0.005, 0.005, 0.005);
      
      // Center the model and adjust position
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.x = -center.x;
      model.position.y = -center.y - 0.1; // Minimal vertical offset for tiny model
      model.position.z = -center.z;
      
      // Enhance materials if needed
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // If needed, you can enhance the materials here
          if (child.material) {
            // Make materials double-sided
            child.material.side = THREE.DoubleSide;
            
            // Increase material brightness if needed
            child.material.emissive = new THREE.Color(0x222222);
            child.material.emissiveIntensity = 0.2;
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (model) {
        model.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [model, nodes, materials]);
  
  // Gentle rotation animation
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  // Check if we have the model or if there was an error
  const hasError = error !== null;

  return (
    <group ref={group} {...props}>
      {!hasError ? (
        // Render the loaded model
        <primitive object={model} />
      ) : (
        // Fallback avatar with error message
        <>
          {/* Basic avatar shape */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.5, 2, 32]} />
            <meshBasicMaterial color="#2a6041" />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color="#f8d5c2" />
          </mesh>
          <mesh position={[0, -1.5, 0]}>
            <cylinderGeometry args={[0.5, 0.4, 2, 32]} />
            <meshBasicMaterial color="#3a5795" />
          </mesh>
          
          {/* Loading progress indicator */}
          {loadingProgress > 0 && loadingProgress < 100 && (
            <group position={[0, 3, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2, 0.2, 0.1]} />
                <meshBasicMaterial color="#444444" />
              </mesh>
              <mesh position={[-(1 - loadingProgress/100), 0, 0.05]} scale={[loadingProgress/100, 1, 1]}>
                <boxGeometry args={[2, 0.2, 0.1]} />
                <meshBasicMaterial color="#4CAF50" />
              </mesh>
            </group>
          )}
          
          {/* Error indicator */}
          {hasError && (
            <group position={[0, 3, 0]}>
              <mesh>
                <boxGeometry args={[2, 0.5, 0.1]} />
                <meshBasicMaterial color="#FF0000" />
              </mesh>
            </group>
          )}
        </>
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/character.glb'); 