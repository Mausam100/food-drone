import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Scene } from "./components/3d&Scene/Scene";
import { MobileControls } from "./components/3d&Scene/MobileControls";
import EndOverlay from "./components/Home/EndOverlay";
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
    down: false
  });
  const [showOverlay, setShowOverlay] = useState(false);
  const [restartTrigger, setRestartTrigger] = useState(false);
  const handleReachEnd = () => {
    setShowOverlay(true);
  };

  const handleRestart = () => {
    setShowOverlay(false);
    setRestartTrigger((prev) => !prev); // Toggle restart trigger to reset the drone
  };
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-screen select-none">
      <KeyboardControls map={keyMap}>
        <Canvas camera={{ 
          position: [21.2, 2.3, -38], 
          fov: 30,
          near: 0.1,    
        }}>
          <Scene 
            touchControls={touchControls} 
            setTouchControls={setTouchControls}
            isFirstPerson={isFirstPerson}
            setIsFirstPerson={setIsFirstPerson}
            onReachEnd={handleReachEnd}
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
       {showOverlay && (
          <EndOverlay
            onRestart={handleRestart}
            message="Congratulations! You've reached the end point!"
          />
        )}
    </div>
  );
}

export default App;
