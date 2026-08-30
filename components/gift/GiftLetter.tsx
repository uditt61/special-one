'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Heart, Sparkles, Feather, Stamp } from 'lucide-react';

interface GiftLetterProps {
  gift: Gift;
  onNext: () => void;
}

export const GiftLetter: React.FC<GiftLetterProps> = ({ gift, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultLetter =
    "I wanted to give you a little reminder of how much you mean to me.\n\nEvery day with you is my favourite place to be, and I am so grateful for all our laughs, quiet moments, and adventures together.\n\nAlways yours.";

  const letterText = gift.loveLetter?.trim() || defaultLetter;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center max-w-sm sm:max-w-md mx-auto relative z-10 select-none">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Sealed Envelope View */
          <motion.div
            key="sealed-envelope"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.6 }}
            className="w-full space-y-6"
          >
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-[#FF4D79] border border-[#FED7E2] shadow-xs">
                <Feather className="w-3.5 h-3.5" /> For Your Eyes Only
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525]">
                There's one more thing...
              </h2>
              <p className="text-xs sm:text-sm text-[#834758]">
                A letter sealed just for you.
              </p>
            </div>

            {/* Illustrated Envelope with Wax Seal */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsOpen(true)}
              className="relative w-full aspect-4/3 bg-[#FDF8F3] rounded-3xl border-2 border-[#E8DCCF] shadow-2xl shadow-pink-500/15 p-6 flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
            >
              {/* Envelope flap diagonal lines */}
              <div className="absolute top-0 inset-x-0 h-1/2 border-b-2 border-[#E8DCCF] bg-[#F5EFEB] [clip-path:polygon(0_0,50%_100%,100%_0)]" />

              {/* Center Wax Seal */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-20 h-20 rounded-full wax-seal flex items-center justify-center text-3xl text-white shadow-xl group-hover:scale-110 transition-transform"
              >
                <span>{gift.waxSeal || '❤️'}</span>
              </motion.div>

              <p className="relative z-10 text-xs font-semibold text-[#834758] mt-4 uppercase tracking-wider">
                Tap wax seal to unseal
              </p>
            </motion.div>
          </motion.div>
        ) : (
          /* Unfolded Letter View */
          <motion.div
            key="unfolded-letter"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 260, damping: 22 }}
            className="w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E8DCCF] shadow-2xl shadow-pink-500/15 space-y-6 relative text-left"
          >
            {/* Stamp Sticker at top right */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white border border-[#FED7E2] shadow-xs flex items-center justify-center text-xl rotate-6">
              {gift.sticker || '🥰'}
            </div>

            {/* Letter Header */}
            <div className="border-b border-[#E8DCCF]/60 pb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#834758]">My Dearest</p>
              <h3 className="text-xl sm:text-2xl font-serif-romantic font-bold text-[#3D281F]">
                {gift.recipientName}
              </h3>
            </div>

            {/* Letter Body (Handwritten font, naturally scrollable if long) */}
            <div className="max-h-75 overflow-y-auto pr-1">
              <p className="font-handwritten text-xl sm:text-2xl text-[#3D281F] leading-relaxed whitespace-pre-line">
                {letterText}
              </p>
            </div>

            {/* Letter Sign-off */}
            <div className="border-t border-[#E8DCCF]/60 pt-3 text-right">
              <p className="font-handwritten text-xl text-[#FF4D79]">
                With all my love,
              </p>
              <p className="font-serif-romantic font-bold text-[#4A1525] text-lg">
                {gift.senderName} {gift.waxSeal || '❤️'}
              </p>
            </div>

            {/* Continue Button */}
            <div className="pt-2 text-center">
              <Button onClick={onNext} size="lg" fullWidth>
                <Sparkles className="w-4 h-4 mr-2" /> One Last Thing →
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
