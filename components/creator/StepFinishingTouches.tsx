'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GiftDraft, ThemeMood, MusicOption } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Heart, Palette, Music, Sparkles, HelpCircle } from 'lucide-react';

interface StepFinishingTouchesProps {
  draft: GiftDraft;
  updateDraft: (fields: Partial<GiftDraft>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

const THEMES: { id: ThemeMood; name: string; desc: string; colors: string[] }[] = [
  {
    id: 'blush',
    name: 'Soft Blush',
    desc: 'Sweet, delicate pink with berry accents',
    colors: ['#FFF5F6', '#FF4D79', '#4A1525'],
  },
  {
    id: 'cream',
    name: 'Warm Cream',
    desc: 'Cozy, nostalgic ivory and warm gold',
    colors: ['#FAF6F0', '#E07A5F', '#3D281F'],
  },
  {
    id: 'rose',
    name: 'Romantic Rose',
    desc: 'Deep passionate wine & rose petals',
    colors: ['#FFE8ED', '#E11D48', '#4A0E2E'],
  },
];

const MUSIC_OPTIONS: { id: MusicOption; label: string; desc: string }[] = [
  { id: 'music-box', label: 'Gentle Music Box', desc: 'Soothing acoustic chime melody' },
  { id: 'harp-lullaby', label: 'Harp Lullaby', desc: 'Dreamy, romantic ambient harmony' },
  { id: 'none', label: 'No Music', desc: 'Quiet, silent reading experience' },
];

export const StepFinishingTouches: React.FC<StepFinishingTouchesProps> = ({
  draft,
  updateDraft,
  onNext,
  onBack,
}) => {
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
          <Heart className="w-3 h-3 fill-current text-[#FF4D79]" /> The Ambience
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525] tracking-tight">
          Finishing Touches
        </h1>
        <p className="text-sm text-[#834758] max-w-md mx-auto">
          Choose the visual mood, background melody, and your final memorable words.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Background Mood */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#834758] flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#FF4D79]" /> Background Mood
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEMES.map((t) => {
              const isSelected = (draft.theme || 'blush') === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateDraft({ theme: t.id })}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#FF4D79] ring-2 ring-[#FF4D79]/20 shadow-xs scale-[1.02]'
                      : 'bg-white/80 border-[#FED7E2]/70 hover:border-[#FF4D79]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex -space-x-1">
                      {t.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#FF4D79] ml-auto uppercase">Selected</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#4A1525]">{t.name}</p>
                    <p className="text-xs text-[#834758] mt-0.5">{t.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Music Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#834758] flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#FF4D79]" /> Background Melody
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MUSIC_OPTIONS.map((m) => {
              const isSelected = (draft.music || 'music-box') === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => updateDraft({ music: m.id })}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#FF4D79] ring-2 ring-[#FF4D79]/20 shadow-xs'
                      : 'bg-white/80 border-[#FED7E2]/70 hover:border-[#FF4D79]/50'
                  }`}
                >
                  <p className="font-semibold text-sm text-[#4A1525]">{m.label}</p>
                  <p className="text-xs text-[#834758] mt-0.5">{m.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Final Message & Question */}
        <div className="bg-white rounded-3xl p-6 border border-[#FED7E2]/80 shadow-xs space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="finalMessage"
              className="text-xs font-bold uppercase tracking-wider text-[#834758] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF4D79]" /> Final Memorable Sentence
            </label>
            <input
              id="finalMessage"
              type="text"
              placeholder="e.g. I'd choose you in every lifetime."
              value={draft.finalMessage || ''}
              onChange={(e) => updateDraft({ finalMessage: e.target.value })}
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl bg-[#FFF9F9] border border-[#FED7E2] text-sm text-[#4A1525] placeholder:text-[#BFA3AC] focus:outline-none focus:border-[#FF4D79]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="finalQuestion"
              className="text-xs font-bold uppercase tracking-wider text-[#834758] flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#FF4D79]" /> Optional Question at the End
            </label>
            <input
              id="finalQuestion"
              type="text"
              placeholder="e.g. Will you always be my person?"
              value={draft.finalQuestion || ''}
              onChange={(e) => updateDraft({ finalQuestion: e.target.value })}
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl bg-[#FFF9F9] border border-[#FED7E2] text-sm text-[#4A1525] placeholder:text-[#BFA3AC] focus:outline-none focus:border-[#FF4D79]"
            />
            <p className="text-[11px] text-[#834758]">
              If provided, an interactive prompt will appear at the climax for them to answer.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Back
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Continue to Preview →
        </Button>
      </div>
    </motion.div>
  );
};
