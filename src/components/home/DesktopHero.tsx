"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { HeroCTAs } from "@/components/home/HeroCTAs";
import { cn } from "@/lib/utils";

const VIDEO_SRC = "/video/hero-marieta-mascotas.mp4";
const PAD = 0.02;

const CHAPTERS: { range: [number, number]; eyebrow?: string; title: string }[] = [
  { range: [0, 0.15], eyebrow: "Bienvenidos a", title: "Marieta Mascotas" },
  { range: [0.2, 0.4], title: "La mejor tienda para tu mejor amigo" },
  { range: [0.45, 0.65], title: "Diseño y amor en cada prenda" },
];

const CTA_START = 0.78;
const CTA_VISIBLE = 0.88;

function ChapterText({
  scrollYProgress,
  range,
  eyebrow,
  title,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  eyebrow?: string;
  title: string;
}) {
  const [start, end] = range;
  const [active, setActive] = useState(start <= 0);

  // Además del fade con opacity, el capítulo se saca directamente del DOM fuera
  // de su rango: así, esté o no perfectamente clampeada la opacidad, es
  // imposible que quede una imagen fantasma superpuesta al resto del hero.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(progress > start - PAD && progress < end + PAD);
  });

  const opacity = useTransform(scrollYProgress, (progress) => {
    if (progress < start) return Math.max(0, Math.min(1, (progress - (start - PAD)) / PAD));
    if (progress > end) return Math.max(0, Math.min(1, 1 - (progress - end) / PAD));
    return 1;
  });
  const y = useTransform(scrollYProgress, (progress) => {
    const clamped = Math.max(start, Math.min(end, progress));
    return 24 - 48 * ((clamped - start) / Math.max(end - start, 0.0001));
  });

  if (!active) return null;

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      {eyebrow && (
        <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-linen backdrop-blur-sm">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance font-display text-3xl italic text-linen drop-shadow-md sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </motion.div>
  );
}

export function DesktopHero({ featuredImage }: { featuredImage: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const targetProgressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    targetProgressRef.current = progress;
    setCtaVisible(progress >= CTA_START + 0.02);
    setHintVisible(progress < 0.05);
  });

  // Interpola el currentTime del video hacia el progreso de scroll en cada frame,
  // en vez de "saltar" directo: si se scrollea rápido, hace un fast-forward suave
  // por los cuadros intermedios en lugar de cortar directo a la escena final.
  // Lee video.duration directo en cada frame (no vía estado de React) para no
  // depender de que loadedmetadata/durationchange disparen a tiempo: el loop
  // arranca apenas se monta y no hace nada hasta que el video esté listo.
  useEffect(() => {
    let frameId: number;
    function tick() {
      const video = videoRef.current;
      const duration = video?.duration;
      if (video && Number.isFinite(duration) && duration! > 0) {
        const target = Math.min(targetProgressRef.current * duration!, duration! - 0.05);
        const diff = target - video.currentTime;
        if (Math.abs(diff) > 0.01) {
          video.currentTime = video.currentTime + diff * 0.15;
        }
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const scrollHintOpacity = useTransform(scrollYProgress, (progress) =>
    Math.max(0, Math.min(1, 1 - progress / 0.05))
  );
  const ctaOpacity = useTransform(scrollYProgress, (progress) =>
    Math.max(0, Math.min(1, (progress - CTA_START) / (CTA_VISIBLE - CTA_START)))
  );

  return (
    <section ref={containerRef} className="relative h-[800vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-english-900">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />

        {CHAPTERS.map((chapter, i) => (
          <ChapterText key={i} scrollYProgress={scrollYProgress} {...chapter} />
        ))}

        <motion.div
          style={{ opacity: ctaOpacity }}
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            ctaVisible ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <HeroCTAs featuredImage={featuredImage} />
        </motion.div>

        {hintVisible && (
          <motion.div
            style={{ opacity: scrollHintOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-widest text-linen/70"
          >
            Desliza para descubrir
          </motion.div>
        )}
      </div>
    </section>
  );
}
