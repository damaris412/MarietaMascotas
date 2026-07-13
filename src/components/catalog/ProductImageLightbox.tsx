"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function ProductImageLightbox({
  images,
  activeIndex,
  onIndexChange,
  onClose,
  alt,
}: {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  alt: string;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((activeIndex + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange((activeIndex - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length, onIndexChange, onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/95 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-linen transition-colors hover:bg-white/20"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((activeIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-linen transition-colors hover:bg-white/20 sm:left-6"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((activeIndex + 1) % images.length);
            }}
            className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-linen transition-colors hover:bg-white/20 sm:right-6"
            aria-label="Foto siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        className="relative h-full max-h-[85vh] w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={images[activeIndex]} alt={alt} fill sizes="100vw" className="object-contain" />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(index);
              }}
              aria-label={`Ver foto ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-5 bg-linen" : "w-1.5 bg-linen/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
