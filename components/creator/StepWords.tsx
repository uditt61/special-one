'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftDraft, WaxSeal, Sticker } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Heart, Plus, X, Sparkles, Feather, Stamp, Smile } from 'lucide-react';

interface StepWordsProps {
  draft: GiftDraft;
  updateDraft: (fields: Partial<GiftDraft>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

const REASON_SUGGESTIONS = [
  'You make ordinary days feel special.',
  'The way you laugh at your own jokes.',
  'You always know when something is off.',
  'You feel like home.',
  'You make me want to be better.',
  'You are the best part of my day.',
  'You never make me earn your kindness.',
  'The way your eyes crinkle when you smile.',
  'How safe I feel when I am with you.',
  'Our late night conversations about everything.',
];

const WAX_SEALS: { symbol: WaxSeal; label: string }[] = [
  { symbol: '❤️', label: 'Heart' },
  { symbol: '💋', label: 'Kiss' },
  { symbol: '🌹', label: 'Rose' },
  { symbol: '🔥', label: 'Flame' },
  { symbol: '∞', label: 'Forever' },
];

const STICKERS: { symbol: Sticker; label: string }[] = [
  { symbol: '🥰', label: 'Loving' },
  { symbol: '😘', label: 'Sweet' },
  { symbol: '🥹', label: 'Touched' },
  { symbol: '😍', label: 'Crushing' },
  { symbol: '🧸', label: 'Cozy' },
];

export const StepWords: React.FC<StepWordsProps> = ({
  draft,
  updateDraft,
  errors,
  onNext,
  onBack,
}) => {
  const [customReason, setCustomReason] = useState('');
  const reasons: string[] = draft.reasons || [];
  const maxReasons = 5;
  const maxLetterLength = 500;

  const toggleReason = (reason: string) => {
    if (reasons.includes(reason)) {
      updateDraft({ reasons: reasons.filter((r) => r !== reason) });
    } else if (reasons.length < maxReasons) {
      updateDraft({ reasons: [...reasons, reason] });
    }
  };

  const addCustomReason = () => {
    const trimmed = customReason.trim();
    if (!trimmed) return;
    if (reasons.length >= maxReasons) return;
    if (!reasons.includes(trimmed)) {
      updateDraft({ reasons: [...reasons, trimmed] });
    }
    setCustomReason('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F3] border border-[#FED7E2] rounded-full text-xs font-semibold text-[#B81846]">
          <Heart className="w-3 h-3 fill-current text-[#FF4D79]" /> Deepest Feelings
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525] tracking-tight">
          Your Words & Love Letter
        </h1>
        <p className="text-sm text-[#834758] max-w-md mx-auto">
          Tell them what makes your heart skip a beat. Add little reasons and your handwritten letter.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Reasons why you love them */}
        <div className="bg-white rounded-3xl p-6 border border-[#FED7E2]/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#4A1525] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF4D79]" /> What do you love about them?
              </h2>
              <p className="text-xs text-[#834758] mt-0.5">Pick or write up to 5 special reasons.</p>
            </div>
            <span className="text-xs font-bold text-[#FF4D79] bg-[#FFF0F3] px-2.5 py-1 rounded-full border border-[#FED7E2]">
              {reasons.length} / {maxReasons}
            </span>
          </div>

          {/* Selected Reasons Pills */}
          {reasons.length > 0 && (
            <div className="space-y-2 pt-1">
              <AnimatePresence>
                {reasons.map((r, i) => (
                  <motion.div
                    key={r}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between gap-2 p-3 bg-[#FFF0F3] border border-[#FED7E2] rounded-2xl text-xs sm:text-sm text-[#4A1525]"
                  >
                    <span className="font-medium">
                      <span className="text-[#FF4D79] font-bold mr-1.5">#{i + 1}</span> {r}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleReason(r)}
                      className="p-1 text-[#834758] hover:text-red-500 rounded-full hover:bg-white transition-colors cursor-pointer"
                      aria-label="Remove reason"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Custom Reason Input */}
          {reasons.length < maxReasons && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write your own custom reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomReason();
                  }
                }}
                maxLength={90}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFF9F9] border border-[#FED7E2] text-xs sm:text-sm text-[#4A1525] placeholder:text-[#BFA3AC] focus:outline-none focus:border-[#FF4D79]"
              />
              <Button
                type="button"
                onClick={addCustomReason}
                disabled={!customReason.trim()}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          )}

          {/* Predefined Suggestion Chips */}
          <div className="pt-2">
            <p className="text-xs text-[#834758] mb-2 font-medium">Or choose from these heartfelt ideas:</p>
            <div className="flex flex-wrap gap-1.5">
              {REASON_SUGGESTIONS.map((suggestion) => {
                const isSelected = reasons.includes(suggestion);
                return (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => toggleReason(suggestion)}
                    disabled={!isSelected && reasons.length >= maxReasons}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#FF4D79] text-white border-[#FF4D79]'
                        : 'bg-[#FFF9F9] text-[#834758] border-[#FED7E2]/70 hover:border-[#FF4D79]/60 hover:text-[#4A1525] disabled:opacity-40 disabled:pointer-events-none'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {suggestion}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Love Letter */}
        <div className="bg-white rounded-3xl p-6 border border-[#FED7E2]/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#4A1525] flex items-center gap-2">
              <Feather className="w-4 h-4 text-[#FF4D79]" /> Your Love Letter
            </h2>
            <span
              className={`text-xs font-semibold ${
                (draft.loveLetter?.length || 0) > maxLetterLength
                  ? 'text-red-500'
                  : 'text-[#834758]'
              }`}
            >
              {draft.loveLetter?.length || 0} / {maxLetterLength}
            </span>
          </div>

          <div className="relative rounded-2xl border border-[#E8DCCF] bg-[#FFFDF9] p-4 shadow-inner">
            <textarea
              rows={6}
              placeholder="Pour your heart into this letter... Write whatever you've always wanted them to know."
              value={draft.loveLetter || ''}
              onChange={(e) => updateDraft({ loveLetter: e.target.value })}
              maxLength={maxLetterLength}
              className="w-full bg-transparent border-none text-[#3D281F] placeholder:text-[#BFA3AC] text-base sm:text-lg font-handwritten focus:outline-none resize-none leading-relaxed"
            />
          </div>
          {errors.loveLetter && <p className="text-xs text-red-500 font-medium">{errors.loveLetter}</p>}
        </div>

        {/* Section 3 & 4: Wax Seal & Sticker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Wax Seal */}
          <div className="bg-white rounded-3xl p-5 border border-[#FED7E2]/80 shadow-xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#834758] flex items-center gap-1.5">
              <Stamp className="w-3.5 h-3.5 text-[#FF4D79]" /> Choose Wax Seal
            </label>
            <div className="grid grid-cols-5 gap-2">
              {WAX_SEALS.map(({ symbol, label }) => {
                const isSelected = draft.waxSeal === symbol;
                return (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => updateDraft({ waxSeal: symbol })}
                    title={label}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF0F3] border-2 border-[#FF4D79] ring-2 ring-[#FF4D79]/20 scale-105 shadow-xs'
                        : 'bg-[#FFF9F9] border border-[#FED7E2] hover:border-[#FF4D79]/50'
                    }`}
                  >
                    <span>{symbol}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticker Selection */}
          <div className="bg-white rounded-3xl p-5 border border-[#FED7E2]/80 shadow-xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#834758] flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[#FF4D79]" /> Stamp a Cute Sticker
            </label>
            <div className="grid grid-cols-5 gap-2">
              {STICKERS.map(({ symbol, label }) => {
                const isSelected = draft.sticker === symbol;
                return (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => updateDraft({ sticker: symbol })}
                    title={label}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF0F3] border-2 border-[#FF4D79] ring-2 ring-[#FF4D79]/20 scale-105 shadow-xs'
                        : 'bg-[#FFF9F9] border border-[#FED7E2] hover:border-[#FF4D79]/50'
                    }`}
                  >
                    <span>{symbol}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Back
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Continue to Step 5 →
        </Button>
      </div>
    </motion.div>
  );
};
