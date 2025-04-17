import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from './components/3d&Scene/Scene'

function App() {

  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <Scene/>
        <OrbitControls />
      </Canvas>
    </>
  )
}

export default App
