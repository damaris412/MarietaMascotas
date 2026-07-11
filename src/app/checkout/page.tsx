"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { GuestCheckoutForm } from "@/components/checkout/GuestCheckoutForm";
import { DeliveryAreaGate } from "@/components/checkout/DeliveryAreaGate";

export default function CheckoutPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl italic text-english-900">Tu carrito está vacío</h1>
        <p className="mt-3 text-sm text-ink/60">
          Añade algún producto de nuestro catálogo antes de continuar con el pago.
        </p>
        <Link
          href="/catalogo"
          className="mt-6 inline-block rounded-full bg-english-700 px-7 py-3 text-sm font-semibold text-linen hover:bg-english-800"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <h1 className="mb-8 font-display text-3xl italic text-english-900">Finalizar compra</h1>
      <DeliveryAreaGate>
        <div className="grid gap-8 md:grid-cols-[1.2fr,1fr]">
          <div className="rounded-3xl border border-sage-200/70 bg-white/70 p-6">
            <GuestCheckoutForm />
          </div>
          <OrderSummary />
        </div>
      </DeliveryAreaGate>
    </div>
  );
}
