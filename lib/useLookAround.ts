'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface LookAroundState {
  targetYaw: number;
  targetPitch: number;
  bind: {
    onTouchStart?: (e: React.TouchEvent | TouchEvent) => void;
    onTouchMove?: (e: React.TouchEvent | TouchEvent) => void;
  };
}

export function useLookAround(): LookAroundState {
  const [targetYaw, setTargetYaw] = useState(0);
  const [targetPitch, setTargetPitch] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);

  const MAX_YAW = 0.87; // ~50 degrees
  const MAX_PITCH = 0.52; // ~30 degrees

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Ignore if touch is active
      if (touchStartRef.current) return;

      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;

      setTargetYaw(-x * MAX_YAW);
      setTargetPitch(-y * MAX_PITCH);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : (e as any);
    if (!touch) return;
    
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    currentYawRef.current = targetYaw;
    currentPitchRef.current = targetPitch;
  }, [targetPitch, targetYaw]);

  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = 'touches' in e ? e.touches[0] : (e as any);
    if (!touch) return;

    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    const { innerWidth, innerHeight } = window;

    const yawDelta = -(deltaX / innerWidth) * MAX_YAW * 2;
    const pitchDelta = -(deltaY / innerHeight) * MAX_PITCH * 2;

    const newYaw = Math.max(-MAX_YAW, Math.min(MAX_YAW, currentYawRef.current + yawDelta));
    const newPitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, currentPitchRef.current + pitchDelta));

    setTargetYaw(newYaw);
    setTargetPitch(newPitch);
  }, []);

  return {
    targetYaw,
    targetPitch,
    bind: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
    }
  };
}
