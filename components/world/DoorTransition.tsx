'use client';

import { create } from 'zustand';

interface TransitionStore {
  isTransitioning: boolean;
  opacity: number;
  startTransition: (callback: () => void) => void;
}

const useTransitionStore = create<TransitionStore>((set) => ({
  isTransitioning: false,
  opacity: 0,
  startTransition: (callback) => {
    set({ isTransitioning: true, opacity: 1 });
    setTimeout(() => {
      callback();
      setTimeout(() => {
        set({ opacity: 0 });
        setTimeout(() => {
          set({ isTransitioning: false });
        }, 600);
      }, 100);
    }, 400);
  }
}));

export function useDoorTransition() {
  const { isTransitioning, startTransition } = useTransitionStore();
  return { isTransitioning, startTransition };
}

export function DoorTransitionOverlay() {
  const { isTransitioning, opacity } = useTransitionStore();
  
  if (!isTransitioning && opacity === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        opacity: opacity,
        transition: opacity === 1 ? 'opacity 0.4s ease-in-out' : 'opacity 0.6s ease-in-out',
        pointerEvents: 'none',
        zIndex: 50
      }}
    />
  );
}
