"use client";

import { useCart } from "@/components/providers/CartProvider";
import { formatCurrency } from "@/lib/utils";
import { calculateShippingCost, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

export function OrderSummary() {
  const { items, subtotal } = useCart();
  const shippingCost = calculateShippingCost(subtotal);

  return (
    <div className="rounded-3xl border border-sage-200/70 bg-white/70 p-6">
      <h2 className="mb-4 font-display text-lg italic text-english-800">Resumen del pedido</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.size ?? "unico"}`}
            className="flex justify-between text-sm"
          >
            <span className="text-ink/70">
              {item.title} {item.size ? `· Talla ${item.size}` : ""} × {item.quantity}
            </span>
            <span className="font-medium text-english-800">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-sage-200 pt-4 text-sm">
        <div className="flex justify-between text-ink/70">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink/70">
          <span>Envío</span>
          <span>{shippingCost === 0 ? "Gratis" : formatCurrency(shippingCost)}</span>
        </div>
        {shippingCost > 0 && (
          <p className="text-xs text-sage-600">
            Envío gratis en pedidos desde {formatCurrency(FREE_SHIPPING_THRESHOLD)}
          </p>
        )}
        <div className="flex justify-between border-t border-sage-200 pt-2 text-base font-semibold text-english-900">
          <span>Total</span>
          <span>{formatCurrency(subtotal + shippingCost)}</span>
        </div>
      </div>
    </div>
  );
}
