'use client';

import React, { useEffect, useRef } from 'react';
import { soundManager } from '@/components/audio/soundManager';

interface FireworksProps {
  active: boolean;
  onComplete?: () => void;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
}

export function Fireworks({ active, onComplete }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let launchInterval: NodeJS.Timeout;

    const colors = ['#ffaa00', '#00ff66', '#ff2a5f', '#ffffff', '#00e5ff', '#ff00ea'];
    const sparks: Spark[] = [];
    const rockets: Rocket[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const createExplosion = (x: number, y: number, color: string) => {
      // Trigger firework explosion sound
      soundManager.playFireworkExplosion();

      const sparkCount = 80 + Math.floor(Math.random() * 40);
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 2,
          color,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01,
        });
      }
    };

    const launchRocket = () => {
      const startX = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
      const targetY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      rockets.push({
        x: startX,
        y: canvas.height,
        targetY,
        vy: -12 - Math.random() * 4,
        color,
      });
    };

    launchRocket();
    launchRocket();
    launchInterval = setInterval(() => {
      if (active) {
        launchRocket();
        if (Math.random() > 0.4) launchRocket();
      }
    }, 650);

    const draw = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.1;
        s.vx *= 0.98;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(launchInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        background: 'transparent',
      }}
    />
  );
}
