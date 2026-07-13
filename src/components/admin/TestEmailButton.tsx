"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

export function TestEmailButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/test-email", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo enviar.");
      setStatus("ok");
      setMessage(`Enviado a ${json.to}. Revisá esa bandeja de entrada.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
    }
  }

  return (
    <div className="rounded-3xl border border-sage-200/70 bg-white/80 p-6">
      <h2 className="font-display text-lg italic text-english-900">Probar envío de correos</h2>
      <p className="mt-1 text-sm text-ink/60">
        Envía un email de compra confirmada de ejemplo a la dirección configurada en{" "}
        <code className="rounded bg-sage-100 px-1.5 py-0.5 text-xs">ADMIN_EMAIL</code>, usando el
        mismo mecanismo que se usa para clientes reales.
      </p>
      <button
        onClick={handleClick}
        disabled={status === "loading"}
        className="mt-4 flex items-center gap-2 rounded-full bg-english-700 px-5 py-2.5 text-sm font-semibold text-linen transition-colors hover:bg-english-800 disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        Enviar email de prueba
      </button>
      {message && (
        <p className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-sage-700"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
