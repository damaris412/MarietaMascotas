"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Move } from "lucide-react";
import type { FocalPoint } from "@/types/catalog";

export function ImagePositionPicker({
  imageUrl,
  value,
  onChange,
  onClose,
}: {
  imageUrl: string;
  value: FocalPoint;
  onChange: (pos: FocalPoint) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<FocalPoint>(value);
  const dragging = useRef(false);

  function handlePointerDown(e: React.PointerEvent) {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dxPercent = (e.movementX / rect.width) * 100;
    const dyPercent = (e.movementY / rect.height) * 100;
    setPos((prev) => ({
      x: Math.min(100, Math.max(0, prev.x - dxPercent)),
      y: Math.min(100, Math.max(0, prev.y - dyPercent)),
    }));
  }

  function handlePointerUp() {
    dragging.current = false;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <Move className="h-4 w-4 text-english-700" />
          <p className="text-sm font-semibold text-english-900">
            Arrastrá la foto para ajustar el encuadre
          </p>
        </div>
        <p className="mb-3 text-xs text-ink/50">
          Este recuadro es exactamente lo que se ve en el catálogo. Arrastrá hasta que quede como
          querés.
        </p>
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative aspect-square w-full cursor-grab touch-none select-none overflow-hidden rounded-2xl bg-sage-100 active:cursor-grabbing"
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            draggable={false}
            className="pointer-events-none object-cover"
            style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-ink/60 hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(pos);
              onClose();
            }}
            className="rounded-full bg-english-700 px-5 py-2 text-sm font-semibold text-linen hover:bg-english-800"
          >
            Guardar posición
          </button>
        </div>
      </div>
    </div>
  );
}
