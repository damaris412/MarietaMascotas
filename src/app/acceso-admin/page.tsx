import { redirect } from "next/navigation";
import { auth } from "@/server/auth/auth";
import { AdminSignInButton } from "@/components/admin/AdminSignInButton";
import { Logo } from "@/components/ui/Logo";

export default async function AccesoAdminPage() {
  const session = await auth();

  if (session?.user?.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-english-900 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-english-800 p-8 text-center text-linen">
        <Logo className="mx-auto h-12 w-12" ringColor="var(--color-sage-300)" lineColor="var(--color-linen)" />
        <h1 className="mt-5 font-display text-xl italic">Acceso administrativo</h1>
        <p className="mt-2 text-sm text-linen/60">
          Este panel es exclusivo para el equipo de Marieta Mascotas.
        </p>

        {session?.user ? (
          <p className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Tu cuenta ({session.user.email}) no tiene permisos de administrador.
          </p>
        ) : (
          <div className="mt-6">
            <AdminSignInButton />
          </div>
        )}
      </div>
    </div>
  );
}
