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

// DronePosition component: Displays the drone's position and rotation
const DronePosition = ({ position, rotation, arrowRotation }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Display drone position as text */}
      <Text
        rotation={[0, rotation + Math.PI, 0]}
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        // outlineWidth={0.02} // Uncomment if outline is needed
        // outlineColor="#000000" // Uncomment if outline is needed
      >
        {`X: ${position[0].toFixed(1)} Y: ${position[1].toFixed(1)} Z: ${position[2].toFixed(1)}`}
      </Text>
    </group>
  );
};

// Export all game point components as a single object
const GamePoints = {
  StartPoint,
  EndPoint,
  DronePosition,
  CheckpointCylinder,
};

export default GamePoints;
