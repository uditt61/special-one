'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Sparkles } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onBack?: () => void;
  canGoBack?: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  onBack,
  canGoBack = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-6 px-4">
      {/* Top row: Back button, Step counter, Badge */}
      <div className="flex items-center justify-between mb-3">
        {canGoBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#834758] hover:text-[#4A1525] transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/70 rounded-full text-xs font-semibold text-[#B81846] border border-[#FED7E2]/60 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#FF4D79]" />
            <span>Special Surprise</span>
          </div>
        )}

        <div className="text-xs font-semibold text-[#834758] tracking-wide">
          STEP <span className="text-[#FF4D79] font-bold">{currentStep}</span> OF {totalSteps}
        </div>
      </div>

      {/* Segmented Progress Bars */}
      <div className="grid grid-cols-7 gap-1.5 h-2 w-full">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div
              key={index}
              className="relative h-full bg-[#FED7E2]/50 rounded-full overflow-hidden"
              title={stepTitles[index] || `Step ${stepNum}`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: isCompleted ? '100%' : isActive ? '100%' : '0%',
                  opacity: isActive || isCompleted ? 1 : 0.4,
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className={`h-full rounded-full ${
                  isCompleted
                    ? 'bg-[#FF4D79]'
                    : isActive
                    ? 'bg-linear-to-r from-[#FF4D79] to-[#E11D48]'
                    : 'bg-transparent'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Current Step Title */}
      <div className="mt-2 text-center text-xs text-[#834758]">
        {stepTitles[currentStep - 1]}
      </div>
    </div>
  );
};
