'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Heart, Sparkles } from 'lucide-react';

interface GiftMessageProps {
  gift: Gift;
  onNext: () => void;
}

export const GiftMessage: React.FC<GiftMessageProps> = ({ gift, onNext }) => {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = gift.openingMessage || 'I made something for you.';
  const [isDoneTyping, setIsDoneTyping] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        setIsDoneTyping(true);
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto relative z-10 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-[#FED7E2] shadow-xl shadow-pink-500/10 space-y-6 relative"
      >
        {/* Decorative Tape on top */}
        <div className="washi-tape" />

        {/* Hey [Recipient] */}
        <div className="space-y-1 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F3] border border-[#FED7E2] rounded-full text-xs font-semibold text-[#B81846]">
            <Heart className="w-3 h-3 fill-current text-[#FF4D79]" /> Just for you
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525]">
            Hey, {gift.recipientName} ❤️
          </h2>
        </div>

        {/* Typed Opening Message */}
        <div className="min-h-[90px] flex items-center justify-center py-2 px-3 bg-[#FFFDF9] rounded-2xl border border-[#E8DCCF]/60">
          <p className="text-lg sm:text-xl font-handwritten text-[#3D281F] leading-relaxed">
            "{displayedText}"
            {!isDoneTyping && (
              <span className="inline-block w-1.5 h-5 bg-[#FF4D79] ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* Relationship vibe tag */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#834758]">
          <span>{gift.occasion}</span>
          <span>•</span>
          <span>{gift.relationshipStyle}</span>
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isDoneTyping ? 1 : 0.4 }}
          transition={{ duration: 0.5 }}
          className="pt-2"
        >
          <Button onClick={onNext} size="lg" fullWidth>
            <Sparkles className="w-4 h-4 mr-2" /> Unfold Memories →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
