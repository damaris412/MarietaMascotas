"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PawPrint, Plus } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { useCart } from "@/components/providers/CartProvider";
import { formatCurrency, cn } from "@/lib/utils";
import type { ProductDTO, ProductSize } from "@/types/catalog";

export function ProductCard({ product }: { product: ProductDTO }) {
  const [size, setSize] = useState<ProductSize | null>(product.sizes[0] ?? null);
  const { addItem } = useCart();
  const router = useRouter();

  const discount =
    product.previousPrice && product.previousPrice > product.price
      ? Math.round(100 - (product.price / product.previousPrice) * 100)
      : null;

  function handleExpress() {
    addItem(product, size, 1);
    router.push("/checkout");
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-sage-200/70 bg-white/70 transition-shadow hover:shadow-xl hover:shadow-sage-900/5">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gradient-to-br from-sage-100 to-beige-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <PawPrint className="h-16 w-16 text-sage-400/50" strokeWidth={1.2} />
          </div>
        )}
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-english-700 px-3 py-1 text-xs font-semibold text-linen">
            {discount}% OFF
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-beige-300 px-3 py-1 text-xs font-semibold text-english-800">
            ¡Últimas {product.stock}!
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/producto/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm font-semibold text-ink hover:text-english-700">
            {product.title}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-english-800">
            {formatCurrency(product.price)}
          </span>
          {product.previousPrice && (
            <span className="text-xs text-ink/40 line-through">
              {formatCurrency(product.previousPrice)}
            </span>
          )}
        </div>

        {product.sizes.length > 0 && (
          <div className="flex gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                  size === s
                    ? "border-english-700 bg-english-700 text-linen"
                    : "border-sage-300 text-ink/70 hover:border-english-500"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-2">
          <button
            onClick={() => addItem(product, size, 1)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-sage-300 py-2.5 text-xs font-semibold text-english-800 transition-colors hover:bg-sage-100"
          >
            <Plus className="h-3.5 w-3.5" /> Añadir
          </button>
          <button
            onClick={handleExpress}
            className="flex-1 rounded-full bg-english-700 py-2.5 text-xs font-semibold text-linen transition-colors hover:bg-english-800"
          >
            ⚡ Compra Express
          </button>
        </div>
      </div>
    </div>
  );
}
