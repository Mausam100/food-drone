import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Scene } from "./components/3d&Scene/Scene";
import { MobileControls } from "./components/3d&Scene/MobileControls";

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
  const [touchControls, setTouchControls] = useState({
    joystick: { active: false, x: 0, y: 0 },
    rotateLeft: false,
    rotateRight: false,
    up: false,
    down: false
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-screen">
      <KeyboardControls map={keyMap}>
        <Canvas camera={{ 
          position: [21.2, 2.3, -38], 
          fov: 30,
          near: 0.1,    // Objects closer than 0.1 units won't be rendered
          far: 1000     // Objects further than 1000 units won't be rendered
        }}>
          <Scene touchControls={touchControls} setTouchControls={setTouchControls} />
        </Canvas>
      </KeyboardControls>
      {isMobile && <MobileControls touchControls={touchControls} />}
      
    </div>
  );
}

export default App;
