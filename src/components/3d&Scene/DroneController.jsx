import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useState } from "react";
import Drone from "./Model/Drone";
import * as THREE from "three";

function DroneController() {
  const droneRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { camera } = useThree();
  const [rotation, setRotation] = useState(0);

  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const cameraOffset = new THREE.Vector3(0, 2, 5);
  const cameraTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const body = droneRef.current;
    if (!body) return;

    const { forward, backward, left, right, up, down, rotateLeft, rotateRight } = getKeys();

    // Handle camera rotation with arrow keys
    if (rotateLeft) setRotation(prev => prev + 0.02);
    if (rotateRight) setRotation(prev => prev - 0.02);

    // Update camera position and rotation
    const pos = body.translation();
    const euler = new THREE.Euler(0, rotation, 0);
    const rotatedOffset = cameraOffset.clone().applyEuler(euler);
    
    // Optimize camera follow
    cameraTarget.current.lerp(
      new THREE.Vector3(
        pos.x + rotatedOffset.x,
        pos.y + rotatedOffset.y,
        pos.z + rotatedOffset.z
      ),
      0.3 // Faster camera follow for reduced lag
    );
    
    camera.position.copy(cameraTarget.current);
    camera.lookAt(pos.x, pos.y, pos.z);

    // Calculate movement direction based on rotation
    direction.set(0, 0, 0);
    const moveDirection = new THREE.Vector3(0, 0, -1).applyEuler(euler);
    
    if (forward) direction.add(moveDirection);
    if (backward) direction.sub(moveDirection);
    if (left) direction.add(new THREE.Vector3(-moveDirection.z, 0, moveDirection.x));
    if (right) direction.add(new THREE.Vector3(moveDirection.z, 0, -moveDirection.x));
    if (up) direction.y += 1;
    if (down) direction.y -= 1;

    direction.normalize();

    // Apply velocity
    velocity.set(
      direction.x * 4,
      direction.y * 4,
      direction.z * 4
    );

    body.setLinvel(velocity, true);

    // Update drone rotation
    body.setRotation({ x: 0, y: rotation, z: 0, w: 1 }, true);
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
      <Drone rotation={[0, rotation, 0]} />
    </RigidBody>
  );
}

export default DroneController;
