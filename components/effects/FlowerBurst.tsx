'use client';

import React, { useEffect, useRef } from 'react';

interface FlowerBurstProps {
  active: boolean;
  onComplete?: () => void;
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotSpeed: number;
}

export function FlowerBurst({ active, onComplete, duration = 3000 }: FlowerBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#ffaa00', '#ff2a5f', '#00ff66'];
    const particleCount = 180;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 2;
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // slight upward bias initially
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let startTime: number | null = null;
    const gravity = 0.15;
    const drag = 0.96;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allDead = true;

      particlesRef.current.forEach(p => {
        if (p.alpha <= 0) return;
        allDead = false;

        p.vx *= drag;
        p.vy *= drag;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        
        // fade out towards the end
        if (elapsed > duration * 0.6) {
          p.alpha -= 0.02;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        
        // draw petal-like shape (oval)
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (elapsed < duration && !allDead) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [active, duration, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50, background: 'transparent' }}
    />
  );
}
