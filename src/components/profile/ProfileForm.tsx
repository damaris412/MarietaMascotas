"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { profileSchema, type ProfileInput } from "@/lib/validation";
import { cn } from "@/lib/utils";

const LOCALITY_OPTIONS: { value: ProfileInput["locality"]; label: string }[] = [
  { value: "VILLA_MARIA", label: "Villa María" },
  { value: "VILLA_NUEVA", label: "Villa Nueva" },
  { value: "OTRA", label: "Otra localidad" },
];

export function ProfileForm() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (session?.user?.address) setValue("address", session.user.address);
    if (session?.user?.locality) setValue("locality", session.user.locality);
    if (session?.user?.phone) setValue("phone", session.user.phone);
  }, [session, setValue]);

  const locality = useWatch({ control, name: "locality" });

  async function onSubmit(data: ProfileInput) {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar tu perfil.");
      await update();
      router.push(searchParams.get("callbackUrl") ?? "/");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-english-600",
      hasError ? "border-red-400" : "border-sage-300"
    );

  if (status === "loading") return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Localidad
        </label>
        <div className="flex flex-wrap gap-2">
          {LOCALITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("locality", option.value, { shouldValidate: true })}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                locality === option.value
                  ? "border-english-700 bg-english-700 text-linen"
                  : "border-sage-300 text-ink/70 hover:bg-sage-100"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.locality && (
          <p className="mt-1 text-xs text-red-500">Elegí tu localidad</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Dirección completa
        </label>
        <textarea
          {...register("address")}
          rows={3}
          data-lenis-prevent
          className={inputClass(!!errors.address)}
          placeholder="Calle, número, barrio y referencias"
        />
        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Teléfono
        </label>
        <input
          {...register("phone")}
          className={inputClass(!!errors.phone)}
          placeholder="Ej. 3534123456"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-english-700 py-3.5 text-sm font-semibold text-linen transition-colors hover:bg-english-800 disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar y continuar
      </button>
    </form>
  );
}
