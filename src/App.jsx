import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Scene } from "./components/3d&Scene/Scene";
import { MobileControls } from "./components/3d&Scene/MobileControls";
import EndOverlay from "./components/Home/EndOverlay";
import StartOverlay from "./components/Home/StartOverlay";
import PointOverlay from "./components/Home/PointOverlay";

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
  const [restartTrigger, setRestartTrigger] = useState(false);

  // Handle fullscreen functionality
  useEffect(() => {
    const handleFullscreenChange = () => {
      // You can add any logic here that needs to run when fullscreen changes
      console.log('Fullscreen changed:', !!document.fullscreenElement);
    };

    // Add event listener for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup function
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleStart = () => {
    setShowStartOverlay(false);
    // Request fullscreen when game starts
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  };

  const handleReachEnd = () => {
    setPoint1Reached(false);
    setPoint2Reached(false);
    setPoint3Reached(false);
    setShowEndOverlay(true);
  };

  const handleRestart = () => {
    setShowEndOverlay(false);
    setRestartTrigger((prev) => !prev); // Toggle restart trigger to reset the drone
    setShowStartOverlay(true); // Show the start overlay again
  };

  const handlePoint1Reached = () => {
    setPoint1Reached(true);
    setPoint2Reached(false);
    setPoint3Reached(false);
  };

  const handlePoint2Reached = () => {
    setPoint1Reached(false);
    setPoint2Reached(true);
    setPoint3Reached(false);
  };

  const handlePoint3Reached = () => {
    setPoint1Reached(false);
    setPoint2Reached(false);
    setPoint3Reached(true);
  };

  useEffect(() => {
    if (!point1Reached) return;
    let tm;
    if (point1Reached) {
      tm = setTimeout(() => {
        setPoint1Reached(false);
      }, 20000);
    }
    return () => clearTimeout(tm);
  }, [point1Reached]);

  useEffect(() => {
    if (!point2Reached) return;
    let tm;
    if (point2Reached) {
      tm = setTimeout(() => {
        setPoint2Reached(false);
      }, 20000);
    }
    return () => clearTimeout(tm);
  }, [point2Reached]);
  useEffect(() => {
    if (!point3Reached) return;
    let tm;
    if (point3Reached) {
      tm = setTimeout(() => {
        setPoint3Reached(false);
      }, 20000);
    }
    return () => clearTimeout(tm);
  }, [point3Reached]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePointClose = () => {
    setPoint1Reached(false);
    setPoint2Reached(false);
    setPoint3Reached(false);
  };

  return (
    <div className="w-full h-screen select-none">
      <KeyboardControls map={keyMap}>
        <Canvas
          camera={{
            position: [21.2, 2.3, -38],
            fov: 30,
            near: 0.1,
          }}
        >
          <Scene
            touchControls={touchControls}
            setTouchControls={setTouchControls}
            isFirstPerson={isFirstPerson}
            setIsFirstPerson={setIsFirstPerson}
            onReachEnd={handleReachEnd}
            onPoint1Reached={handlePoint1Reached}
            onPoint2Reached={handlePoint2Reached}
            onPoint3Reached={handlePoint3Reached}
            restartTrigger={restartTrigger}
          />
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
      {showStartOverlay && <StartOverlay onStart={handleStart} />}
      {showEndOverlay && (
        <EndOverlay
          onRestart={handleRestart}
          message="Congratulations! You've reached the end point!"
        />
      )}
      {point1Reached && (
        <PointOverlay heading={"Point 1"} onClose={handlePointClose} />
      )}
      {point2Reached && (
        <PointOverlay heading={"Point 2"} onClose={handlePointClose} />
      )}
      {point3Reached && (
        <PointOverlay heading={"Point 3"} onClose={handlePointClose} />
      )}
    </div>
  );
}

export default App;
