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
  droneColor,
}) => {
  // Determine if the user is on a mobile device
  const isMobile = useMemo(() => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }, []);

  // State for device pixel ratio and quality
  const [dpr, setDpr] = useState(1);
  const [quality, setQuality] = useState(1);

  // State for generating a random number
  const [randomNumber, setRandomNumber] = useState(0);

  // State for day and night cycle
  const [isDay, setIsDay] = useState(true);

  // Update day/night cycle based on the current hour
  useEffect(() => {
    const updateDayNightCycle = () => {
      const hour = new Date().getHours();
      setIsDay(hour >= 6 && hour < 18);
    };

    updateDayNightCycle();
    const interval = setInterval(updateDayNightCycle, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Memoized random points for checkpoints
  const randomPoints = useMemo(() => ({
    point1: {
      position: [[3.1, 5.7, -14.8], [6.7, 5.7, -14.8], [9, 6.6, -9.5]],
    },
    point2: {
      position: [[-12, 6.7, -2.2], [-10.4, 6.7, 14.4], [-10.5, 6.7, -4]],
    },
    point3: {
      position: [[-17.3, 5.7, 12.8], [-18.7, 5.7, 14.8], [-18.7, 5.7, 12.8]],
    },
  }), []);

  // Generate a random number once when the component mounts
  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 3));
  }, []);

  // Memoized skybox geometry
  const skyboxGeometry = useMemo(
    () => new THREE.SphereGeometry(50, isMobile ? 16 : 32, isMobile ? 16 : 32),
    [isMobile]
  );

  // Memoized skybox material
  const skyboxMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        side: THREE.BackSide,
        transparent: true,
        opacity: 1,
      }),
    []
  );

  // Memoized physics settings
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
      {/* Performance Monitor to adjust DPR and quality dynamically */}
      <PerformanceMonitor
        factor={1}
        onChange={({ factor }) => {
          setDpr(Math.min(1.5, 0.5 + factor));
          setQuality(Math.min(1, 0.5 + factor));
        }}
      />

      {/* Scene background and fog */}
      <color attach="background" args={[isDay ? "#87CEEB" : "#0D1B2A"]} />
      <fog attach="fog" color={isDay ? "#87CEEB" : "#0D1B2A"} near={1} far={100} />

      {/* Lighting */}
      <ambientLight intensity={isDay ? 1 : 0.3} />
      <directionalLight position={[10, 10, 5]} intensity={isDay ? 1 : 0.5} />
      <Environment preset="city" far={100} />

      {/* Adaptive settings for mobile devices */}
      {isMobile && (
        <>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </>
      )}

      {/* Skybox */}
      <mesh geometry={skyboxGeometry} material={skyboxMaterial}>
        <GradientTexture
          stops={[0, 0.5, 1]}
          colors={isDay ? ["#44ffd1", "#00c3ae", "#004a41"] : ["#0D1B2A", "#1B263B", "#415A77"]}
          size={isMobile ? 512 : 1024}
          attach="map"
        />
      </mesh>

      {/* Physics simulation */}
      <Physics {...physicsSettings}>
        {/* City bounds */}
        <Bounds fit clip observe margin={1.2}>
          <RigidBody type="fixed" colliders="hull">
            <City isMobile={isMobile} />
          </RigidBody>
        </Bounds>

        {/* Drone controller */}
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
          droneColor={droneColor}
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
