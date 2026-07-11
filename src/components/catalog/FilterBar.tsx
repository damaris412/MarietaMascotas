"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES = [
  { value: "", label: "Todo" },
  { value: "ROPA", label: "Ropa" },
  { value: "CAMAS", label: "Camas" },
];

const SIZES = ["S", "M", "L"];
const MAX_PRICE = 400000;

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const category = searchParams.get("categoria") ?? "";
  const size = searchParams.get("talla") ?? "";
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("precioMax") ?? MAX_PRICE)
  );

  const applyParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="sticky top-[65px] z-30 border-b border-sage-200/70 bg-linen/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => applyParams({ categoria: c.value })}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                category === c.value
                  ? "border-english-700 bg-english-700 text-linen"
                  : "border-sage-300 text-ink/70 hover:bg-sage-100"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="mr-1 text-xs font-medium uppercase tracking-wide text-ink/50">
              Talla
            </span>
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => applyParams({ talla: size === s ? "" : s })}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  size === s
                    ? "border-english-700 bg-english-700 text-linen"
                    : "border-sage-300 text-ink/70 hover:bg-sage-100"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex min-w-[220px] items-center gap-3">
            <span className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-ink/50">
              Hasta {formatCurrency(maxPrice)}
            </span>
            <input
              type="range"
              min={20000}
              max={MAX_PRICE}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              onMouseUp={() => applyParams({ precioMax: String(maxPrice) })}
              onTouchEnd={() => applyParams({ precioMax: String(maxPrice) })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-sage-200 accent-sage-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
