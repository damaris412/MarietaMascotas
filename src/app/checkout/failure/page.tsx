import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutFailurePage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
      <XCircle className="h-16 w-16 text-red-400" />
      <h1 className="mt-6 font-display text-3xl italic text-english-900">
        El pago no se pudo completar
      </h1>
      <p className="mt-3 text-sm text-ink/60">
        No te preocupes, no se realizó ningún cargo. Puedes intentarlo nuevamente.
      </p>
      <Link
        href="/checkout"
        className="mt-8 rounded-full bg-english-700 px-7 py-3 text-sm font-semibold text-linen hover:bg-english-800"
      >
        Reintentar pago
      </Link>
    </div>
  );
}
