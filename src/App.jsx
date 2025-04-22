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
import MobileWarning from "./components/Home/MobileWarning";
import DroneCustomization from "./components/3d&Scene/Model/DroneCustomization";
import {
  handleReachEnd,
  handlePoint1Reached,
  handlePoint2Reached,
  handlePoint3Reached,
  handleRestart,
  handlePointClose,
} from "./utils/allFun"; // Game controls

// Key mappings for keyboard controls
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
  // State variables for various game states
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
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [droneColor, setDroneColor] = useState("#00c3ae");

  // Effect to handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      console.log("Fullscreen changed:", !!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Effect to detect if the user is on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Effect to show mobile warning
  useEffect(() => {
    if (isMobile) {
      setShowMobileWarning(true);
    }
  }, [isMobile]);

  return loading ? (
    <div className="w-full h-[100dvh] select-none font-ZF2334">
      {/* Mobile Warning */}
      {showMobileWarning && (
        <MobileWarning onClose={() => setShowMobileWarning(false)} />
      )}

      {/* Drone Customization */}
      <DroneCustomization
        onColorChange={setDroneColor}
      />

      {/* Keyboard controls wrapper */}
      <KeyboardControls map={keyMap}>
        <Canvas
          dpr={dpr}
          camera={{
            position: [21.2, 2.3, -38],
            fov: 30,
            near: 0.1,
          }}
        >
          {/* Performance monitor to dynamically adjust DPR */}
          <PerformanceMonitor
            factor={1}
            onChange={({ factor }) => setDpr(Math.floor(0.5 + 1.5 * factor, 1))}
          />

          <Suspense fallback={null}>
            {/* Main 3D Scene */}
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
              droneColor={droneColor}
            />
            <Preload all  />
          </Suspense>
        </Canvas>
      </KeyboardControls>

      {/* Mobile controls for touch devices */}
      {isMobile && (
        <MobileControls
          touchControls={touchControls}
          setTouchControls={setTouchControls}
          isFirstPerson={isFirstPerson}
          setIsFirstPerson={setIsFirstPerson}
        />
      )}

      {/* End overlay */}
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

      {/* Checkpoints cleared overlay */}
      {showCheckpointsCleared && (
        <PointOverlay
          heading="Checkpoints Cleared"
          onClose={() => setShowCheckpointsCleared(false)}
        />
      )}

      {/* Point 1 overlay */}
      {point1Reached && (
        <PointOverlay
          heading={"Dispatch Systems"}
          span={"Smart "}
          description={
            "AI instantly connects orders with available drones. Fast, smart, and always ready. Effect: Lines/light paths show optimized drone routes across the city."
          }
          onClose={() =>
            handlePointClose(
              setPoint1Reached,
              setPoint2Reached,
              setPoint3Reached
            )
          }
        />
      )}

      {/* Point 2 overlay */}
      {point2Reached && (
        <PointOverlay
          heading={"Friendly Flight"}
          span={"Eco-"}
          description={
            "Zero carbon emissions No engine noise Supports a greener future."
          }
          onClose={() =>
            handlePointClose(
              setPoint1Reached,
              setPoint2Reached,
              setPoint3Reached
            )
          }
        />
      )}

      {/* Point 3 overlay */}
      {point3Reached && (
        <PointOverlay
          heading={"any where"}
          span={"Delivery,"}
          description={"Real-time tracking."}
          description2={"Climate-controlled food."}
          description3={"Delivered your way."}
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
    // Start overlay when loading is false
    <div className="font-ZF2334 w-full h-screen select-none">
      <StartOverlay onStart={() => setLoading(true)} />
    </div>
  );
}

export default App;
