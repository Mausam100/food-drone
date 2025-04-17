import React from "react";
import * as THREE from "three";
import {
    Environment,
    GradientTexture,
    Line,
    useScroll,
    Text,
    Html,
    Image,
    Float,
  } from "@react-three/drei";
  import Drone from "./Model/Drone";
import City from "./Model/City";

export const Scene = () => {
return (
    <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
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
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <Drone/>
            <City/>
        </mesh>
    </>
);
};
