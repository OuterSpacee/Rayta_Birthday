'use client';

import React, { useEffect, useRef } from 'react';

interface StarrySkyProps {
  starCount?: number;
  className?: string;
  preset?: 'intro' | 'celebration' | 'message' | 'hallway' | 'room' | 'default';
  accentColor?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  baseAlpha: number;
  speed: number;
}

export function StarrySky({
  starCount = 200,
  className = '',
  preset = 'default',
  accentColor = '#ffaa00',
}: StarrySkyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const getPalette = () => {
      if (preset === 'celebration') return ['#ffaa00', '#ff2a5f', '#ffffff'];
      if (preset === 'message') return ['#00e5ff', '#ffaa00', '#ffffff'];
      if (preset === 'room') return [accentColor, '#ffffff', 'rgba(255,255,255,0.8)'];
      return ['#ffffff', '#fff4cc', '#ffaa00', '#00ff66'];
    };

    const palette = getPalette();
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.8,
        color: palette[Math.floor(Math.random() * palette.length)],
        baseAlpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.05 + 0.01,
      });
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle background gradient nebula based on preset
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        100,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );

      if (preset === 'intro') {
        grad.addColorStop(0, 'rgba(255, 170, 0, 0.06)');
        grad.addColorStop(1, 'rgba(10, 10, 14, 0)');
      } else if (preset === 'celebration') {
        grad.addColorStop(0, 'rgba(255, 42, 95, 0.08)');
        grad.addColorStop(1, 'rgba(10, 10, 14, 0)');
      } else if (preset === 'message') {
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
        grad.addColorStop(1, 'rgba(10, 10, 14, 0)');
      } else if (preset === 'room') {
        grad.addColorStop(0, `${accentColor}10`);
        grad.addColorStop(1, 'rgba(10, 10, 14, 0)');
      } else {
        grad.addColorStop(0, 'rgba(20, 18, 32, 0.2)');
        grad.addColorStop(1, 'rgba(10, 10, 14, 0)');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Stars
      stars.forEach((star) => {
        const alpha = star.baseAlpha + Math.sin(time * 0.002 * star.speed * 100) * 0.3;
        const clampedAlpha = Math.max(0.1, Math.min(1, alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starCount, preset, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        background: 'transparent',
      }}
    />
  );
}
