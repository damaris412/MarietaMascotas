export function OrthopedicBed({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 260" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="210" cy="235" rx="170" ry="18" fill="var(--color-english-800)" opacity="0.14" />

      <rect x="30" y="70" width="360" height="110" rx="55" fill="var(--color-beige-300)" />
      <rect x="30" y="70" width="360" height="110" rx="55" fill="var(--color-sage-400)" opacity="0.18" />

      <rect x="52" y="90" width="316" height="78" rx="39" fill="var(--color-beige-100)" />

      <g stroke="var(--color-beige-300)" strokeWidth="2" opacity="0.7">
        <path d="M110 96v66" />
        <path d="M170 90v78" />
        <path d="M230 90v78" />
        <path d="M290 96v66" />
      </g>

      <ellipse cx="210" cy="129" rx="80" ry="26" fill="var(--color-sage-200)" opacity="0.6" />
      <path
        d="M180 129c4-10 12-16 22-16s18 6 22 16c4 10-8 20-22 20s-26-10-22-20Z"
        fill="var(--color-sage-500)"
        opacity="0.5"
      />
    </svg>
  );
}
