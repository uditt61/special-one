'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '@/types/gift';
import { Sparkles, Heart } from 'lucide-react';

interface GiftIntroProps {
  gift: Gift;
  onOpen: () => void;
}

export const GiftIntro: React.FC<GiftIntroProps> = ({ gift, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleBoxClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center select-none relative z-10">
      {/* Recipient Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-2 mb-8 sm:mb-10"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-bold text-[#FF4D79] border border-[#FED7E2] shadow-xs">
          <Heart className="w-3 h-3 fill-current" /> A surprise waiting for you
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-romantic text-[#4A1525] tracking-tight">
          For you, <span className="text-[#FF4D79]">{gift.recipientName}</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#834758] italic">
          From {gift.senderName} with all my love ❤️
        </p>
      </motion.div>

      {/* Interactive Floating Gift Box */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
        className="relative cursor-pointer group my-4"
        onClick={handleBoxClick}
      >
        {/* Glow burst effect when opening */}
        <AnimatePresence>
          {isOpening && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3.5, opacity: [0, 0.9, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute inset-0 m-auto w-40 h-40 rounded-full bg-radial from-pink-400 via-rose-300 to-transparent blur-xl pointer-events-none z-30"
            />
          )}
        </AnimatePresence>

        {/* The Gift Box Container */}
        <motion.div
          animate={
            isOpening
              ? { scale: [1, 1.15, 0.9, 1.3], opacity: [1, 1, 1, 0] }
              : { y: [0, -10, 0] }
          }
          transition={
            isOpening
              ? { duration: 1.1, ease: 'easeInOut' }
              : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center"
        >
          {/* Illustrated Premium Gift Box */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52">
            {/* Box Body */}
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-36 bg-linear-to-tr from-[#FF4D79] via-[#E11D48] to-[#FF6B8B] rounded-2xl shadow-2xl shadow-pink-500/30 overflow-hidden border-2 border-white/40">
              {/* Vertical Ribbon */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-linear-to-r from-[#FDE047] via-[#FBBF24] to-[#F59E0B] shadow-md" />
              {/* Subtle box sheen */}
              <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
            </div>

            {/* Box Lid (Lifts on opening) */}
            <motion.div
              animate={
                isOpening
                  ? { y: -80, rotate: -18, opacity: [1, 1, 0] }
                  : {}
              }
              transition={{ duration: 0.8, ease: 'backOut' }}
              className="absolute -inset-x-2 top-6 sm:top-8 h-12 bg-linear-to-r from-[#FF6B8B] via-[#E11D48] to-[#C2185B] rounded-xl shadow-lg border-2 border-white/60 z-10"
            >
              {/* Lid Vertical Ribbon */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-linear-to-r from-[#FDE047] via-[#FBBF24] to-[#F59E0B]" />
            </motion.div>

            {/* Ribbon Bow on Top */}
            <motion.div
              animate={
                isOpening
                  ? { y: -100, scale: 1.2, opacity: [1, 1, 0] }
                  : { scale: [1, 1.06, 1] }
              }
              transition={
                isOpening
                  ? { duration: 0.7 }
                  : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }
              className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="relative flex items-center justify-center">
                {/* Left bow loop */}
                <div className="w-9 h-12 rounded-full border-4 border-[#FBBF24] bg-[#FDE047] -rotate-45 shadow-sm transform -translate-x-2" />
                {/* Right bow loop */}
                <div className="w-9 h-12 rounded-full border-4 border-[#FBBF24] bg-[#FDE047] rotate-45 shadow-sm transform translate-x-2" />
                {/* Center knot */}
                <div className="absolute w-6 h-6 rounded-full bg-[#F59E0B] border-2 border-white shadow-md" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tap hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-2 mt-4"
      >
        <button
          type="button"
          onClick={handleBoxClick}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 text-[#4A1525] font-semibold text-sm border border-[#FED7E2] shadow-md shadow-pink-500/10 hover:border-[#FF4D79] transition-all cursor-pointer animate-pulse-soft"
        >
          <Sparkles className="w-4 h-4 text-[#FF4D79]" />
          <span>Tap to unwrap your surprise</span>
        </button>
      </motion.div>
    </div>
  );
};
