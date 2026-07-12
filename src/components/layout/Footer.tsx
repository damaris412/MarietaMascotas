import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-sage-200/70 bg-english-800 text-linen">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-5 py-8 md:grid-cols-4 md:gap-10 md:px-8 md:py-14">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3 flex items-center gap-2.5 md:mb-4">
            <Logo className="h-8 w-8 md:h-9 md:w-9" ringColor="var(--color-sage-300)" lineColor="var(--color-linen)" />
            <span className="font-display text-base italic md:text-lg">Marieta Mascotas</span>
          </div>
          <p className="max-w-xs text-xs text-linen/70 md:text-sm">
            Ropa de diseño y camas premium para que tu mascota viva con estilo y confort.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage-300 md:mb-4 md:text-sm">
            Tienda
          </h3>
          <ul className="space-y-1.5 text-xs text-linen/80 md:space-y-2.5 md:text-sm">
            <li><Link href="/catalogo?categoria=ropa" className="hover:text-linen">Ropa</Link></li>
            <li><Link href="/catalogo?categoria=camas" className="hover:text-linen">Camas</Link></li>
            <li><Link href="/catalogo" className="hover:text-linen">Todo el catálogo</Link></li>
            <li><Link href="/sastreria-a-medida" className="hover:text-linen">Sastrería a medida</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage-300 md:mb-4 md:text-sm">
            Ayuda
          </h3>
          <ul className="space-y-1.5 text-xs text-linen/80 md:space-y-2.5 md:text-sm">
            <li><Link href="/nosotros" className="hover:text-linen">Nosotros</Link></li>
            <li><Link href="/envios" className="hover:text-linen">Envíos y devoluciones</Link></li>
            <li><Link href="/contacto" className="hover:text-linen">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage-300 md:mb-4 md:text-sm">
            Sumate
          </h3>
          <ul className="space-y-1.5 text-xs text-linen/80 md:space-y-2.5 md:text-sm">
            <li><Link href="/trabaja-con-nosotros" className="hover:text-linen">Trabajá con nosotros</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-linen/10 px-5 py-3 text-center text-[11px] text-linen/50 md:px-8 md:py-5 md:text-xs">
        © {new Date().getFullYear()} Marieta Mascotas. Todos los derechos reservados.
      </div>
    </footer>
  );
}
