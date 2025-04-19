import React from 'react';
import * as THREE from 'three';
import { Text,  } from '@react-three/drei';

const StartPoint = ({ position, height = 5, radius = 2, color = "#00c3ae" }) => {
  return (
    <mesh position={position}>
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

const EndPoint = ({ position, height = 5, radius = 2, color = "#ff0000" }) => {
  return (
    <mesh position={position}>
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

const CheckpointCylinder = ({ position, height = 5, radius = 2, color = "#ffff00" }) => {
  return (
    <mesh position={position}>
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


const DronePosition = ({ position, rotation, arrowRotation }) => {
  return (
    <group position={[0, 0, 0]}>
      <Text
        rotation={[0, rotation + Math.PI, 0]}
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`X: ${position[0].toFixed(1)} Y: ${position[1].toFixed(1)} Z: ${position[2].toFixed(1)}`}
      </Text>
    </group>
  );
};


const GamePoints = {
  StartPoint,
  EndPoint,  
  DronePosition,
  CheckpointCylinder
};

export default GamePoints;
