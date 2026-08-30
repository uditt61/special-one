'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GiftDraft } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Heart, Calendar, Sparkles, Flame, Moon, Smile, Compass } from 'lucide-react';

interface StepRelationshipProps {
  draft: GiftDraft;
  updateDraft: (fields: Partial<GiftDraft>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

const OCCASIONS = [
  { label: 'Just because', icon: Sparkles, desc: 'No special date needed' },
  { label: 'I love you', icon: Heart, desc: 'A heartfelt reminder' },
  { label: 'Our anniversary', icon: Calendar, desc: 'Celebrating our milestone' },
  { label: 'Their birthday', icon: Smile, desc: 'Making their day brighter' },
  { label: "Valentine's Day", icon: Flame, desc: 'Pure romantic surprise' },
  { label: 'Special day', icon: Compass, desc: 'A memory just for us' },
];

const RELATIONSHIPS = [
  'My girlfriend',
  'Love of my life',
  'My partner',
  'My fiancé',
  'Best friend',
  'Long distance',
];

const STYLES = [
  { label: 'Soft & quiet', icon: Moon, desc: 'Gentle, cozy, late-night talks' },
  { label: 'Silly & loud', icon: Smile, desc: 'Non-stop laughing & inside jokes' },
  { label: 'Still butterflies', icon: Sparkles, desc: 'Feels like day one every day' },
  { label: 'Ride or die', icon: Flame, desc: 'Through thick, thin, and everything' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => String(currentYear - i));

export const StepRelationship: React.FC<StepRelationshipProps> = ({
  draft,
  updateDraft,
  errors,
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
          <Heart className="w-3 h-3 fill-current text-[#FF4D79]" /> The Story
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525] tracking-tight">
          The Two of You
        </h1>
        <p className="text-sm text-[#834758] max-w-md mx-auto">
          Every love has its own rhythm. Pick the vibes that describe you best.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section A: What is this for? */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#834758]">
            A. What is this surprise for?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {OCCASIONS.map(({ label, icon: Icon, desc }) => {
              const isSelected = draft.occasion === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => updateDraft({ occasion: label })}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FFF0F3] border-[#FF4D79] ring-2 ring-[#FF4D79]/20 shadow-xs'
                      : 'bg-white border-[#FED7E2]/70 hover:border-[#FF4D79]/50 hover:bg-[#FFF9F9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF4D79]' : 'text-[#834758]'}`} />
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#FF4D79]" />}
                  </div>
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-[#4A1525]">{label}</div>
                    <div className="text-[10px] sm:text-xs text-[#834758] mt-0.5 line-clamp-1">{desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.occasion && <p className="text-xs text-red-500 font-medium">{errors.occasion}</p>}
        </div>

        {/* Section B: What are they to you? */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#834758]">
            B. What are they to you?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {RELATIONSHIPS.map((rel) => {
              const isSelected = draft.relationship === rel;
              return (
                <button
                  key={rel}
                  type="button"
                  onClick={() => updateDraft({ relationship: rel })}
                  className={`px-3 py-3 rounded-2xl border text-center font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF4D79] text-white border-[#FF4D79] shadow-xs'
                      : 'bg-white text-[#4A1525] border-[#FED7E2]/70 hover:border-[#FF4D79]/50 hover:bg-[#FFF9F9]'
                  }`}
                >
                  {rel}
                </button>
              );
            })}
          </div>
          {errors.relationship && <p className="text-xs text-red-500 font-medium">{errors.relationship}</p>}
        </div>

        {/* Section C: Relationship Style */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#834758]">
            C. What are you two like together?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {STYLES.map(({ label, icon: Icon, desc }) => {
              const isSelected = draft.relationshipStyle === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => updateDraft({ relationshipStyle: label })}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-[#FFF0F3] border-[#FF4D79] ring-2 ring-[#FF4D79]/20 shadow-xs'
                      : 'bg-white border-[#FED7E2]/70 hover:border-[#FF4D79]/50 hover:bg-[#FFF9F9]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#FF4D79] text-white' : 'bg-[#FFF0F3] text-[#FF4D79]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-[#4A1525]">{label}</div>
                    <div className="text-xs text-[#834758]">{desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.relationshipStyle && <p className="text-xs text-red-500 font-medium">{errors.relationshipStyle}</p>}
        </div>

        {/* Section D: When did you get together? */}
        <div className="bg-white rounded-2xl p-5 border border-[#FED7E2]/70 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#834758]">
              D. When did you get together? <span className="text-[11px] text-[#BFA3AC] font-normal">(Optional)</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="month-select" className="text-[11px] text-[#834758] block mb-1 font-medium">Month</label>
              <select
                id="month-select"
                value={draft.togetherMonth || ''}
                onChange={(e) => updateDraft({ togetherMonth: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9F9] border border-[#FED7E2] text-sm text-[#4A1525] focus:outline-none focus:border-[#FF4D79]"
              >
                <option value="">Choose Month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year-select" className="text-[11px] text-[#834758] block mb-1 font-medium">Year</label>
              <select
                id="year-select"
                value={draft.togetherYear || ''}
                onChange={(e) => updateDraft({ togetherYear: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9F9] border border-[#FED7E2] text-sm text-[#4A1525] focus:outline-none focus:border-[#FF4D79]"
              >
                <option value="">Choose Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
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
          Continue to Step 3 →
        </Button>
      </div>
    </motion.div>
  );
};
