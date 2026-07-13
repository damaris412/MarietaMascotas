import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";

export function HeroCTAs() {
  return (
    <div className="w-full max-w-3xl px-6">
      <h2 className="mb-6 text-balance text-center font-display text-2xl italic text-linen drop-shadow-md sm:text-3xl">
        Elegí tu manera de vestirlo
      </h2>
      <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
        <Link
          href="/catalogo"
          className="group relative flex min-h-[190px] flex-col justify-end overflow-hidden rounded-2xl bg-english-900 p-6 shadow-xl transition-colors hover:bg-english-800"
        >
          <div className="relative z-10">
            <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-linen backdrop-blur-sm">
              Catálogo
            </span>
            <h3 className="font-display text-lg italic text-linen sm:text-xl">
              Ropa y camas listas para tu mascota
            </h3>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-linen px-5 py-2.5 text-xs font-semibold text-english-900 transition-transform group-hover:-translate-y-0.5">
              Ver catálogo <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>

        <Link
          href="/sastreria-a-medida"
          className="group flex flex-col justify-between rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-colors hover:bg-white/15"
        >
          <div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-linen">
              <Ruler className="h-4 w-4" />
            </span>
            <h3 className="mt-3 font-display text-lg italic text-linen">Sastrería a medida</h3>
            <p className="mt-1.5 text-xs text-linen/70">
              Diseñamos prendas únicas a partir de 3 medidas simples.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-linen group-hover:text-white">
            Conocer más <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
