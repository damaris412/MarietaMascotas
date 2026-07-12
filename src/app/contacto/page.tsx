import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactoPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola! Quería hacerte una consulta.")}`
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-display text-3xl italic text-english-900">Contacto</h1>
      <div className="mt-6 space-y-4 text-ink/70">
        <p className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-sage-600" /> contacto@marietamascotas.com
        </p>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-english-700"
          >
            <MessageCircle className="h-4 w-4 text-sage-600" /> Escribinos por WhatsApp
          </a>
        )}
        <p className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-sage-600" /> Villa María, Córdoba, Argentina
        </p>
      </div>
    </div>
  );
}
