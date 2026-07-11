"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/providers/CartProvider";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { GuestCheckoutForm } from "@/components/checkout/GuestCheckoutForm";
import { DeliveryAreaGate } from "@/components/checkout/DeliveryAreaGate";
import type { LocalityValue } from "@/lib/validation";

export default function CheckoutPage() {
  const { items } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [locality, setLocality] = useState<LocalityValue | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    const profileIncomplete =
      !session.user.address || !session.user.locality || !session.user.phone;
    if (profileIncomplete) {
      router.replace("/perfil/completar?callbackUrl=/checkout");
      return;
    }
    // Perfil completo: preseleccionamos la localidad guardada para que el
    // cliente no tenga que volver a elegirla en cada compra.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocality((current) => current ?? session.user.locality);
  }, [status, session, router]);

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
      <DeliveryAreaGate locality={locality} onLocalityChange={setLocality}>
        <div className="grid gap-8 md:grid-cols-[1.2fr,1fr]">
          <div className="rounded-3xl border border-sage-200/70 bg-white/70 p-6">
            <GuestCheckoutForm locality={locality} />
          </div>
          <OrderSummary />
        </div>
      </DeliveryAreaGate>
    </div>
  );
}
