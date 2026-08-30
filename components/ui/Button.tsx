'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm sm:text-base px-5 py-2.5 gap-2',
    lg: 'text-base sm:text-lg px-7 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-[#FF4D79] hover:bg-[#E11D48] text-white shadow-md shadow-pink-500/20 focus-visible:ring-[#FF4D79]',
    secondary: 'bg-[#4A1525] hover:bg-[#360D19] text-white shadow-md shadow-berry-950/20 focus-visible:ring-[#4A1525]',
    outline: 'border border-[#FED7E2] bg-white/80 hover:bg-[#FFF0F3] text-[#4A1525] hover:border-[#FF4D79] focus-visible:ring-[#FF4D79]',
    ghost: 'text-[#4A1525] hover:bg-[#FFE4EA]/60 focus-visible:ring-[#FF4D79]',
    soft: 'bg-[#FFF0F3] hover:bg-[#FFE4EA] text-[#B81846] border border-[#FED7E2]/50 focus-visible:ring-[#FF4D79]',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Just a moment...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
