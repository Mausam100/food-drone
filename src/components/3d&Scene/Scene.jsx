import React, { useMemo, useState, useEffect } from "react";
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
import DroneController from "../controller/DroneController";
import GamePoints from "./GamePoints";
export const Scene = ({
  touchControls,
  setTouchControls,
  isFirstPerson,
  setIsFirstPerson,
  restartTrigger,
  setShowCheckpointsCleared,
  point1Reached,
  point2Reached,
  point3Reached,
  onReachEnd,
  onPoint1Reached,
  onPoint2Reached,
  onPoint3Reached,
}) => {
  const isMobile = useMemo(() => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);
  
  const [dpr, setDpr] = useState(1);
  const [quality, setQuality] = useState(1);
  const [randomNumber, setRandomNumber] = useState(0);

  // Memoize the random points to avoid recreating them on every render
  const randomPoints = useMemo(() => ({
    point1: {
      position: [[3.1, 5.7, -14.8], [6.7, 5.7, -14.8], [9, 6.6, -9.5]],
    },
    point2: {
      position: [[-12, 6.7, -2.2], [-10.4, 6.7, 14.4], [-10.5, 6.7, -4]],
    },
    point3: {
      position: [[-17.3, 5.7, 12.8], [-18.7, 5.7, 14.8], [-18.7, 5.7, 12.8]],
    }
  }), []);

  // Generate random number only once on mount
  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 3));
  }, []);
  
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
      <fog attach="fog" color="#ffffff" near={1} far={100} />
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
          onPoint1Reached={onPoint1Reached}
          onPoint2Reached={onPoint2Reached}
          onPoint3Reached={onPoint3Reached}
          restartTrigger={restartTrigger}
          randomPoints={randomPoints}
          randomNumber={randomNumber}
          setShowCheckpointsCleared={setShowCheckpointsCleared}
        />

        {/* Game Points */}
        <GamePoints.CheckpointCylinder
          position={randomPoints.point1.position[randomNumber]}
          height={5}
          radius={3}
          color={point1Reached ? "#00ff00" : "#00adca"}
        />
        <GamePoints.CheckpointCylinder
          position={randomPoints.point2.position[randomNumber]}
          height={5}
          radius={3}
          color={point2Reached ? "#00ff00" : "#00adca"}
        />
        <GamePoints.CheckpointCylinder
          position={randomPoints.point3.position[randomNumber]}
          height={5}
          radius={3}
          color={point3Reached ? "#00ff00" : "#00adca"}
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
