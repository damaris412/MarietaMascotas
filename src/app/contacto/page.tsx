import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-display text-3xl italic text-english-900">Contacto</h1>
      <div className="mt-6 space-y-4 text-ink/70">
        <p className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-sage-600" /> contacto@marietamascotas.com
        </p>
        <p className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-sage-600" /> +57 300 000 0000
        </p>
        <p className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-sage-600" /> Bogotá, Colombia
        </p>
      </div>
    </div>
  );
}
