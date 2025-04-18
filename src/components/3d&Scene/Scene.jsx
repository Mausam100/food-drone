// Scene.jsx
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, GradientTexture, Text } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import Drone from "./Model/Drone";
import City from "./Model/City";
import DroneController from "./DroneController";

export const Scene = () => {
 
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment
        preset="city"
        background
        backgroundBlurriness={0.05}
        backgroundIntensity={0.5}
        environmentIntensity={0.8}
        backgroundRotation={[0, Math.PI / 2, 0]}
      />
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
      <Physics debug>
        <DroneController/>
        {/* City */}
        <RigidBody type="fixed" colliders="trimesh">
          <City />
        </RigidBody>
      </Physics>
    </>
  );
};
