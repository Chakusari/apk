export default function PixelCigarette({ size = 56 }) {
  return (
    <svg
      className="pixel-cigarette"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    >
      {/* Lit/ember end on the LEFT (matches the 🚬 glyph), filter on the right */}
      {/* Ember */}
      <rect x="1" y="7" width="2" height="3" fill="#ff7b1c" />
      <rect x="0" y="7" width="1" height="3" fill="#ffb000" />
      <rect x="0" y="6" width="2" height="1" fill="#ff9a3d" />
      <rect x="0" y="5" width="1" height="1" fill="#ffd24d" />
      {/* Smoke puffs rise from the lit end on the left */}
      <rect x="0" y="3" width="3" height="1" fill="#7a8a7e" opacity="0.85" />
      <rect x="0" y="2" width="3" height="1" fill="#7a8a7e" opacity="0.65" />
      <rect x="0" y="1" width="3" height="1" fill="#7a8a7e" opacity="0.5" />
      {/* Paper body */}
      <rect x="3" y="6" width="10" height="4" fill="#f2f5f3" />
      <rect x="3" y="8" width="10" height="1" fill="#c2c9c5" />
      {/* Filter tip on the right */}
      <rect x="13" y="6" width="3" height="4" fill="#cfd8d3" />
      <rect x="13" y="6" width="1" height="4" fill="#9aa5a0" />
    </svg>
  );
}