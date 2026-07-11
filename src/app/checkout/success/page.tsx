"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
      <CheckCircle2 className="h-16 w-16 text-sage-500" />
      <h1 className="mt-6 font-display text-3xl italic text-english-900">¡Pago confirmado!</h1>
      <p className="mt-3 text-sm text-ink/60">
        Gracias por tu compra. Te enviaremos la confirmación y el seguimiento de envío a tu
        correo electrónico.
      </p>
      <Link
        href="/catalogo"
        className="mt-8 rounded-full bg-english-700 px-7 py-3 text-sm font-semibold text-linen hover:bg-english-800"
      >
        Seguir comprando
      </Link>
    </div>
  );
}
