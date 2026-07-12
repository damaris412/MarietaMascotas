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
  const hasLeadIn = start - PAD > 0;
  const times = hasLeadIn ? [start - PAD, start, end, end + PAD] : [start, start, end, end + PAD];
  const values = hasLeadIn ? [0, 1, 1, 0] : [1, 1, 1, 0];
  const opacity = useTransform(scrollYProgress, times, values);
  const y = useTransform(scrollYProgress, [start, end], [24, -24]);

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

export function Hero({ featuredImage }: { featuredImage: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [ctaVisible, setCtaVisible] = useState(false);
  const targetProgressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  function captureDuration(e: React.SyntheticEvent<HTMLVideoElement>) {
    const value = e.currentTarget.duration;
    if (Number.isFinite(value) && value > 0) setDuration(value);
  }

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    targetProgressRef.current = progress;
    setCtaVisible(progress >= CTA_START + 0.02);
  });

  // Interpola el currentTime del video hacia el progreso de scroll en cada frame,
  // en vez de "saltar" directo: si se scrollea rápido, hace un fast-forward suave
  // por los cuadros intermedios en lugar de cortar directo a la escena final.
  useEffect(() => {
    if (!duration) return;
    let frameId: number;
    function tick() {
      const video = videoRef.current;
      if (video) {
        const target = Math.min(targetProgressRef.current * duration, duration - 0.05);
        const diff = target - video.currentTime;
        if (Math.abs(diff) > 0.01) {
          video.currentTime = video.currentTime + diff * 0.15;
        }
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [duration]);

  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [CTA_START, CTA_VISIBLE], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[700vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-english-900">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={captureDuration}
          onDurationChange={captureDuration}
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

        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-widest text-linen/70"
        >
          Desliza para descubrir
        </motion.div>
      </div>
    </section>
  );
}
