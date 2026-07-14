import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Evita anunciar "X-Powered-By: Next.js" en cada respuesta.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // El panel /admin no debe poder embeberse en un iframe de otro sitio.
          { key: "X-Frame-Options", value: "DENY" },
          // Evita que el navegador intente "adivinar" el tipo de un archivo.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No filtra la URL completa (con posibles IDs de pedido, etc.) a sitios externos.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Desactiva APIs del navegador que esta app no usa.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
