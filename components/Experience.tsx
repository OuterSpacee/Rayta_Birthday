'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useBirthdayStore } from '@/lib/store';
import { IntroScene } from '@/components/scenes/IntroScene';
import { CelebrationScene } from '@/components/scenes/CelebrationScene';
import { MessageScene } from '@/components/scenes/MessageScene';
import { FinaleScene } from '@/components/scenes/FinaleScene';

/* Dynamically import the 3D world — only loads when scene === 'world' */
const WorldCanvas = dynamic(
  () => import('@/components/world/WorldCanvas'),
  { ssr: false, loading: () => <WorldLoading /> }
);

function WorldLoading() {
  return (
    <div className="scene" style={{ background: 'var(--surface-deep)' }}>
      <div className="scene-content">
        <div className="heading-retro" style={{ fontSize: '24px' }}>
          LOADING WORLD
          <span className="animate-flicker" style={{ marginLeft: 8 }}>...</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          <span className="led led--amber" />
          <span className="led led--amber" style={{ animationDelay: '0.3s' }} />
          <span className="led led--amber" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>
    </div>
  );
}

const sceneVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

export default function Experience() {
  const scene = useBirthdayStore((s) => s.scene);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'var(--surface-deep)',
      }}
    >
      <AnimatePresence mode="wait">
        {scene === 'intro' && (
          <motion.div
            key="intro"
            className="scene"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <IntroScene />
          </motion.div>
        )}

        {scene === 'blow' && (
          <motion.div
            key="blow"
            className="scene"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Blow scene is just a brief transition — candle going out */}
            <IntroScene />
          </motion.div>
        )}

        {scene === 'celebration' && (
          <motion.div
            key="celebration"
            className="scene"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <CelebrationScene />
          </motion.div>
        )}

        {scene === 'message' && (
          <motion.div
            key="message"
            className="scene"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <MessageScene />
          </motion.div>
        )}

        {scene === 'world' && (
          <motion.div
            key="world"
            className="scene"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <WorldCanvas />
          </motion.div>
        )}

        {scene === 'finale' && (
          <motion.div
            key="finale"
            className="scene"
            variants={sceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FinaleScene />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
