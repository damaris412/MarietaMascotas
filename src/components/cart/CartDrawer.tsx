"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-english-900/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-linen shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-sage-200 px-6 py-5">
              <h2 className="font-display text-xl italic text-english-800">Tu carrito</h2>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sage-100"
                aria-label="Cerrar carrito"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink/60">
                  <ShoppingBag className="h-10 w-10 text-sage-400" />
                  <p>Tu carrito está vacío por ahora.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={`${item.productId}-${item.size ?? "unico"}`}
                      className="flex gap-3 rounded-2xl border border-sage-200/70 bg-white/60 p-3"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sage-100" />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-ink">{item.title}</p>
                          {item.size && (
                            <p className="text-xs text-ink/60">Talla {item.size}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-sage-300 px-1.5 py-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.size, item.quantity - 1)
                              }
                              className="flex h-5 w-5 items-center justify-center text-english-700"
                              aria-label="Restar cantidad"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-4 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.size, item.quantity + 1)
                              }
                              className="flex h-5 w-5 items-center justify-center text-english-700"
                              aria-label="Sumar cantidad"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-english-800">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="self-start text-ink/40 hover:text-red-500"
                        aria-label="Eliminar del carrito"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-sage-200 px-6 py-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-ink/70">Subtotal</span>
                  <span className="text-lg font-semibold text-english-800">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full rounded-full bg-english-700 py-3.5 text-center text-sm font-semibold text-linen transition-colors hover:bg-english-800"
                >
                  Finalizar compra
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
