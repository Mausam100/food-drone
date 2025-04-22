import React from 'react';
import { Text } from '@react-three/drei';

// StartPoint component: Represents the starting point in the scene
const StartPoint = ({ position, height = 5, radius = 2, color = "#00c3ae" }) => {
  return (
    <mesh position={position}>
      {/* Cylinder geometry for the start point */}
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.3} // Adjust transparency
        emissive={color} // Add glowing effect
        emissiveIntensity={0.5} // Adjust glow intensity
      />
    </mesh>
  );
};

// EndPoint component: Represents the ending point in the scene
const EndPoint = ({ position, color = "#ca0048" }) => {
  return (
    <group position={position}>
      {/* Outer floating ring */}
      <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <torusGeometry args={[1.4, 0.15, 16, 72]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.6} // Adjust transparency
          emissive={"red"} // Add glowing effect
          emissiveIntensity={0.8} // Adjust glow intensity
          shininess={1} // Adjust shininess
        />
      </mesh>
    </group>
  );
};

// CheckpointCylinder component: Represents a checkpoint in the scene
const CheckpointCylinder = ({ position, height = 5, radius = 2, color = "#00adca" }) => {
  return (
    <group position={position}>
      {/* Outer floating ring */}
      <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <torusGeometry args={[1.4, 0.15, 16, 72]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.9} // Adjust transparency
          emissive={color} // Add glowing effect
          emissiveIntensity={0.8} // Adjust glow intensity
          shininess={1} // Adjust shininess
        />
      </mesh>
    </group>
  );
};

const GamePoints = {
  StartPoint,
  EndPoint,
  
  CheckpointCylinder,
};

export default GamePoints;
