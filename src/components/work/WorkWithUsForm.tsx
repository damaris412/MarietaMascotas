"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { jobApplicationSchema, type JobApplicationInput } from "@/lib/validation";
import { cn } from "@/lib/utils";

const AREA_OPTIONS: { value: JobApplicationInput["area"]; label: string }[] = [
  { value: "MARKETING", label: "Marketing" },
  { value: "CATALOGO_FOTOS", label: "Fotos / subida de catálogo" },
  { value: "IMAGENES_IA", label: "Generación de imágenes (IA)" },
  { value: "FLETE_ENVIOS", label: "Flete / envíos" },
  { value: "COLABORACIONES", label: "Colaboraciones entre empresas" },
  { value: "EVENTOS", label: "Eventos" },
  { value: "PACKAGING", label: "Packaging" },
  { value: "OTRO", label: "Otro" },
];

export function WorkWithUsForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<{ name: string; area: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobApplicationInput>({ resolver: zodResolver(jobApplicationSchema) });

  async function onSubmit(data: JobApplicationInput) {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/trabaja-con-nosotros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo enviar tu postulación.");
      setSubmitted({ name: data.name, area: data.area });
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
          `¡Hola! Soy ${submitted.name}, acabo de enviar mi postulación para "${submitted.area}" a través de la web. ¡Gracias!`
        )}`
      : undefined;

    return (
      <div className="rounded-3xl border border-sage-200/70 bg-white/70 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sage-600" />
        <h2 className="mt-4 font-display text-xl italic text-english-900">
          ¡Recibimos tu postulación, {submitted.name}!
        </h2>
        <p className="mt-2 text-sm text-ink/60">
          Te va a llegar un correo confirmando que la recibimos con éxito. La vamos a revisar y,
          si encaja con lo que buscamos, nos contactamos con vos.
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
      className="space-y-4 rounded-3xl border border-sage-200/70 bg-white/70 p-6"
    >
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Nombre completo
        </label>
        <input {...register("name")} className={inputClass(!!errors.name)} placeholder="Tu nombre" />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Correo electrónico
        </label>
        <input
          {...register("email")}
          type="email"
          className={inputClass(!!errors.email)}
          placeholder="tu@correo.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Teléfono
        </label>
        <input {...register("phone")} className={inputClass(!!errors.phone)} placeholder="Ej. 3534290975" />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Área de interés
        </label>
        <select {...register("area")} className={inputClass(!!errors.area)}>
          {AREA_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Contanos sobre vos
        </label>
        <textarea
          {...register("message")}
          rows={4}
          className={inputClass(!!errors.message)}
          placeholder="Experiencia, disponibilidad, qué te gustaría aportar..."
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-english-700 py-3.5 text-sm font-semibold text-linen transition-all hover:-translate-y-0.5 hover:bg-english-800 hover:shadow-lg hover:shadow-english-800/30 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar postulación"}
      </button>
    </form>
  );
}
