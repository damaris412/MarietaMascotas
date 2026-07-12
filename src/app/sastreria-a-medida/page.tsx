import { CustomOrderForm } from "@/components/custom-order/CustomOrderForm";
import { MeasurementGuideDog } from "@/components/illustrations/MeasurementGuideDog";

const MEASUREMENTS = [
  {
    key: "neck" as const,
    title: "Contorno de cuello",
    description:
      "Ni muy arriba ni muy abajo: tiene que pasar justo por donde le pasa la correa a tu mascota.",
  },
  {
    key: "chest" as const,
    title: "Contorno de tórax",
    description:
      "Justo donde terminan las dos patas delanteras — no en la panza.",
  },
  {
    key: "back" as const,
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
          Prendas únicas, hechas a la medida exacta de tu mascota
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/70">
          En Marieta Mascotas armamos prendas a medida, como una sastrería, pero para mascotas.
          Vos nos indicás el diseño o la tela que te gusta, nos contás sobre tu compañero de
          cuatro patas, y juntos creamos un modelo único, pensado exactamente para su cuerpo.
        </p>
      </div>

      <div className="mt-12 rounded-3xl border border-sage-200/70 bg-sage-50/60 p-6 md:p-8">
        <h2 className="font-display text-xl italic text-english-900">Cómo tomar las medidas</h2>
        <p className="mt-2 text-sm text-ink/60">
          Para prendas a medida no usamos talles S, M, L — solo estas 3 medidas, en centímetros.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {MEASUREMENTS.map((m) => (
            <div key={m.key} className="text-center">
              <div className="mx-auto w-full max-w-[220px]">
                <MeasurementGuideDog measurement={m.key} className="w-full" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-english-900">{m.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-xl">
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
