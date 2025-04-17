// Scene.jsx
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { GradientTexture, Text } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import Drone from "./Model/Drone";
import City from "./Model/City";

export const Scene = () => {
  const droneRef = useRef();
  const cameraTarget = useRef(new THREE.Vector3());
  const [started, setStarted] = useState(false);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  // Keyboard input listeners
  useEffect(() => {
    const down = (e) => {
      if (!started) return;
      if (e.key === "w") keys.current.forward = true;
      if (e.key === "s") keys.current.backward = true;
      if (e.key === "a") keys.current.left = true;
      if (e.key === "d") keys.current.right = true;
      if (e.key === "ArrowUp") keys.current.up = true;
      if (e.key === "ArrowDown") keys.current.down = true; // Ensure this works
    };

    const up = (e) => {
      if (e.key === "w") keys.current.forward = false;
      if (e.key === "s") keys.current.backward = false;
      if (e.key === "a") keys.current.left = false;
      if (e.key === "d") keys.current.right = false;
      if (e.key === "ArrowUp") keys.current.up = false;
      if (e.key === "ArrowDown") keys.current.down = false; // Ensure this works
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [started]);

  useFrame(({ camera }) => {
    const body = droneRef.current;

    if (started && body) {
      const velocity = body.linvel();

      // Apply hover force only when falling and close to the ground
      if (velocity.y < -0.1 && body.translation().y < 2) {
        body.applyImpulse({ x: 0, y: 0.01, z: 0 }, true); // Adjust hover force
      }

      const impulse = { x: 0, y: 0, z: 0 };
      const speed = 0.002; // Adjust speed for smoother control

      if (keys.current.forward) impulse.z -= speed;
      if (keys.current.backward) impulse.z += speed;
      if (keys.current.left) impulse.x -= speed;
      if (keys.current.right) impulse.x += speed;
      if (keys.current.up) impulse.y += speed;
      if (keys.current.down) impulse.y -= speed; // Ensure this works

      body.applyImpulse(impulse, true);

      const pos = body.translation();
      cameraTarget.current.lerp(
        new THREE.Vector3(pos.x, pos.y + 2, pos.z + 5),
        0.05
      ); // Smooth camera movement
      camera.position.copy(cameraTarget.current);
      camera.lookAt(pos.x, pos.y, pos.z);
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

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

      {/* Start Button */}
      {!started && (
        <Text
          position={[0, 2, -5]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
          onClick={() => setStarted(true)}
          style={{ cursor: "pointer" }}
        >
          Start Drone
        </Text>
      )}

      {/* Physics World */}
      <Physics gravity={[0, 0.5, 0]}>
        {/* Drone */}
        <RigidBody
          ref={droneRef}
          colliders="trimesh"
          mass={1}
          angularDamping={10}
          linearDamping={5}
          enabledRotations={[false, false, false]}
          position={[0, 5, 0]}
          type={started ? "dynamic" : "kinematicPosition"}
          ccd={true} // Enable continuous collision detection
        >
          <Drone />
        </RigidBody>

        {/* City */}
        <RigidBody type="fixed" colliders="trimesh">
          <City />
        </RigidBody>
      </Physics>
    </>
  );
};
