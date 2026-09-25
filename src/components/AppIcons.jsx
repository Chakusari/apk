// Themed SVG icons. They use `currentColor` so they automatically
// inherit the active theme's text/accent color and follow the palette.

function Svg({ size = 16, className, style, children, viewBox = '0 0 24 24' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function CigaretteIcon({ size = 16, className, style }) {
  return (
    <Svg size={size} className={className} style={style}>
      <rect x="2" y="8" width="16" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="18" y="8" width="3" height="5" fill="currentColor" />
      <rect x="2" y="9" width="3" height="3" fill="#ff7b1c" />
      <path d="M4 6 C5 5 6 5 7 6" stroke="currentColor" strokeWidth="1.3" />
    </Svg>
  );
}

export function CalendarIcon({ size = 16, className, style }) {
  return (
    <Svg size={size} className={className} style={style}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9 H17 M7 13 H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="7" y="1" width="2" height="5" rx="0.5" fill="currentColor" opacity="0.4" />
      <rect x="15" y="1" width="2" height="5" rx="0.5" fill="currentColor" opacity="0.4" />
    </Svg>
  );
}

export function BestDayIcon({ size = 16, className, style }) {
  return (
    <Svg size={size} className={className} style={style}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2 L12 4 M12 20 L12 22 M2 12 L4 12 M20 12 L22 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </Svg>
  );
}

export function WorstDayIcon({ size = 16, className, style }) {
  return (
    <Svg size={size} className={className} style={style}>
      <polygon points="12 2 22 22 2 22" fill="currentColor" />
      <path d="M12 7 L12 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.5" fill="white" />
    </Svg>
  );
}

export function BellIcon({ size = 16, className, style }) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M9 21 C9 22.65 10.35 24 12 24 C13.65 24 15 22.65 15 21" fill="currentColor" opacity="0.5" />
      <path d="M5 19 L5 11 C5 7.7 7.7 4 12 4 C16.3 4 19 7.7 19 11 L19 19" stroke="currentColor" strokeWidth="1.5" />
    </Svg>
  );
}

export function BellOffIcon({ size = 16, className, style }) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 19 C9 19.3 9.3 19.6 9.7 19.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 15 L14 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

export function TrashIcon({ size = 16, className, style }) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M5 6 L5 18 C5 19.1 5.9 20 7 20 H17 C18.1 20 19 19.1 19 18 L19 6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9 L9 15 M15 9 L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 6 L22 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 2 L15 2 C15.55 2 16 2.45 16 3 L8 3 C8 2.45 8.5 2 9 2 Z" fill="currentColor" opacity="0.4" />
      <line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </Svg>
  );
}

export function DollarIcon({ size = 16, className, style }) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M12 6 L12 10 M12 14 L12 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="12" cy="12" rx="4" ry="2.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12 C8 9.8 9.8 8 12 8 C14.2 8 16 9.8 16 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}
