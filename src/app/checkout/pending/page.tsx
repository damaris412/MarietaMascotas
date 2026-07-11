import Link from "next/link";
import { Clock } from "lucide-react";

export default function CheckoutPendingPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
      <Clock className="h-16 w-16 text-beige-300" />
      <h1 className="mt-6 font-display text-3xl italic text-english-900">
        Tu pago está en proceso
      </h1>
      <p className="mt-3 text-sm text-ink/60">
        Estamos esperando la confirmación (por ejemplo, pagos en efectivo o transferencias).
        Te avisaremos por correo cuando se acredite.
      </p>
      <Link
        href="/catalogo"
        className="mt-8 rounded-full bg-english-700 px-7 py-3 text-sm font-semibold text-linen hover:bg-english-800"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
