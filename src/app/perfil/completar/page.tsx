"use client";

import { useSession, signIn } from "next-auth/react";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function CompletarPerfilPage() {
  const { status } = useSession();

  return (
    <div className="mx-auto max-w-lg px-5 py-16 md:px-8">
      <h1 className="font-display text-2xl italic text-english-900">Completá tus datos</h1>
      <p className="mt-2 text-sm text-ink/60">
        Necesitamos tu localidad, dirección y teléfono para poder coordinar tus envíos. Lo
        guardamos en tu perfil para que no tengas que volver a escribirlo la próxima vez.
      </p>

      <div className="mt-8 rounded-3xl border border-sage-200/70 bg-white/70 p-6">
        {status === "loading" && <p className="text-sm text-ink/50">Cargando...</p>}

        {status === "unauthenticated" && (
          <div className="text-center">
            <p className="mb-4 text-sm text-ink/70">
              Iniciá sesión con Google para completar tu perfil.
            </p>
            <button
              onClick={() => signIn("google")}
              className="rounded-full bg-english-700 px-7 py-3 text-sm font-semibold text-linen hover:bg-english-800"
            >
              Continuar con Google
            </button>
          </div>
        )}

        {status === "authenticated" && <ProfileForm />}
      </div>
    </div>
  );
}
