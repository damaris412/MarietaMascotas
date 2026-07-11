export function DogWithCoat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 420" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="190" cy="392" rx="120" ry="16" fill="var(--color-english-800)" opacity="0.12" />

      <path
        d="M120 190c-28 8-46 34-46 66 0 52 42 96 116 96s116-44 116-96c0-32-18-58-46-66"
        fill="var(--color-sage-200)"
      />

      <path
        d="M118 200c0-46 32-78 72-78s72 32 72 78-32 96-72 96-72-50-72-96Z"
        fill="var(--color-beige-200)"
      />

      <circle cx="190" cy="128" r="66" fill="var(--color-sage-300)" />
      <ellipse cx="150" cy="96" rx="18" ry="28" fill="var(--color-sage-300)" transform="rotate(-25 150 96)" />
      <ellipse cx="230" cy="96" rx="18" ry="28" fill="var(--color-sage-300)" transform="rotate(25 230 96)" />
      <ellipse cx="152" cy="100" rx="9" ry="15" fill="var(--color-english-800)" opacity="0.35" transform="rotate(-25 152 100)" />
      <ellipse cx="228" cy="100" rx="9" ry="15" fill="var(--color-english-800)" opacity="0.35" transform="rotate(25 228 100)" />

      <circle cx="166" cy="126" r="6.5" fill="var(--color-english-800)" />
      <circle cx="214" cy="126" r="6.5" fill="var(--color-english-800)" />
      <ellipse cx="190" cy="150" rx="10" ry="7" fill="var(--color-english-800)" />
      <path
        d="M190 157v10M178 176c4 6 8 8 12 8s8-2 12-8"
        stroke="var(--color-english-800)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M108 214c18-14 44-22 82-22s64 8 82 22c8 22-6 40-30 40H138c-24 0-38-18-30-40Z"
        fill="var(--color-english-700)"
      />
      <path
        d="M108 214c18-14 44-22 82-22s64 8 82 22"
        stroke="var(--color-beige-100)"
        strokeWidth="3"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      <circle cx="190" cy="246" r="7" fill="var(--color-beige-200)" />
    </svg>
  );
}
