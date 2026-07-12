"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

const VIDEO_SRC = "/video/hero-marieta-mascotas.mp4";

const CHAPTERS: { range: [number, number]; eyebrow?: string; title: string }[] = [
  { range: [0, 0.16], eyebrow: "Bienvenidos a", title: "Marieta Mascotas" },
  { range: [0.18, 0.36], title: "La mejor tienda para tu mejor amigo" },
  { range: [0.38, 0.56], title: "Diseño y amor en cada prenda" },
  { range: [0.58, 0.76], title: "Y cuando querés algo único..." },
];

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
  const pad = 0.03;
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - pad), start, end, Math.min(1, end + pad)],
    [0, 1, 1, 0]
  );
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

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const targetTime = progress * duration;
    if (Math.abs(video.currentTime - targetTime) > 0.05) {
      video.currentTime = targetTime;
    }
  });

  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-english-900">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />

        {CHAPTERS.map((chapter, i) => (
          <ChapterText key={i} scrollYProgress={scrollYProgress} {...chapter} />
        ))}

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
