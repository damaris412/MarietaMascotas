"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSettingsSchema, type StoreSettingsInput } from "@/lib/validation";

export function SettingsForm({ initial }: { initial: StoreSettingsInput }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreSettingsInput>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: initial,
  });

  async function onSubmit(data: StoreSettingsInput) {
    setServerError(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar la configuración.");
      setSaved(true);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-english-600";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-3xl border border-sage-200/70 bg-white/80 p-6 md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <h2 className="font-display text-lg italic text-english-800">Costo de envío</h2>
        <p className="mt-1 text-xs text-ink/50">
          Este valor se suma automáticamente en el checkout de cada pedido a Villa María o Villa
          Nueva, salvo que el subtotal supere el umbral de envío gratis.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Costo de envío ($)
        </label>
        <input
          type="number"
          {...register("shippingCost", { valueAsNumber: true })}
          className={inputClass}
        />
        {errors.shippingCost && (
          <p className="mt-1 text-xs text-red-500">{errors.shippingCost.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Envío gratis a partir de ($)
        </label>
        <input
          type="number"
          {...register("freeShippingThreshold", { valueAsNumber: true })}
          className={inputClass}
        />
        {errors.freeShippingThreshold && (
          <p className="mt-1 text-xs text-red-500">{errors.freeShippingThreshold.message}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 md:col-span-2">
          {serverError}
        </p>
      )}
      {saved && (
        <p className="rounded-lg bg-sage-100 px-4 py-2.5 text-sm text-english-800 md:col-span-2">
          Configuración guardada.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-english-700 py-3 text-sm font-semibold text-linen transition-all hover:-translate-y-0.5 hover:bg-english-800 hover:shadow-lg hover:shadow-english-800/30 disabled:opacity-50 md:col-span-2"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
