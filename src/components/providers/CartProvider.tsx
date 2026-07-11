"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, ProductDTO, ProductSize } from "@/types/catalog";

const STORAGE_KEY = "marieta-cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: ProductDTO, size: ProductSize | null, quantity?: number) => void;
  removeItem: (productId: string, size: ProductSize | null) => void;
  updateQuantity: (productId: string, size: ProductSize | null, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function keyFor(productId: string, size: ProductSize | null) {
  return `${productId}__${size ?? "unico"}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hidratación única desde localStorage al montar en el cliente: el carrito
    // vive fuera de React, así que un efecto es la única forma de sincronizarlo al montar.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage no disponible o corrupto: se ignora y arranca vacío
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: ProductDTO, size: ProductSize | null, quantity = 1) => {
      setItems((prev) => {
        const id = keyFor(product.id, size);
        const existing = prev.find((item) => keyFor(item.productId, item.size) === id);
        if (existing) {
          return prev.map((item) =>
            keyFor(item.productId, item.size) === id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + quantity, item.maxStock),
                }
              : item
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            image: product.images[0] ?? null,
            size,
            quantity: Math.min(quantity, product.stock),
            maxStock: product.stock,
          },
        ];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((productId: string, size: ProductSize | null) => {
    setItems((prev) =>
      prev.filter((item) => keyFor(item.productId, item.size) !== keyFor(productId, size))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: ProductSize | null, quantity: number) => {
      setItems((prev) =>
        prev.map((item) =>
          keyFor(item.productId, item.size) === keyFor(productId, size)
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxStock)) }
            : item
        )
      );
    },
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
