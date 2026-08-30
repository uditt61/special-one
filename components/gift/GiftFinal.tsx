'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { fireRomanticConfetti } from './Confetti';
import { Heart, Sparkles, RotateCcw, Share2, Check } from 'lucide-react';

interface GiftFinalProps {
  gift: Gift;
  onRestart: () => void;
}

export const GiftFinal: React.FC<GiftFinalProps> = ({ gift, onRestart }) => {
  const [answered, setAnswered] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Initial gentle celebration confetti on entering final scene
    const t = setTimeout(() => {
      fireRomanticConfetti();
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleAnswer = () => {
    setAnswered(true);
    fireRomanticConfetti();
  };

  const handleShareBack = () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      navigator.share({
        title: `A special surprise from ${gift.senderName}`,
        text: `Look at what ${gift.senderName} made for ${gift.recipientName} ❤️`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const finalSentence =
    gift.finalMessage ||
    "If I could give you one thing, it would be the ability to see yourself the way I see you.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center max-w-sm sm:max-w-md mx-auto relative z-10 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-[#FED7E2] shadow-2xl shadow-pink-500/15 space-y-6 relative"
      >
        {/* Floating Heart Icon */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-linear-to-tr from-[#FF4D79] to-[#E11D48] text-white mx-auto flex items-center justify-center shadow-lg shadow-pink-500/30 text-2xl"
        >
          ❤️
        </motion.div>

        {/* Climax Message */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525]">
            For {gift.recipientName}, Always.
          </h2>
          <div className="p-4 bg-[#FFF0F3] rounded-2xl border border-[#FED7E2]/70">
            <p className="text-base sm:text-lg font-serif-romantic italic text-[#4A1525] leading-relaxed">
              "{finalSentence}"
            </p>
          </div>
        </div>

        {/* Optional Interactive Romantic Question */}
        {gift.finalQuestion && (
          <div className="space-y-3 pt-1">
            <p className="text-sm font-bold text-[#4A1525]">
              {gift.finalQuestion}
            </p>

            {!answered ? (
              <Button
                type="button"
                onClick={handleAnswer}
                size="lg"
                fullWidth
                className="shadow-lg shadow-pink-500/25 text-base"
              >
                <Heart className="w-4 h-4 mr-2 fill-current" /> Yes, with all my heart ❤️
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-rose-100/80 border border-rose-300 rounded-2xl text-xs sm:text-sm font-bold text-[#B81846] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#F59E0B]" /> Forever & Always Sealed ❤️
              </motion.div>
            )}
          </div>
        )}

        {/* Sender Sign-off */}
        <div className="pt-2 text-xs text-[#834758]">
          <p>Made with love by <span className="font-semibold text-[#4A1525]">{gift.senderName}</span></p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#FED7E2]/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRestart}
            fullWidth
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Experience Again from the Start
          </Button>

          <button
            type="button"
            onClick={handleShareBack}
            className="text-xs text-[#834758] hover:text-[#4A1525] font-medium py-1.5 flex items-center justify-center gap-1 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Link copied to clipboard!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" /> Share this surprise
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
