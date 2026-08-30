'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GiftDraft } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Sparkles, Heart } from 'lucide-react';

interface StepBasicsProps {
  draft: GiftDraft;
  updateDraft: (fields: Partial<GiftDraft>) => void;
  errors: Record<string, string>;
  onNext: () => void;
}

const OPENING_SUGGESTIONS = [
  'I was thinking about you.',
  'You are my favourite person.',
  'I made something for you.',
  'Every day, it is you.',
  'Still you. Always you.',
  'A tiny world made just for you.',
];

export const StepBasics: React.FC<StepBasicsProps> = ({
  draft,
  updateDraft,
  errors,
  onNext,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F3] border border-[#FED7E2] rounded-full text-xs font-semibold text-[#B81846]">
          <Heart className="w-3 h-3 fill-current text-[#FF4D79]" /> The Beginning
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525] tracking-tight">
          Make something they'll always cherish.
        </h1>
        <p className="text-sm text-[#834758] max-w-md mx-auto">
          Start with the names and the very first words they will see when opening their surprise.
        </p>
      </div>

      {/* Form Fields Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FED7E2]/70 shadow-sm space-y-6">
        {/* Recipient Name */}
        <div className="space-y-2">
          <label
            htmlFor="recipientName"
            className="block text-xs font-bold uppercase tracking-wider text-[#834758]"
          >
            Who is this surprise for? <span className="text-[#FF4D79]">*</span>
          </label>
          <input
            id="recipientName"
            type="text"
            placeholder="e.g. Maya, My love, Bub"
            value={draft.recipientName || ''}
            onChange={(e) => updateDraft({ recipientName: e.target.value })}
            className={`w-full px-4 py-3 rounded-2xl bg-[#FFF9F9] border text-[#4A1525] placeholder:text-[#BFA3AC] text-base focus:outline-none focus:ring-2 transition-all ${
              errors.recipientName
                ? 'border-red-400 focus:ring-red-300'
                : 'border-[#FED7E2] focus:border-[#FF4D79] focus:ring-[#FF4D79]/20'
            }`}
          />
          {errors.recipientName && (
            <p className="text-xs text-red-500 font-medium">{errors.recipientName}</p>
          )}
        </div>

        {/* Sender Name */}
        <div className="space-y-2">
          <label
            htmlFor="senderName"
            className="block text-xs font-bold uppercase tracking-wider text-[#834758]"
          >
            Your name or nickname <span className="text-[#FF4D79]">*</span>
          </label>
          <input
            id="senderName"
            type="text"
            placeholder="e.g. Alex, Yours forever"
            value={draft.senderName || ''}
            onChange={(e) => updateDraft({ senderName: e.target.value })}
            className={`w-full px-4 py-3 rounded-2xl bg-[#FFF9F9] border text-[#4A1525] placeholder:text-[#BFA3AC] text-base focus:outline-none focus:ring-2 transition-all ${
              errors.senderName
                ? 'border-red-400 focus:ring-red-300'
                : 'border-[#FED7E2] focus:border-[#FF4D79] focus:ring-[#FF4D79]/20'
            }`}
          />
          {errors.senderName && (
            <p className="text-xs text-red-500 font-medium">{errors.senderName}</p>
          )}
        </div>

        {/* Opening Message */}
        <div className="space-y-2">
          <label
            htmlFor="openingMessage"
            className="block text-xs font-bold uppercase tracking-wider text-[#834758]"
          >
            The first thing they will read <span className="text-[#FF4D79]">*</span>
          </label>
          <input
            id="openingMessage"
            type="text"
            placeholder="e.g. I made something for you."
            value={draft.openingMessage || ''}
            onChange={(e) => updateDraft({ openingMessage: e.target.value })}
            maxLength={120}
            className={`w-full px-4 py-3 rounded-2xl bg-[#FFF9F9] border text-[#4A1525] placeholder:text-[#BFA3AC] text-base focus:outline-none focus:ring-2 transition-all ${
              errors.openingMessage
                ? 'border-red-400 focus:ring-red-300'
                : 'border-[#FED7E2] focus:border-[#FF4D79] focus:ring-[#FF4D79]/20'
            }`}
          />
          {errors.openingMessage && (
            <p className="text-xs text-red-500 font-medium">{errors.openingMessage}</p>
          )}

          {/* Suggestion Chips */}
          <div className="pt-2">
            <p className="text-xs text-[#834758] mb-2 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF4D79]" /> Tap an idea to use:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {OPENING_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => updateDraft({ openingMessage: suggestion })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer text-left ${
                    draft.openingMessage === suggestion
                      ? 'bg-[#FF4D79] text-white border-[#FF4D79] shadow-xs'
                      : 'bg-[#FFF0F3] text-[#834758] border-[#FED7E2]/70 hover:border-[#FF4D79] hover:text-[#4A1525]'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button onClick={onNext} size="lg" fullWidth>
          Continue to Step 2 →
        </Button>
      </div>
    </motion.div>
  );
};
