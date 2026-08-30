'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Heart, Sparkles, ChevronRight } from 'lucide-react';

interface GiftReasonsProps {
  gift: Gift;
  onNext: () => void;
}

export const GiftReasons: React.FC<GiftReasonsProps> = ({ gift, onNext }) => {
  const reasons = (gift.reasons && gift.reasons.length > 0)
    ? gift.reasons
    : ['You make ordinary days feel special.', 'You feel like home.'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const isLast = currentIndex === reasons.length - 1;

  const handleNext = () => {
    if (isLast) {
      onNext();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const getReasonIntro = (index: number) => {
    if (index === 0) return 'One thing I love about you...';
    if (index === 1) return 'Another reason why...';
    if (index === 2) return 'And also this...';
    if (index === 3) return 'Something I never want to forget...';
    return 'And most of all...';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center max-w-sm sm:max-w-md mx-auto relative z-10 select-none">
      {/* Header Indicator */}
      <div className="mb-4 text-center space-y-1">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-[#FF4D79] border border-[#FED7E2] shadow-xs">
          <Sparkles className="w-3 h-3 text-[#F59E0B]" /> Little Things
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -25 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-[#FED7E2] shadow-2xl shadow-pink-500/10 space-y-6 relative"
        >
          {/* Decorative washi tape */}
          <div className="washi-tape" />

          {/* Reason Intro Prompt */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D79]">
              Reason #{currentIndex + 1}
            </span>
            <h3 className="text-base sm:text-lg font-serif-romantic italic text-[#834758]">
              "{getReasonIntro(currentIndex)}"
            </h3>
          </div>

          {/* The Reason Card */}
          <div className="p-6 bg-[#FFF0F3] rounded-2xl border border-[#FED7E2] min-h-27.5 flex items-center justify-center">
            <p className="text-lg sm:text-xl font-semibold text-[#4A1525] leading-relaxed">
              {reasons[currentIndex]}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 pt-2">
            {reasons.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? 'w-6 bg-[#FF4D79]' : 'w-2 bg-[#FED7E2]'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button onClick={handleNext} size="lg" fullWidth>
              {isLast ? (
                <>
                  <Heart className="w-4 h-4 mr-2 fill-current" /> Continue Surprise →
                </>
              ) : (
                <>
                  Another one <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
