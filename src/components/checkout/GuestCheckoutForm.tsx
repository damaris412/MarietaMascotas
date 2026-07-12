"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signIn, signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";
import { guestDetailsSchema, type GuestDetails, type LocalityValue } from "@/lib/validation";
import { useCart } from "@/components/providers/CartProvider";
import { cn } from "@/lib/utils";

export function GuestCheckoutForm({ locality }: { locality: LocalityValue | null }) {
  const { items } = useCart();
  const { data: session, status } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = status === "authenticated";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestDetails>({ resolver: zodResolver(guestDetailsSchema) });

  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name ?? "");
      setValue("email", session.user.email ?? "");
      if (session.user.address) setValue("address", session.user.address);
      if (session.user.phone) setValue("phone", session.user.phone);
    }
  }, [session, setValue]);

  async function onSubmit(data: GuestDetails) {
    if (!locality) {
      setServerError("Elegí tu localidad antes de continuar.");
      return;
    }
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/mercado-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
          })),
          guest: data,
          locality,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo procesar el pago.");
      window.location.assign(json.initPoint);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
      setLoading(false);
    }
  }

  const inputClass = (hasError: boolean, disabled?: boolean) =>
    cn(
      "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-english-600",
      hasError ? "border-red-400" : "border-sage-300",
      disabled && "cursor-not-allowed bg-sage-50 text-ink/60"
    );

  return (
    <div className="space-y-5">
      {!isAuthenticated && (
        <>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/checkout" })}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-sage-300 bg-white py-3.5 text-sm font-semibold text-english-800 transition-colors hover:bg-sage-100"
          >
            Continuar con Google
          </button>
          <div className="flex items-center gap-3 text-xs text-ink/40">
            <div className="h-px flex-1 bg-sage-200" />
            o continúa como invitado
            <div className="h-px flex-1 bg-sage-200" />
          </div>
        </>
      )}

      {isAuthenticated && (
        <div className="flex items-center justify-between rounded-2xl bg-sage-100 px-4 py-3 text-sm">
          <span className="text-ink/70">
            Conectado como <strong>{session.user?.email}</strong>
          </span>
          <button
            type="button"
            onClick={() => signOut({ redirect: false })}
            className="flex items-center gap-1 text-xs font-medium text-english-700 hover:underline"
          >
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Nombre completo
          </label>
          <input
            {...register("name")}
            disabled={isAuthenticated}
            className={inputClass(!!errors.name, isAuthenticated)}
            placeholder="Ej. Ana Rodríguez"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Correo electrónico
          </label>
          <input
            {...register("email")}
            type="email"
            disabled={isAuthenticated}
            className={inputClass(!!errors.email, isAuthenticated)}
            placeholder="tu@correo.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            DNI (Documento Nacional de Identidad)
          </label>
          <input
            {...register("dni")}
            className={inputClass(!!errors.dni)}
            placeholder="Ej. 1032456789"
          />
          {errors.dni && <p className="mt-1 text-xs text-red-500">{errors.dni.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Teléfono
          </label>
          <input
            {...register("phone")}
            className={inputClass(!!errors.phone)}
            placeholder="Ej. 3534290975"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Dirección completa de envío
          </label>
          <textarea
            {...register("address")}
            rows={3}
            data-lenis-prevent
            className={inputClass(!!errors.address)}
            placeholder="Calle, número, barrio, ciudad y referencias"
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={loading || items.length === 0 || !locality}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-english-700 py-3.5 text-sm font-semibold text-linen transition-colors hover:bg-english-800 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Pagar con Mercado Pago
        </button>
      </form>
    </div>
  );
}
