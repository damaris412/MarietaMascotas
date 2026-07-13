"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { HeroCTAs } from "@/components/home/HeroCTAs";

const VIDEO_SRC = "/video/hero-marieta-mascotas.mp4";

export function MobileHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  function handleStart() {
    if (started) return;
    setStarted(true);
    videoRef.current?.play().catch(() => {});
  }

  function handleEnded() {
    const el = ctaSectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <>
      <section
        onClick={handleStart}
        className="relative h-[100dvh] w-full overflow-hidden bg-english-900"
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-linen backdrop-blur-sm">
              Bienvenidos a
            </span>
            <h1 className="text-balance font-display text-4xl italic text-linen drop-shadow-md">
              Marieta Mascotas
            </h1>

            <div className="relative mt-10">
              <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-linen/40" />
              <span className="relative inline-flex items-center gap-2 rounded-full bg-linen px-6 py-3 text-sm font-bold text-english-900 shadow-[0_0_35px_12px_rgba(255,255,255,0.45)]">
                <Play className="h-4 w-4 fill-english-900" /> Tocá para comenzar
              </span>
            </div>
          </div>
        )}
      </section>

      <div ref={ctaSectionRef} className="flex justify-center bg-english-900 py-14">
        <HeroCTAs />
      </div>
    </>
  );
}
