import Image from "next/image";
import { CustomOrderForm } from "@/components/custom-order/CustomOrderForm";

const MEASUREMENTS = [
  {
    key: "neck" as const,
    image: "/images/sastreria/medidas-de-cuello.png",
    title: "Contorno de cuello",
    description:
      "Ni muy arriba ni muy abajo: tiene que pasar justo por donde le pasa la correa a tu mascota.",
  },
  {
    key: "chest" as const,
    image: "/images/sastreria/contornotorax.png",
    title: "Contorno de tórax",
    description:
      "Justo donde terminan las dos patas delanteras — no en la panza.",
  },
  {
    key: "back" as const,
    image: "/images/sastreria/largolomo.png",
    title: "Largo de lomo",
    description:
      "Desde la correa del cuello hasta antes de la cola. No incluye la cola.",
  },
];

export default function SastreriaAMedidaPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
      <div className="max-w-2xl">
        <span className="mb-4 inline-block rounded-full bg-sage-200/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-english-800">
          Sastrería a medida
        </span>
        <h1 className="text-balance font-display text-3xl italic text-english-900 md:text-4xl">
          Diseños exclusivos, el calce ideal para tu mascota.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/70">
          En Marieta Mascotas redefinimos la sastrería animal. Creamos prendas a medida para que
          tengas tu diseño exclusivo. Nos envías una referencia del modelo o tipo de prenda que te
          guste (como un vestido o un buzo, ¡una foto de internet es ideal!), nos hablas sobre tu
          mascota, y juntos creamos una pieza única diseñada para su comodidad.
        </p>
      </div>

      <div className="mt-12 rounded-3xl border border-sage-200/70 bg-sage-50/60 p-6 md:p-8">
        <h2 className="font-display text-xl italic text-english-900">Cómo tomar las medidas</h2>
        <p className="mt-2 text-sm text-ink/60">
          Para prendas a medida no usamos talles S, M, L — solo estas 3 medidas, en centímetros.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-8">
          {MEASUREMENTS.map((m) => (
            <div key={m.key} className="text-center">
              <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-2xl">
                <Image
                  src={m.image}
                  alt={m.title}
                  width={1000}
                  height={800}
                  sizes="(min-width: 640px) 220px, 33vw"
                  className="h-auto w-full object-cover"
                />
              </div>
              <h3 className="mt-3 text-xs font-semibold text-english-900 sm:mt-4 sm:text-sm">
                {m.title}
              </h3>
              <p className="mt-1.5 hidden text-xs leading-relaxed text-ink/60 sm:block">
                {m.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2 sm:hidden">
          {MEASUREMENTS.map((m) => (
            <p key={m.key} className="text-xs leading-relaxed text-ink/60">
              <span className="font-semibold text-english-900">{m.title}:</span> {m.description}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-display text-xl italic text-english-900">Contanos sobre el pedido</h2>
        <p className="mt-2 text-sm text-ink/60">
          Completá tus datos, las medidas y — si querés — fotos de referencia. Te contactamos para
          avanzar con el diseño.
        </p>
        <div className="mt-6">
          <CustomOrderForm />
        </div>
      </div>
    </div>
  );
}
