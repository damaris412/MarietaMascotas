"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "loading" | "success" | "error" | "info";
type ToastItem = { id: number; message: string; type: ToastType };

type ToastContextValue = {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 2000) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-2 px-4 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "toast-pop pointer-events-auto flex max-w-[92vw] items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg shadow-black/10",
              toast.type === "error" ? "bg-red-600 text-linen" : "bg-english-800 text-linen"
            )}
          >
            {toast.type === "loading" && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />}
            {toast.type === "success" && <Check className="h-3.5 w-3.5 shrink-0" />}
            {toast.type === "error" && <TriangleAlert className="h-3.5 w-3.5 shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
