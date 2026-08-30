'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '@/types/gift';
import { FloatingHearts } from '@/components/ui/FloatingHearts';
import { AmbientSound } from '@/components/ui/AmbientSound';
import { GiftIntro } from './GiftIntro';
import { GiftMessage } from './GiftMessage';
import { GiftPhotos } from './GiftPhotos';
import { GiftReasons } from './GiftReasons';
import { GiftVoice } from './GiftVoice';
import { GiftLetter } from './GiftLetter';
import { GiftFinal } from './GiftFinal';

interface GiftExperienceProps {
  gift: Gift;
  isPreview?: boolean;
  onExitPreview?: () => void;
}

export const GiftExperience: React.FC<GiftExperienceProps> = ({
  gift,
  isPreview = false,
  onExitPreview,
}) => {
  // Determine scenes list based on content
  // Scenes: 'intro' -> 'message' -> 'photos' -> 'reasons' -> ('voice' if present) -> 'letter' -> 'final'
  const hasVoice = Boolean(gift.voiceMessageUrl);

  const sceneSequence = [
    'intro',
    'message',
    'photos',
    'reasons',
    ...(hasVoice ? ['voice'] : []),
    'letter',
    'final',
  ];

  const [sceneIndex, setSceneIndex] = useState(0);
  const currentScene = sceneSequence[sceneIndex];

  const nextScene = () => {
    if (sceneIndex < sceneSequence.length - 1) {
      setSceneIndex((prev) => prev + 1);
    }
  };

  const restartExperience = () => {
    setSceneIndex(0);
  };

  const themeClass = gift.theme ? `theme-${gift.theme}` : 'theme-blush';

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden transition-colors duration-500 ${themeClass}`}
    >
      {/* Floating romantic background particles */}
      <FloatingHearts count={16} />

      {/* Ambient background melody toggle */}
      <AmbientSound enabled={gift.music !== 'none'} />

      {/* Preview Exit banner if in creator preview mode */}
      {isPreview && onExitPreview && (
        <div className="fixed top-4 left-4 z-50">
          <button
            type="button"
            onClick={onExitPreview}
            className="px-4 py-2 rounded-full bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md shadow-lg transition-all cursor-pointer"
          >
            ← Exit Preview Mode
          </button>
        </div>
      )}

      {/* Immersive scene transitions */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentScene === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <GiftIntro gift={gift} onOpen={nextScene} />
            </motion.div>
          )}

          {currentScene === 'message' && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <GiftMessage gift={gift} onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <GiftPhotos gift={gift} onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 'reasons' && (
            <motion.div
              key="reasons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <GiftReasons gift={gift} onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 'voice' && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <GiftVoice gift={gift} onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <GiftLetter gift={gift} onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GiftFinal gift={gift} onRestart={restartExperience} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
