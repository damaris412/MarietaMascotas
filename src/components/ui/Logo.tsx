type LogoProps = {
  className?: string;
  withAntennae?: boolean;
  ringColor?: string;
  lineColor?: string;
};

/**
 * Marca de "Marieta Mascotas": el caparazón de una mariquita (marieta, en
 * catalán) reducido a sus dos formas redondas concéntricas, sin antenas ni
 * puntitos, para un acabado minimal y premium en el resto de la interfaz.
 */
export function Logo({
  className,
  withAntennae = false,
  ringColor = "var(--color-sage-500)",
  lineColor = "var(--color-english-700)",
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 200 210"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Marieta Mascotas"
    >
      {withAntennae && (
        <g stroke={lineColor} strokeWidth="4" strokeLinecap="round">
          <path d="M92 40c-6-14-18-22-30-20" />
          <path d="M108 40c6-14 18-22 30-20" />
          <circle cx="61" cy="19" r="4" fill={lineColor} stroke="none" />
          <circle cx="139" cy="19" r="4" fill={lineColor} stroke="none" />
        </g>
      )}
      <circle cx="100" cy="115" r="82" stroke={ringColor} strokeWidth="20" />
      <circle cx="100" cy="115" r="54" stroke={ringColor} strokeWidth="16" opacity="0.6" />
      <line x1="100" y1="66" x2="100" y2="164" stroke={lineColor} strokeWidth="3" />
    </svg>
  );
}
