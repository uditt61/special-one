'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GiftDraft } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Heart, Sparkles, Image, Feather, Mic, Eye, Share2, Check } from 'lucide-react';

interface StepReviewProps {
  draft: GiftDraft;
  onBack: () => void;
  onPreview: () => void;
  onPublish: () => void;
  isPublishing: boolean;
}

export const StepReview: React.FC<StepReviewProps> = ({
  draft,
  onBack,
  onPreview,
  onPublish,
  isPublishing,
}) => {
  const photoCount = draft.photos?.length || 0;
  const reasonCount = draft.reasons?.length || 0;
  const hasVoice = Boolean(draft.voiceMessageUrl);
  const hasLetter = Boolean(draft.loveLetter?.trim());

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
          <Sparkles className="w-3 h-3 text-[#FF4D79]" /> Ready to Surprise
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525] tracking-tight">
          It's ready.
        </h1>
        <p className="text-sm text-[#834758] max-w-md mx-auto">
          Here is a summary of the memories and words you've wrapped up for <span className="font-semibold text-[#FF4D79]">{draft.recipientName || 'them'}</span>.
        </p>
      </div>

      {/* Summary Review Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FED7E2] shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFF0F3] rounded-bl-full z-0 opacity-60 pointer-events-none" />

        {/* Names Header */}
        <div className="relative z-10 border-b border-[#FED7E2]/60 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#834758]">For</p>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-romantic text-[#4A1525]">
                {draft.recipientName || 'Special Someone'}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-[#834758]">From</p>
              <h2 className="text-lg sm:text-xl font-bold font-serif-romantic text-[#FF4D79]">
                {draft.senderName || 'You'}
              </h2>
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-[#FFF9F9] rounded-2xl border border-[#FED7E2]/60">
            <p className="text-xs text-[#834758] italic font-medium">
              "{draft.openingMessage || 'I made something for you.'}"
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="relative z-10 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#834758]">
            Included In This Surprise
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] text-xs font-medium text-[#4A1525] border border-[#FED7E2]">
              ❤️ {draft.occasion || 'Just because'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] text-xs font-medium text-[#4A1525] border border-[#FED7E2]">
              ✨ {draft.relationshipStyle || 'Soft & quiet'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] text-xs font-medium text-[#4A1525] border border-[#FED7E2]">
              <Image className="w-3.5 h-3.5 text-[#FF4D79]" /> {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] text-xs font-medium text-[#4A1525] border border-[#FED7E2]">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" /> {reasonCount} reasons
            </span>
            {hasLetter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] text-xs font-medium text-[#4A1525] border border-[#FED7E2]">
                <Feather className="w-3.5 h-3.5 text-[#FF4D79]" /> Love letter ({draft.waxSeal})
              </span>
            )}
            {hasVoice && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-800 border border-emerald-200">
                <Mic className="w-3.5 h-3.5 text-emerald-600" /> Voice message
              </span>
            )}
          </div>
        </div>

        {/* Interactive Experience Teaser */}
        <div className="relative z-10 pt-2">
          <Button
            type="button"
            variant="soft"
            fullWidth
            onClick={onPreview}
            className="py-3 font-semibold text-sm border-dashed"
          >
            <Eye className="w-4 h-4 mr-2" /> Experience Preview (See what they will see)
          </Button>
        </div>
      </div>

      {/* Creation and Navigation CTA */}
      <div className="space-y-3 pt-2">
        <Button
          onClick={onPublish}
          isLoading={isPublishing}
          size="lg"
          fullWidth
          className="shadow-lg shadow-pink-500/25 text-base sm:text-lg py-4"
        >
          <Share2 className="w-5 h-5 mr-2" /> Create Gift & Get Shareable Link ❤️
        </Button>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-[#834758] hover:text-[#4A1525] font-medium underline py-2 cursor-pointer"
          >
            ← Need to change something? Go back
          </button>
        </div>
      </div>
    </motion.div>
  );
};
