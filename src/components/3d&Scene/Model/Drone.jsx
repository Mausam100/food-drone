import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Drone(props) {
    const group = useRef()
    const { nodes, materials } = useGLTF('/hot_dog_drone.glb')

    return (
        <group ref={group} scale={0.005} {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_2.geometry}
                material={materials.wire_000000000}
                rotation={[-Math.PI/2 , 0, 0]}
            />
        </group>
    )
}

useGLTF.preload('/hot_dog_drone.glb')
