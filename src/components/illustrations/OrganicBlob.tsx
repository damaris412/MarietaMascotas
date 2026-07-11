export function OrganicBlob({ className, color = "var(--color-sage-300)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        d="M147.6 27.4c22.6 17.3 38.9 44.7 39.9 72.6 1 27.9-13.3 56.3-36.1 72.9-22.8 16.6-54.1 21.4-79.8 10.6-25.7-10.8-45.8-36.2-52.3-64.4-6.5-28.2-.5-59.2 18.1-79.6C56 19 84.6 8.3 111.6 12.9c14 2.3 24 6.8 36 14.5Z"
      />
    </svg>
  );
}
