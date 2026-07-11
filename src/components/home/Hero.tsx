"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { DogWithCoat } from "@/components/illustrations/DogWithCoat";
import { OrthopedicBed } from "@/components/illustrations/OrthopedicBed";
import { OrganicBlob } from "@/components/illustrations/OrganicBlob";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const dogX = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const dogY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const dogRotate = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const dogScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  const bedX = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const bedY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const bedRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);

  const blobScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const blobRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[105vh] min-h-[720px] overflow-hidden bg-gradient-to-b from-sage-50 via-linen to-linen"
    >
      <motion.div
        style={{ scale: blobScale, rotate: blobRotate }}
        className="pointer-events-none absolute -left-24 top-10 w-[420px] opacity-60"
      >
        <OrganicBlob color="var(--color-sage-200)" />
      </motion.div>
      <motion.div
        style={{ scale: blobScale, rotate: blobRotate }}
        className="pointer-events-none absolute -right-20 bottom-0 w-[320px] opacity-50"
      >
        <OrganicBlob color="var(--color-beige-200)" />
      </motion.div>

      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center px-6 pt-16 md:flex-row md:pt-0">
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="z-10 max-w-xl text-center md:text-left"
        >
          <span className="mb-5 inline-block rounded-full bg-sage-200/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-english-800">
            Ropa &amp; camas premium
          </span>
          <h1 className="text-balance font-display text-4xl italic leading-tight text-english-900 sm:text-5xl md:text-6xl">
            Estilo y confort para quien más lo merece
          </h1>
          <p className="mt-5 text-balance text-base text-ink/70 md:text-lg">
            Diseñamos abrigos y camas ortopédicas de alta gama para perros y gatos: materiales
            nobles, siluetas cuidadas y el mismo mimo que le das tú.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/catalogo"
              className="rounded-full bg-english-700 px-7 py-3.5 text-center text-sm font-semibold text-linen shadow-lg shadow-english-800/20 transition-transform hover:-translate-y-0.5 hover:bg-english-800"
            >
              Ver catálogo
            </Link>
            <Link
              href="/catalogo?express=1"
              className="rounded-full border border-sage-400 bg-white/60 px-7 py-3.5 text-center text-sm font-semibold text-english-800 backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-white"
            >
              ⚡ Compra Express
            </Link>
          </div>
        </motion.div>

        <div className="relative mt-10 h-[360px] w-full flex-1 md:mt-0 md:h-full">
          <motion.div
            style={{ x: dogX, y: dogY, rotate: dogRotate, scale: dogScale }}
            className="absolute left-1/2 top-6 w-[240px] -translate-x-1/2 md:left-auto md:right-6 md:top-16 md:w-[300px] md:translate-x-0"
          >
            <DogWithCoat className="w-full drop-shadow-xl" />
          </motion.div>
          <motion.div
            style={{ x: bedX, y: bedY, rotate: bedRotate }}
            className="absolute bottom-2 left-1/2 w-[260px] -translate-x-1/2 md:bottom-16 md:left-4 md:w-[320px] md:translate-x-0"
          >
            <OrthopedicBed className="w-full drop-shadow-xl" />
          </motion.div>
        </div>
      </div>

      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-widest text-english-700/60"
      >
        Desliza para descubrir
      </motion.div>
    </section>
  );
}
