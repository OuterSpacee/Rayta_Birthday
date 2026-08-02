'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CandleFlameProps {
  lit: boolean;
  onBlowOut?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const SCALE_FACTORS = {
  sm: 0.5,
  md: 0.75,
  lg: 1.0,
};

export function CandleFlame({ lit, onBlowOut, size = 'md' }: CandleFlameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showSmoke, setShowSmoke] = useState(false);
  const [scale, setScale] = useState(SCALE_FACTORS[size]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        setScale(SCALE_FACTORS[size] * 0.72);
      } else {
        setScale(SCALE_FACTORS[size]);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  useEffect(() => {
    if (!lit) {
      setShowSmoke(true);
      const timer = setTimeout(() => setShowSmoke(false), 2200);
      return () => clearTimeout(timer);
    } else {
      setShowSmoke(false);
    }
  }, [lit]);

  // Canvas Gooey Particle Flame Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const cw = (canvas.width = 300);
    const ch = (canvas.height = 200);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    class FlameParticle {
      x: number;
      y: number;
      radius: number;
      speed: { x: number; y: number };
      life: number;
      alpha: number;
      curAlpha: number;
      curLife: number;

      constructor(x = cw / 2, y = ch - 20) {
        this.radius = rand(12, 18);
        this.speed = { x: rand(-0.4, 0.4), y: rand(2.0, 3.2) };
        this.life = rand(50, 90);
        this.alpha = 0.5;

        this.x = x;
        this.y = y;
        this.curAlpha = this.alpha;
        this.curLife = this.life;
      }

      update() {
        if (this.curLife <= 80) {
          this.radius -= Math.min(this.radius, 0.22);
          this.curAlpha -= 0.006;
        }

        this.x += this.speed.x;
        this.curLife -= this.speed.y;
        this.y -= this.speed.y;
        this.draw();
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.1, this.radius), 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(254, 252, 207, ${Math.max(0, this.curAlpha)})`;
        ctx.fill();
        ctx.closePath();
      }
    }

    class FlameBase {
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(cw / 2, ch - 18, 13, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(185, 125, 45, 0.45)';
        ctx.fill();
        ctx.closePath();
      }
    }

    const MAX_PARTICLES = 80;
    const particles: FlameParticle[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(new FlameParticle());
    }
    const base = new FlameBase();

    const animate = () => {
      ctx.clearRect(0, 0, cw, ch);

      if (lit) {
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].curLife < 0) {
            particles[i] = new FlameParticle();
          }
          particles[i].update();
        }
        base.draw();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [lit]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
        cursor: lit && onBlowOut ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onClick={() => lit && onBlowOut?.()}
    >
      {/* SVG Gooey Filter for Canvas Particles */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="candle-goo-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Ambient Flame Radial Glow */}
      {lit && (
        <div
          style={{
            position: 'absolute',
            bottom: '120px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(254, 230, 110, 0.4) 0%, rgba(220, 120, 30, 0.15) 45%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Canvas Particle Flame */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          marginBottom: '-55px',
          filter: "url('#candle-goo-blur') blur(1.2px)",
          opacity: lit ? 0.95 : 0,
          transition: 'opacity 0.4s ease-out',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Smoke Wisps on Extinguish */}
      {!lit && showSmoke && (
        <div
          style={{
            position: 'absolute',
            bottom: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 3,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'rgba(210, 210, 220, 0.6)',
                boxShadow: '0 0 10px rgba(210, 210, 220, 0.4)',
                filter: 'blur(1px)',
                animation: `smokeRise 2s ease-out ${i * 0.25}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Realistic Vector SVG Candle */}
      <svg
        id="candle"
        viewBox="0 0 141.166 136.763"
        style={{
          display: 'block',
          width: '280px',
          height: 'auto',
          zIndex: 1,
        }}
      >
        <defs>
          <linearGradient id="b">
            <stop offset="0" stopColor="#321007" />
            <stop offset=".294" stopColor="#7e4417" />
            <stop offset=".542" stopColor="#c0752d" />
            <stop offset="1" stopColor="#f7ef6f" />
          </linearGradient>
          <linearGradient id="c">
            <stop offset="0" stopColor="#bb9c46" stopOpacity=".212" />
            <stop offset=".222" stopColor="#433819" stopOpacity="0" />
            <stop offset="1" stopColor="#020201" stopOpacity=".192" />
          </linearGradient>
          <linearGradient
            gradientTransform="matrix(1 0 0 1.27083 0 -42.037)"
            gradientUnits="userSpaceOnUse"
            y2="157"
            x2="325.857"
            y1="138.104"
            x1="325.857"
            id="j"
          >
            <stop offset="0" stopColor="#7e4417" stopOpacity="0" />
            <stop offset="1" stopColor="#220404" />
          </linearGradient>
          <radialGradient
            id="h"
            cx="322.264"
            cy="150.306"
            fx="322.264"
            fy="150.306"
            r="25.495"
            gradientTransform="matrix(8.6617 0 0 2.52296 -2469.086 -221.95)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#321007" />
            <stop offset=".294" stopColor="#7e4417" />
            <stop offset=".542" stopColor="#c0752d" />
            <stop offset="1" stopColor="#f7ef6f" />
          </radialGradient>
          <radialGradient
            id="i"
            cx="1330.067"
            cy="1011.201"
            fx="1329.597"
            fy="991.312"
            r="65.761"
            gradientTransform="matrix(.40238 -.0005 .00014 .11177 -213.295 -9.579)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#bb9c46" stopOpacity=".212" />
            <stop offset=".222" stopColor="#433819" stopOpacity="0" />
            <stop offset="1" stopColor="#020201" stopOpacity=".192" />
          </radialGradient>
          <radialGradient
            id="g"
            cx="321.813"
            cy="87.115"
            fx="321.813"
            fy="87.115"
            r="43.354"
            gradientTransform="matrix(1.0667 0 0 1.0667 -194.42 43.2)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#58450a" />
            <stop offset="1" stopColor="#58450a" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="f"
            cx="321.813"
            cy="87.115"
            fx="321.813"
            fy="87.115"
            r="59.505"
            gradientTransform="matrix(1.18617 0 0 1.09185 -232.869 39.512)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#58450a" />
            <stop offset="1" stopColor="#58450a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="translate(-78.274 -69.658)">
          <ellipse
            cx="148.857"
            cy="134.629"
            rx="70.583"
            ry="64.97"
            fill="url(#f)"
            paintOrder="stroke fill markers"
          />
          <ellipse
            ry="46.246"
            rx="46.246"
            cy="136.125"
            cx="148.857"
            opacity=".149"
            fill="url(#g)"
            paintOrder="stroke fill markers"
          />
          <g transform="translate(-172.956 49.01)">
            <path
              d="M321.421 92.595c-.63 0-1.23.014-1.818.034-13.035.363-22.33 3.516-23.017 8.509-.73 5.299-.09 12.27-.022 18.442l.466 37.363h49.407l.466-37.363c.077-6.172.708-13.143-.022-18.442-.688-4.993-9.982-8.146-23.017-8.509a51.726 51.726 0 0 0-1.818-.034l-.313.002-.312-.002z"
              fill="url(#h)"
              paintOrder="stroke fill markers"
            />
            <path
              d="M303.332 104.585s-1.042-.75-1.601-.251c-.56.499.173.971.173.971 4.559 2.327 11.72 3.6 19.29 3.602a65.665 65.665 0 0 0 4.141-.133s.575-.061.549-.586c-.026-.525-.83-.477-.83-.477-.972.044-1.949.074-2.929.074-7.27-.002-14.001-1.109-18.793-3.2zM342.298 103.62c-2.599 1.555-4.753 2.376-7.198 2.833 0 0-1.231-.034-1.396.697-.165.731.701.692.701.692 2.892-.409 6.667-1.573 8.635-3.223.323-.187.446-.602.234-.887-.211-.286-.72-.26-.976-.111z"
              fill="#fdfada"
              fillOpacity=".278"
              paintOrder="stroke fill markers"
            />
            <ellipse
              cx="322.045"
              cy="101.359"
              rx="21.673"
              ry="6.409"
              fill="#daaa49"
              paintOrder="stroke fill markers"
            />
            <ellipse
              cx="322.045"
              cy="102.748"
              rx="16.043"
              ry="3.974"
              fill="#e9dc94"
              fillOpacity=".427"
              paintOrder="stroke fill markers"
            />
            <path
              d="M322.045 94.95c-11.97 0-21.673 2.87-21.673 6.41.007.517.228 1.033.655 1.535 2.381-3.21 11.054-5.119 21.018-5.123 9.96.004 18.63 1.91 21.018 5.118.426-.5.646-1.015.655-1.53 0-3.54-9.703-6.41-21.673-6.41z"
              fill="url(#i)"
              paintOrder="stroke fill markers"
            />
            <path
              fill="url(#j)"
              paintOrder="stroke fill markers"
              d="M297.03 132.83h49.407v24.581H297.03z"
            />
            <ellipse
              ry="2.844"
              rx="10.578"
              cy="102.748"
              cx="322.045"
              fill="#e9dc94"
              fillOpacity=".427"
              paintOrder="stroke fill markers"
            />
            <path
              d="M323.91 101.848c.115 1.828-2.09 1.471-2.879 1.46-.083-.002-.159-.007-.241-.01 1.746 1.43 5.034-.104 3.12-1.45z"
              fill="#ac7736"
              fillOpacity=".525"
              paintOrder="stroke fill markers"
            />
            <path
              d="M322.045 94.285c.483 0 .85.493.871 1.105l.234 6.799c.021.612-.493.824-1.105.824s-1.126-.212-1.105-.824l.234-6.8c.021-.611.389-1.104.871-1.104z"
              fill="#181818"
              paintOrder="stroke fill markers"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
