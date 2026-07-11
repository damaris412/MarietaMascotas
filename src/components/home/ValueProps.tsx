import { Sparkles, Truck, ShieldCheck, HeartHandshake } from "lucide-react";

const ITEMS = [
  {
    icon: Sparkles,
    title: "Diseño premium",
    text: "Materiales nobles y siluetas cuidadas para cada raza y tamaño.",
  },
  {
    icon: ShieldCheck,
    title: "Pago 100% seguro",
    text: "Checkout protegido con Mercado Pago: tarjetas, PSE y efectivo.",
  },
  {
    icon: Truck,
    title: "Envío a todo el país",
    text: "Empaques cuidados y seguimiento de tu pedido en todo momento.",
  },
  {
    icon: HeartHandshake,
    title: "Compra sin fricción",
    text: "En un clic con Google o como invitado, sin contraseñas.",
  },
];

export function ValueProps() {
  return (
    <section className="border-y border-sage-200/70 bg-sage-50/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-200 text-english-800">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-english-900">{title}</h3>
            <p className="text-sm text-ink/60">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
