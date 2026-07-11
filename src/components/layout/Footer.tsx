import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-sage-200/70 bg-english-800 text-linen">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <Logo className="h-9 w-9" ringColor="var(--color-sage-300)" lineColor="var(--color-linen)" />
            <span className="font-display text-lg italic">Marieta Mascotas</span>
          </div>
          <p className="max-w-xs text-sm text-linen/70">
            Ropa de diseño y camas ortopédicas premium para que tu mascota viva con estilo y
            confort.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sage-300">
            Tienda
          </h3>
          <ul className="space-y-2.5 text-sm text-linen/80">
            <li><Link href="/catalogo?categoria=ROPA" className="hover:text-linen">Ropa</Link></li>
            <li><Link href="/catalogo?categoria=CAMAS" className="hover:text-linen">Camas</Link></li>
            <li><Link href="/catalogo" className="hover:text-linen">Todo el catálogo</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sage-300">
            Ayuda
          </h3>
          <ul className="space-y-2.5 text-sm text-linen/80">
            <li><Link href="/nosotros" className="hover:text-linen">Nosotros</Link></li>
            <li><Link href="/envios" className="hover:text-linen">Envíos y devoluciones</Link></li>
            <li><Link href="/contacto" className="hover:text-linen">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sage-300">
            Pagos seguros
          </h3>
          <p className="text-sm text-linen/70">
            Tarjetas de crédito/débito, PSE y efectivo a través de Mercado Pago.
          </p>
        </div>
      </div>
      <div className="border-t border-linen/10 px-5 py-5 text-center text-xs text-linen/50 md:px-8">
        © {new Date().getFullYear()} Marieta Mascotas. Todos los derechos reservados.
      </div>
    </footer>
  );
}
