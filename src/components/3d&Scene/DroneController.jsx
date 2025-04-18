import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import Drone from "./Model/Drone";
import * as THREE from "three";

function DroneController({ touchControls, setTouchControls }) {
  const droneRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { camera } = useThree();
  const [rotation, setRotation] = useState(0);
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const lastFirstPersonToggle = useRef(false);

  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const cameraOffset = new THREE.Vector3(0, 2, 5);
  const firstPersonOffset = new THREE.Vector3(0, -1, 0);
  const cameraTarget = useRef(new THREE.Vector3());
  const cameraPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  const resetDrone = () => {
    const body = droneRef.current;
    if (body) {
      // Reset position to start point
      body.setTranslation({ x: 21.2, y: 2.3, z: -18 }, true);
      // Reset rotation
      body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      // Reset velocity
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      // Reset state
      setRotation(0);
      setHasReachedEnd(false);
    }
  };

  useEffect(() => {
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touches = e.touches;
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const rect = e.target.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        if (x < window.innerWidth / 2) {
          setTouchControls(prev => ({
            ...prev,
            joystick: { active: true, x, y }
          }));
        }
        else {
          if (x > window.innerWidth * 0.75) {
            setTouchControls(prev => ({ ...prev, rotateRight: true }));
          } else {
            setTouchControls(prev => ({ ...prev, rotateLeft: true }));
          }
        }
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touches = e.touches;
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const rect = e.target.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        if (x < window.innerWidth / 2) {
          setTouchControls(prev => ({
            ...prev,
            joystick: { ...prev.joystick, x, y }
          }));
        }
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      setTouchControls(prev => ({
        ...prev,
        joystick: { ...prev.joystick, active: false },
        rotateLeft: false,
        rotateRight: false
      }));
    };

    const canvas = document.querySelector('canvas');
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [setTouchControls]);

  useFrame(() => {
    const body = droneRef.current;
    if (!body) return;

    const { forward, backward, left, right, up, down, rotateLeft, rotateRight, firstPerson } = getKeys();

    if (firstPerson && !lastFirstPersonToggle.current) {
      setIsFirstPerson(!isFirstPerson);
    }
    lastFirstPersonToggle.current = firstPerson;

    const keyboardRotation = (rotateLeft ? 0.01 : 0) + (rotateRight ? -0.01 : 0);
    const touchRotation = (touchControls.rotateLeft ? 0.01 : 0) + (touchControls.rotateRight ? -0.01 : 0);
    setRotation(prev => prev + keyboardRotation + touchRotation);

    const pos = body.translation();
    const dronePosition = new THREE.Vector3(pos.x, pos.y, pos.z);
    
    // Check if drone has reached the end point
    if (!hasReachedEnd) {
      const endPoint = new THREE.Vector3(-32.2, 2.1, 10);
      const distance = dronePosition.distanceTo(endPoint);
      if (distance < 2) {
        setHasReachedEnd(true);
        alert("Congratulations! You've reached the end point! Opening reference website...");
        window.location.href = 'http://localhost:5173/';
      }
    }

    const euler = new THREE.Euler(0, rotation, 0);
    
    if (isFirstPerson) {
      const firstPersonPos = firstPersonOffset.clone().applyEuler(euler);
      cameraPosition.current.lerp(
        new THREE.Vector3(
          pos.x + firstPersonPos.x,
          pos.y + firstPersonPos.y,
          pos.z + firstPersonPos.z
        ),
        0.1
      );
      camera.position.copy(cameraPosition.current);
      camera.rotation.set(0, rotation, 0);
      const lookDirection = new THREE.Vector3(0, -1.2, -1).applyEuler(euler);
      cameraLookAt.current.lerp(
        new THREE.Vector3(
          pos.x + lookDirection.x,
          pos.y + lookDirection.y,
          pos.z + lookDirection.z
        ),
        0.1
      );
      camera.lookAt(cameraLookAt.current);
    } else {
      const rotatedOffset = cameraOffset.clone().applyEuler(euler);
      cameraTarget.current.lerp(
        new THREE.Vector3(
          pos.x + rotatedOffset.x,
          pos.y + rotatedOffset.y,
          pos.z + rotatedOffset.z
        ),
        0.05
      );
      cameraPosition.current.lerp(cameraTarget.current, 0.1);
      camera.position.copy(cameraPosition.current);
      cameraLookAt.current.lerp(
        new THREE.Vector3(pos.x, pos.y, pos.z),
        0.1
      );
      camera.lookAt(cameraLookAt.current);
    }

    direction.set(0, 0, 0);
    const moveDirection = new THREE.Vector3(0, 0, -1).applyEuler(euler);
    
    if (forward) direction.add(moveDirection);
    if (backward) direction.sub(moveDirection);
    if (left) direction.add(new THREE.Vector3(moveDirection.z, 0, -moveDirection.x));
    if (right) direction.add(new THREE.Vector3(-moveDirection.z, 0, moveDirection.x));
    if (up) direction.y += 1;
    if (down) direction.y -= 1;

    if (touchControls.joystick.active) {
      const joystickX = (touchControls.joystick.x - window.innerWidth / 4) / (window.innerWidth / 4);
      const joystickY = (touchControls.joystick.y - window.innerHeight / 2) / (window.innerHeight / 2);
      
      direction.add(moveDirection.clone().multiplyScalar(joystickY));
      direction.add(new THREE.Vector3(moveDirection.z, 0, -moveDirection.x).multiplyScalar(joystickX));
    }

    direction.normalize();

    velocity.set(
      direction.x * 5,
      direction.y * 5,
      direction.z * 5
    );

    body.setLinvel(velocity, true);
    body.setRotation({ x: 0, y: rotation, z: 0, w: 0 }, true);
  });

  return (
    <RigidBody
      ref={droneRef}
      colliders="cuboid"
      lockRotations={false}
      linearDamping={2}
      angularDamping={2}
      position={[21.2, 2.3, -18]}
    >
      <Drone rotation={[0, rotation, 0]} />
    </RigidBody>
  );
}

export default DroneController;
