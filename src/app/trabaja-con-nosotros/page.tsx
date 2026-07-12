import { WorkWithUsForm } from "@/components/work/WorkWithUsForm";

export default function TrabajaConNosotrosPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16 md:px-8">
      <h1 className="font-display text-3xl italic text-english-900">Trabajá con nosotros</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink/70">
        Marieta Mascotas está creciendo y buscamos sumar personas y empresas para distintas
        áreas: marketing, fotografía y armado de catálogo, generación de imágenes, flete y
        envíos, colaboraciones entre marcas, eventos, packaging, y más. Contanos un poco sobre
        vos y cómo te gustaría colaborar.
      </p>
      <div className="mt-8">
        <WorkWithUsForm />
      </div>
    </div>
  );
}
