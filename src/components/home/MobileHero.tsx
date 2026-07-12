"use client";

import { useRef, useState } from "react";
import { HeroCTAs } from "@/components/home/HeroCTAs";

const VIDEO_SRC = "/video/hero-marieta-mascotas.mp4";

export function MobileHero({ featuredImage }: { featuredImage: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  function handleStart() {
    if (started) return;
    setStarted(true);
    videoRef.current?.play().catch(() => {});
  }

  function handleEnded() {
    ctaSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
            <span className="mt-8 animate-pulse text-xs font-medium uppercase tracking-widest text-linen/80">
              Tocá para comenzar
            </span>
          </div>
        )}
      </section>

      <div ref={ctaSectionRef} className="flex justify-center bg-english-900 py-14">
        <HeroCTAs featuredImage={featuredImage} />
      </div>
    </>
  );
}
