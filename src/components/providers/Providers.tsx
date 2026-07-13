"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/providers/CartProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { MobileRepaintFix } from "@/components/providers/MobileRepaintFix";
import { ToastProvider } from "@/components/providers/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <CartProvider>
          <SmoothScrollProvider>
            <MobileRepaintFix />
            {children}
          </SmoothScrollProvider>
        </CartProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
