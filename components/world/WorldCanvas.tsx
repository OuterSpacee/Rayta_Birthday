'use client';

import React, { useState, useEffect } from 'react';
import { useBirthdayStore } from '@/lib/store';
import { CONFIG } from '@/lib/config';
import { soundManager } from '../audio/soundManager';
import { useDoorTransition, DoorTransitionOverlay } from './DoorTransition';
import Hallway2D from './Hallway2D';
import FriendRoom2D from './FriendRoom2D';

export default function WorldCanvas() {
  const activeRoom = useBirthdayStore((s) => s.activeRoom);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        background: '#0a0a0e',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* 2D Parallax Perspective World */}
      {activeRoom ? <FriendRoom2D roomId={activeRoom} /> : <Hallway2D />}

      {/* Screen Fade Transition Overlay */}
      <DoorTransitionOverlay />
    </div>
  );
}
