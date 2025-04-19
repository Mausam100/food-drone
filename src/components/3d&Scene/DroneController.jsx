import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Drone from "./Model/Drone";

import * as THREE from "three";
import GamePoints from "./GamePoints";

function DroneController({
  touchControls,
  setTouchControls,
  isFirstPerson,
  setIsFirstPerson,
  onReachEnd,
  onPoint1Reached,
  onPoint2Reached,
  onPoint3Reached,
  restartTrigger,
  randomPoints,
  randomNumber,
}) {
  const droneRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { camera } = useThree();
  const [rotation, setRotation] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [hasReachedPoint1, setHasReachedPoint1] = useState(false);
  const [hasReachedPoint2, setHasReachedPoint2] = useState(false);
  const [hasReachedPoint3, setHasReachedPoint3] = useState(false);
  const [point1MessageShown, setPoint1MessageShown] = useState(false);
  const lastFirstPersonToggle = useRef(false);
  const [dronePosition, setDronePosition] = useState([21.2, 3.3, -18]);
  const [direction, setDirection] = useState([0, 0, -1]);
  const [arrowRotation, setArrowRotation] = useState(0);

  // Mobile detection
  const isMobile = useMemo(() => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);

  // Speed settings based on device
  const [speed, setSpeed] = useState(isMobile ? 2 : 5); // Base speed
  const maxSpeed = isMobile ? 4 : 10; // Maximum speed
  const minSpeed = isMobile ? 0.5 : 1; // Minimum speed
  const speedIncrement = isMobile ? 0.05 : 0.1; // Speed change rate

  // Memoize vectors to avoid recreating them every frame
  const vectors = useMemo(
    () => {
      const point1Pos = randomPoints.point1.position[randomNumber];
      const point2Pos = randomPoints.point2.position[randomNumber];
      const point3Pos = randomPoints.point3.position[randomNumber];

      return {
        direction: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        cameraOffset: new THREE.Vector3(0, 0.7, 5),
        firstPersonOffset: new THREE.Vector3(0, -1, 0),
        moveDirection: new THREE.Vector3(0, 0, -1),
        lookDirection: new THREE.Vector3(0, -1, -1),
        endPoint: new THREE.Vector3(-32.2, 2, 10),
        point1: new THREE.Vector3(point1Pos[0], point1Pos[1], point1Pos[2]),
        point2: new THREE.Vector3(point2Pos[0], point2Pos[1], point2Pos[2]),
        point3: new THREE.Vector3(point3Pos[0], point3Pos[1], point3Pos[2]),
      };
    },
    [randomNumber, randomPoints]
  );

  // Memoize the checkPoint function to avoid recreating it every frame
  const checkPoint = useCallback((dronePos, point, hasReached, setHasReached, onReached) => {
    if (!hasReached) {
      // Use squared distance for faster calculation
      const dx = dronePos.x - point.x;
      const dy = dronePos.y - point.y;
      const dz = dronePos.z - point.z;
      const distanceSquared = dx * dx + dy * dy + dz * dz;
      
      // Check against squared threshold (4 = 2^2)
      if (distanceSquared < 4) {
        setHasReached(true);
        onReached();
      }
    }
  }, []);

  // Memoize point checking logic
  const checkPoints = useCallback((dronePos) => {
    if (!hasReachedPoint1) {
      checkPoint(dronePos, vectors.point1, hasReachedPoint1, setHasReachedPoint1, onPoint1Reached);
    }
    if (!hasReachedPoint2) {
      checkPoint(dronePos, vectors.point2, hasReachedPoint2, setHasReachedPoint2, onPoint2Reached);
    }
    if (!hasReachedPoint3) {
      checkPoint(dronePos, vectors.point3, hasReachedPoint3, setHasReachedPoint3, onPoint3Reached);
    }
    if (!hasReachedEnd) {
      checkPoint(dronePos, vectors.endPoint, hasReachedEnd, setHasReachedEnd, onReachEnd);
    }
  }, [
    hasReachedPoint1,
    hasReachedPoint2,
    hasReachedPoint3,
    hasReachedEnd,
    vectors,
    checkPoint,
    onPoint1Reached,
    onPoint2Reached,
    onPoint3Reached,
    onReachEnd
  ]);

  // Memoize camera movement logic
  const updateCamera = useCallback((pos, rotation, isFirstPerson) => {
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
        isMobile ? 0.5 : 0.05
      );
      cameraPosition.current.lerp(cameraTarget.current, 0.1);
      camera.position.copy(cameraPosition.current);
      cameraLookAt.current.lerp(new THREE.Vector3(pos.x, pos.y, pos.z), 0.1);
      camera.lookAt(cameraLookAt.current);
    }
  }, [vectors, isMobile]);

  const cameraTarget = useRef(new THREE.Vector3());
  const cameraPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  const resetDrone = () => {
    setHasReachedEnd(false);
    setHasReachedPoint1(false);
    setHasReachedPoint2(false);
    setHasReachedPoint3(false);
    if (droneRef.current) {
      droneRef.current.setTranslation({ x: 21.2, y: 3.3, z: -18 }, true);
      droneRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  };

  useEffect(() => {
    if (restartTrigger) {
      resetDrone();
    }
  }, [restartTrigger]);

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
          setTouchControls((prev) => ({
            ...prev,
            joystick: { active: true, x, y },
          }));
        } else {
          if (x > window.innerWidth * 0.75) {
            setTouchControls((prev) => ({ ...prev, rotateRight: true }));
          } else {
            setTouchControls((prev) => ({ ...prev, rotateLeft: true }));
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
          setTouchControls((prev) => ({
            ...prev,
            joystick: { ...prev.joystick, x, y },
          }));
        }
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      setTouchControls((prev) => ({
        ...prev,
        joystick: { ...prev.joystick, active: false },
        rotateLeft: false,
        rotateRight: false,
      }));
    };

    const canvas = document.querySelector("canvas");
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setTouchControls]);


  useFrame(() => {
    const body = droneRef.current;
    if (!body) return;

    const {
      forward,
      backward,
      left,
      right,
      up,
      down,
      rotateLeft,
      rotateRight,
      firstPerson,
      speedUp,
      speedDown,
    } = getKeys();

    // Handle speed control with debounce
    if (speedUp && speed < maxSpeed) {
      setSpeed(prev => Math.min(prev + speedIncrement, maxSpeed));
    }
    if (speedDown && speed > minSpeed) {
      setSpeed(prev => Math.max(prev - speedIncrement, minSpeed));
    }

    // Handle first person toggle with debounce
    if (firstPerson && !lastFirstPersonToggle.current) {
      setIsFirstPerson(!isFirstPerson);
    }
    lastFirstPersonToggle.current = firstPerson;

    // Calculate rotation
    const keyboardRotation = (rotateLeft ? 0.01 : 0) + (rotateRight ? -0.01 : 0);
    const touchRotation = (touchControls.rotateLeft ? 0.01 : 0) + (touchControls.rotateRight ? -0.01 : 0);
    setRotation(prev => prev + keyboardRotation + touchRotation);

    // Get position and create vector
    const pos = body.translation();
    const dronePos = new THREE.Vector3(pos.x, pos.y, pos.z);

    // Update drone position state only if changed significantly
    const [currentX, currentY, currentZ] = dronePosition;
    if (Math.abs(currentX - pos.x) > 0.1 || 
        Math.abs(currentY - pos.y) > 0.1 || 
        Math.abs(currentZ - pos.z) > 0.1) {
      setDronePosition([pos.x, pos.y, pos.z]);
    }

    // Check points
    checkPoints(dronePos);

    // Calculate arrow rotation
    const directionToEnd = vectors.endPoint.clone().sub(dronePos);
    const angle = Math.atan2(directionToEnd.x, directionToEnd.z);
    setArrowRotation(angle);

    // Update camera
    updateCamera(pos, rotation, isFirstPerson);

    // Calculate movement direction
    vectors.direction.set(0, 0, 0);
    const moveDir = vectors.moveDirection.clone().applyEuler(new THREE.Euler(0, rotation, 0));

    if (forward) vectors.direction.add(moveDir);
    if (backward) vectors.direction.sub(moveDir);
    if (left) vectors.direction.add(new THREE.Vector3(moveDir.z, 0, -moveDir.x));
    if (right) vectors.direction.add(new THREE.Vector3(-moveDir.z, 0, moveDir.x));

    // Handle vertical movement
    if (up) vectors.direction.y += 1;
    if (down) vectors.direction.y -= 1;
    if (touchControls.up) vectors.direction.y += 1;
    if (touchControls.down) vectors.direction.y -= 1;

    // Handle joystick movement
    if (touchControls.joystick.active) {
      const maxDistance = 60;
      const joystickX = touchControls.joystick.x / maxDistance;
      const joystickY = touchControls.joystick.y / maxDistance;

      const deadzone = 0.1;
      const magnitude = Math.sqrt(joystickX * joystickX + joystickY * joystickY);

      if (magnitude > deadzone) {
        const normalizedX = -joystickX / magnitude;
        const normalizedY = joystickY / magnitude;

        const moveSpeed = 0.5;
        const acceleration = 0.1;

        vectors.direction.add(
          moveDir.clone().multiplyScalar(-normalizedY * moveSpeed * acceleration)
        );
        vectors.direction.add(
          new THREE.Vector3(moveDir.z, 0, -moveDir.x).multiplyScalar(
            normalizedX * moveSpeed * acceleration
          )
        );
      }
    }

    // Normalize and apply movement
    vectors.direction.normalize();
    setDirection([vectors.direction.x, vectors.direction.y, vectors.direction.z]);

    vectors.velocity.set(
      vectors.direction.x * speed,
      vectors.direction.y * speed,
      vectors.direction.z * speed
    );

    // Apply physics
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
        <GamePoints.DronePosition
          rotation={rotation}
          arrowRotation={arrowRotation}
          position={dronePosition}
        />
      </group>
      {/* Direction Arrow */}
    </RigidBody>
  );
}

export default DroneController;
