import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import City from './City';

export default function FrustumCulledCity() {
  const { camera } = useThree();
  const cityRef = useRef();
  const [visibleMeshes, setVisibleMeshes] = useState(new Set());
  const frustum = useRef(new THREE.Frustum());
  const projScreenMatrix = useRef(new THREE.Matrix4());
  const lastCheckTime = useRef(0);
  const checkInterval = 100; // Check every 100ms

  // Group meshes by distance for LOD
  const meshGroups = useMemo(() => {
    if (!cityRef.current) return [];
    
    const meshes = cityRef.current.children.filter(child => child instanceof THREE.Mesh);
    return meshes.reduce((groups, mesh) => {
      const position = new THREE.Vector3();
      mesh.getWorldPosition(position);
      const distance = position.distanceTo(camera.position);
      
      // Group meshes by distance
      if (distance < 20) {
        groups.near.push(mesh);
      } else if (distance < 50) {
        groups.mid.push(mesh);
      } else {
        groups.far.push(mesh);
      }
      return groups;
    }, { near: [], mid: [], far: [] });
  }, [camera.position]);

  useEffect(() => {
    if (!cityRef.current) return;

    const checkVisibility = (timestamp) => {
      // Throttle checks
      if (timestamp - lastCheckTime.current < checkInterval) {
        requestAnimationFrame(checkVisibility);
        return;
      }
      lastCheckTime.current = timestamp;

      // Update frustum
      projScreenMatrix.current.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      );
      frustum.current.setFromProjectionMatrix(projScreenMatrix.current);

      const newVisibleMeshes = new Set();
      
      // Check visibility for each group with different detail levels
      Object.entries(meshGroups).forEach(([group, meshes]) => {
        meshes.forEach(mesh => {
          const boundingSphere = new THREE.Sphere();
          mesh.geometry.computeBoundingSphere();
          boundingSphere.copy(mesh.geometry.boundingSphere);
          boundingSphere.applyMatrix4(mesh.matrixWorld);
          
          if (frustum.current.intersectsSphere(boundingSphere)) {
            newVisibleMeshes.add(mesh);
            
            // Apply LOD based on distance
            if (group === 'far') {
              mesh.material.dithering = true;
              mesh.material.precision = 'lowp';
            } else if (group === 'mid') {
              mesh.material.dithering = false;
              mesh.material.precision = 'mediump';
            } else {
              mesh.material.dithering = false;
              mesh.material.precision = 'highp';
            }
          }
        });
      });

      setVisibleMeshes(newVisibleMeshes);
      requestAnimationFrame(checkVisibility);
    };

    const animationId = requestAnimationFrame(checkVisibility);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [camera, meshGroups]);

  return (
    <group ref={cityRef}>
      <City />
      {cityRef.current && cityRef.current.children.map((child, index) => {
        if (child instanceof THREE.Mesh) {
          return React.cloneElement(child, {
            key: index,
            visible: visibleMeshes.has(child),
            frustumCulled: true,
            castShadow: true,
            receiveShadow: true
          });
        }
        return child;
      })}
    </group>
  );
} 