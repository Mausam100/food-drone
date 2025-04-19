import React from 'react';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { Text } from '@react-three/drei';

const StartPoint = ({ position }) => {
  return (
    <RigidBody type="fixed" sensor>
     
      <Text
        rotation={[0, Math.PI / 2, 0]}
        position={[position[0], position[1] + 1.1, position[2]]}
        traverse={() => {
          console.log('Pointer moved');
        }}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        START
      </Text>
    </RigidBody>
  );
};

const EndPoint = ({ position }) => {
  return (
    <RigidBody type="fixed" sensor>
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.2, 32]} />
        <meshStandardMaterial color="#ff0000" transparent opacity={0.5} />
      </mesh>
      <Text
        position={[position[0], position[1] + 0.1, position[2]]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        END
      </Text>
    </RigidBody>
  );
};
const FollowPoint = ({ position }) => {
  return (
    <RigidBody type="fixed" sensor>
      <Text position={position} fontSize={1} color="white" anchorX="center" anchorY="middle">
        FOLLOW
      </Text>
    </RigidBody>
  );
};

const DronePosition = ({ position }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Position indicator */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshStandardMaterial color="#00c3ae" transparent opacity={0.8} />
      </mesh>
      
      {/* Glowing effect */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.9, 32]} />
        <meshStandardMaterial 
          color="#00c3ae" 
          transparent 
          opacity={0.3}
          emissive="#00c3ae"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Position text */}
      <Text
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
  FollowPoint,
  DronePosition
};

export default GamePoints;
