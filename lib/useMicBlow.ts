'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface UseMicBlowProps {
  onBlow: () => void;
  threshold?: number;
  minDuration?: number;
}

export function useMicBlow({ onBlow, threshold = 20, minDuration = 500 }: UseMicBlowProps) {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const blowStartTimeRef = useRef<number | null>(null);

  const stopListening = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsListening(false);
    setVolume(0);
    blowStartTimeRef.current = null;
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError(null);

      if (!navigator?.mediaDevices?.getUserMedia) {
        setError('Microphone access is not supported on this browser/device.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        const limit = Math.min(20, dataArray.length);
        for (let i = 0; i < limit; i++) {
          sum += dataArray[i];
        }
        const currentVolume = sum / limit;
        setVolume(currentVolume);

        if (currentVolume > threshold) {
          if (!blowStartTimeRef.current) {
            blowStartTimeRef.current = Date.now();
          } else {
            const duration = Date.now() - blowStartTimeRef.current;
            if (duration >= minDuration) {
              onBlow();
              stopListening();
              return;
            }
          }
        } else {
          blowStartTimeRef.current = null;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      setIsListening(true);
    } catch (err: any) {
      const errName = err?.name || '';
      if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setError('No microphone found on your device. Please tap to blow!');
      } else if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setError('Microphone permission denied. Please tap to blow!');
      } else {
        setError('Microphone not available. Please tap to blow!');
      }
      setIsListening(false);
    }
  }, [onBlow, threshold, minDuration, stopListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    startListening,
    stopListening,
    isListening,
    volume,
    error,
  };
}
