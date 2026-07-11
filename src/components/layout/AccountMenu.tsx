"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, Package, User as UserIcon } from "lucide-react";

export function AccountMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status !== "authenticated") {
    return (
      <button
        onClick={() => signIn("google")}
        className="rounded-full bg-english-700 px-5 py-2 text-sm font-semibold text-linen transition-colors hover:bg-english-800"
      >
        Ingresar
      </button>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-sage-300 bg-sage-100"
        aria-label="Mi cuenta"
      >
        {session.user?.image ? (
          <Image src={session.user.image} alt="" width={40} height={40} className="h-full w-full object-cover" />
        ) : (
          <UserIcon className="h-5 w-5 text-english-700" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-56 rounded-2xl border border-sage-200/70 bg-white p-2 shadow-xl">
          <p className="truncate px-3 py-2 text-xs text-ink/50">{session.user?.email}</p>
          {session.user?.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-english-700 hover:bg-sage-100"
            >
              <LayoutDashboard className="h-4 w-4" /> Panel admin
            </Link>
          )}
          <Link
            href="/mis-pedidos"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink/80 hover:bg-sage-100"
          >
            <Package className="h-4 w-4" /> Mis pedidos
          </Link>
          <Link
            href="/perfil/completar"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink/80 hover:bg-sage-100"
          >
            <UserIcon className="h-4 w-4" /> Mis datos
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-ink/80 hover:bg-sage-100"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
