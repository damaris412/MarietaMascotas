import { formatCurrency } from "@/lib/utils";
import { FLAT_SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

export default function EnviosPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-display text-3xl italic text-english-900">Envíos y devoluciones</h1>
      <div className="mt-6 space-y-4 text-ink/70 leading-relaxed">
        <p>
          Envío estándar: {formatCurrency(FLAT_SHIPPING_COST)}. Envío gratuito en pedidos desde{" "}
          {formatCurrency(FREE_SHIPPING_THRESHOLD)}.
        </p>
        <p>Tiempo de entrega estimado: 3 a 7 días hábiles según tu ciudad.</p>
        <p>
          Si tu producto presenta algún defecto de fábrica, cuentas con 15 días calendario desde
          la entrega para solicitar cambio o devolución, escribiéndonos a
          contacto@marietamascotas.com.
        </p>
      </div>
    </div>
  );
}
