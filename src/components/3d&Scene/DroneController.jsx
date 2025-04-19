import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState, useMemo } from "react";
import Drone from "./Model/Drone";

import * as THREE from "three";
import GamePoints from "./GamePoints";

function DroneController({ touchControls, setTouchControls, isFirstPerson, setIsFirstPerson }) {
  const droneRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { camera } = useThree();
  const [rotation, setRotation] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [hasReachedPoint1, setHasReachedPoint1] = useState(false);
  const [point1MessageShown, setPoint1MessageShown] = useState(false);
  const lastFirstPersonToggle = useRef(false);
  const [dronePosition, setDronePosition] = useState([21.2, 3.3, -18]);
  const [direction, setDirection] = useState([0, 0, -1]);
  const [arrowRotation, setArrowRotation] = useState(0);

  // Memoize vectors to avoid recreating them every frame
  const vectors = useMemo(() => ({
    direction: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    cameraOffset: new THREE.Vector3(0, 2, 5),
    firstPersonOffset: new THREE.Vector3(0, -1, 0),
    moveDirection: new THREE.Vector3(0, 0, -1),
    lookDirection: new THREE.Vector3(0, -1, -1),
    endPoint: new THREE.Vector3(-32.2, 2.1, 10),
    point1: new THREE.Vector3(6.7, 5.7, -14.8)
  }), []);

  const cameraTarget = useRef(new THREE.Vector3());
  const cameraPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  // Touch event handlers
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
    setDronePosition([pos.x, pos.y, pos.z]);
    
    // Calculate arrow rotation to point towards end point
    const dronePos = new THREE.Vector3(pos.x, pos.y, pos.z);
    const directionToEnd = vectors.endPoint.clone().sub(dronePos);
    const angle = Math.atan2(directionToEnd.x, directionToEnd.z);
    setArrowRotation(angle);
    
    // Check if drone has reached the end point
    if (!hasReachedEnd) {
      const distance = dronePos.distanceTo(vectors.endPoint);
      if (distance < 2) {
        setHasReachedEnd(true);
        alert("Congratulations! You've reached the end point! Opening reference website...");
        window.location.href = 'http://localhost:5173/';
      }
    }
    if (!hasReachedPoint1) {
      const distance = dronePos.distanceTo(vectors.point1);
      if (distance < 2 && !point1MessageShown) {
        setPoint1MessageShown(true);
        console.log("Congratulations! You've reached point 1!");
      }
    }

    const euler = new THREE.Euler(0, rotation, 0);
    
    if (isFirstPerson) {
      const firstPersonPos = vectors.firstPersonOffset.clone().applyEuler(euler);
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
      const lookDir = vectors.lookDirection.clone().applyEuler(euler);
      cameraLookAt.current.lerp(
        new THREE.Vector3(
          pos.x + lookDir.x,
          pos.y + lookDir.y,
          pos.z + lookDir.z
        ),
        0.1
      );
      camera.lookAt(cameraLookAt.current);
    } else {
      const rotatedOffset = vectors.cameraOffset.clone().applyEuler(euler);
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

    vectors.direction.set(0, 0, 0);
    const moveDir = vectors.moveDirection.clone().applyEuler(euler);
    
    if (forward) vectors.direction.add(moveDir);
    if (backward) vectors.direction.sub(moveDir);
    if (left) vectors.direction.add(new THREE.Vector3(moveDir.z, 0, -moveDir.x));
    if (right) vectors.direction.add(new THREE.Vector3(-moveDir.z, 0, moveDir.x));
    
    // Handle vertical movement
    if (up) vectors.direction.y += 1;
    if (down) vectors.direction.y -= 1;
    if (touchControls.up) vectors.direction.y += 1;
    if (touchControls.down) vectors.direction.y -= 1;

    if (touchControls.joystick.active) {
      // Normalize joystick values to [-1, 1] range
      const maxDistance = 60; // Same as in MobileControls
      const joystickX = touchControls.joystick.x / maxDistance;
      const joystickY = touchControls.joystick.y / maxDistance;
      
      // Apply deadzone to prevent tiny movements
      const deadzone = 0.1;
      const magnitude = Math.sqrt(joystickX * joystickX + joystickY * joystickY);
      
      if (magnitude > deadzone) {
        // Normalize and scale the input
        const normalizedX = -joystickX / magnitude;
        const normalizedY = joystickY / magnitude;
        
        // Apply movement with smooth acceleration
        const moveSpeed = 0.5;
        const acceleration = 0.1;
        
        vectors.direction.add(moveDir.clone().multiplyScalar(-normalizedY * moveSpeed * acceleration));
        vectors.direction.add(new THREE.Vector3(moveDir.z, 0, -moveDir.x).multiplyScalar(normalizedX * moveSpeed * acceleration));
      }
    }

    vectors.direction.normalize();
    setDirection([vectors.direction.x, vectors.direction.y, vectors.direction.z]);

    vectors.velocity.set(
      vectors.direction.x * 5,
      vectors.direction.y * 5,
      vectors.direction.z * 5
    );

    body.setLinvel(vectors.velocity, true);
    body.setRotation({ x: 0, y: rotation, z: 0, w: 0 }, true);
  });

  return (
    <RigidBody
      ref={droneRef}
      colliders="cuboid"
      linearDamping={2}
      angularDamping={2}
      lockRotations={false}
      position={[21.2, 3.3, -18]}
    >
      <Drone rotation={[0, rotation, 0]} />
      <group position={[0, -1, 0]}>
        <GamePoints.DronePosition rotation={rotation} arrowRotation={arrowRotation} position={dronePosition} />
      </group>
      {/* Direction Arrow */}
    
    </RigidBody>
  );
}

export default DroneController;
