
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className,
  hoverEffect = false,
  intensity = 'medium',
  ...props
}) => {
  const getIntensityClasses = () => {
    switch (intensity) {
      case 'light':
        return 'bg-white/40 dark:bg-black/40 backdrop-blur-sm border-white/10 dark:border-white/5';
      case 'heavy':
        return 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-white/30 dark:border-white/10';
      case 'medium':
      default:
        return 'bg-white/60 dark:bg-black/60 backdrop-blur-lg border-white/20 dark:border-white/5';
    }
  };

  return (
    <div
      className={cn(
        'rounded-2xl border shadow-sm',
        getIntensityClasses(),
        hoverEffect && 'transition-all duration-300 hover:shadow-md hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;
