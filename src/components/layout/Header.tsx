"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/components/providers/CartProvider";
import { AccountMenu } from "@/components/layout/AccountMenu";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?categoria=ROPA", label: "Ropa" },
  { href: "/catalogo?categoria=CAMAS", label: "Camas" },
  { href: "/nosotros", label: "Nosotros" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/70 bg-linen/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="font-display text-xl italic text-english-800">Marieta Mascotas</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-english-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <AccountMenu />
          </div>
          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-english-800 transition-colors hover:bg-sage-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-english-700 px-1 text-[10px] font-semibold text-linen">
                {count}
              </span>
            )}
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-english-800 transition-colors hover:bg-sage-100 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-sage-200/70 bg-linen px-5 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-sage-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 px-3">
            <AccountMenu />
          </div>
        </nav>
      )}
    </header>
  );
}
