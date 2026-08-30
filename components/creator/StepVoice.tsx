'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GiftDraft } from '@/types/gift';
import { Button } from '@/components/ui/Button';
import { Heart, Mic, Square, Play, Pause, Trash2, RotateCcw, AlertCircle, Upload } from 'lucide-react';

interface StepVoiceProps {
  draft: GiftDraft;
  updateDraft: (fields: Partial<GiftDraft>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

export const StepVoice: React.FC<StepVoiceProps> = ({
  draft,
  updateDraft,
  onNext,
  onBack,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const maxDuration = 45; // 45 seconds

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];

    try {
      if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
        setMicError(
          'Live microphone recording requires a secure connection (HTTPS) or a supported mobile browser. You can record using your phone\'s Voice Memos app and upload the audio file below!'
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine best supported MIME type for current browser (especially iOS Safari vs Chrome Android)
      let options: MediaRecorderOptions | undefined = undefined;
      let selectedMime = '';

      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
        const candidateTypes = [
          'audio/mp4',
          'audio/aac',
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/wav',
          'audio/ogg',
        ];
        for (const type of candidateTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            selectedMime = type;
            options = { mimeType: type };
            break;
          }
        }
      }

      const mediaRecorder = options ? new MediaRecorder(stream, options) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || selectedMime || 'audio/mp4';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          updateDraft({
            voiceMessageUrl: base64Audio,
            voiceDuration: recordingTime,
          });
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks to release mic hardware
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev + 1 >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone permission error:', err);
      setMicError(
        'Microphone access was denied or not supported in this connection context. You can upload an audio file directly using the button below!'
      );
      setIsRecording(false);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setMicError('Audio file size exceeds 15MB limit.');
      return;
    }

    setMicError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result as string;

      // Estimate audio duration
      const tempAudio = new Audio(base64Audio);
      tempAudio.onloadedmetadata = () => {
        const dur = Math.round(tempAudio.duration) || 15;
        updateDraft({
          voiceMessageUrl: base64Audio,
          voiceDuration: dur,
        });
      };
      tempAudio.onerror = () => {
        updateDraft({
          voiceMessageUrl: base64Audio,
          voiceDuration: 15,
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (!draft.voiceMessageUrl) return;

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(draft.voiceMessageUrl);
      audioElementRef.current.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      };
      audioElementRef.current.ontimeupdate = () => {
        if (audioElementRef.current) {
          setPlaybackTime(Math.floor(audioElementRef.current.currentTime));
        }
      };
    }

    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackTime(0);
    setRecordingTime(0);
    updateDraft({ voiceMessageUrl: undefined, voiceDuration: undefined });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          <Heart className="w-3 h-3 fill-current text-[#FF4D79]" /> Personal Voice
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-romantic text-[#4A1525] tracking-tight">
          Say it out loud.
        </h1>
        <p className="text-sm text-[#834758] max-w-md mx-auto">
          Hearing your voice makes this moment unforgettable. Record up to 45 seconds or upload an audio note.
        </p>
      </div>

      {/* Voice Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FED7E2]/80 shadow-sm text-center space-y-6">
        {/* Error message */}
        {micError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 space-y-1">
              <p className="font-semibold">Microphone & Audio Guidance</p>
              <p>{micError}</p>
            </div>
          </div>
        )}

        {!draft.voiceMessageUrl && !isRecording && (
          <div className="space-y-6 py-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-linear-to-tr from-[#FF4D79] to-[#E11D48] text-white flex flex-col items-center justify-center shadow-lg shadow-pink-500/25 cursor-pointer"
            >
              <Mic className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
              <span className="text-[11px] font-semibold tracking-wider uppercase">Record</span>
            </motion.button>

            <p className="text-xs text-[#834758]">
              Tap above to record live (Max 45s)
            </p>

            {/* Audio File Upload Fallback option for mobile phones */}
            <div className="pt-2 border-t border-[#FED7E2]/60">
              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFileUpload}
                  className="hidden"
                />
                <div className="p-3.5 rounded-2xl border border-dashed border-[#FF4D79]/40 bg-[#FFF0F3]/60 hover:bg-[#FFF0F3] text-[#4A1525] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-[#FF4D79]" />
                  <span>Upload Audio File / Voice Memo</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* State: Recording Active */}
        {isRecording && (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span>RECORDING • {formatTime(recordingTime)} / {formatTime(maxDuration)}</span>
            </div>

            {/* Live animated waveform bars */}
            <div className="flex items-center justify-center gap-1.5 h-16">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: ['20%', `${Math.random() * 80 + 20}%`, '20%'],
                  }}
                  transition={{
                    duration: 0.5 + (i % 5) * 0.1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-1.5 bg-[#FF4D79] rounded-full"
                />
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={stopRecording}
              className="gap-2"
            >
              <Square className="w-4 h-4 fill-current text-white" /> Stop Recording
            </Button>
          </div>
        )}

        {/* State: Recorded / Playback Preview */}
        {draft.voiceMessageUrl && !isRecording && (
          <div className="space-y-6 py-2">
            <div className="p-4 rounded-2xl bg-[#FFF0F3] border border-[#FED7E2] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={togglePlayback}
                className="w-12 h-12 rounded-full bg-[#FF4D79] text-white flex items-center justify-center shadow-md shadow-pink-500/20 hover:bg-[#E11D48] transition-colors cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <div className="flex-1 text-left">
                <p className="font-semibold text-xs sm:text-sm text-[#4A1525]">Your Voice Note</p>
                <p className="text-xs text-[#834758]">
                  {isPlaying ? formatTime(playbackTime) : formatTime(draft.voiceDuration || 0)} duration
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={startRecording}
                  title="Re-record"
                  className="p-2 rounded-xl text-[#834758] hover:text-[#4A1525] hover:bg-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={deleteRecording}
                  title="Delete voice note"
                  className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-emerald-600 font-medium">✓ Voice note recorded and ready!</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          ← Back
        </Button>
        <Button onClick={onNext} size="lg" className="flex-1">
          Continue to Step 6 →
        </Button>
      </div>
    </motion.div>
  );
};
