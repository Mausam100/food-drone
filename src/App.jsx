import React from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Scene } from "./components/3d&Scene/Scene";

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
  return (
    <div className="w-full h-screen">
      <KeyboardControls map={keyMap}>
        <Canvas camera={{ position: [0, 5, 10], fov: 30 }}>
          <Scene />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default App;
