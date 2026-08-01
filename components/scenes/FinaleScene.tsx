'use client';

import React, { useState, useMemo } from 'react';
import { CONFIG } from '@/lib/config';
import { StarrySky } from '@/components/effects/StarrySky';
import { Fireworks } from '@/components/effects/Fireworks';
import { soundManager } from '@/components/audio/soundManager';
import styles from './FinaleScene.module.css';

export function FinaleScene() {
  const [fireworksLaunched, setFireworksLaunched] = useState(false);

  const lines = useMemo(
    () => CONFIG.messages.finaleNote.split('\n').filter(Boolean),
    []
  );

  const handleLaunch = () => {
    soundManager.playSFX('firework');
    setFireworksLaunched(true);
  };

  return (
    <div className={`scene ${styles.container}`}>
      <div className="scene-canvas">
        <StarrySky preset="celebration" starCount={250} />
      </div>

      {fireworksLaunched && <Fireworks active />}

      <div className={`scene-content ${styles.content}`}>
        <div className={styles.messageContainer}>
          {lines.map((line, i) => (
            <p
              key={i}
              className={`${styles.line} fade-in-up`}
              style={{ animationDelay: `${i * 1.2}s` }}
            >
              {line}
            </p>
          ))}
        </div>

        {!fireworksLaunched ? (
          <button
            id="btn-launch-fireworks"
            className="btn-arcade btn-arcade--crimson fade-in-up"
            style={{ animationDelay: `${lines.length * 1.2 + 0.5}s` }}
            onClick={handleLaunch}
          >
            LAUNCH FIREWORKS
          </button>
        ) : (
          <div className={`${styles.finalText} animate-glow`}>
            WITH LOVE ♥
          </div>
        )}
      </div>
    </div>
  );
}
