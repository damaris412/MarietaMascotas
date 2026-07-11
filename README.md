# Marieta Mascotas

Tienda e-commerce premium de ropa y camas para mascotas. Next.js 16 (App Router) + TypeScript +
Prisma/PostgreSQL + NextAuth (Auth.js v5) + Mercado Pago + Tailwind CSS v4 + Framer Motion.

## Estructura del proyecto

Una sola app Next.js, pero con el código organizado para que la frontera entre backend y
frontend sea explícita — pensado para que varias personas puedan trabajar en paralelo sin pisarse:

```
prisma/                  Esquema de base de datos, migraciones y seed (backend)
docker/Dockerfile        Imagen de producción de la app (multi-stage)
docker-compose.yml       Orquesta Postgres + migraciones + la app (config centralizada)
.env / .env.example      Variables de entorno centralizadas (una sola fuente de verdad)

src/
  app/                   Rutas de Next.js: páginas + API routes (capa de entrada HTTP)
  server/                TODA la lógica de backend — nada de esto se importa desde el navegador
    db/prisma.ts            Cliente de Prisma
    auth/auth.ts             Configuración de NextAuth (Google OAuth, roles)
    payments/mercadopago.ts  Integración con Mercado Pago
    services/                Consultas y reglas de negocio (products, orders, analytics)
    utils/                   Utilidades exclusivas del servidor (slugify)
  components/            UI (frontend) — páginas, catálogo, checkout, admin, layout
  lib/                    Utilidades compartidas y seguras para el navegador (cn, formatCurrency,
                           cálculo de envío, esquemas de validación con zod usados en formularios
                           y en las API routes)
  types/                  Tipos compartidos entre frontend y backend
  proxy.ts                Middleware: protege /admin y /api/admin por rol
```

Regla simple para saber dónde poner código nuevo: si toca la base de datos, un secreto o un SDK
de servidor (Prisma, Mercado Pago, NextAuth), va en `src/server/`. Si es una función pura que
puede ejecutarse también en el navegador (formateo, validación, constantes), va en `src/lib/`. La
UI vive en `src/components/` y `src/app/**/page.tsx`.

## Paleta de marca

El logo (mariquita/"marieta") se simplificó a sus dos formas redondas concéntricas, sin antenas
ni puntitos, para un look minimal. Colores definidos en `src/app/globals.css`:

- **Verde eucalipto pastel** (`--color-sage-*`): color principal de marca, botones secundarios, acentos.
- **Blanco lino** (`--color-linen`): fondo general del sitio.
- **Beige suave** (`--color-beige-*`): acentos cálidos, descuentos, detalles.
- **Verde inglés oscuro** (`--color-english-*`): botones primarios, header/footer, textos de énfasis.

## Requisitos previos

- Node.js 20+
- Docker Desktop (recomendado, para levantar Postgres y/o toda la app con un solo comando)
- Cuenta de Google Cloud (OAuth) para "Continuar con Google"
- Cuenta de Mercado Pago (credenciales de prueba o producción)

## Configuración local (con `npm run dev`)

1. Copia `.env.example` a `.env` y completa las variables. Todas las variables de entorno del
   proyecto viven en este único archivo (lo usan tanto `npm run dev` como docker-compose):
   - `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB`: credenciales de la base de datos.
   - `DATABASE_URL`: cadena de conexión que usa Prisma (debe coincidir con las credenciales de arriba).
   - `AUTH_SECRET`: genera uno con `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: credenciales OAuth de Google Cloud Console
     (tipo "Web application", con `http://localhost:3000/api/auth/callback/google` como URI de
     redirección autorizada).
   - `MERCADOPAGO_ACCESS_TOKEN`: access token de tu cuenta de Mercado Pago (credenciales de prueba
     o de producción, panel de desarrolladores).
   - `NEXT_PUBLIC_SITE_URL`: URL pública del sitio (usa una URL de túnel como ngrok en desarrollo
     para que el webhook de Mercado Pago pueda alcanzar tu máquina local).

2. Levanta solo la base de datos con Docker:

   ```bash
   docker compose up -d db
   ```

3. Instala dependencias, aplica migraciones y carga productos de ejemplo:

   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```

4. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

## Levantar todo con Docker (app + base de datos)

Para correr la aplicación completa igual que en producción, sin instalar Node localmente:

```bash
docker compose up --build
```

Esto construye la imagen de la app (`docker/Dockerfile`), levanta Postgres, corre las migraciones
(`prisma migrate deploy`) automáticamente en el servicio `migrate`, y arranca la app en
`http://localhost:3000`. Sigue usando el único archivo `.env` para toda la configuración.

## Convertir un usuario en administrador

No existe una pantalla pública de registro de administradores (por seguridad). Para dar acceso
al panel `/admin/dashboard`:

1. Inicia sesión una vez con Google desde `/acceso-admin` (ruta oculta, sin enlaces desde el menú).
2. En la base de datos, actualiza el rol de ese usuario:

   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'tu-correo@dominio.com';
   ```

3. Vuelve a `/acceso-admin` (o refresca la sesión) para acceder al dashboard.

El middleware (`src/proxy.ts`) protege `/admin/*` y `/api/admin/*`, redirigiendo a
`/acceso-admin` a cualquier usuario que no tenga rol `ADMIN`.

## Webhook de Mercado Pago

Configura la notification URL de tu integración a `https://tu-dominio/api/webhooks/mercado-pago`.
En desarrollo local, usa una herramienta de túnel (ngrok, cloudflared) y actualiza
`NEXT_PUBLIC_SITE_URL` en consecuencia para que `back_urls` y `notification_url` sean alcanzables.

## Notas de implementación

- Las imágenes de producto se muestran como marcadores ilustrados (paw icon) porque el proyecto
  no incluye fotografía real; sustituye `product.images` y los componentes de tarjeta/detalle por
  `next/image` apuntando a tus assets cuando tengas fotografía de catálogo.
- El precio de cada producto se recalcula en el servidor al crear la preferencia de pago — nunca
  se confía en el precio enviado desde el cliente.
- El stock se descuenta únicamente cuando el webhook confirma un pago `approved`, evitando
  bloquear inventario por carritos abandonados.
- Envío gratis configurable en `src/lib/shipping.ts`.

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de ramas y convenciones al trabajar en equipo.
