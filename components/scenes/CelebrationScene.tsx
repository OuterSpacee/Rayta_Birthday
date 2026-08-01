'use client';

import React, { useEffect, useState } from 'react';
import { useBirthdayStore } from '@/lib/store';
import { FlowerBurst } from '@/components/effects/FlowerBurst';
import styles from './CelebrationScene.module.css';

export function CelebrationScene() {
  const setScene = useBirthdayStore((s) => s.setScene);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show text mid-burst
    const textTimer = setTimeout(() => setShowText(true), 800);
    // Auto-advance to message scene
    const advanceTimer = setTimeout(() => setScene('message'), 4500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(advanceTimer);
    };
  }, [setScene]);

  return (
    <div className={`scene ${styles.container}`}>
      <div className="scene-canvas">
        <FlowerBurst active duration={4000} />
      </div>

      <div className="scene-content">
        {showText && (
          <h1 className={`heading-retro heading-crimson animate-crt-on ${styles.text}`}>
            HAPPY BIRTHDAY!
          </h1>
        )}
      </div>
    </div>
  );
}
