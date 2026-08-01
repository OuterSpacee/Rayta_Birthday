'use client';

import React, { useState, useEffect } from 'react';
import { useBirthdayStore } from '@/lib/store';
import { CONFIG, Friend } from '@/lib/config';
import { Howl } from 'howler';
import { useDoorTransition } from './DoorTransition';
import { StarrySky } from '@/components/effects/StarrySky';
import { soundManager } from '../audio/soundManager';

interface FriendRoom2DProps {
  roomId: string;
}

function AvatarPlaceholder({ friend }: { friend: Friend }) {
  const isGirl = friend.avatar === 'girl';
  const accent = friend.accentColor || '#ffaa00';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '180px',
        background: `radial-gradient(ellipse at center, ${accent}25 0%, #12111c 80%)`,
        border: `2px solid ${accent}`,
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `inset 0 0 20px ${accent}30, 0 4px 15px rgba(0,0,0,0.5)`,
        overflow: 'hidden',
      }}
    >
      {/* Scalable Vector Avatar Illustration (Boy / Girl) */}
      <svg
        viewBox="0 0 100 100"
        style={{
          width: '110px',
          height: '110px',
          filter: `drop-shadow(0 0 8px ${accent})`,
        }}
      >
        <defs>
          <linearGradient id={`avatarGrad-${friend.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#1a1828" />
          </linearGradient>
        </defs>

        {/* Head Base */}
        <circle cx="50" cy="42" r="22" fill="#ffe0bd" stroke={accent} strokeWidth="1.5" />

        {isGirl ? (
          /* Girl Hair & Features */
          <g>
            {/* Long Hair Back */}
            <path d="M 22 42 Q 18 80 32 90 L 68 90 Q 82 80 78 42 Z" fill={accent} opacity="0.85" />
            {/* Bangs */}
            <path d="M 28 35 Q 50 20 72 35 Q 50 30 28 35 Z" fill={accent} />
            {/* Ribbon Bow */}
            <path d="M 32 24 L 40 28 L 36 34 Z M 68 24 L 60 28 L 64 34 Z" fill="#ff2a5f" />
            {/* Eyes */}
            <circle cx="42" cy="42" r="3" fill="#111" />
            <circle cx="58" cy="42" r="3" fill="#111" />
            <circle cx="43" cy="41" r="1" fill="#fff" />
            <circle cx="59" cy="41" r="1" fill="#fff" />
            {/* Blush */}
            <ellipse cx="38" cy="48" rx="3" ry="1.5" fill="#ff2a5f" opacity="0.6" />
            <ellipse cx="62" cy="48" rx="3" ry="1.5" fill="#ff2a5f" opacity="0.6" />
            {/* Smile */}
            <path d="M 45 50 Q 50 55 55 50" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            {/* Shoulders / Clothes */}
            <path d="M 25 90 Q 50 68 75 90 Z" fill={`url(#avatarGrad-${friend.id})`} />
          </g>
        ) : (
          /* Boy Hair & Features */
          <g>
            {/* Cool Spiky Short Hair */}
            <path d="M 26 38 C 20 20 40 12 50 16 C 60 12 80 20 74 38 C 65 24 35 24 26 38 Z" fill={accent} />
            {/* Eyes */}
            <circle cx="42" cy="42" r="3" fill="#111" />
            <circle cx="58" cy="42" r="3" fill="#111" />
            <circle cx="43" cy="41" r="1" fill="#fff" />
            <circle cx="59" cy="41" r="1" fill="#fff" />
            {/* Smile */}
            <path d="M 44 51 Q 50 56 56 51" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            {/* Hoodie Collar / Clothes */}
            <path d="M 22 90 L 35 68 L 50 78 L 65 68 L 78 90 Z" fill={`url(#avatarGrad-${friend.id})`} />
          </g>
        )}
      </svg>

      {/* Name Badge */}
      <div
        className="heading-retro"
        style={{
          fontSize: '15px',
          color: accent,
          marginTop: '6px',
          letterSpacing: '0.1em',
          textShadow: `0 0 8px ${accent}`,
        }}
      >
        {friend.name.toUpperCase()}
      </div>
    </div>
  );
}

