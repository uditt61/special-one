'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Play, Pause, Mic, Heart, Sparkles, Volume2 } from 'lucide-react';

interface GiftVoiceProps {
  gift: Gift;
  onNext: () => void;
}

export const GiftVoice: React.FC<GiftVoiceProps> = ({ gift, onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(gift.voiceDuration || 15);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gift.voiceMessageUrl) {
      const audio = new Audio(gift.voiceMessageUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(Math.floor(audio.duration));
        }
      };

      audio.ontimeupdate = () => {
        setCurrentTime(Math.floor(audio.currentTime));
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [gift.voiceMessageUrl]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center max-w-sm sm:max-w-md mx-auto relative z-10 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-[#FED7E2] shadow-2xl shadow-pink-500/10 space-y-6 relative"
      >
        {/* Washi tape */}
        <div className="washi-tape" />

        {/* Intro */}
        <div className="space-y-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F3] border border-[#FED7E2] rounded-full text-xs font-semibold text-[#B81846]">
            <Mic className="w-3 h-3 text-[#FF4D79]" /> Personal Voice Note
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525]">
            A message for your ears
          </h2>
          <p className="text-xs sm:text-sm text-[#834758] italic">
            "There's something I wanted you to hear out loud."
          </p>
        </div>

        {/* Big Audio Playback Circle */}
        <div className="py-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={toggleAudio}
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-linear-to-tr from-[#FF4D79] to-[#E11D48] text-white flex items-center justify-center shadow-xl shadow-pink-500/30 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 fill-current" />
            ) : (
              <Play className="w-10 h-10 fill-current ml-1" />
            )}
          </motion.button>
        </div>

        {/* Audio Waveform visualization */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 h-10 px-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                animate={
                  isPlaying
                    ? {
                        height: ['15%', `${Math.random() * 85 + 15}%`, '15%'],
                      }
                    : { height: '20%' }
                }
                transition={{
                  duration: 0.4 + (i % 4) * 0.1,
                  repeat: isPlaying ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                className={`w-1 rounded-full transition-all ${
                  isPlaying ? 'bg-[#FF4D79]' : 'bg-[#FED7E2]'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between text-xs text-[#834758] px-2 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Continue CTA */}
        <div className="pt-2">
          <Button onClick={onNext} size="lg" fullWidth>
            <Sparkles className="w-4 h-4 mr-2" /> Open My Letter →
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
