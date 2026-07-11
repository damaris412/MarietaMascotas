"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/providers/CartProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </CartProvider>
    </SessionProvider>
  );
}
