'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Upload, Trash2, CheckCircle2, Copy, ExternalLink, Share2, MessageCircle } from 'lucide-react';
import { FloatingHearts } from '@/components/ui/FloatingHearts';
import { Gift, Photo } from '@/types/gift';
import { generateSlug, saveLocalGift, compressImage, copyToClipboard, getWhatsAppShareUrl } from '@/lib/utils';
import { saveGiftToStorage } from '@/lib/supabase';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const BALLOON_SPARKS = [
  'Your laugh is my favourite sound',
  'You make ordinary days feel special',
  'You believed in me when I didn\'t',
  'The world is kinder with you in it',
  'You remember the little things I forget',
  'My worst days get shorter when you call',
];

const LETTER_SPARKS = [
  'I keep thinking about how lucky I got with you. You have seen me at my worst and stayed anyway, and I do not say thank you nearly enough for that ❤️ This year, I hope life is gentle with you...',
  'Every year I try to find the perfect words and every year I fall short, so here is the honest version: You make my most ordinary days feel worth remembering 🎂 Happy birthday, my favourite person...',
];

export default function BirthdayCreatorPage() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [recipientName, setRecipientName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [turningAge, setTurningAge] = useState<string>('');
  const [birthDay, setBirthDay] = useState<string>('');
  const [birthMonth, setBirthMonth] = useState<string>('');

  const [balloons, setBalloons] = useState<string[]>([
    '', '', '', '', ''
  ]);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [letterText, setLetterText] = useState<string>('');

  // Baking state
  const [isBaking, setIsBaking] = useState<boolean>(false);
  const [bakingStep, setBakingStep] = useState<number>(0);

  // Completed Gift state
  const [createdSlug, setCreatedSlug] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length >= 5) {
      alert('You can upload up to 5 photos for the birthday surprise.');
      return;
    }

    setIsUploading(true);
    try {
      const newPhotos: Photo[] = [...photos];
      for (let i = 0; i < files.length && newPhotos.length < 5; i++) {
        const compressedDataUrl = await compressImage(files[i]);
        newPhotos.push({
          id: Math.random().toString(36).substring(2, 9),
          url: compressedDataUrl,
          caption: '',
          aspectRatio: 'square',
        });
      }
      setPhotos(newPhotos);
    } catch (err) {
      console.error('Photo upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBalloonSparkClick = (sparkText: string) => {
    // Fill first empty balloon slot or update target
    const emptyIndex = balloons.findIndex((b) => b.trim() === '');
    const targetIndex = emptyIndex !== -1 ? emptyIndex : 0;
    const updated = [...balloons];
    updated[targetIndex] = sparkText.slice(0, 50);
    setBalloons(updated);
  };

  const handleBakeMagic = async () => {
    setStep(5);
    setIsBaking(true);
    setBakingStep(1);

    // Sequence progress checks
    await new Promise((res) => setTimeout(res, 700));
    setBakingStep(2);
    await new Promise((res) => setTimeout(res, 700));
    setBakingStep(3);
    await new Promise((res) => setTimeout(res, 700));
    setBakingStep(4);
    await new Promise((res) => setTimeout(res, 700));
    setBakingStep(5);

    // Create Gift Object
    const slug = generateSlug();
    const finalReasons = balloons.filter((b) => b.trim().length > 0);
    if (finalReasons.length === 0) {
      finalReasons.push('You make ordinary days feel special.');
      finalReasons.push('Your laugh is my favourite sound.');
    }

    const newGift: Gift = {
      id: Math.random().toString(36).substring(2, 9),
      slug,
      senderName: senderName || 'Someone who loves you',
      recipientName: recipientName || 'Birthday Star',
      openingMessage: `Happy Birthday, ${recipientName || 'Birthday Star'}! 🎂🎉`,
      occasion: 'Birthday',
      relationship: 'Friend / Loved One',
      relationshipStyle: 'Warm & Festive',
      turningAge: turningAge || '',
      birthDay: birthDay || '',
      birthMonth: birthMonth || '',
      photos,
      reasons: finalReasons,
      loveLetter: letterText || `Wishing you the happiest birthday ever! May your year ahead be filled with joy, laughter, and endless love ❤️`,
      waxSeal: '🌹',
      sticker: '🥰',
      theme: 'rose',
      music: 'music-box',
      finalMessage: `Happy Birthday! I am so grateful to celebrate you today. ✨`,
      finalQuestion: `Ready to make this your best year yet? 🎂`,
      template: 'birthday',
      createdAt: new Date().toISOString(),
    };

    try {
      await saveGiftToStorage(newGift);
    } catch {
      saveLocalGift(newGift);
    }

    setCreatedSlug(slug);
    setIsBaking(false);
  };

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/gift/${createdSlug}`
    : `/gift/${createdSlug}`;

  const copyLink = async () => {
    if (!shareUrl) return;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${recipientName || 'Star'}! 🎂`,
          text: `Open your birthday surprise 🎉`,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    await copyLink();
  };

  return (
    <div className="min-h-screen bg-[#FFF8F5] text-[#4A1525] flex flex-col justify-between py-6 px-4 relative overflow-x-hidden font-sans">
      <FloatingHearts count={8} />

      {/* Top Navigation & Step Indicator */}
      <header className="relative z-10 w-full max-w-lg mx-auto mb-4 text-center">
        {step < 5 && (
          <div className="space-y-2">
            <div className="flex justify-center items-center gap-1.5 text-xs text-[#C87D55] font-semibold">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i + 1 <= step ? 'opacity-100 scale-110 transition-all' : 'opacity-30'}>
                  🎈
                </span>
              ))}
            </div>
            <p className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
              Step {step} of 5 • {
                step === 1 ? 'The Star' :
                step === 2 ? 'The Balloons' :
                step === 3 ? 'The Memories' : 'The Letter'
              }
            </p>
          </div>
        )}
      </header>

      {/* Main Form Container */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: THE STAR */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#FED7AA] shadow-xl space-y-6 text-center"
            >
              <div className="text-4xl">🌟</div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#7C2D12]">
                  Who&apos;s the birthday star?
                </h1>
                <p className="text-xs sm:text-sm text-[#9A3412]">
                  You&apos;re about to make someone&apos;s day unforgettable 🎀
                </p>
              </div>

              <div className="space-y-4 text-left">
                {/* Recipient Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9A3412] mb-1.5">
                    Their name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFFBF7] border border-[#FDBA74] text-[#7C2D12] text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] shadow-inner placeholder-[#C87D55]/60"
                  />
                </div>

                {/* Sender Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9A3412] mb-1.5">
                    Your name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFFBF7] border border-[#FDBA74] text-[#7C2D12] text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] shadow-inner placeholder-[#C87D55]/60"
                  />
                </div>

                {/* Turning Age */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9A3412] mb-1.5">
                    Turning age <span className="normal-case text-[10px] text-[#C87D55]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25"
                    value={turningAge}
                    onChange={(e) => setTurningAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFFBF7] border border-[#FDBA74] text-[#7C2D12] text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] shadow-inner placeholder-[#C87D55]/60"
                  />
                </div>

                {/* Birthday Date (Day & Month) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9A3412] mb-1.5">
                    Their birthday <span className="normal-case text-[10px] text-[#C87D55]">(optional — unlocks midnight magic)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="px-3 py-3 rounded-2xl bg-[#FFFBF7] border border-[#FDBA74] text-[#7C2D12] text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    >
                      <option value="">Day —</option>
                      {DAYS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="px-3 py-3 rounded-2xl bg-[#FFFBF7] border border-[#FDBA74] text-[#7C2D12] text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    >
                      <option value="">Month —</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                disabled={!recipientName.trim()}
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-full bg-linear-to-r from-[#F97316] to-[#EA580C] text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 transition-all cursor-pointer"
              >
                Let&apos;s begin 🎂
              </button>
            </motion.div>
          )}

          {/* STEP 2: THE BALLOONS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#FED7AA] shadow-xl space-y-6 text-center"
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-serif-romantic text-[#7C2D12]">
                  Fill the balloons
                </h2>
                <p className="text-xs text-[#9A3412]">
                  Each balloon hides one reason they&apos;re loved. They&apos;ll pop them one by one.
                </p>
              </div>

              {/* 5 Balloon Inputs */}
              <div className="space-y-3">
                {balloons.map((val, idx) => (
                  <div key={idx} className="relative flex items-center">
                    <span className="absolute left-3.5 text-lg">🎈</span>
                    <input
                      type="text"
                      maxLength={50}
                      placeholder={`e.g. ${BALLOON_SPARKS[idx % BALLOON_SPARKS.length]}`}
                      value={val}
                      onChange={(e) => {
                        const updated = [...balloons];
                        updated[idx] = e.target.value;
                        setBalloons(updated);
                      }}
                      className="w-full pl-11 pr-14 py-3 rounded-2xl bg-[#FFFBF7] border border-[#FDBA74] text-[#7C2D12] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] placeholder-[#C87D55]/50"
                    />
                    <span className="absolute right-3 text-[10px] font-mono text-[#C87D55]">
                      {val.length}/50
                    </span>
                  </div>
                ))}
              </div>

              {/* Suggestion Sparks */}
              <div className="space-y-2 text-left pt-2 border-t border-[#FFEDD5]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] text-center">
                  Need a spark? Tap to use
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BALLOON_SPARKS.map((spark, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleBalloonSparkClick(spark)}
                      className="p-2.5 rounded-xl border border-dashed border-[#FDBA74] bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#7C2D12] text-xs font-medium text-left transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-orange-500 font-bold">+</span>
                      <span className="truncate">{spark}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-12 h-12 rounded-full border border-[#FDBA74] text-[#7C2D12] flex items-center justify-center hover:bg-[#FFF7ED] cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-full bg-linear-to-r from-[#F97316] to-[#EA580C] text-white font-bold text-sm shadow-lg shadow-orange-500/25 cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: THE MEMORIES */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#FED7AA] shadow-xl space-y-6 text-center"
            >
              <div className="text-3xl">📸</div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-serif-romantic text-[#7C2D12]">
                  Hang up some memories
                </h2>
                <p className="text-xs text-[#9A3412]">
                  Up to 5 photos of {recipientName || 'them'}, strung on fairy lights. A caption like &quot;Goa, 2023&quot; makes hearts melt.
                </p>
              </div>

              {/* Photos List / Upload Grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {photos.map((photo, idx) => (
                    <div key={photo.id} className="relative rounded-2xl overflow-hidden border border-[#FED7AA] bg-[#FFFBF7] p-2 space-y-1">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-html-loader */}
                        <img src={photo.url} alt="Memory" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Add caption..."
                        value={photo.caption || ''}
                        onChange={(e) => {
                          const updated = [...photos];
                          updated[idx].caption = e.target.value;
                          setPhotos(updated);
                        }}
                        className="w-full text-[11px] px-2 py-1 rounded-lg bg-white border border-[#FDBA74] text-[#7C2D12] text-center focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Dropzone */}
              {photos.length < 5 && (
                <label className="block w-full border-2 border-dashed border-[#FDBA74] rounded-2xl p-6 bg-[#FFFBF7] hover:bg-[#FFF7ED] transition-colors cursor-pointer text-center space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="w-10 h-10 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#7C2D12]">
                      {isUploading ? 'Compressing photos...' : 'Tap to add photos'}
                    </p>
                    <p className="text-[10px] text-[#C87D55]">
                      JPG or PNG under 5MB each ({photos.length}/5)
                    </p>
                  </div>
                </label>
              )}

              {/* Navigation Buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-12 h-12 rounded-full border border-[#FDBA74] text-[#7C2D12] flex items-center justify-center hover:bg-[#FFF7ED] cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex-1 py-3.5 rounded-full bg-linear-to-r from-[#F97316] to-[#EA580C] text-white font-bold text-sm shadow-lg shadow-orange-500/25 cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs font-semibold text-[#C87D55] underline hover:text-[#EA580C] cursor-pointer"
                >
                  Skip photos for now
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: THE LETTER */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#FED7AA] shadow-xl space-y-6 text-center"
            >
              <div className="text-3xl">💌</div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-serif-romantic text-[#7C2D12]">
                  Write your birthday letter
                </h2>
                <p className="text-xs text-[#9A3412]">
                  This is the part {recipientName || 'they'} will read twice — and remember forever.
                </p>
              </div>

              {/* Letter Textarea */}
              <div className="relative">
                <textarea
                  rows={6}
                  maxLength={500}
                  placeholder="I keep thinking about how lucky I got with you..."
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-[#FFFBF7] border border-[#FDBA74] text-[#7C2D12] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] placeholder-[#C87D55]/50 leading-relaxed"
                />
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[#C87D55]">
                  {letterText.length}/500
                </span>
              </div>

              {/* Sparks */}
              <div className="space-y-2 text-left pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] text-center">
                  Need a spark? Tap to use
                </p>
                <div className="space-y-2">
                  {LETTER_SPARKS.map((spark, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLetterText(spark)}
                      className="p-3 rounded-2xl border border-dashed border-[#FDBA74] bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#7C2D12] text-xs font-medium text-left transition-colors cursor-pointer block w-full leading-relaxed"
                    >
                      <span className="text-orange-500 font-bold mr-1.5">+</span>
                      {spark}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-12 h-12 rounded-full border border-[#FDBA74] text-[#7C2D12] flex items-center justify-center hover:bg-[#FFF7ED] cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleBakeMagic}
                  className="flex-1 py-4 rounded-full bg-linear-to-r from-[#F97316] to-[#EA580C] text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Bake the magic</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: BAKING THE MAGIC LOADER / REVIEW */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#FED7AA] shadow-2xl space-y-6 text-center"
            >
              {isBaking ? (
                <div className="space-y-6 py-4">
                  <div className="w-16 h-16 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center mx-auto text-3xl shadow-md animate-bounce">
                    🎂
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-xl font-bold font-serif-romantic text-[#7C2D12]">
                      Crafting {recipientName}&apos;s surprise...
                    </h2>
                  </div>

                  {/* Animated Checklist */}
                  <div className="space-y-3 text-left max-w-xs mx-auto text-xs sm:text-sm">
                    <div className={`flex items-center gap-2.5 transition-all ${bakingStep >= 1 ? 'text-amber-800 font-semibold opacity-100' : 'text-gray-400 opacity-40'}`}>
                      <CheckCircle2 className={`w-4 h-4 ${bakingStep >= 1 ? 'text-amber-600' : ''}`} />
                      <span>Baking the Midnight Chocolate 🎂</span>
                    </div>
                    <div className={`flex items-center gap-2.5 transition-all ${bakingStep >= 2 ? 'text-amber-800 font-semibold opacity-100' : 'text-gray-400 opacity-40'}`}>
                      <CheckCircle2 className={`w-4 h-4 ${bakingStep >= 2 ? 'text-amber-600' : ''}`} />
                      <span>Lighting candles for turning {turningAge || 'special age'} 🕯️</span>
                    </div>
                    <div className={`flex items-center gap-2.5 transition-all ${bakingStep >= 3 ? 'text-amber-800 font-semibold opacity-100' : 'text-gray-400 opacity-40'}`}>
                      <CheckCircle2 className={`w-4 h-4 ${bakingStep >= 3 ? 'text-amber-600' : ''}`} />
                      <span>Filling balloons with your words 🎈</span>
                    </div>
                    <div className={`flex items-center gap-2.5 transition-all ${bakingStep >= 4 ? 'text-amber-800 font-semibold opacity-100' : 'text-gray-400 opacity-40'}`}>
                      <CheckCircle2 className={`w-4 h-4 ${bakingStep >= 4 ? 'text-amber-600' : ''}`} />
                      <span>Sealing your letter inside the card 💌</span>
                    </div>
                    <div className={`flex items-center gap-2.5 transition-all ${bakingStep >= 5 ? 'text-amber-800 font-semibold opacity-100' : 'text-gray-400 opacity-40'}`}>
                      <CheckCircle2 className={`w-4 h-4 ${bakingStep >= 5 ? 'text-amber-600' : ''}`} />
                      <span>Signed with love — {senderName || 'You'} ✍️</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#FFEDD5] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-linear-to-r from-orange-400 to-orange-600"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(bakingStep / 5) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              ) : (
                /* BAKED READY STATE (SHARE LINK) */
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-full bg-linear-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30 text-3xl">
                    🎁
                  </div>

                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> Birthday Surprise Ready!
                    </span>
                    <h2 className="text-2xl font-bold font-serif-romantic text-[#7C2D12]">
                      Your surprise for {recipientName} is created.
                    </h2>
                    <p className="text-xs text-[#9A3412]">
                      Share this magical link with {recipientName} to pop the balloons and celebrate!
                    </p>
                  </div>

                  {/* Share Link Box */}
                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border border-[#FDBA74] flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="w-full text-xs font-mono bg-transparent text-[#7C2D12] focus:outline-none truncate cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={copyLink}
                      className="px-3.5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="w-full py-4 rounded-full bg-linear-to-r from-[#F97316] to-[#EA580C] text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share with {recipientName || 'Birthday Star'}</span>
                    </button>

                    <a
                      href={getWhatsAppShareUrl(`Happy Birthday ${recipientName || 'Birthday Star'}! 🎂 Here is a special surprise for you:`, shareUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Share on WhatsApp</span>
                    </a>

                    <a
                      href={`/gift/${createdSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-full border border-[#FDBA74] text-[#7C2D12] font-semibold text-xs hover:bg-[#FFF7ED] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Preview Recipient Experience</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      className="text-xs font-semibold text-[#C87D55] hover:text-[#EA580C] cursor-pointer"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
