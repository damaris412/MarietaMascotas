"use client";

import { signIn } from "next-auth/react";

export function AdminSignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
      className="w-full rounded-full bg-sage-300 py-3.5 text-sm font-semibold text-english-900 transition-colors hover:bg-sage-200"
    >
      Continuar con Google
    </button>
  );
}
