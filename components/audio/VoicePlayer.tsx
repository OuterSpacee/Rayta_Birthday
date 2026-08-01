'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import styles from './VoicePlayer.module.css';

interface VoicePlayerProps {
  friendName: string;
  audioSrc: string;
  onComplete?: () => void;
  autoPlay?: boolean;
}

export function VoicePlayer({ friendName, audioSrc, onComplete, autoPlay = false }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    howlRef.current = new Howl({
      src: [audioSrc],
      onend: () => {
        setIsPlaying(false);
        if (onComplete) onComplete();
      },
    });

    if (autoPlay) {
      howlRef.current.play();
      setIsPlaying(true);
    }

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, [audioSrc, autoPlay, onComplete]);

  const togglePlay = () => {
    if (!howlRef.current) return;

    if (isPlaying) {
      howlRef.current.pause();
      setIsPlaying(false);
    } else {
      howlRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={`panel ${styles.container}`}>
      <div className={styles.header}>
        <h3 className={styles.name}>{friendName}</h3>
        <div className={`led ${isPlaying ? 'led--green' : 'led--red'}`} />
      </div>
      
      <div className={`${styles.recordContainer} ${isPlaying ? styles.spinning : ''}`}>
        <div className={styles.label}>
          <div className={styles.hole} />
        </div>
      </div>

      <div className={styles.controls}>
        <button 
          className="btn-arcade" 
          onClick={togglePlay}
        >
          {isPlaying ? 'STOP' : 'PLAY'}
        </button>
      </div>
    </div>
  );
}
