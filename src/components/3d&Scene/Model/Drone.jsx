import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Drone({ color = "#00c3ae", ...props }) {
    const group = useRef()
    const { nodes, materials } = useGLTF('/hot_dog_drone.glb')

    // Create a new material with the custom color
    const customMaterial = React.useMemo(() => {
        return materials.wire_000000000.clone()
    }, [materials.wire_000000000])

    // Update the material color when the color prop changes
    React.useEffect(() => {
        customMaterial.color.set(color)
    }, [color, customMaterial])

    return (
        <group ref={group} scale={0.005} {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_2.geometry}
                material={customMaterial}
                rotation={[-Math.PI/2 , 0, 0]}
            />
        </group>
    )
}

useGLTF.preload('/hot_dog_drone.glb')
