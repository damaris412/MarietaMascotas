import { prisma } from "@/server/db/prisma";

const DEFAULT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos

/**
 * Limitador de tasa respaldado por Postgres (reutiliza la misma base que ya
 * usa el resto de la app, sin sumar un servicio externo). Cada llamada
 * incrementa un "bucket" `clave:inicio-de-ventana` y devuelve si todavía
 * está dentro del límite permitido para esa ventana de tiempo.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = DEFAULT_WINDOW_MS
): Promise<boolean> {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const bucketKey = `${key}:${windowStart}`;

  const bucket = await prisma.rateLimitBucket.upsert({
    where: { key: bucketKey },
    update: { count: { increment: 1 } },
    create: { key: bucketKey, count: 1, expiresAt: new Date(windowStart + windowMs) },
  });

  // Limpieza oportunista de buckets vencidos (no en cada request, para no
  // sumar carga): así la tabla nunca crece sin límite.
  if (Math.random() < 0.02) {
    prisma.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {});
  }

  return bucket.count <= limit;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export const RATE_LIMIT_MESSAGE = "Demasiados intentos. Probá de nuevo en unos minutos.";
