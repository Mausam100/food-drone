import React, { useMemo, useState } from "react";
import * as THREE from "three";
import {
  GradientTexture,
  Environment,
  Bounds,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import City from "./Model/City";
import DroneController from "./DroneController";
import GamePoints from "./GamePoints";

export const Scene = ({
  touchControls,
  setTouchControls,
  isFirstPerson,
  setIsFirstPerson,
  onReachEnd,
  onPoint1Reached,
  onPoint2Reached,
  onPoint3Reached,
  restartTrigger,
}) => {
  const isMobile = useMemo(() => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);

  const [dpr, setDpr] = useState(1);
  const [quality, setQuality] = useState(1);

  const skyboxGeometry = useMemo(
    () => new THREE.SphereGeometry(50, isMobile ? 16 : 32, isMobile ? 16 : 32),
    [isMobile]
  );
  const skyboxMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        side: THREE.BackSide,
        transparent: true,
        opacity: 1,
      }),
    []
  );

  const physicsSettings = useMemo(
    () => ({
      gravity: [0, 0, 0],
      timeStep: isMobile ? 1 / 30 : 1 / 60,
      maxSteps: isMobile ? 2 : 3,
      solverIterations: isMobile ? 4 : 8,
      debug: false,
      defaultSleepTime: 0.5,
      defaultWakeUpThreshold: 0.1,
      defaultCcdEnabled: false,
    }),
    [isMobile]
  );

  return (
    <>
      <PerformanceMonitor
        factor={1}
        onChange={({ factor }) => {
          setDpr(Math.min(1.5, 0.5 + factor));
          setQuality(Math.min(1, 0.5 + factor));
        }}
      />

      <color attach="background" args={["#ffffff"]} />
      <fog attach="fog" args={["#ffffff", 10, 100]} />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />

      {isMobile && (
        <>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </>
      )}

      <mesh geometry={skyboxGeometry} material={skyboxMaterial}>
        <GradientTexture
          stops={[0, 0.5, 1]}
          colors={["#ffffff", "#00c3ae", "#004a41"]}
          size={isMobile ? 512 : 1024}
          attach="map"
        />
      </mesh>

      <Physics {...physicsSettings}>
        <Bounds fit clip observe margin={1.2}>
          <RigidBody type="fixed" colliders="hull">
            <City isMobile={isMobile} />
          </RigidBody>
        </Bounds>

        <DroneController
          touchControls={touchControls}
          setTouchControls={setTouchControls}
          isFirstPerson={isFirstPerson}
          setIsFirstPerson={setIsFirstPerson}
          onReachEnd={onReachEnd}
          restartTrigger={restartTrigger}
          onPoint1Reached={onPoint1Reached}
          onPoint2Reached={onPoint2Reached}
          onPoint3Reached={onPoint3Reached}
        />

        {/* Game Points */}
    
        <GamePoints.CheckpointCylinder
          position={[6.7, 5.7, -14.8]}
          height={5}
          radius={3}
        />
        <GamePoints.CheckpointCylinder
          position={[0, 5, 0]}
          height={5}
          radius={3}
        />
        <GamePoints.CheckpointCylinder
          position={[-10, 5, 5]}
          height={5}
          radius={3}
        />
        <GamePoints.EndPoint
          position={[-32.2, 2.1, 10]}
          height={5}
          radius={3}
        />
      </Physics>
    </>
  );
};
