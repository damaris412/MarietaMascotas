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
   - `MERCADOPAGO_WEBHOOK_SECRET`: firma secreta del webhook (panel de Mercado Pago → tu
     integración → Webhooks → "Firma secreta"). Sin esto, en producción se rechazan todas las
     notificaciones entrantes.
   - `NEXT_PUBLIC_SITE_URL`: URL pública del sitio (usa una URL de túnel como ngrok en desarrollo
     para que el webhook de Mercado Pago pueda alcanzar tu máquina local).
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: número de WhatsApp del negocio en formato internacional sin
     "+" ni espacios (ej. `5493534123456`), usado en el checkout para coordinar por WhatsApp con
     clientes fuera de la zona de envío.

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

## Medios de pago (Mercado Pago Checkout Pro)

La preferencia de pago (`src/server/payments/mercadopago.ts`) no excluye ningún medio de pago,
por lo que Checkout Pro muestra todo lo habilitado para la cuenta en Argentina: tarjeta de
crédito, tarjeta de débito, transferencia bancaria, dinero en cuenta/QR de la billetera, y
efectivo (Rapipago y Pago Fácil). El cliente es redirigido a la página de Mercado Pago
(`init_point`) para elegir el medio y completar el pago ahí — el botón de pago en el checkout
(`GuestCheckoutForm`) simplemente redirige a esa URL una vez que el backend crea la preferencia.

Para el pago en efectivo, Mercado Pago genera automáticamente el cupón con código de barras para
pagar en el local (Rapipago/Pago Fácil); no hace falta generar ningún comprobante desde esta app.

## Webhook de Mercado Pago

Configura la notification URL de tu integración a `https://tu-dominio/api/webhooks/mercado-pago`.
En desarrollo local, usa una herramienta de túnel (ngrok, cloudflared) y actualiza
`NEXT_PUBLIC_SITE_URL` en consecuencia para que `back_urls` y `notification_url` sean alcanzables.

El endpoint valida la firma HMAC-SHA256 del header `x-signature` con `MERCADOPAGO_WEBHOOK_SECRET`
antes de procesar cualquier notificación (ver `isValidSignature` en la ruta del webhook) y,
además, vuelve a consultar el pago directamente a la API de Mercado Pago antes de tocar la base
de datos — nunca confía en el estado que venga en el payload de la notificación. Solo cuando el
estado real es `approved` se marca el pedido como `PAID`, se guarda el `payment_id` y se descuenta
el stock.

## Zona de envío

Por ahora la tienda solo envía a **Villa María** y **Villa Nueva**. Antes de mostrar el
formulario de pago, `DeliveryAreaGate` (`src/components/checkout/DeliveryAreaGate.tsx`) pide al
cliente que confirme su localidad. Si elige "Otra localidad", no se le ofrece el checkout
automático: se le explica que la única opción es coordinar el retiro personal en Villa Nueva, y
se le da un botón que abre WhatsApp (`NEXT_PUBLIC_WHATSAPP_NUMBER`) con un mensaje prellenado que
incluye el detalle de su carrito, para que la coordinación la haga la dueña del negocio
directamente por chat.

## Notas de implementación

- Moneda: pesos argentinos (ARS) en toda la app (`formatCurrency` en `src/lib/utils.ts` y
  `currency_id` en la preferencia de Mercado Pago).
- Las camas ya tienen fotografía real de catálogo (`public/images/productos/`); la ropa todavía
  se muestra con un marcador ilustrado (paw icon) hasta que se sumen esas fotos al seed.
- El precio de cada producto se recalcula en el servidor al crear la preferencia de pago — nunca
  se confía en el precio enviado desde el cliente.
- El stock se descuenta únicamente cuando el webhook confirma un pago `approved`, evitando
  bloquear inventario por carritos abandonados.
- Envío gratis configurable en `src/lib/shipping.ts`.

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de ramas y convenciones al trabajar en equipo.
