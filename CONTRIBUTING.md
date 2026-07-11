# Guía de contribución

## Ramas

- **`main`** — siempre desplegable. Solo se actualiza vía merge de `develop` (o de un `hotfix/*`
  urgente). Nadie hace commit directo aquí.
- **`develop`** — rama de integración. Todas las features se mezclan aquí primero.
- **`feature/<nombre-corto>`** — una rama por funcionalidad, creada desde `develop`.
  Ej. `feature/checkout-invitado`, `feature/dashboard-graficos`.
- **`fix/<nombre-corto>`** — corrección de un bug, creada desde `develop`.
- **`hotfix/<nombre-corto>`** — corrección urgente en producción, creada desde `main` y
  mezclada tanto a `main` como a `develop`.

Flujo típico:

```bash
git checkout develop
git pull
git checkout -b feature/mi-funcionalidad
# ...trabajo y commits...
git push -u origin feature/mi-funcionalidad
# abrir Pull Request hacia develop
```

## Pull Requests

- Un PR por funcionalidad o corrección; evita mezclar cambios sin relación.
- Antes de abrir el PR: `npm run lint` y `npm run build` deben pasar localmente.
- Si el cambio toca `prisma/schema.prisma`, incluye la migración generada
  (`npm run db:migrate`) en el mismo PR.
- Describe qué cambia y por qué, no solo qué archivos se tocaron.

## Dónde va el código nuevo

- ¿Toca base de datos, secretos o un SDK de servidor (Prisma, Mercado Pago, NextAuth)?
  → `src/server/`
- ¿Es una función pura reutilizable en cliente y servidor (formateo, validación, constantes)?
  → `src/lib/`
- ¿Es interfaz de usuario? → `src/components/` (UI) o `src/app/**/page.tsx` (rutas)

Ver la sección "Estructura del proyecto" en el [README](README.md) para más detalle.

## Commits

Mensajes cortos en modo imperativo, en español o inglés (consistente dentro de un mismo PR):

```
Agrega filtro de talla al catálogo
Fix: el webhook no actualizaba el método de pago
```

## Variables de entorno

Todo el equipo usa el mismo `.env.example` como referencia. Si agregas una variable nueva,
actualiza `.env.example` en el mismo PR (con un valor de ejemplo, nunca un secreto real).
