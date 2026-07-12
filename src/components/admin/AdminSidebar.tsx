"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, PackageSearch, ShoppingCart, LogOut, Ruler, Settings, Users } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Analíticas", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/productos", label: "Productos", icon: PackageSearch },
  { href: "/admin/sastreria", label: "Sastrería a medida", icon: Ruler },
  { href: "/admin/postulaciones", label: "Postulaciones", icon: Users },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-english-900 text-linen">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <Logo className="h-8 w-8" ringColor="var(--color-sage-300)" lineColor="var(--color-linen)" />
        <span className="font-display text-lg italic">Admin</span>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-sage-300 text-english-900"
                : "text-linen/70 hover:bg-white/5 hover:text-linen"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mx-4 mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-linen/60 hover:bg-white/5 hover:text-linen"
      >
        <LogOut className="h-4 w-4" /> Cerrar sesión
      </button>
    </aside>
  );
}
