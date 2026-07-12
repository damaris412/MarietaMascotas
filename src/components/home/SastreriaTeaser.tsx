import Link from "next/link";
import { MeasurementGuideDog } from "@/components/illustrations/MeasurementGuideDog";

export function SastreriaTeaser() {
  return (
    <section className="border-y border-sage-200/70 bg-sage-50/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:py-20">
        <div className="w-full max-w-[220px] shrink-0 md:max-w-[260px]">
          <MeasurementGuideDog measurement="back" className="w-full" />
        </div>
        <div className="text-center md:text-left">
          <span className="mb-4 inline-block rounded-full bg-sage-200/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-english-800">
            Sastrería a medida
          </span>
          <h2 className="text-balance font-display text-3xl italic text-english-900 md:text-4xl">
            ¿Buscás algo único? Creamos prendas a medida para tu mascota
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/70">
            Como una sastrería, pero para mascotas: nos indicás el modelo que te gusta, tomás 3
            medidas simples y juntos diseñamos una prenda única, pensada exactamente para su
            cuerpo.
          </p>
          <Link
            href="/sastreria-a-medida"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-english-700 px-7 py-3.5 text-sm font-semibold text-linen shadow-lg shadow-english-800/20 transition-transform hover:-translate-y-0.5 hover:bg-english-800"
          >
            Descubrí la sastrería a medida
          </Link>
        </div>
      </div>
    </section>
  );
}
