'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCandleBlowSound } from '@/lib/utils';
import { fireRomanticConfetti } from './Confetti';

interface BirthdayCakeCandlesProps {
  recipientName: string;
  senderName: string;
  turningAge?: string;
  finalMessage?: string;
  finalQuestion?: string;
}

export default function BirthdayCakeCandles({
  recipientName,
  senderName,
  turningAge,
  finalMessage,
  finalQuestion,
}: BirthdayCakeCandlesProps) {
  const [isBlown, setIsBlown] = useState<boolean>(false);
  const [answered, setAnswered] = useState<boolean>(false);

  const handleBlowCandles = () => {
    if (isBlown) return;

    playCandleBlowSound();
    fireRomanticConfetti();
    setIsBlown(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-linear-to-b from-[#FFF5F0] via-[#FFF0F5] to-[#FFF8F5] text-[#4A1525] relative overflow-hidden font-sans text-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-sm w-full space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            🎂 Make a Birthday Wish
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#7C2D12]">
            {isBlown
              ? `Happy Birthday, ${recipientName}! 🎉`
              : `Blow out the candles, ${recipientName}!`}
          </h2>
          <p className="text-xs text-[#9A3412]">
            {isBlown
              ? `Your wish for turning ${turningAge || 'this year'} has been sent to the stars ✨`
              : `Tap the cake to blow out your ${turningAge ? `${turningAge}th` : ''} birthday candles`}
          </p>
        </div>

        {/* Illustrated 3D Birthday Cake Container */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleBlowCandles}
          className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex flex-col items-center justify-end cursor-pointer group"
        >
          {/* Candle Flames */}
          <div className="flex gap-4 mb-2 z-10">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                {/* Flame */}
                <AnimatePresence>
                  {!isBlown ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.9, 1, 0.9],
                      }}
                      transition={{
                        duration: 0.6 + idx * 0.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="w-4 h-6 rounded-full bg-linear-to-t from-amber-500 via-orange-400 to-yellow-200 shadow-lg shadow-amber-400/50 transform -translate-y-1"
                    />
                  ) : (
                    /* Smoke particle after blowing */
                    <motion.div
                      initial={{ y: 0, opacity: 0.8, scale: 1 }}
                      animate={{ y: -30, opacity: 0, scale: 2 }}
                      transition={{ duration: 1.2 }}
                      className="w-3 h-3 rounded-full bg-gray-400/50 blur-[2px]"
                    />
                  )}
                </AnimatePresence>

                {/* Candle Stick */}
                <div className="w-2.5 h-10 bg-linear-to-b from-pink-300 to-rose-400 rounded-t-sm shadow-xs border-x border-white/40" />
              </div>
            ))}
          </div>

          {/* Cake Top Layer */}
          <div className="w-44 sm:w-48 h-16 bg-linear-to-tr from-pink-400 via-rose-400 to-pink-300 rounded-t-3xl shadow-md border-t-2 border-white/60 relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-0 inset-x-0 h-4 bg-white/40 rounded-full blur-[1px]" />
            <span className="text-xs font-bold text-white tracking-wider">
              {turningAge ? `TURNING ${turningAge}` : 'HAPPY BIRTHDAY'}
            </span>
          </div>

          {/* Cake Bottom Layer */}
          <div className="w-52 sm:w-56 h-20 bg-linear-to-tr from-amber-700 via-amber-800 to-amber-900 rounded-b-3xl shadow-2xl border-t-4 border-amber-300/40 relative flex items-center justify-center">
            <div className="text-2xl">🍓 🍓 🍓</div>
          </div>
        </motion.div>

        {/* Action Prompt */}
        {!isBlown ? (
          <button
            type="button"
            onClick={handleBlowCandles}
            className="w-full py-4 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-xl shadow-orange-500/25 animate-pulse cursor-pointer"
          >
            💨 Tap to Blow Out Candles!
          </button>
        ) : (
          /* REVEALED FINALE */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 rounded-3xl p-6 border border-orange-200 shadow-xl space-y-4 text-center"
          >
            <p className="text-sm sm:text-base font-serif-romantic font-semibold text-[#7C2D12] leading-relaxed">
              {finalMessage || `May all your wishes come true! Celebrate today to the fullest! ✨`}
            </p>

            {finalQuestion && (
              <div className="pt-2 border-t border-orange-100 space-y-3">
                <p className="text-xs font-bold text-orange-700">
                  {finalQuestion}
                </p>
                {!answered ? (
                  <button
                    type="button"
                    onClick={() => {
                      fireRomanticConfetti();
                      setAnswered(true);
                    }}
                    className="w-full py-3 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer hover:scale-102 transition-transform"
                  >
                    YES! BEST BIRTHDAY EVER! 🥳🎉
                  </button>
                ) : (
                  <p className="text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-xl border border-emerald-200">
                    🎉 Happy Birthday! Sent with love from {senderName}!
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
