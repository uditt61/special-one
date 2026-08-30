'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPopSound } from '@/lib/utils';
import { fireRomanticConfetti } from './Confetti';

interface PopBalloonsProps {
  reasons: string[];
  recipientName: string;
  onComplete: () => void;
}

const BALLOON_COLORS = [
  { bg: 'from-pink-500 via-rose-500 to-red-600', shadow: 'shadow-pink-500/40', accent: '#EC4899' },
  { bg: 'from-amber-400 via-orange-500 to-red-500', shadow: 'shadow-orange-500/40', accent: '#F97316' },
  { bg: 'from-purple-500 via-violet-600 to-indigo-600', shadow: 'shadow-purple-500/40', accent: '#8B5CF6' },
  { bg: 'from-teal-400 via-emerald-500 to-green-600', shadow: 'shadow-teal-500/40', accent: '#10B981' },
  { bg: 'from-rose-400 via-pink-500 to-purple-600', shadow: 'shadow-rose-500/40', accent: '#F43F5E' },
];

export default function PopBalloons({ reasons, recipientName, onComplete }: PopBalloonsProps) {
  const [poppedIndices, setPoppedIndices] = useState<number[]>([]);
  const [activeReason, setActiveReason] = useState<string | null>(null);

  const handlePop = (index: number) => {
    if (poppedIndices.includes(index)) return;

    playPopSound();
    fireRomanticConfetti();

    const updated = [...poppedIndices, index];
    setPoppedIndices(updated);
    setActiveReason(reasons[index]);
  };

  const isAllPopped = poppedIndices.length === reasons.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 bg-linear-to-b from-[#FFF5F0] via-[#FFF0F5] to-[#FFF8F5] text-[#4A1525] relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 text-center space-y-1 mt-4">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200">
          🎈 Pop the balloons for {recipientName}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#7C2D12]">
          {isAllPopped ? 'All Birthday Wishes Unlocked!' : 'Tap each balloon to pop it!'}
        </h2>
        <p className="text-xs text-[#9A3412]">
          {poppedIndices.length} of {reasons.length} balloons popped
        </p>
      </div>

      {/* Balloons Container */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center">
          {reasons.map((reason, idx) => {
            const isPopped = poppedIndices.includes(idx);
            const color = BALLOON_COLORS[idx % BALLOON_COLORS.length];

            return (
              <div key={idx} className="relative flex flex-col items-center">
                <AnimatePresence mode="wait">
                  {!isPopped ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        y: [0, -12, 0],
                      }}
                      exit={{
                        scale: [1, 1.4, 0],
                        opacity: [1, 1, 0],
                        transition: { duration: 0.25 },
                      }}
                      transition={{
                        y: {
                          duration: 2.5 + idx * 0.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePop(idx)}
                      className="cursor-pointer flex flex-col items-center group relative"
                    >
                      {/* 3D Balloon Body */}
                      <div
                        className={`w-24 h-28 sm:w-28 sm:h-32 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-linear-to-tr ${color.bg} shadow-lg ${color.shadow} relative flex items-center justify-center border-t border-white/40 overflow-hidden`}
                      >
                        {/* 3D Shine highlight */}
                        <div className="absolute top-3 left-4 w-6 h-10 bg-white/30 rounded-full blur-[1px] transform -rotate-45" />

                        <span className="text-2xl font-bold text-white/90 drop-shadow-md select-none">
                          🎈 {idx + 1}
                        </span>
                      </div>

                      {/* Balloon Knot & String */}
                      <div className="w-2.5 h-2 bg-orange-700/60 rounded-sm -mt-0.5" />
                      <div className="w-0.5 h-16 bg-orange-400/40 rounded-full" />
                    </motion.div>
                  ) : (
                    /* POPPED POP SHARD / REVEALED CARD MINI BADGE */
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 rounded-2xl bg-white/80 border border-orange-200 shadow-sm flex flex-col items-center justify-center p-2 text-center"
                    >
                      <span className="text-xl">✨</span>
                      <span className="text-[10px] font-bold text-orange-700">Popped!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* POPPED REASON MODAL / CARD POPUP */}
      <AnimatePresence>
        {activeReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
            onClick={() => setActiveReason(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-orange-200 shadow-2xl space-y-4 text-center relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-full bg-linear-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md text-2xl">
                🎈
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  Balloon Wish Unlocked
                </span>
                <p className="text-base sm:text-lg font-semibold text-[#7C2D12] leading-relaxed">
                  &quot;{activeReason}&quot;
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveReason(null)}
                className="w-full py-3 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Close & Pop Next 🎈
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Step / Complete Button */}
      <div className="relative z-10 w-full max-w-sm mx-auto mb-4 text-center">
        {isAllPopped && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            type="button"
            onClick={onComplete}
            className="w-full py-4 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-xl shadow-orange-500/30 hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue to Birthday Memories & Cake 🎂</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
