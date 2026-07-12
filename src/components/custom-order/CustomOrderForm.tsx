"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { customOrderSchema, type CustomOrderInput } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { MediaUploader } from "@/components/admin/MediaUploader";

export function CustomOrderForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<{ ownerName: string; petName: string } | null>(null);
  const [fabricMediaUrls, setFabricMediaUrls] = useState<string[]>([]);
  const [petMediaUrls, setPetMediaUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomOrderInput>({ resolver: zodResolver(customOrderSchema) });

  async function onSubmit(data: CustomOrderInput) {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/sastreria-a-medida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, fabricMediaUrls, petMediaUrls }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo enviar tu pedido.");
      setSubmitted({ ownerName: data.ownerName, petName: data.petName });
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

  if (submitted) {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const whatsappHref = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          `¡Hola! Soy ${submitted.ownerName}, acabo de enviar un pedido de prenda a medida para ${submitted.petName} a través de la web. ¡Gracias!`
        )}`
      : undefined;

    return (
      <div className="rounded-3xl border border-sage-200/70 bg-white/70 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sage-600" />
        <h2 className="mt-4 font-display text-xl italic text-english-900">
          ¡Recibimos tu pedido, {submitted.ownerName}!
        </h2>
        <p className="mt-2 text-sm text-ink/60">
          Te va a llegar un correo confirmando que lo recibimos. Vamos a revisar las medidas y las
          referencias que nos enviaste, y te contactamos para avanzar con el diseño.
        </p>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-english-700 px-6 py-3 text-sm font-semibold text-linen transition-all hover:-translate-y-0.5 hover:bg-english-800 hover:shadow-lg hover:shadow-english-800/30"
          >
            <MessageCircle className="h-4 w-4" /> Confirmar también por WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-3xl border border-sage-200/70 bg-white/70 p-6"
    >
      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-semibold text-english-900">Tus datos</legend>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Nombre completo
          </label>
          <input
            {...register("ownerName")}
            className={inputClass(!!errors.ownerName)}
            placeholder="Tu nombre"
          />
          {errors.ownerName && <p className="mt-1 text-xs text-red-500">{errors.ownerName.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Correo electrónico
            </label>
            <input
              {...register("ownerEmail")}
              type="email"
              className={inputClass(!!errors.ownerEmail)}
              placeholder="tu@correo.com"
            />
            {errors.ownerEmail && (
              <p className="mt-1 text-xs text-red-500">{errors.ownerEmail.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Teléfono
            </label>
            <input
              {...register("ownerPhone")}
              className={inputClass(!!errors.ownerPhone)}
              placeholder="Ej. 3534290975"
            />
            {errors.ownerPhone && (
              <p className="mt-1 text-xs text-red-500">{errors.ownerPhone.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-semibold text-english-900">Tu mascota</legend>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Nombre
            </label>
            <input {...register("petName")} className={inputClass(!!errors.petName)} placeholder="Ej. Firulais" />
            {errors.petName && <p className="mt-1 text-xs text-red-500">{errors.petName.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Edad
            </label>
            <input {...register("petAge")} className={inputClass(!!errors.petAge)} placeholder="Ej. 2 años" />
            {errors.petAge && <p className="mt-1 text-xs text-red-500">{errors.petAge.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Raza
            </label>
            <input {...register("petBreed")} className={inputClass(!!errors.petBreed)} placeholder="Ej. Salchicha" />
            {errors.petBreed && <p className="mt-1 text-xs text-red-500">{errors.petBreed.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            ¿Es para algún evento especial? (opcional)
          </label>
          <input
            {...register("eventName")}
            className={inputClass(false)}
            placeholder="Ej. boda, cumpleaños, sesión de fotos..."
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-semibold text-english-900">
          Medidas (en centímetros — no usamos talles S/M/L)
        </legend>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Contorno de cuello (cm)
            </label>
            <input
              {...register("neckCm", { valueAsNumber: true })}
              type="number"
              step="0.5"
              className={inputClass(!!errors.neckCm)}
              placeholder="Ej. 32"
            />
            {errors.neckCm && <p className="mt-1 text-xs text-red-500">{errors.neckCm.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Contorno de tórax (cm)
            </label>
            <input
              {...register("chestCm", { valueAsNumber: true })}
              type="number"
              step="0.5"
              className={inputClass(!!errors.chestCm)}
              placeholder="Ej. 48"
            />
            {errors.chestCm && <p className="mt-1 text-xs text-red-500">{errors.chestCm.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Largo de lomo (cm)
            </label>
            <input
              {...register("backLengthCm", { valueAsNumber: true })}
              type="number"
              step="0.5"
              className={inputClass(!!errors.backLengthCm)}
              placeholder="Ej. 40"
            />
            {errors.backLengthCm && (
              <p className="mt-1 text-xs text-red-500">{errors.backLengthCm.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-semibold text-english-900">Referencias</legend>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Fotos o video de referencia de tela (opcional)
          </label>
          <MediaUploader
            value={fabricMediaUrls}
            onChange={setFabricMediaUrls}
            uploadUrl="/api/sastreria-a-medida/upload"
            maxFiles={5}
            hint="Subí hasta 5 fotos (o un par de videos cortos) de la tela o el diseño que te gusta."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Fotos o video de tu mascota (opcional)
          </label>
          <MediaUploader
            value={petMediaUrls}
            onChange={setPetMediaUrls}
            uploadUrl="/api/sastreria-a-medida/upload"
            maxFiles={5}
            hint="Así nos damos una idea de cómo es — subí hasta 5 fotos o videos."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Comentarios (opcional)
          </label>
          <textarea
            {...register("notes")}
            rows={4}
            className={inputClass(false)}
            placeholder="Contanos sobre tu mascota o cualquier detalle que quieras que tengamos en cuenta..."
          />
        </div>
      </fieldset>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-english-700 py-3.5 text-sm font-semibold text-linen transition-all hover:-translate-y-0.5 hover:bg-english-800 hover:shadow-lg hover:shadow-english-800/30 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar pedido"}
      </button>
    </form>
  );
}
