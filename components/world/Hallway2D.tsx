'use client';

import React, { useState, useEffect } from 'react';
import { useBirthdayStore } from '@/lib/store';
import { CONFIG } from '@/lib/config';
import { soundManager } from '../audio/soundManager';
import { useDoorTransition } from './DoorTransition';
import { StarrySky } from '@/components/effects/StarrySky';

export default function Hallway2D() {
  const { enterRoom, roomsVisited, allRoomsVisited, setScene } = useBirthdayStore();
  const { startTransition } = useDoorTransition();
  const friends = CONFIG.friends;
  const isFinished = allRoomsVisited();

  // Mouse / Touch Parallax 3D Tilt Illusion
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    soundManager.startAmbient();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * -10;
      setTilt({ x, y });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      const { innerWidth, innerHeight } = window;
      const x = (touch.clientX / innerWidth - 0.5) * 16;
      const y = (touch.clientY / innerHeight - 0.5) * -10;
      setTilt({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleDoorClick = (friendId: string) => {
    soundManager.playSFX('door');
    startTransition(() => {
      enterRoom(friendId);
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1b1928 0%, #0a0a0e 85%)',
        perspective: '1200px',
        overflow: 'hidden',
        padding: '12px',
      }}
    >
      {/* Full-Screen Dynamic Starfield Background */}
      <StarrySky preset="hallway" starCount={220} />

      {/* Grid Floor 3D Plane */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          background:
            'linear-gradient(rgba(255,170,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,170,0,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: `perspective(600px) rotateX(65deg) translateY(120px) rotateY(${tilt.x * 0.3}deg)`,
          transformOrigin: 'bottom center',
          pointerEvents: 'none',
        }}
      />

      {/* Main 3D Parallax Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          zIndex: 2,
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
          padding: '8px',
        }}
      >
        {/* Header HUD Panel */}
        <div className="panel" style={{ width: '100%', maxWidth: '800px', textAlign: 'center', padding: '12px 16px' }}>
          <div className="panel-header" style={{ justifyContent: 'space-between', paddingBottom: '6px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={`led ${isFinished ? 'led--green' : 'led--amber'}`} />
              <span>THE HALLWAY</span>
            </div>
            <div style={{ color: 'var(--accent-amber)', fontSize: '11px' }}>
              VISITED: {roomsVisited.length} / {friends.length}
            </div>
          </div>

          <h2
            className="heading-display"
            style={{ fontSize: 'clamp(18px, 3.5vw, 32px)', margin: '4px 0 2px' }}
          >
            RAYTA&apos;S FRIEND ROOMS
          </h2>
          <p className="text-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Choose a door to step inside and listen to their message.
          </p>
        </div>

        {/* 12 Doors Grid Layout (Responsive on Mobile) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(130px, 28vw, 180px), 1fr))',
            gap: '12px',
            width: '100%',
            maxHeight: 'calc(100dvh - 160px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '8px 4px',
          }}
        >
          {friends.map((friend, idx) => {
            const isVisited = roomsVisited.includes(friend.id);
            const accent = friend.accentColor || '#ffaa00';

            return (
              <div
                key={friend.id}
                onClick={() => handleDoorClick(friend.id)}
                style={{
                  position: 'relative',
                  background: 'var(--surface-panel)',
                  border: `2px solid ${isVisited ? 'var(--accent-green)' : 'var(--border-base)'}`,
                  borderRadius: '4px',
                  padding: '12px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: isVisited
                    ? '0 0 15px rgba(0, 255, 102, 0.25)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                {/* Status LED & Room Number */}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-dim)',
                  }}
                >
                  <span>ROOM 0{idx + 1}</span>
                  <span className={`led ${isVisited ? 'led--green' : 'led--off'}`} />
                </div>

                {/* Styled 2D Door Illustration */}
                <div
                  style={{
                    width: '56px',
                    height: '88px',
                    background: '#1a1826',
                    border: `2px solid ${accent}`,
                    borderRadius: '3px 3px 0 0',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isVisited ? `inset 0 0 15px ${accent}60` : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '68px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: '6px',
                      top: '44px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--accent-amber)',
                      boxShadow: '0 0 6px var(--accent-amber)',
                    }}
                  />
                </div>

                {/* Friend Name Badge */}
                <div
                  className="heading-retro"
                  style={{
                    fontSize: '15px',
                    color: isVisited ? 'var(--accent-green)' : accent,
                    textShadow: isVisited ? 'var(--glow-green-text)' : 'none',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  {friend.name.toUpperCase()}
                </div>

                {/* Candle Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    color: isVisited ? 'var(--accent-green)' : 'var(--text-dim)',
                  }}
                >
                  {isVisited ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span className="led led--green" />
                      <span style={{ color: 'var(--accent-green)', fontWeight: 700, letterSpacing: '0.05em' }}>
                        🔥 LIT
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', opacity: 0.6 }}>
                      <span className="led led--off" />
                      <span>UNLIT</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <button
            className={`btn-arcade ${isFinished ? 'btn-arcade--green' : ''}`}
            onClick={() => setScene('finale')}
          >
            {isFinished ? '★ ENTER FINALE ★' : 'LEAVE HALLWAY'}
          </button>
        </div>
      </div>
    </div>
  );
}
