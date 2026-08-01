'use client';

import React, { useEffect, useState } from 'react';

interface CandleFlameProps {
  lit: boolean;
  onBlowOut?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { candleWidth: 20, candleHeight: 60, flameWidth: 28, flameHeight: 48, wickHeight: 10 },
  md: { candleWidth: 28, candleHeight: 90, flameWidth: 38, flameHeight: 64, wickHeight: 12 },
  lg: { candleWidth: 36, candleHeight: 120, flameWidth: 48, flameHeight: 80, wickHeight: 14 },
};

export function CandleFlame({ lit, onBlowOut, size = 'md' }: CandleFlameProps) {
  const [showSmoke, setShowSmoke] = useState(false);
  const dims = SIZES[size];

  useEffect(() => {
    if (!lit) {
      setShowSmoke(true);
      const timer = setTimeout(() => setShowSmoke(false), 2200);
      return () => clearTimeout(timer);
    } else {
      setShowSmoke(false);
    }
  }, [lit]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: lit && onBlowOut ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onClick={() => lit && onBlowOut?.()}
    >
      {/* Ambient Flame Glow */}
      {lit && (
        <div
          style={{
            position: 'absolute',
            top: -dims.flameHeight * 0.7,
            width: dims.candleWidth * 5,
            height: dims.candleWidth * 5,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at center, rgba(255,170,0,0.4) 0%, rgba(255,42,95,0.15) 50%, transparent 75%)',
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* 100% Vector SVG Teardrop Flame (Zero Sharp Edges / Zero Square Boxes) */}
      <div
        style={{
          position: 'relative',
          width: dims.flameWidth,
          height: dims.flameHeight,
          opacity: lit ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {lit && (
          <svg
            viewBox="0 0 100 140"
            style={{
              width: '100%',
              height: '100%',
              overflow: 'visible',
              animation: 'flameSway 2.5s ease-in-out infinite, flicker 1.8s ease-in-out infinite',
            }}
          >
            <defs>
              <radialGradient id="outerFlameGrad" cx="50%" cy="75%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#ffaa00" />
                <stop offset="75%" stopColor="#ff2a5f" />
                <stop offset="100%" stopColor="#ff2a5f" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="innerFlameGrad" cx="50%" cy="80%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#fff4cc" />
                <stop offset="100%" stopColor="#ffaa00" stopOpacity="0" />
              </radialGradient>
              <filter id="smoothGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer Flame Curved Teardrop Path */}
            <path
              d="M 50 10 C 22 55 18 90 50 130 C 82 90 78 55 50 10 Z"
              fill="url(#outerFlameGrad)"
              filter="url(#smoothGlow)"
            />

            {/* Inner Core Curved Teardrop Path */}
            <path
              d="M 50 45 C 33 72 30 95 50 120 C 70 95 67 72 50 45 Z"
              fill="url(#innerFlameGrad)"
            />
          </svg>
        )}
      </div>

      {/* Smoke Wisps on Extinguish */}
      {!lit && showSmoke && (
        <div
          style={{
            position: 'absolute',
            top: -dims.flameHeight * 0.8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'rgba(200, 200, 210, 0.6)',
                boxShadow: '0 0 10px rgba(200, 200, 210, 0.4)',
                filter: 'blur(1px)',
                animation: `smokeRise 2s ease-out ${i * 0.25}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Candle Wick */}
      <div
        style={{
          width: 2,
          height: dims.wickHeight,
          background: '#222',
          borderRadius: '1px 1px 0 0',
          zIndex: 1,
        }}
      />

      {/* Candle Body */}
      <div
        style={{
          width: dims.candleWidth,
          height: dims.candleHeight,
          background: 'linear-gradient(180deg, #1c1b26 0%, #100f18 100%)',
          border: '2px solid #ffaa00',
          borderTop: 'none',
          borderRadius: '2px 2px 4px 4px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: lit
            ? 'inset 0 10px 15px -5px rgba(255,170,0,0.5), 0 4px 15px rgba(0,0,0,0.6)'
            : '0 4px 15px rgba(0,0,0,0.6)',
        }}
      >
        {/* Top Rim Wax Highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(255, 170, 0, 0.6)',
            borderRadius: '50%',
          }}
        />
        {/* Subtle Candle Stripes */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(180deg, transparent 0px, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 9px)',
          }}
        />
      </div>
    </div>
  );
}