export default function FriendRoom2D({ roomId }: FriendRoom2DProps) {
  const { visitRoom, exitRoom } = useBirthdayStore();
  const { startTransition } = useDoorTransition();
  const friend = CONFIG.friends.find((f) => f.id === roomId);

  const [playing, setPlaying] = useState(false);
  const [howlInstance, setHowlInstance] = useState<Howl | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    soundManager.startAmbient();
    if (friend) {
      visitRoom(friend.id);
    }
  }, [friend, visitRoom]);

  // Mouse Parallax 3D Tilt Illusion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 12;
      const y = (e.clientY / innerHeight - 0.5) * -8;
      setTilt({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      soundManager.unduckAmbient();
      if (howlInstance) {
        howlInstance.stop();
      }
    };
  }, [howlInstance]);

  if (!friend) return null;

  const accentColor = friend.accentColor || '#ffaa00';
  const wallColor = friend.wallColor || '#14131a';

  const handlePlayVoice = () => {
    if (playing) {
      howlInstance?.stop();
      setPlaying(false);
      soundManager.unduckAmbient();
      return;
    }

    // Duck global background song volume during voiceover playback
    soundManager.duckAmbient();

    const sound = new Howl({
      src: [friend.audioSrc],
      html5: true,
      onend: () => {
        setPlaying(false);
        soundManager.unduckAmbient();
        visitRoom(friend.id);
      },
      onloaderror: () => {
        setTimeout(() => {
          setPlaying(false);
          soundManager.unduckAmbient();
          visitRoom(friend.id);
        }, 3500);
      },
    });

    setHowlInstance(sound);
    sound.play();
    setPlaying(true);
  };

  const handleExit = () => {
    soundManager.unduckAmbient();
    if (howlInstance) howlInstance.stop();
    startTransition(() => {
      exitRoom();
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse at center, ${wallColor} 0%, #0d0c14 90%)`,
        perspective: '1000px',
        overflow: 'hidden',
        padding: '24px',
      }}
    >
      {/* Dynamic Starfield Background tinted with Friend Accent */}
      <StarrySky preset="room" accentColor={accentColor} starCount={240} />

      {/* Main 3D Perspective Card Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '920px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          zIndex: 2,
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Room Header Panel */}
        <div className="panel" style={{ width: '100%', borderColor: accentColor }}>
          <div className="panel-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`led ${playing ? 'led--green' : 'led--amber'}`} />
              <span>ROOM: {friend.name.toUpperCase()}</span>
            </div>
            <button className="btn-ghost" onClick={handleExit}>
              ◀ EXIT ROOM
            </button>
          </div>

          <h2
            className="heading-display"
            style={{ color: accentColor, fontSize: 'clamp(22px, 5vw, 40px)', margin: '4px 0' }}
          >
            {friend.name}&apos;S SANCTUARY
          </h2>
        </div>

        {/* Room Content Grid: Gramophone + Photo & Keepsake */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            width: '100%',
          }}
        >
          {/* Authentic Rotating Vinyl Record Player Console */}
          <div
            className="panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '28px 20px',
              background: 'var(--surface-raised)',
              border: `2px solid ${accentColor}60`,
            }}
          >
            <div className="panel-header" style={{ width: '100%' }}>
              <span className={`led ${playing ? 'led--green' : 'led--off'}`} />
              <span>VINTAGE GRAMOPHONE PLAYER</span>
            </div>

            {/* Realistic Vinyl Disc & Tonearm */}
            <div
              style={{
                position: 'relative',
                width: '190px',
                height: '190px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Spinning Vinyl Record Disc */}
              <div
                style={{
                  position: 'relative',
                  width: '170px',
                  height: '170px',
                  borderRadius: '50%',
                  background:
                    'repeating-radial-gradient(circle at center, #111 0px, #111 4px, #262626 5px, #111 7px)',
                  border: '3px solid #333',
                  boxShadow: playing
                    ? `0 0 35px ${accentColor}80`
                    : '0 8px 24px rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: playing ? 'vinylSpin 3.5s linear infinite' : 'none',
                }}
              >
                {/* Center Vinyl Label with Friend Name Printed */}
                <div
                  style={{
                    position: 'relative',
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${accentColor} 0%, #111 100%)`,
                    border: '2px solid #111',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: 700,
                    textAlign: 'center',
                    padding: '4px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#000',
                      fontWeight: 'bold',
                      maxWidth: '62px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {friend.name}
                  </div>
                  <div
                    style={{
                      fontSize: '7px',
                      fontFamily: 'var(--font-mono)',
                      color: '#111',
                    }}
                  >
                    33 RPM
                  </div>
                  {/* Spindle Hole */}
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#111',
                      marginTop: '2px',
                    }}
                  />
                </div>
              </div>

              {/* Tonearm Arm Assembly extending onto record */}
              <div
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  width: '60px',
                  height: '90px',
                  pointerEvents: 'none',
                  transform: playing ? 'rotate(18deg)' : 'rotate(0deg)',
                  transformOrigin: 'top right',
                  transition: 'transform 0.8s ease-in-out',
                }}
              >
                {/* Arm Base Pivot */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`,
                  }}
                />
                {/* Metal Arm Line */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '8px',
                    width: '4px',
                    height: '65px',
                    background: 'linear-gradient(to bottom, #ccc, #888)',
                    borderRadius: '2px',
                    transform: 'rotate(-25deg)',
                    transformOrigin: 'top right',
                  }}
                />
              </div>
            </div>

            {/* Audio Action Button */}
            <button
              className={`btn-arcade ${playing ? 'btn-arcade--green' : ''}`}
              onClick={handlePlayVoice}
              style={{ width: '100%', maxWidth: '260px' }}
            >
              {playing ? '⏸ PAUSE RECORDING' : '▶ PLAY MESSAGE'}
            </button>
          </div>

          {/* Photo & Keepsake Section with Gender Avatar */}
          <div
            className="panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '24px',
              background: 'var(--surface-raised)',
              border: `1px solid ${accentColor}50`,
            }}
          >
            <div className="panel-header" style={{ width: '100%' }}>
              <span className="led led--amber" />
              <span>PHOTO & KEEPSAKE</span>
            </div>

            {/* Stylized Gender Avatar Placeholder (Boy / Girl based on name) */}
            <AvatarPlaceholder friend={friend} />

            {/* Personal Note Caption */}
            {friend.note && (
              <div
                style={{
                  fontFamily: 'var(--font-mono-alt)',
                  fontSize: '14px',
                  color: accentColor,
                  background: `${accentColor}10`,
                  border: `1px solid ${accentColor}30`,
                  padding: '12px 16px',
                  borderRadius: '2px',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                &ldquo;{friend.note}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Exit Action Button */}
        <button
          className="btn-arcade"
          onClick={handleExit}
          style={{ marginTop: '4px' }}
        >
          RETURN TO HALLWAY
        </button>
      </div>

      <style jsx>{`
        @keyframes vinylSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
