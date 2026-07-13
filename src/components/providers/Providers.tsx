"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/providers/CartProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { MobileRepaintFix } from "@/components/providers/MobileRepaintFix";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <SmoothScrollProvider>
          <MobileRepaintFix />
          {children}
        </SmoothScrollProvider>
      </CartProvider>
    </SessionProvider>
  );
}
