'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'white' | 'subtle' | 'dashed' | 'paper';
  interactive?: boolean;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  interactive = false,
  selected = false,
  className,
  ...props
}) => {
  const variantStyles = {
    white: 'bg-white border border-[#FED7E2]/60 shadow-[0_4px_20px_-4px_rgba(74,21,37,0.06)]',
    subtle: 'bg-[#FFF0F3] border border-[#FED7E2]',
    dashed: 'bg-white/90 border-2 border-dashed border-[#FECDD3]',
    paper: 'paper-texture border border-[#E8DCCF] shadow-sm',
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -2, scale: 1.01 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'rounded-2xl p-5 sm:p-6 transition-all duration-200',
        variantStyles[variant],
        interactive && 'cursor-pointer select-none',
        selected && 'border-[#FF4D79] bg-[#FFF0F3]/70 ring-2 ring-[#FF4D79]/20 shadow-md shadow-pink-500/10',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
