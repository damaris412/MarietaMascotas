import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Ruler } from "lucide-react";

export function PostHeroCTAs({ featuredImage }: { featuredImage: string | null }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl italic text-english-900 sm:text-3xl">
          ¿Qué estás buscando hoy?
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <Link
          href="/catalogo"
          className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl bg-english-900 p-8 shadow-lg shadow-english-900/10"
        >
          {featuredImage && (
            <Image
              src={featuredImage}
              alt=""
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-english-900 via-english-900/50 to-transparent" />
          <div className="relative z-10">
            <span className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-linen backdrop-blur-sm">
              Catálogo
            </span>
            <h3 className="text-balance font-display text-2xl italic text-linen sm:text-3xl">
              Ropa y camas listas para tu mascota
            </h3>
            <p className="mt-2 max-w-sm text-sm text-linen/80">
              Descubrí todo lo que ya tenemos disponible, listo para comprar hoy.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-linen px-6 py-3 text-sm font-semibold text-english-900 transition-transform group-hover:-translate-y-0.5">
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        <Link
          href="/sastreria-a-medida"
          className="group flex flex-col justify-between rounded-3xl border border-sage-200/70 bg-sage-50/60 p-8 transition-colors hover:border-english-500"
        >
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-200/70 text-english-800">
              <Ruler className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-xl italic text-english-900">
              Sastrería a medida
            </h3>
            <p className="mt-2 text-sm text-ink/60">
              ¿Buscás algo único? Diseñamos prendas a medida a partir de 3 medidas simples.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-english-700 group-hover:text-english-800">
            Conocer más <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
