import { useId } from 'react';

export default function Logo({ variant = 'full', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const gradientId = `logoGradient-${uid}`;
  const shineId = `logoShine-${uid}`;
  const showIcon = variant === 'full' || variant === 'icon';
  const showWordmark = variant === 'full' || variant === 'wordmark';

  return (
    <span className={`logo ${className}`} aria-hidden={variant === 'icon'}>
      {showIcon && (
        <svg
          className="logo-mark"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0b1220" />
              <stop stopColor="#1e3a8a" offset="0.55" />
              <stop stopColor="#2563eb" offset="1" />
            </linearGradient>
            <linearGradient id={shineId} x1="12" y1="8" x2="28" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.28" />
              <stop stopColor="#ffffff" stopOpacity="0" offset="1" />
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="13" fill={`url(#${gradientId})`} />
          <rect x="1" y="1" width="46" height="46" rx="12" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <path
            d="M10 18.5L24 11.5L38 18.5L24 25.5L10 18.5Z"
            fill={`url(#${shineId})`}
          />
          <path
            d="M10 19.2L24 12.2L38 19.2L24 26.2L10 19.2Z"
            fill="#ffffff"
          />
          <path d="M22 26.2H26V30.2H22V26.2Z" fill="#ffffff" />
          <path
            d="M14 34.5V38.5H17.5V34.5H14Z"
            fill="#ffffff"
            fillOpacity="0.55"
          />
          <path
            d="M21 31.5V38.5H24.5V31.5H21Z"
            fill="#ffffff"
            fillOpacity="0.78"
          />
          <path
            d="M28 28.5V38.5H31.5V28.5H28Z"
            fill="#ffffff"
          />
          <circle cx="36" cy="14" r="2.25" fill="#93c5fd" />
        </svg>
      )}
      {showWordmark && (
        <span className="logo-wordmark">
          <span className="logo-wordmark-cgpa">CGPA</span>
          <span className="logo-wordmark-pro">Pro</span>
        </span>
      )}
    </span>
  );
}
