import React from "react";
import * as THREE from "three";
import { GradientTexture, Environment } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import City from "./Model/City";
import DroneController from "./DroneController";
import { StartPoint, EndPoint } from "./GamePoints";

export const Scene = ({ touchControls, setTouchControls }) => {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />

      {/* Skybox */}
      <mesh>
        <sphereGeometry args={[50, 50, 50]} />
        <meshStandardMaterial side={THREE.BackSide} transparent opacity={1}>
          <GradientTexture
            stops={[0, 0.5, 1]}
            colors={["#ffffff", "#00c3ae", "#004a41"]}
            size={1024}
            attach="map"
          />
        </meshStandardMaterial>
      </mesh>

      {/* Physics World */}
      <Physics gravity={[0, 0, 0]} colliders="trimesh">
        <RigidBody type="fixed">
          <City />
        </RigidBody>
        <DroneController touchControls={touchControls} setTouchControls={setTouchControls} />
        
        {/* Game Points */}
        <StartPoint position={[21.2, 2, -18]} />
        <EndPoint position={[-32.2, 2.1, 10]} />
      </Physics>
    </>
  );
};
