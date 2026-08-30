'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftDraft, Photo } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { compressImage } from '@/lib/utils';
import { Heart, UploadCloud, X, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';

interface StepPhotosProps {
  draft: GiftDraft;
  updateDraft: (fields: Partial<GiftDraft>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

export const StepPhotos: React.FC<StepPhotosProps> = ({
  draft,
  updateDraft,
  errors,
  onNext,
  onBack,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const photos: Photo[] = draft.photos || [];
  const maxPhotos = 8;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const remainingSlots = maxPhotos - photos.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      const newPhotos: Photo[] = [];
      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) continue;
        const compressedUrl = await compressImage(file);
        newPhotos.push({
          id: Math.random().toString(36).substring(2, 9),
          url: compressedUrl,
          caption: '',
        });
      }

      updateDraft({ photos: [...photos, ...newPhotos] });
    } catch (err) {
      console.error('Error compressing uploaded photos:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = (id: string) => {
    updateDraft({ photos: photos.filter((p) => p.id !== id) });
  };

  const updateCaption = (id: string, caption: string) => {
    updateDraft({
      photos: photos.map((p) => (p.id === id ? { ...p, caption } : p)),
    });
  };

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
          <Heart className="w-3 h-3 fill-current text-[#FF4D79]" /> Sweet Memories
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525] tracking-tight">
          Add your favourite photos.
        </h1>
        <p className="text-sm text-[#834758] max-w-md mx-auto">
          Add the moments you want them to remember. Up to 8 photos with optional personal captions.
        </p>
      </div>

      {/* Upload Area / Dropzone */}
      {photos.length < maxPhotos && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#FF4D79] bg-[#FFF0F3] scale-[1.01]'
              : 'border-[#FED7E2] bg-white hover:border-[#FF4D79]/60 hover:bg-[#FFF9F9]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] text-[#FF4D79] flex items-center justify-center shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base text-[#4A1525]">
                {isProcessing ? 'Processing memories...' : 'Tap to upload or drop photos here'}
              </p>
              <p className="text-xs text-[#834758] mt-1">
                JPG, PNG, or WEBP • {photos.length} of {maxPhotos} added
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#834758]">
            <span>Your Selected Moments ({photos.length}/{maxPhotos})</span>
            {photos.length < maxPhotos && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#FF4D79] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add more
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="bg-white rounded-2xl p-3 border border-[#FED7E2]/80 shadow-xs space-y-2.5 relative group"
                >
                  <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-[#FFF0F3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-500 text-white transition-colors cursor-pointer shadow-md"
                      title="Remove photo"
                      aria-label="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-[10px] text-white font-medium">
                      #{index + 1}
                    </span>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Add a sweet caption (e.g. That rainy evening ❤️)"
                      value={photo.caption || ''}
                      onChange={(e) => updateCaption(photo.id, e.target.value)}
                      maxLength={60}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#FFF9F9] border border-[#FED7E2]/70 text-[#4A1525] placeholder:text-[#BFA3AC] focus:outline-none focus:border-[#FF4D79]"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {errors.photos && <p className="text-xs text-red-500 font-medium">{errors.photos}</p>}

      {/* Helper text */}
      {photos.length === 0 && (
        <div className="p-4 rounded-2xl bg-[#FFF0F3]/60 border border-[#FED7E2]/50 text-center">
          <p className="text-xs text-[#834758]">
            <Sparkles className="w-3.5 h-3.5 inline text-[#FF4D79] mr-1" />
            Photos bring your surprise to life! If you prefer, you can also proceed and add them later.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Back
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Continue to Step 4 →
        </Button>
      </div>
    </motion.div>
  );
};
