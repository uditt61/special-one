'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '@/types/gift';
import { GiftIntro } from './GiftIntro';
import PopBalloons from './PopBalloons';
import { GiftPhotos } from './GiftPhotos';
import { GiftLetter } from './GiftLetter';
import BirthdayCakeCandles from './BirthdayCakeCandles';
import { AmbientSound } from '@/components/ui/AmbientSound';

interface BirthdayExperienceProps {
  gift: Gift;
}

export default function BirthdayExperience({ gift }: BirthdayExperienceProps) {
  // Scenes: 1 = GiftIntro, 2 = PopBalloons, 3 = Photos, 4 = Letter, 5 = Cake & Candles
  const [scene, setScene] = useState<number>(1);

  const nextScene = () => setScene((prev) => prev + 1);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF8F5]">
      {/* Background Music Synthesizer Player */}
      <AmbientSound enabled={gift.music !== 'none'} />

      {/* Dynamic Scene Renderer */}
      <AnimatePresence mode="wait">
        {scene === 1 && (
          <motion.div
            key="scene1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GiftIntro gift={gift} onOpen={nextScene} />
          </motion.div>
        )}

        {scene === 2 && (
          <motion.div
            key="scene2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PopBalloons
              reasons={gift.reasons}
              recipientName={gift.recipientName}
              onComplete={nextScene}
            />
          </motion.div>
        )}

        {scene === 3 && (
          <motion.div
            key="scene3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {gift.photos && gift.photos.length > 0 ? (
              <GiftPhotos gift={gift} onNext={nextScene} />
            ) : (
              // Skip photos if empty
              <GiftLetter gift={gift} onNext={nextScene} />
            )}
          </motion.div>
        )}

        {scene === 4 && (
          <motion.div
            key="scene4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GiftLetter gift={gift} onNext={nextScene} />
          </motion.div>
        )}

        {scene >= 5 && (
          <motion.div
            key="scene5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BirthdayCakeCandles
              recipientName={gift.recipientName}
              senderName={gift.senderName}
              turningAge={gift.turningAge}
              finalMessage={gift.finalMessage}
              finalQuestion={gift.finalQuestion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
