import React, { useState } from 'react';
import officialLogoImg from '../assets/images/regenerated_image_1789663734796.png';

interface AzmLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  variant?: 'full' | 'icon' | 'badge';
  modeOverride?: 'light' | 'dark';
}

const FALLBACK_LOGO_SRCS = [
  '/azm-logo.png',
  '/azm real logo.jpeg',
  '/azm%20real%20logo.jpeg',
];

export const AzmLogo: React.FC<AzmLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const [fallbackIndex, setFallbackIndex] = useState(-1);

  let dimension = 44;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs':
        dimension = 24;
        break;
      case 'sm':
        dimension = 34;
        break;
      case 'md':
        dimension = 48;
        break;
      case 'lg':
        dimension = 68;
        break;
      case 'xl':
        dimension = 96;
        break;
    }
  }

  const currentSrc =
    fallbackIndex === -1
      ? officialLogoImg
      : FALLBACK_LOGO_SRCS[Math.min(fallbackIndex, FALLBACK_LOGO_SRCS.length - 1)];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Eagle Mascot Logo: Preserves exact proportions with zero crop or distort */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center overflow-visible"
        style={{
          width: dimension,
          height: dimension,
        }}
      >
        <img
          src={currentSrc}
          alt="شعار عزم"
          className="w-full h-full object-contain pointer-events-none select-none"
          loading="eager"
          decoding="async"
          onError={() => {
            if (fallbackIndex < FALLBACK_LOGO_SRCS.length - 1) {
              setFallbackIndex((prev) => prev + 1);
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight text-right select-none justify-center">
          <span
            className="text-base sm:text-lg font-bold tracking-tight text-[#F5F5F5]"
            style={{ fontFamily: "'Readex Pro', sans-serif" }}
          >
            عزم
          </span>
        </div>
      )}
    </div>
  );
};
