'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, GiftDraft } from '@/types/gift';
import { defaultGiftDraft, saveDraft, loadDraft, clearDraft, generateSlug, copyToClipboard, getWhatsAppShareUrl } from '@/lib/utils';
import { validateStep } from '@/lib/validation';
import { saveGiftToStorage } from '@/lib/supabase';

// Creator Components
import { StepIndicator } from '@/components/creator/StepIndicator';
import { StepBasics } from '@/components/creator/StepBasics';
import { StepRelationship } from '@/components/creator/StepRelationship';
import { StepPhotos } from '@/components/creator/StepPhotos';
import { StepWords } from '@/components/creator/StepWords';
import { StepVoice } from '@/components/creator/StepVoice';
import { StepFinishingTouches } from '@/components/creator/StepFinishingTouches';
import { StepReview } from '@/components/creator/StepReview';

// Recipient Preview & UI
import { GiftExperience } from '@/components/gift/GiftExperience';
import { FloatingHearts } from '@/components/ui/FloatingHearts';
import { Button } from '@/components/ui/Button';
import { fireRomanticConfetti } from '@/components/gift/Confetti';
import { Sparkles, Copy, Check, Share2, ExternalLink, Heart, MessageCircle } from 'lucide-react';

const STEP_TITLES = [
  'The Basics',
  'The Two of You',
  'Your Photos',
  'Your Words',
  'Your Voice',
  'Finishing Touches',
  'Review & Wrap',
];

