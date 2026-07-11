"use client";

import { MapPin, MessageCircle } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatCurrency, cn } from "@/lib/utils";
import type { LocalityValue } from "@/lib/validation";

const OPTIONS: { value: LocalityValue; label: string }[] = [
  { value: "VILLA_MARIA", label: "Villa María" },
  { value: "VILLA_NUEVA", label: "Villa Nueva" },
  { value: "OTRA", label: "Otra localidad" },
];

function buildWhatsAppMessage(
  items: { title: string; size: string | null; quantity: number }[],
  subtotal: number
) {
  const lines = items.map(
    (item) => `- ${item.title}${item.size ? ` (talla ${item.size})` : ""} x${item.quantity}`
  );
  return [
    "¡Hola! Quiero comprar en Marieta Mascotas pero no soy de Villa María ni Villa Nueva.",
    "",
    "Mi pedido:",
    ...lines,
    "",
    `Total aproximado: ${formatCurrency(subtotal)}`,
    "",
    "Mi localidad es: ___",
    "¿Podemos coordinar el retiro en Villa Nueva o cómo hacemos la entrega?",
  ].join("\n");
}

export function DeliveryAreaGate({
  locality,
  onLocalityChange,
  children,
}: {
  locality: LocalityValue | null;
  onLocalityChange: (locality: LocalityValue) => void;
  children: React.ReactNode;
}) {
  const { items, subtotal } = useCart();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(items, subtotal))}`
    : undefined;

  return (
    <div className="mb-8">
      <div className="rounded-3xl border border-sage-200/70 bg-white/70 p-6">
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-english-700" />
          <h2 className="text-sm font-semibold text-english-900">
            Por ahora solo hacemos envíos a Villa María y Villa Nueva
          </h2>
        </div>
        <p className="mb-4 text-sm text-ink/60">
          Próximamente sumaremos localidades cercanas. Contanos desde dónde nos comprás para
          continuar:
        </p>
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onLocalityChange(option.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                locality === option.value
                  ? "border-english-700 bg-english-700 text-linen"
                  : "border-sage-300 text-ink/70 hover:bg-sage-100"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {locality === "OTRA" && (
          <div className="mt-5 rounded-2xl bg-beige-100 p-5">
            <p className="text-sm text-ink/80">
              Todavía no hacemos envíos a tu localidad. La única opción por ahora es coordinar el{" "}
              <strong>retiro personal en Villa Nueva</strong>. Escribinos por WhatsApp y
              coordinamos el punto de entrega o retiro directamente.
            </p>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-english-700 px-6 py-3 text-sm font-semibold text-linen transition-colors hover:bg-english-800"
              >
                <MessageCircle className="h-4 w-4" />
                Coordinar por WhatsApp
              </a>
            ) : (
              <p className="mt-4 text-xs text-red-500">
                Falta configurar el número de WhatsApp del negocio (variable
                NEXT_PUBLIC_WHATSAPP_NUMBER).
              </p>
            )}
          </div>
        )}
      </div>

      {(locality === "VILLA_MARIA" || locality === "VILLA_NUEVA") && (
        <div className="mt-8">{children}</div>
      )}
    </div>
  );
}
