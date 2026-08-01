'use client';

import React, { useEffect, useState } from 'react';
import { useBirthdayStore } from '@/lib/store';
import { CONFIG } from '@/lib/config';
import { StarrySky } from '@/components/effects/StarrySky';
import { soundManager } from '@/components/audio/soundManager';
import styles from './MessageScene.module.css';

export function MessageScene() {
  const setScene = useBirthdayStore((s) => s.setScene);
  const [showName, setShowName] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [typedName, setTypedName] = useState('');

  // Start continuous ambient background music
  useEffect(() => {
    soundManager.startAmbient();
  }, []);

  // Staggered reveals
  useEffect(() => {
    const nameTimer = setTimeout(() => setShowName(true), 1200);
    const buttonTimer = setTimeout(() => setShowButton(true), 3600);
    return () => {
      clearTimeout(nameTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  // Typewriter effect with synthesized typing sound click
  useEffect(() => {
    if (!showName) return;
    const name = CONFIG.name;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedName(name.slice(0, i));
      soundManager.playTypingClick(); // Play typing click sound
      if (i >= name.length) clearInterval(interval);
    }, 110);
    return () => clearInterval(interval);
  }, [showName]);

  return (
    <div className={`scene ${styles.container}`}>
      <div className="scene-canvas">
        <StarrySky preset="message" starCount={220} />
      </div>

      <div className={`scene-content ${styles.contentWrap}`}>
        <h1
          className={`heading-display animate-crt-on ${styles.heading}`}
          style={{ fontSize: 'clamp(36px, 8vw, 80px)' }}
        >
          {CONFIG.messages.birthday}
        </h1>

        <div className={styles.nameWrap}>
          {showName && (
            <span className={`heading-retro ${styles.name}`}>
              {typedName}
              <span className={styles.cursor}>▌</span>
            </span>
          )}
        </div>

        {showButton && (
          <button
            id="btn-enter-world"
            className="btn-arcade btn-arcade--green fade-in-up"
            onClick={() => {
              soundManager.playSFX('whoosh');
              setScene('world');
            }}
          >
            ENTER THE HALLWAY
          </button>
        )}
      </div>
    </div>
  );
}
