function svgProps(size) {
  return {
    width: size,
    height: size,
    style: { width: size, height: size, display: 'inline-block', verticalAlign: 'middle' },
    viewBox: '0 0 24 20',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  };
}

export function CigaretteIcon({ size = 22, className }) {
  return (
    <svg className={className} {...svgProps(size)}>
      <rect x="1.5" y="7" width="17" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="18.5" y="7" width="4" height="4" rx="0.5" fill="currentColor" />
      <circle cx="20.5" cy="10" r="1.1" fill="#ff7b1c" />
      <path d="M19.5 5.2 C20 4.6 20.7 4.6 21.2 5.2" stroke="currentColor" strokeWidth="1.3" opacity="0.75" />
    </svg>
  );
}

export function BestDayIcon({ size = 14, className }) {
  return (
    <svg className={className} {...svgProps(size)}>
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <path d="M12 3 L12 22 M2 12 L22 12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function WorstDayIcon({ size = 14, className, color }) {
  return (
    <svg className={className} {...svgProps(size)} style={{ ...svgProps(size).style, color: color }}>
      <polygon points="12 2 22 20 2 20" fill="currentColor" />
      <path d="M12 6 L12 11 L12 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.1" fill="currentColor" />
    </svg>
  );
}
