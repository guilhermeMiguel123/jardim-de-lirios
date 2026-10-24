import React, { useMemo } from 'react';

export const WhiteLilySVG = ({ className = "w-24 h-24" }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <radialGradient id="lilyGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDF2F8" stopOpacity="0.9" />
        <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.98" />
        <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.9" />
      </radialGradient>
      <linearGradient id="petalShade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="65%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B8E78" />
        <stop offset="100%" stopColor="#3F5E4D" />
      </linearGradient>
      <filter id="softDrop" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#1E293B" floodOpacity="0.08" />
      </filter>
    </defs>

    {/* Folhas de fundo em Verde Sálvia */}
    <path d="M100 135 C 55 140, 25 110, 18 75 C 45 85, 75 105, 100 135 Z" fill="url(#leafGrad)" opacity="0.85" />
    <path d="M100 135 C 145 140, 175 110, 182 75 C 155 85, 125 105, 100 135 Z" fill="url(#leafGrad)" opacity="0.85" />
    <path d="M100 145 C 70 165, 45 160, 28 142 C 55 140, 80 140, 100 145 Z" fill="#52735E" opacity="0.7" />
    <path d="M100 145 C 130 165, 155 160, 172 142 C 145 140, 120 140, 100 145 Z" fill="#52735E" opacity="0.7" />

    {/* Caule */}
    <path d="M100 130 Q 100 165 94 190" stroke="#4A6B57" strokeWidth="4.5" strokeLinecap="round" />

    {/* Pétalas Traseiras do Lírio Branco */}
    <g filter="url(#softDrop)">
      <path d="M100 120 C 65 95, 42 52, 62 24 C 82 42, 95 75, 100 120 Z" fill="url(#petalShade)" stroke="#E2E8F0" strokeWidth="1" />
      <path d="M100 120 C 135 95, 158 52, 138 24 C 118 42, 105 75, 100 120 Z" fill="url(#petalShade)" stroke="#E2E8F0" strokeWidth="1" />
      <path d="M100 122 C 74 75, 76 30, 100 10 C 124 30, 126 75, 100 122 Z" fill="url(#lilyGlow)" stroke="#F1F5F9" strokeWidth="1.2" />
    </g>

    {/* Pétalas Frontais Abertas */}
    <g filter="url(#softDrop)">
      <path d="M100 122 C 55 122, 22 96, 26 62 C 54 66, 82 90, 100 122 Z" fill="url(#lilyGlow)" stroke="#F1F5F9" strokeWidth="1.2" />
      <path d="M100 122 C 145 122, 178 96, 174 62 C 146 66, 118 90, 100 122 Z" fill="url(#lilyGlow)" stroke="#F1F5F9" strokeWidth="1.2" />
      <path d="M100 120 C 70 148, 72 176, 100 184 C 128 176, 130 148, 100 120 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.2" />
    </g>

    {/* Veios suaves nas pétalas */}
    <path d="M100 118 L 100 32" stroke="#F4DFE6" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M100 118 Q 68 95 42 72" stroke="#F4DFE6" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    <path d="M100 118 Q 132 95 158 72" stroke="#F4DFE6" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    <path d="M100 122 L 100 168" stroke="#F4DFE6" strokeWidth="1.3" strokeLinecap="round" />

    {/* Estames Dourados no Centro do Lírio */}
    <path d="M100 118 Q 86 86 76 72" stroke="#D4AF37" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d="M100 118 Q 95 80 92 63" stroke="#D4AF37" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d="M100 118 Q 105 80 108 63" stroke="#D4AF37" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d="M100 118 Q 114 86 124 72" stroke="#D4AF37" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d="M100 118 L 100 58" stroke="#B48A28" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* Pólen Dourado */}
    <ellipse cx="75" cy="71" rx="3.5" ry="2" transform="rotate(-30 75 71)" fill="#D97706" />
    <ellipse cx="91" cy="61" rx="3.5" ry="2" transform="rotate(-15 91 61)" fill="#D97706" />
    <ellipse cx="109" cy="61" rx="3.5" ry="2" transform="rotate(15 109 61)" fill="#D97706" />
    <ellipse cx="125" cy="71" rx="3.5" ry="2" transform="rotate(30 125 71)" fill="#D97706" />
    <circle cx="100" cy="56" r="3" fill="#B45309" />
    <circle cx="100" cy="120" r="4.5" fill="#EDE9FE" />
  </svg>
);

export const CornerGarlandSVG = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 142 C 12 80, 55 30, 142 10" stroke="#7A9A86" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
    <path d="M25 110 C 12 95, 15 78, 30 70 C 35 86, 32 100, 25 110 Z" fill="#7A9A86" opacity="0.4" />
    <path d="M55 72 C 42 58, 48 40, 65 35 C 68 52, 62 65, 55 72 Z" fill="#5E7E6B" opacity="0.45" />
    <path d="M95 40 C 88 25, 98 14, 115 14 C 112 28, 104 36, 95 40 Z" fill="#7A9A86" opacity="0.4" />
    <path d="M44 82 C 62 85, 76 76, 82 60 C 66 60, 52 70, 44 82 Z" fill="#7A9A86" opacity="0.35" />
    <g transform="translate(38, 42)">
      <path d="M15 25 C 2 18, 0 5, 12 0 C 20 8, 20 18, 15 25 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
      <path d="M15 25 C 28 18, 30 5, 18 0 C 10 8, 10 18, 15 25 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
      <circle cx="15" cy="12" r="2" fill="#D4AF37" />
    </g>
    <circle cx="82" cy="32" r="3" fill="#FFF1F2" stroke="#FBCFE8" strokeWidth="0.8" />
    <circle cx="24" cy="96" r="2.5" fill="#FFF1F2" stroke="#FBCFE8" strokeWidth="0.8" />
  </svg>
);

export const FloatingPetals = () => {
  const petals = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.3) % 96}%`,
      delay: `${(i * 1.7) % 12}s`,
      duration: `${15 + (i % 9) * 2}s`,
      size: 12 + (i % 4) * 5,
      opacity: 0.35 + (i % 3) * 0.15,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: `${p.size}px`,
            height: `${p.size * 1.4}px`,
            opacity: p.opacity,
          }}
          className="absolute -top-10 animate-[floatPetal_18s_linear_infinite]"
        >
          <svg viewBox="0 0 24 34" fill="none" className="w-full h-full drop-shadow-xs">
            <path d="M12 0 C 22 10, 24 24, 12 34 C 0 24, 2 10, 12 0 Z" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1" />
            <path d="M12 5 L 12 28" stroke="#FCE7F3" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      ))}
    </div>
  );
};
