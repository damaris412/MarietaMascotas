"use client";

import { useEffect } from "react";

/**
 * Algunos Android (reportado ampliamente en Galaxy A con One UI 6, ver
 * community.samsung.com "Broken content display since update One UI 6.0")
 * dejan páginas con listas/grillas de imágenes con contenido superpuesto o
 * "craqueado" al scrollear, y solo se arregla haciendo pellizco de zoom —
 * eso fuerza al sistema a recomponer la página. Esto intenta el mismo
 * efecto automáticamente: al dejar de scrollear, togglea brevemente un
 * transform para forzar un recompositado. No es una garantía (es un bug
 * del sistema operativo, no del sitio), pero es de bajo costo y no debería
 * afectar a nadie que no tenga el bug.
 */
export function MobileRepaintFix() {
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    function forceRepaint() {
      document.body.style.transform = "translateZ(0)";
      requestAnimationFrame(() => {
        document.body.style.transform = "";
      });
    }
    function onScroll() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(forceRepaint, 200);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
