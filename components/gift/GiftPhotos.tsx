'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Heart, ChevronRight, ChevronLeft, Sparkles, Image as ImageIcon } from 'lucide-react';

interface GiftPhotosProps {
  gift: Gift;
  onNext: () => void;
}

export const GiftPhotos: React.FC<GiftPhotosProps> = ({ gift, onNext }) => {
  const photos = gift.photos || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no photos uploaded, show a sweet placeholder card and let them proceed
  if (photos.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto relative z-10 select-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white/95 rounded-3xl p-8 border border-[#FED7E2] shadow-xl space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#FFF0F3] text-[#FF4D79] mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-serif-romantic text-[#4A1525]">Every Moment With You</h3>
            <p className="text-sm text-[#834758]">
              "The best memories aren't just in photographs — they live in every quiet second we share."
            </p>
          </div>
          <Button onClick={onNext} size="lg" fullWidth>
            Read My Words →
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];
  const isLast = currentIndex === photos.length - 1;

  const handleNext = () => {
    if (isLast) {
      onNext();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Give each polaroid a playful slight authentic tilt
  const rotationDegrees = (currentIndex % 3 === 0 ? -2.5 : currentIndex % 2 === 0 ? 2 : -1.5);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center max-w-sm sm:max-w-md mx-auto relative z-10 select-none">
      {/* Header Indicator */}
      <div className="mb-4 text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#834758]">
          Memory {currentIndex + 1} of {photos.length}
        </span>
      </div>

      {/* Polaroid Card */}
      <div className="w-full relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.85, rotate: rotationDegrees * 2, y: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: rotationDegrees, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: -rotationDegrees * 2, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="w-full polaroid-card relative rounded-xl shadow-2xl border border-[#FED7E2]/50 bg-white"
          >
            {/* Scrapbook washi tape */}
            <div className="washi-tape" />

            {/* Photo Container */}
            <div className="relative aspect-4/3 w-full bg-[#FFF0F3] rounded-lg overflow-hidden mt-1 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption || 'Cherished Memory'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Caption (Handwritten style) */}
            <div className="pt-4 pb-1 text-center min-h-13 flex items-center justify-center px-2">
              <p className="font-handwritten text-lg sm:text-xl text-[#3D281F]">
                {currentPhoto.caption || 'A moment etched in my heart ❤️'}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-1.5 mt-6 mb-4">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentIndex ? 'w-6 bg-[#FF4D79]' : 'w-2 bg-[#FED7E2]'
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3 w-full">
          {currentIndex > 0 && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handlePrev}
              className="px-4"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}

          <Button
            type="button"
            size="lg"
            fullWidth
            onClick={handleNext}
            className="flex-1 shadow-md shadow-pink-500/20"
          >
            {isLast ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" /> What I Love About You →
              </>
            ) : (
              <>
                Next Memory <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
