import React from 'react';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { Text, Line } from '@react-three/drei';

const StartPoint = ({ position }) => {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[2, 2, 0.2, 32]} />
      <meshStandardMaterial color="#00c3ae" transparent opacity={0.5} />
    </mesh>
  );
};

const EndPoint = ({ position }) => {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[2, 2, 0.2, 32]} />
      <meshStandardMaterial color="#ff0000" transparent opacity={0.5} />
    </mesh>
  );
};

const FollowPoint = ({ position }) => {
  return (
      <Text position={position} fontSize={1} color="white" anchorX="center" anchorY="middle">
        FOLLOW
      </Text>
    
  );
};

const DronePosition = ({ position, rotation, arrowRotation }) => {
  return (
    <group position={[0, 0, 0]}>
  

      {/* Back position text */}
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

const point1 = ({ position }) => {
  return (
    <Text position={position} rotation={[0, Math.PI / 2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
      Point 1
    </Text>
  );
};

const PathLine = ({ points, color = "yellow" }) => {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const curvePoints = curve.getPoints(100); // Increase for smoother curves

  return (
    <Line
      points={curvePoints} // Array of points
      color={color} // Line color
      lineWidth={10} // Line width
      dashed={true} // Solid line
    />
  );
};

const GamePoints = {
  StartPoint,
  EndPoint,
  FollowPoint,  
  DronePosition,
  point1,
  PathLine
};

export default GamePoints;
