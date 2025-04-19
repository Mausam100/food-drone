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

const EndPoint = ({ position, color = "#ca0048" }) => {
  return (
    <group position={position}>
    {/* Outer floating ring */}
    <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 4 , 0]}>
        <torusGeometry args={[1.4, 0.15, 16, 72]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive={"red"} 
          emissiveIntensity={0.8}
          shininess={1}
        />
     </mesh>
</group>
  );
};

const CheckpointCylinder = ({ position, height = 5, radius = 2, color = "#00adca" }) => {
  return (
   <group position={position}>
        {/* Outer floating ring */}
        <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 4 , 0]}>
            <torusGeometry args={[1.4, 0.15, 16, 72]} />
            <meshPhongMaterial
              color={color}
              transparent
              opacity={0.6}
              emissive={color} 
              emissiveIntensity={0.8}
              shininess={1}
            />
         </mesh>
   </group>
  );
};


const DronePosition = ({ position, rotation, arrowRotation }) => {
  return (
    <group position={[0, 0, 0]}>
   
 
      <Text
        rotation={[0, rotation + Math.PI, 0]}
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        // outlineWidth={0.02}
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
