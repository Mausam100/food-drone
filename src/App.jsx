import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Scene } from "./components/3d&Scene/Scene";
import { MobileControls } from "./components/3d&Scene/MobileControls";

// Initial touch controls state
const initialTouchControls = {
  joystick: { active: false, x: 0, y: 0 },
  rotateLeft: false,
  rotateRight: false,
  up: false,
  down: false
};

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [touchControls, setTouchControls] = useState(initialTouchControls);

  // Memoize key map to prevent recreation
  const keyMap = useMemo(() => [
    { name: "forward", keys: ["w"] },
    { name: "backward", keys: ["s"] },
    { name: "left", keys: ["a"] },
    { name: "right", keys: ["d"] },
    { name: "up", keys: ["ArrowUp"] },
    { name: "down", keys: ["ArrowDown"] },
    { name: "rotateLeft", keys: ["ArrowLeft"] },
    { name: "rotateRight", keys: ["ArrowRight"] },
    { name: "firstPerson", keys: ["f"] },
  ], []);

  // Memoize mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    
    // Initial check
    checkMobile();
    
    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Memoize canvas props
  const canvasProps = useMemo(() => ({
    camera: { 
      position: [21.2, 2.3, -38], 
      fov: 30,
      near: 0.1,    
    },
    dpr: [1, 2], // Enable high DPR for better quality on high-res displays
    gl: {
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    },
    performance: {
      min: 0.5
    }
  }), []);

  return (
    <div className="w-full h-screen select-none">
      <KeyboardControls map={keyMap}>
        <Canvas {...canvasProps}>
          <Scene 
            touchControls={touchControls} 
            setTouchControls={setTouchControls}
            isFirstPerson={isFirstPerson}
            setIsFirstPerson={setIsFirstPerson}
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
    </div>
  );
}

export default App;
