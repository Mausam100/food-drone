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

export const Scene = () => {
return (
    <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <mesh>
            <sphereGeometry args={[100, 100, 100]} />
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
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="green" side={THREE.DoubleSide} />
            <mesh position={[0, 0, 0.5]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" side={THREE.DoubleSide} />
            </mesh>
        </mesh>
    </>
);
};
