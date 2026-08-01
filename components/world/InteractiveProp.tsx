'use client';

import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractivePropProps {
  children: React.ReactNode;
  onClick?: () => void;
  glowColor?: string;
  gazeReveal?: boolean;
}

export default function InteractiveProp({
  children,
  onClick,
  glowColor = '#ffaa00',
  gazeReveal = false,
}: InteractivePropProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;

    let targetIntensity = 0;

    if (gazeReveal) {
      const cameraDir = camera.getWorldDirection(new THREE.Vector3());
      const propPos = groupRef.current.getWorldPosition(new THREE.Vector3());
      const toProp = propPos.sub(camera.position).normalize();
      const dot = cameraDir.dot(toProp);
      targetIntensity = Math.max(0, (dot - 0.85) * 6.5);
    } else if (hovered) {
      targetIntensity = 0.8;
    }

    groupRef.current.traverse((child: any) => {
      if (child.isMesh && child.material && 'emissive' in child.material) {
        if (!child.userData.originalEmissive) {
          child.userData.originalEmissive = child.material.emissive.clone();
          child.userData.originalIntensity = child.material.emissiveIntensity ?? 0;
        }

        if (targetIntensity > 0) {
          child.material.emissive.set(glowColor);
          child.material.emissiveIntensity = THREE.MathUtils.lerp(
            child.material.emissiveIntensity ?? 0,
            targetIntensity,
            0.15
          );
        } else {
          child.material.emissive.copy(child.userData.originalEmissive);
          child.material.emissiveIntensity = THREE.MathUtils.lerp(
            child.material.emissiveIntensity ?? 0,
            child.userData.originalIntensity,
            0.15
          );
        }
      }
    });
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      {children}
    </group>
  );
}
