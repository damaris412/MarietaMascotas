"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Minus, PawPrint, Plus, ZoomIn } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { ProductImageLightbox } from "@/components/catalog/ProductImageLightbox";
import { formatCurrency, cn } from "@/lib/utils";
import type { ProductDTO, ProductSize } from "@/types/catalog";

export function ProductDetail({ product }: { product: ProductDTO }) {
  const [size, setSize] = useState<ProductSize | null>(product.sizes[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem(product, size, quantity);
    setAdded(true);
    showToast("Producto agregado al carrito", "success");
    openCart();
    setTimeout(() => setAdded(false), 1200);
  }

  const discount =
    product.previousPrice && product.previousPrice > product.price
      ? Math.round(100 - (product.price / product.previousPrice) * 100)
      : null;

  const activeUrl = product.images[activeImage];
  const focalPoint = activeUrl ? product.imageFocalPoints?.[activeUrl] : null;
  const objectPosition = focalPoint ? `${focalPoint.x}% ${focalPoint.y}%` : undefined;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:px-8">
      <div>
        <button
          type="button"
          onClick={() => product.images[activeImage] && setLightboxOpen(true)}
          disabled={!product.images[activeImage]}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-sage-100 to-beige-100"
        >
          {product.images[activeImage] ? (
            <Image
              src={product.images[activeImage]}
              alt={product.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              style={objectPosition ? { objectPosition } : undefined}
              className="object-cover"
              priority
            />
          ) : (
            <PawPrint className="h-24 w-24 text-sage-400/50" strokeWidth={1} />
          )}
          {discount && (
            <span className="absolute left-4 top-4 rounded-full bg-english-700 px-3 py-1 text-xs font-semibold text-linen">
              {discount}% OFF
            </span>
          )}
          {product.images[activeImage] && (
            <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-xs font-medium text-linen backdrop-blur-sm transition-colors group-hover:bg-ink/75">
              <ZoomIn className="h-3.5 w-3.5" /> Ver en grande
            </span>
          )}
        </button>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((image, index) => (
              <button
                key={image}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "relative h-16 w-16 overflow-hidden rounded-xl border-2",
                  activeImage === index ? "border-english-700" : "border-transparent"
                )}
              >
                <Image src={image} alt={`${product.title} foto ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-sage-600">
          {product.category.name}
        </span>
        <h1 className="mt-2 font-display text-3xl italic text-english-900">{product.title}</h1>
        <div className="mt-3">
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-english-800">
            {formatCurrency(product.price)}
          </span>
          {product.previousPrice && (
            <span className="text-base text-ink/40 line-through">
              {formatCurrency(product.previousPrice)}
            </span>
          )}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink/70">{product.description}</p>

        {product.sizes.length > 0 && (
          <div className="mt-6">
            <span className="text-xs font-medium uppercase tracking-wide text-ink/50">Talla</span>
            <div className="mt-2 flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    size === s
                      ? "border-english-700 bg-english-700 text-linen"
                      : "border-sage-300 text-ink/70 hover:border-english-500"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {!outOfStock && (
          <div className="mt-6 flex items-center gap-2 rounded-full border border-sage-300 px-2 py-1.5 w-fit">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-7 w-7 items-center justify-center text-english-700"
              aria-label="Restar"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="flex h-7 w-7 items-center justify-center text-english-700"
              aria-label="Sumar"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={cn(
              "w-full rounded-full py-3.5 text-sm font-semibold shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
              added
                ? "bg-sage-500 text-linen"
                : "bg-english-700 text-linen hover:-translate-y-0.5 hover:bg-english-800 hover:shadow-lg hover:shadow-english-800/30 active:translate-y-0"
            )}
          >
            {outOfStock ? (
              "Sin stock"
            ) : added ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4" /> Añadido al carrito
              </span>
            ) : (
              "Añadir al carrito"
            )}
          </button>
        </div>

        <p className="mt-4 text-xs text-ink/50">
          {product.stock > 0 ? `${product.stock} unidades disponibles` : "Agotado temporalmente"}
        </p>
      </div>

      {lightboxOpen && product.images.length > 0 && (
        <ProductImageLightbox
          images={product.images}
          activeIndex={activeImage}
          onIndexChange={setActiveImage}
          onClose={() => setLightboxOpen(false)}
          alt={product.title}
        />
      )}
    </div>
  );
}
