'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FloatingHearts } from '@/components/ui/FloatingHearts';
import { Heart, Sparkles, Image, Feather, Mic, ArrowRight, Gift as GiftIcon } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden bg-[#FFF5F6] text-[#4A1525]">
      {/* Background Floating Hearts */}
      <FloatingHearts count={15} />

      {/* Top Simple Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#FF4D79] to-[#E11D48] text-white flex items-center justify-center shadow-md shadow-pink-500/20 text-sm">
            ❤️
          </div>
          <span className="font-serif-romantic font-bold text-xl text-[#4A1525] tracking-tight">
            SpecialOne
          </span>
        </div>

        <Link href="/create">
          <Button variant="soft" size="sm">
            Create a Gift
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-14 text-center max-w-3xl mx-auto">
        {/* Little badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#FED7E2] shadow-xs text-xs font-semibold text-[#B81846] mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D79]" />
          <span>A tiny interactive world just for them</span>
        </motion.div>

        {/* Main Emotional Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif-romantic tracking-tight text-[#4A1525] leading-tight"
        >
          Make something they'll <br />
          <span className="text-[#FF4D79] underline decoration-[#FECDD3] decoration-wavy decoration-2">
            never forget.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-[#834758] mt-5 max-w-xl mx-auto leading-relaxed"
        >
          Turn your favourite memories, inside jokes, recorded voice notes, and a sealed handwritten letter into an intimate digital surprise made just for them.
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto"
        >
          <Link href="/create" className="w-full sm:w-1/2">
            <Button
              size="lg"
              fullWidth
              className="px-6 py-4 text-sm sm:text-base shadow-xl shadow-pink-500/25"
            >
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Romantic Surprise ❤️
            </Button>
          </Link>
          <Link href="/create/birthday" className="w-full sm:w-1/2">
            <button
              type="button"
              className="w-full py-3.5 px-6 rounded-full bg-linear-to-r from-[#F97316] to-[#EA580C] text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Birthday Pop Balloons 🎈</span>
            </button>
          </Link>
        </motion.div>

        {/* Visual Scrapbook Teaser Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 sm:mt-16 w-full max-w-md relative"
        >
          {/* Decorative Polaroid Scrapbook stack */}
          <div className="relative bg-white rounded-3xl p-6 border border-[#FED7E2] shadow-xl shadow-pink-500/10 space-y-4">
            <div className="washi-tape" />

            <div className="flex items-center justify-between border-b border-[#FED7E2]/60 pb-3">
              <div className="text-left">
                <span className="text-[11px] font-bold text-[#FF4D79] uppercase tracking-wider">The Experience</span>
                <h2 className="font-serif-romantic font-bold text-base text-[#4A1525]">A Digital Love Capsule</h2>
              </div>
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-[#FFF0F3] border border-[#FED7E2] flex items-center justify-center text-xs">📸</span>
                <span className="w-7 h-7 rounded-full bg-[#FFF0F3] border border-[#FED7E2] flex items-center justify-center text-xs">🎙️</span>
                <span className="w-7 h-7 rounded-full bg-[#FFF0F3] border border-[#FED7E2] flex items-center justify-center text-xs">💌</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-left pt-1">
              <div className="p-3 bg-[#FFF9F9] rounded-2xl border border-[#FED7E2]/50 space-y-1">
                <Image className="w-4 h-4 text-[#FF4D79]" />
                <p className="text-[11px] font-bold text-[#4A1525]">Polaroids</p>
                <p className="text-[10px] text-[#834758]">Captioned photos</p>
              </div>
              <div className="p-3 bg-[#FFF9F9] rounded-2xl border border-[#FED7E2]/50 space-y-1">
                <Mic className="w-4 h-4 text-[#FF4D79]" />
                <p className="text-[11px] font-bold text-[#4A1525]">Voice Note</p>
                <p className="text-[10px] text-[#834758]">Spoken memory</p>
              </div>
              <div className="p-3 bg-[#FFF9F9] rounded-2xl border border-[#FED7E2]/50 space-y-1">
                <Feather className="w-4 h-4 text-[#FF4D79]" />
                <p className="text-[11px] font-bold text-[#4A1525]">Wax Letter</p>
                <p className="text-[10px] text-[#834758]">Sealed envelope</p>
              </div>
            </div>

            <p className="text-xs text-[#834758] italic pt-1">
              "Someone created a tiny interactive world just for me."
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-[#834758]">
        <p>Made with love • A romantic surprise they will cherish forever</p>
      </footer>
    </div>
  );
}
