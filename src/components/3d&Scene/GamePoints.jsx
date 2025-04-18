import React from 'react';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { Text } from '@react-three/drei';

const StartPoint = ({ position }) => {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      {/* <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 42]} />
        <meshStandardMaterial color="#000f00" transparent opacity={0.5} />
      </mesh> */}
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

export { StartPoint, EndPoint }; 