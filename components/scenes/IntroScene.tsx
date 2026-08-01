'use client';

import React, { useState } from 'react';
import { useBirthdayStore } from '@/lib/store';
import { useMicBlow } from '@/lib/useMicBlow';
import { StarrySky } from '@/components/effects/StarrySky';
import { CandleFlame } from '@/components/effects/CandleFlame';
import { soundManager } from '@/components/audio/soundManager';
import styles from './IntroScene.module.css';

export function IntroScene() {
  const setScene = useBirthdayStore((s) => s.setScene);
  const setMicAllowed = useBirthdayStore((s) => s.setMicAllowed);
  const [extinguished, setExtinguished] = useState(false);

  const handleBlow = () => {
    if (extinguished) return;
    soundManager.startAmbient();
    soundManager.playSFX('candleBlow');

    // 1. Extinguish the flame immediately so particle count drops & smoke rises on screen
    setExtinguished(true);

    // 2. Wait 1.6s for full blow animation & smoke wisps, then transition to celebration
    setTimeout(() => {
      setScene('blow');
      setTimeout(() => {
        setScene('celebration');
      }, 400);
    }, 1600);
  };

  const { startListening, isListening, error } = useMicBlow({
    onBlow: handleBlow,
    threshold: 30,
    minDuration: 500,
  });

  const handleLightCandle = () => {
    soundManager.startAmbient();
    setMicAllowed(true);
    startListening();
  };

  const candleLit = !extinguished;

  return (
    <div className={`scene ${styles.container}`}>
      <div className="scene-canvas">
        <StarrySky preset="intro" starCount={200} />
      </div>

      <div className={`scene-content ${styles.contentWrap}`}>
        {/* Status LED panel */}
        <div className={styles.statusPanel}>
          <div className="panel-header">
            <span className={`led ${isListening ? 'led--green' : error ? 'led--red' : 'led--off'}`} />
            <span>MIC {isListening ? 'ACTIVE' : error ? 'ERROR' : 'STANDBY'}</span>
          </div>
        </div>

        {/* Multi-layer Organic Candle */}
        <div className={styles.candleWrap}>
          <CandleFlame lit={candleLit} size="lg" onBlowOut={handleBlow} />
        </div>

        {/* Title */}
        <h1 className={`heading-display ${styles.title}`} style={{ fontSize: 'clamp(28px, 6vw, 56px)' }}>
          MAKE A WISH
        </h1>

        <p className={`text-mono-alt ${styles.subtitle}`}>
          blow into your mic or tap the candle to extinguish the flame
        </p>

        {/* Controls */}
        <div className={styles.controls}>
          {!isListening && !extinguished && (
            <button
              id="btn-light-candle"
              className="btn-arcade"
              onClick={handleLightCandle}
            >
              LIGHT THE CANDLE
            </button>
          )}

          {isListening && !extinguished && (
            <div className={styles.listeningIndicator}>
              <span className="led led--green" />
              <span className="heading-retro heading-green" style={{ fontSize: '18px' }}>
                LISTENING FOR BLOW...
              </span>
            </div>
          )}

          {error && (
            <div className={styles.errorMsg}>
              <span className="led led--red" />
              <span>{error}</span>
            </div>
          )}

          {!extinguished && (
            <button
              id="btn-tap-blow"
              className="btn-ghost"
              onClick={handleBlow}
            >
              TAP TO BLOW (FALLBACK)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
