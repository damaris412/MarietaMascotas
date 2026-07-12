import { formatCurrency } from "@/lib/utils";
import { getStoreSettings } from "@/server/services/settings";

export const dynamic = "force-dynamic";

export default async function EnviosPage() {
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-display text-3xl italic text-english-900">Envíos y devoluciones</h1>
      <div className="mt-6 space-y-4 text-ink/70 leading-relaxed">
        <p>Por ahora hacemos envíos únicamente a Villa María y Villa Nueva (Córdoba).</p>
        <p>
          Envío estándar: {formatCurrency(settings.shippingCost)}. Envío gratuito en pedidos desde{" "}
          {formatCurrency(settings.freeShippingThreshold)}.
        </p>
        <p>Tiempo de entrega estimado: 2 a 5 días hábiles.</p>
        <p>
          Si tu producto presenta algún defecto de fábrica, contás con 15 días calendario desde
          la entrega para solicitar cambio o devolución, escribiéndonos a
          contacto@marietamascotas.com.
        </p>
      </div>
    </div>
  );
}
