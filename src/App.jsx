import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  KeyboardControls,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";
import { Scene } from "./components/3d&Scene/Scene";
import { MobileControls } from "./components/controller/MobileControls"; // Mobile controls
import EndOverlay from "./components/Home/EndOverlay"; // End overlay
import StartOverlay from "./components/Home/StartOverlay"; // Start overlay
import PointOverlay from "./components/Home/PointOverlay"; // Point overlay
import {
  handleReachEnd,
  handlePoint1Reached,
  handlePoint2Reached,
  handlePoint3Reached,
  handleRestart,
  handlePointClose,
} from "./utils/allFun"; // Game controls

// Game controls
const keyMap = [
  { name: "forward", keys: ["w"] },
  { name: "backward", keys: ["s"] },
  { name: "left", keys: ["a"] },
  { name: "right", keys: ["d"] },
  { name: "up", keys: ["ArrowUp"] },
  { name: "down", keys: ["ArrowDown"] },
  { name: "rotateLeft", keys: ["ArrowLeft"] },
  { name: "rotateRight", keys: ["ArrowRight"] },
  { name: "firstPerson", keys: ["f"] },
];

function App() {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [touchControls, setTouchControls] = useState({
    joystick: { active: false, x: 0, y: 0 },
    rotateLeft: false,
    rotateRight: false,
    up: false,
    down: false,
  });
  const [point1Reached, setPoint1Reached] = useState(false);
  const [point2Reached, setPoint2Reached] = useState(false);
  const [point3Reached, setPoint3Reached] = useState(false);
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const [showCheckpointsCleared, setShowCheckpointsCleared] = useState(false);
  const [restartTrigger, setRestartTrigger] = useState(false);
  const [dpr, setDpr] = useState(2);

  // Handle fullscreen functionality
  useEffect(() => {
    const handleFullscreenChange = () => {
      // You can add any logic here that needs to run when fullscreen changes
      console.log("Fullscreen changed:", !!document.fullscreenElement);
    };

    // Add event listener for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup function
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return loading ? (
    <div className="w-full h-screen select-none">
      <KeyboardControls map={keyMap}>
        <Canvas
          dpr={dpr}
          camera={{
            position: [21.2, 2.3, -38],
            fov: 30,
            near: 0.1,
          }}
        >
          <PerformanceMonitor
            factor={1}
            onChange={({ factor }) => setDpr(Math.floor(0.5 + 1.5 * factor, 1))}
          />
          <Suspense fallback={null}>
            <Scene
              touchControls={touchControls}
              setTouchControls={setTouchControls}
              isFirstPerson={isFirstPerson}
              setIsFirstPerson={setIsFirstPerson}
              onReachEnd={() =>
                handleReachEnd(
                  setPoint1Reached,
                  setPoint2Reached,
                  setPoint3Reached,
                  setShowEndOverlay
                )
              }
              onPoint1Reached={() =>
                handlePoint1Reached(
                  setPoint1Reached,
                  setPoint2Reached,
                  setPoint3Reached
                )
              }
              onPoint2Reached={() =>
                handlePoint2Reached(
                  setPoint1Reached,
                  setPoint2Reached,
                  setPoint3Reached
                )
              }
              onPoint3Reached={() =>
                handlePoint3Reached(
                  setPoint1Reached,
                  setPoint2Reached,
                  setPoint3Reached
                )
              }
              restartTrigger={restartTrigger}
              setShowCheckpointsCleared={setShowCheckpointsCleared}
              point1Reached={point1Reached}
              point2Reached={point2Reached}
              point3Reached={point3Reached}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </KeyboardControls>
      {isMobile && (
        <MobileControls
          touchControls={touchControls}
          setTouchControls={setTouchControls}
          isFirstPerson={isFirstPerson}
          setIsFirstPerson={setIsFirstPerson}
        />
      )}
      {/* {showStartOverlay && <StartOverlay onStart={() => handleStart(setShowStartOverlay)} />} */}
      {showEndOverlay && (
        <EndOverlay
          onRestart={() =>
            handleRestart(
              setShowEndOverlay,
              setRestartTrigger,
              setShowStartOverlay
            )
          }
        />
      )}
      {showCheckpointsCleared && (
        <PointOverlay
          heading="Checkpoints Cleared"
          onClose={() => setShowCheckpointsCleared(false)}
        />
      )}
      {point1Reached && (
        <PointOverlay
          heading={"Point 1"}
          onClose={() =>
            handlePointClose(
              setPoint1Reached,
              setPoint2Reached,
              setPoint3Reached
            )
          }
        />
      )}
      {point2Reached && (
        <PointOverlay
          heading={"Point 2"}
          onClose={() =>
            handlePointClose(
              setPoint1Reached,
              setPoint2Reached,
              setPoint3Reached
            )
          }
        />
      )}
      {point3Reached && (
        <PointOverlay
          heading={"Point 3"}
          onClose={() =>
            handlePointClose(
              setPoint1Reached,
              setPoint2Reached,
              setPoint3Reached
            )
          }
        />
      )}
    </div>
  ) : (
    <div className="w-full h-screen select-none">
      <StartOverlay onStart={() => setLoading(true)} />
    </div>
  );
}

export default App;
