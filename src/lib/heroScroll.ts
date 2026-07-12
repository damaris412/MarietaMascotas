// Debe coincidir con la altura h-[800vh] del contenedor en src/components/home/Hero.tsx
export const HERO_SCROLL_VH = 800;

export function getHeroPinnedProgress(scrollY: number, viewportHeight: number) {
  const pinDistance = (HERO_SCROLL_VH / 100 - 1) * viewportHeight;
  if (pinDistance <= 0) return 1;
  return Math.min(1, Math.max(0, scrollY / pinDistance));
}
