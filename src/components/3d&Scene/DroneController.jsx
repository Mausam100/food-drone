import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useRef } from "react";
import Drone from "./Model/Drone";
import * as THREE from "three";

function DroneController() {
  const droneRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { camera } = useThree();

  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();

  useFrame(() => {
    const body = droneRef.current;
    if (!body) return;

    const { forward, backward, left, right, up, down } = getKeys();

    // Calculate movement direction
    direction.set(0, 0, 0);
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    if (left) direction.x -= 1;
    if (right) direction.x += 1;
    if (up) direction.y += 1;
    if (down) direction.y -= 1;

    direction.normalize();

    // Apply velocity (not impulse or force)
    velocity.set(
      direction.x * 4,
      direction.y * 4,
      direction.z * 4
    );

    body.setLinvel(velocity, true);

    // Get current position for camera follow
    const pos = body.translation();

    // Smooth camera follow and rotation
    const camOffset = new THREE.Vector3(0, 4, 8);
    const camPos = new THREE.Vector3(pos.x, pos.y, pos.z).add(camOffset);
    camera.position.lerp(camPos, 0.1);

    const lookAt = new THREE.Vector3(pos.x, pos.y, pos.z);
    camera.lookAt(lookAt);

    // Optional: rotate drone in movement direction
    if (direction.lengthSq() > 0) {
      const angle = Math.atan2(direction.x, direction.z);
      body.setRotation({ x: 0, y: angle, z: 0, w: 1 }, true);
    }
  });

  return (
    <RigidBody
      ref={droneRef}
      colliders="cuboid"
      lockRotations={false}
      linearDamping={2}
      angularDamping={2}
      position={[0, 5, 0]}
    >
      <Drone />
    </RigidBody>
  );
}

export default DroneController;
