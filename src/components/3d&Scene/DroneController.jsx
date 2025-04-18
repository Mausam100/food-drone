import { RigidBody } from '@react-three/rapier'
import React from 'react'
import Drone from './Model/Drone'

function DroneController() {
  return (
    <RigidBody

  >
    <group >
      <Drone />
    </group>
  </RigidBody>
  )
}

export default DroneController
