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
  const lastFirstPersonToggle = useRef(false);

  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const cameraOffset = new THREE.Vector3(0, 2, 5);
  const firstPersonOffset = new THREE.Vector3(0, -1, 0);
  const cameraTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touches = e.touches;
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const rect = e.target.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Left side for joystick
        if (x < window.innerWidth / 2) {
          setTouchControls(prev => ({
            ...prev,
            joystick: { active: true, x, y }
          }));
        }
        // Right side for rotation
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
        const x = -touch.clientX - rect.left;
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

    // Toggle first person view with 'F' key
    if (firstPerson && !lastFirstPersonToggle.current) {
      setIsFirstPerson(!isFirstPerson);
    }
    lastFirstPersonToggle.current = firstPerson;

    // Handle rotation with arrow keys or touch
    const keyboardRotation = (rotateLeft ? 0.01 : 0) + (rotateRight ? -0.01 : 0);
    const touchRotation = (touchControls.rotateLeft ? 0.01 : 0) + (touchControls.rotateRight ? -0.01 : 0);
    setRotation(prev => prev + keyboardRotation + touchRotation);

    // Update camera position and rotation
    const pos = body.translation();
    const euler = new THREE.Euler(0, rotation, 0);
    
    if (isFirstPerson) {
      const firstPersonPos = firstPersonOffset.clone().applyEuler(euler);
      camera.position.set(
        pos.x + firstPersonPos.x,
        pos.y + firstPersonPos.y,
        pos.z + firstPersonPos.z
      );
      camera.rotation.set(0, rotation, 0);
      const lookDirection = new THREE.Vector3(0, -1.2, -1).applyEuler(euler);
      camera.lookAt(
        pos.x + lookDirection.x,
        pos.y + lookDirection.y,
        pos.z + lookDirection.z
      );
    } else {
      const rotatedOffset = cameraOffset.clone().applyEuler(euler);
      cameraTarget.current.lerp(
        new THREE.Vector3(
          pos.x + rotatedOffset.x,
          pos.y + rotatedOffset.y,
          pos.z + rotatedOffset.z
        ),
        0.03
      );
      camera.position.copy(cameraTarget.current);
      camera.lookAt(pos.x, pos.y, pos.z);
    }

    // Calculate movement direction based on rotation and touch controls
    direction.set(0, 0, 0);
    const moveDirection = new THREE.Vector3(0, 0, -1).applyEuler(euler);
    
    // Keyboard controls
    if (forward) direction.add(moveDirection);
    if (backward) direction.sub(moveDirection);
    if (left) direction.add(new THREE.Vector3(moveDirection.z, 0, -moveDirection.x));
    if (right) direction.add(new THREE.Vector3(-moveDirection.z, 0, moveDirection.x));
    if (up) direction.y += 1;
    if (down) direction.y -= 1;

    // Touch controls
    if (touchControls.joystick.active) {
      const joystickX = (touchControls.joystick.x - window.innerWidth / 4) / (window.innerWidth / 4);
      const joystickY = (touchControls.joystick.y - window.innerHeight / 2) / (window.innerHeight / 2);
      
      direction.add(moveDirection.clone().multiplyScalar(joystickY));
      direction.add(new THREE.Vector3(moveDirection.z, 0, -moveDirection.x).multiplyScalar(joystickX));
    }

    direction.normalize();

    // Apply velocity
    velocity.set(
      direction.x * 4,
      direction.y * 4,
      direction.z * 4
    );

    body.setLinvel(velocity, true);
    body.setRotation({ x: 0, y: rotation, z: 0, w: 1 }, true);
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