export default function CreateGiftPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState<GiftDraft>(defaultGiftDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Restore draft on initial load
  useEffect(() => {
    const saved = loadDraft();
    if (saved) {
      setDraft((prev) => ({ ...prev, ...saved }));
    }
  }, []);

  // Save draft whenever it changes
  const updateDraft = (fields: Partial<GiftDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...fields };
      saveDraft(next);
      return next;
    });
    // Clear errors for modified fields
    setErrors((prev) => {
      const copy = { ...prev };
      Object.keys(fields).forEach((key) => delete copy[key]);
      return copy;
    });
  };

  const handleNext = () => {
    const validation = validateStep(currentStep, draft);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const slug = draft.slug || generateSlug();
      const finalGift: Gift = {
        ...defaultGiftDraft,
        ...draft,
        id: draft.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)),
        slug,
        senderName: draft.senderName || 'Anonymous',
        recipientName: draft.recipientName || 'My Love',
        openingMessage: draft.openingMessage || 'I made something for you.',
        occasion: draft.occasion || 'Just because',
        relationship: draft.relationship || 'My partner',
        relationshipStyle: draft.relationshipStyle || 'Soft & quiet',
        photos: draft.photos || [],
        reasons: draft.reasons || [],
        loveLetter: draft.loveLetter || '',
        waxSeal: draft.waxSeal || '❤️',
        sticker: draft.sticker || '🥰',
        theme: draft.theme || 'blush',
        music: draft.music || 'music-box',
        template: 'romantic',
        createdAt: new Date().toISOString(),
      };

      await saveGiftToStorage(finalGift);
      clearDraft();
      setCreatedSlug(slug);
      fireRomanticConfetti();
    } catch (err) {
      console.error('Error finalizing gift:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' && createdSlug
    ? `${window.location.origin}/gift/${createdSlug}`
    : '';

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `A special surprise for ${draft.recipientName || 'you'}`,
          text: `Open your surprise ❤️`,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    await handleCopyLink();
  };

  // If Creator is in full-screen Preview mode
  if (isPreviewOpen) {
    const previewGift: Gift = {
      ...defaultGiftDraft,
      ...draft,
      id: 'preview',
      slug: 'preview',
      senderName: draft.senderName || 'Your Name',
      recipientName: draft.recipientName || 'Recipient Name',
      openingMessage: draft.openingMessage || 'I made something for you.',
      occasion: draft.occasion || 'Just because',
      relationship: draft.relationship || 'My partner',
      relationshipStyle: draft.relationshipStyle || 'Soft & quiet',
      photos: draft.photos || [],
      reasons: draft.reasons || ['You make ordinary days feel special.'],
      loveLetter: draft.loveLetter || 'A sweet message.',
      waxSeal: draft.waxSeal || '❤️',
      sticker: draft.sticker || '🥰',
      theme: draft.theme || 'blush',
      music: draft.music || 'music-box',
      template: 'romantic',
      createdAt: new Date().toISOString(),
    };

    return (
      <GiftExperience
        gift={previewGift}
        isPreview={true}
        onExitPreview={() => setIsPreviewOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-[#FFF5F6] text-[#4A1525] pb-12">
      <FloatingHearts count={8} />

      {/* Header */}
      <header className="relative z-10 w-full max-w-xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FF4D79] text-white flex items-center justify-center text-xs shadow-sm">
            ❤️
          </div>
          <span className="font-serif-romantic font-bold text-lg text-[#4A1525]">
            SpecialOne
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="text-xs font-semibold text-[#834758] hover:text-[#FF4D79] px-3 py-1.5 rounded-full bg-white/80 border border-[#FED7E2] transition-colors cursor-pointer"
        >
          Preview Experience
        </button>
      </header>

      {/* Step Indicator */}
      <div className="relative z-10 pt-2">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={7}
          stepTitles={STEP_TITLES}
          canGoBack={currentStep > 1}
          onBack={handleBack}
        />
      </div>

      {/* Main Step Form Body */}
      <main className="relative z-10 flex-1 w-full max-w-xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <StepBasics
              key="step1"
              draft={draft}
              updateDraft={updateDraft}
              errors={errors}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <StepRelationship
              key="step2"
              draft={draft}
              updateDraft={updateDraft}
              errors={errors}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <StepPhotos
              key="step3"
              draft={draft}
              updateDraft={updateDraft}
              errors={errors}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <StepWords
              key="step4"
              draft={draft}
              updateDraft={updateDraft}
              errors={errors}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <StepVoice
              key="step5"
              draft={draft}
              updateDraft={updateDraft}
              errors={errors}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 6 && (
            <StepFinishingTouches
              key="step6"
              draft={draft}
              updateDraft={updateDraft}
              errors={errors}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 7 && (
            <StepReview
              key="step7"
              draft={draft}
              onBack={handleBack}
              onPreview={() => setIsPreviewOpen(true)}
              onPublish={handlePublish}
              isPublishing={isPublishing}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Published / Ready Modal */}
      <AnimatePresence>
        {createdSlug && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#FED7E2] shadow-2xl space-y-6 text-center relative"
            >
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-[#FF4D79] to-[#E11D48] text-white mx-auto flex items-center justify-center shadow-lg shadow-pink-500/30 text-2xl">
                🎁
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF4D79] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Gift Wrapped & Ready!
                </span>
                <h3 className="text-2xl font-bold font-serif-romantic text-[#4A1525]">
                  Your surprise for {draft.recipientName} is created.
                </h3>
                <p className="text-xs sm:text-sm text-[#834758]">
                  Share this private link with them. When they open it, their romantic interactive world will unfold.
                </p>
              </div>

              {/* Share URL Box */}
              <div className="p-3 bg-[#FFF0F3] rounded-2xl border border-[#FED7E2] flex items-center justify-between gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="bg-transparent text-xs text-[#4A1525] font-mono flex-1 focus:outline-none truncate cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-[#FF4D79] border border-[#FED7E2] hover:bg-[#FFF5F6] transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>

              {/* Modal Buttons */}
              <div className="space-y-2 pt-2">
                <Button onClick={handleNativeShare} size="lg" fullWidth>
                  <Share2 className="w-4 h-4 mr-2" /> Share with {draft.recipientName || 'Your Love'}
                </Button>

                <a
                  href={getWhatsAppShareUrl(`A special surprise for ${draft.recipientName || 'you'} ❤️`, shareUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </a>

                <Link href={`/gift/${createdSlug}`} target="_blank" className="block w-full">
                  <Button variant="outline" size="md" fullWidth>
                    <ExternalLink className="w-4 h-4 mr-1.5" /> View Gift Page
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
