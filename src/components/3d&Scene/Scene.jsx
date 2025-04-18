// Scene.jsx
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, GradientTexture, Text } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import Drone from "./Model/Drone";
import City from "./Model/City";

export const Scene = () => {
  const droneRef = useRef();
  const cameraTarget = useRef(new THREE.Vector3());
  const [started, setStarted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    rotateLeft: false,
    rotateRight: false
  });

  // Touch event handlers
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (!started) {
        setStarted(true);
        return;
      }
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchMove = (e) => {
      if (!started || !touchStartRef.current) return;
      
      touchMoveRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };

      const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
      const deltaY = touchMoveRef.current.y - touchStartRef.current.y;

      // Handle rotation and strafing
      if (Math.abs(deltaX) > 5) {
        // If moving mostly horizontally, rotate
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          setTargetRotation(prev => prev + deltaX * 0.002);
        } 
        // If moving diagonally, strafe
        else {
          if (deltaX > 0) {
            keys.current.right = true;
            keys.current.left = false;
          } else {
            keys.current.left = true;
            keys.current.right = false;
          }
        }
      } else {
        keys.current.left = false;
        keys.current.right = false;
      }

      // Handle forward/backward movement
      if (deltaY < -5) {
        keys.current.forward = true;
        keys.current.backward = false;
      } else if (deltaY > 5) {
        keys.current.backward = true;
        keys.current.forward = false;
      } else {
        keys.current.forward = false;
        keys.current.backward = false;
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
      touchMoveRef.current = null;
      keys.current.forward = false;
      keys.current.backward = false;
      keys.current.left = false;
      keys.current.right = false;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [started]);

  // Keyboard input listeners
  useEffect(() => {
    const down = (e) => {
      if (!started) return;
      if (e.key === "w") keys.current.forward = true;
      if (e.key === "s") keys.current.backward = true;
      if (e.key === "a") keys.current.left = true;
      if (e.key === "d") keys.current.right = true;
      if (e.key === "ArrowUp") keys.current.up = true;
      if (e.key === "ArrowDown") keys.current.down = true;
      if (e.key === "ArrowLeft") keys.current.rotateLeft = true;
      if (e.key === "ArrowRight") keys.current.rotateRight = true;
    };

    const up = (e) => {
      if (e.key === "w") keys.current.forward = false;
      if (e.key === "s") keys.current.backward = false;
      if (e.key === "a") keys.current.left = false;
      if (e.key === "d") keys.current.right = false;
      if (e.key === "ArrowUp") keys.current.up = false;
      if (e.key === "ArrowDown") keys.current.down = false;
      if (e.key === "ArrowLeft") keys.current.rotateLeft = false;
      if (e.key === "ArrowRight") keys.current.rotateRight = false;
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

      // Optimize hover force calculation
      if (velocity.y < -0.1 && body.translation().y < 2) {
        body.applyImpulse({ x: 0, y: 0.01, z: 0 }, true);
      }

      // Optimize rotation interpolation
      setRotation(prev => THREE.MathUtils.lerp(prev, targetRotation, 0.2));

      // Handle keyboard rotation with optimized values
      if (keys.current.rotateLeft) {
        setTargetRotation(prev => prev + 0.03);
      }
      if (keys.current.rotateRight) {
        setTargetRotation(prev => prev - 0.03);
      }

      const impulse = { x: 0, y: 0, z: 0 };
      const speed = 0.002; // Increased base speed for more responsive movement

      // Pre-calculate direction vector
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyEuler(new THREE.Euler(0, rotation, 0));

      // Optimize movement calculations
      if (keys.current.forward) {
        impulse.x += direction.x * speed;
        impulse.z += direction.z * speed;
      }
      if (keys.current.backward) {
        impulse.x -= direction.x * speed;
        impulse.z -= direction.z * speed;
      }
      if (keys.current.left) {
        impulse.x -= direction.z * speed;
        impulse.z += direction.x * speed;
      }
      if (keys.current.right) {
        impulse.x += direction.z * speed;
        impulse.z -= direction.x * speed;
      }
      if (keys.current.up) impulse.y += speed;
      if (keys.current.down) impulse.y -= speed;

      // Apply impulse with optimized damping
      body.applyImpulse(impulse, true);

      // Optimize camera follow
      const pos = body.translation();
      const cameraOffset = new THREE.Vector3(0, 2, 5);
      cameraOffset.applyEuler(new THREE.Euler(0, rotation, 0));
      
      cameraTarget.current.lerp(
        new THREE.Vector3(
          pos.x + cameraOffset.x,
          pos.y + cameraOffset.y,
          pos.z + cameraOffset.z
        ),
        0.3 // Faster camera follow for reduced lag
      );
      
      camera.position.copy(cameraTarget.current);
      camera.lookAt(pos.x, pos.y, pos.z);
    }
  });

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
          angularDamping={8}
          linearDamping={4}
          enabledRotations={[false, true, false]}
          position={[0, 5, 0]}
          type={started ? "dynamic" : "kinematicPosition"}
          ccd={true}
        >
          <group rotation={[0, rotation, 0]}>
            <Drone />
          </group>
        </RigidBody>

        {/* City */}
        <RigidBody type="fixed" colliders="trimesh">
          <City />
        </RigidBody>
      </Physics>
    </>
  );
};
