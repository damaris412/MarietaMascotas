type Measurement = "neck" | "chest" | "back";

export function MeasurementGuideDog({
  measurement,
  className,
}: {
  measurement: Measurement;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 420 260" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="220" cy="240" rx="150" ry="12" fill="var(--color-english-800)" opacity="0.1" />

      {/* tail */}
      <path
        d="M110 150c-22-6-38-26-32-46 4-14 18-18 26-6 8 12 6 34 6 52Z"
        fill="var(--color-beige-200)"
      />

      {/* body */}
      <rect x="108" y="96" width="200" height="92" rx="46" fill="var(--color-sage-200)" />

      {/* legs */}
      <rect x="140" y="164" width="22" height="60" rx="10" fill="var(--color-sage-300)" />
      <rect x="200" y="170" width="22" height="54" rx="10" fill="var(--color-sage-300)" />
      <rect x="256" y="170" width="22" height="54" rx="10" fill="var(--color-sage-300)" />
      <rect x="286" y="164" width="22" height="60" rx="10" fill="var(--color-sage-300)" />

      {/* neck */}
      <path d="M290 98c8-24 24-42 46-46 8 26 4 52-10 72Z" fill="var(--color-sage-200)" />

      {/* head */}
      <circle cx="346" cy="86" r="42" fill="var(--color-sage-300)" />
      <ellipse cx="382" cy="94" rx="16" ry="12" fill="var(--color-beige-200)" />
      <ellipse
        cx="322"
        cy="52"
        rx="14"
        ry="22"
        fill="var(--color-sage-300)"
        transform="rotate(-20 322 52)"
      />
      <circle cx="358" cy="78" r="4.5" fill="var(--color-english-800)" />
      <circle cx="386" cy="92" r="3" fill="var(--color-english-800)" />

      {measurement === "neck" && (
        <g>
          <path
            d="M296 86c10-18 22-30 36-36"
            stroke="var(--color-english-700)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M296 86c10-18 22-30 36-36"
            stroke="var(--color-linen)"
            strokeWidth="2"
            strokeDasharray="3 6"
            strokeLinecap="round"
          />
        </g>
      )}

      {measurement === "chest" && (
        <g>
          <path
            d="M282 92c-4 32-4 62 0 92"
            stroke="var(--color-english-700)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M282 92c-4 32-4 62 0 92"
            stroke="var(--color-linen)"
            strokeWidth="2"
            strokeDasharray="3 6"
            strokeLinecap="round"
          />
        </g>
      )}

      {measurement === "back" && (
        <g stroke="var(--color-english-700)" strokeLinecap="round">
          <path d="M312 64 L124 108" strokeWidth="3" strokeDasharray="6 6" opacity="0.8" />
          <path d="M312 64l-14 2 4 14" strokeWidth="3" fill="none" />
          <path d="M124 108l14-4-2-14" strokeWidth="3" fill="none" />
        </g>
      )}
    </svg>
  );
}
