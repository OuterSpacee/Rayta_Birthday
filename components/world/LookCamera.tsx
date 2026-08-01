'use client';

import { useFrame } from '@react-three/fiber';
import { useLookAround } from '@/lib/useLookAround';
import { useEffect } from 'react';

export default function LookCamera() {
  const { targetYaw, targetPitch, bind } = useLookAround();

  useEffect(() => {
    const handleTouchStart = bind.onTouchStart as any;
    const handleTouchMove = bind.onTouchMove as any;
    
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [bind]);

  useFrame((state) => {
    const pitch = state.camera.rotation.x;
    const yaw = state.camera.rotation.y;
    
    state.camera.rotation.set(
      pitch + (targetPitch - pitch) * 0.08,
      yaw + (targetYaw - yaw) * 0.08,
      0,
      'YXZ'
    );
  });

  return null;
}
