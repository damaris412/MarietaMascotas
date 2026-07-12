-- Convierte Product.category (enum fijo ROPA/CAMAS) en una tabla "Category"
-- editable desde el panel de admin. El nombre "Category" lo usaba el enum
-- viejo, así que primero lo liberamos (columna temporal + drop del enum)
-- antes de crear la tabla nueva con el mismo nombre.

-- 1. Columna temporal de texto para no perder el valor del enum viejo
ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT;
UPDATE "Product" SET "categoryId" = "category"::text;

-- 2. Soltar la columna y el tipo enum viejo (libera el nombre "Category")
ALTER TABLE "Product" DROP COLUMN "category";
DROP TYPE "Category";

-- 3. Crear la tabla Category nueva
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- 4. Sembrar las dos categorías existentes
INSERT INTO "Category" ("id", "name", "slug") VALUES
  ('cat_ropa', 'Ropa', 'ropa'),
  ('cat_camas', 'Camas', 'camas');

-- 5. Apuntar los productos existentes a las categorías nuevas
UPDATE "Product" SET "categoryId" = 'cat_ropa' WHERE "categoryId" = 'ROPA';
UPDATE "Product" SET "categoryId" = 'cat_camas' WHERE "categoryId" = 'CAMAS';

-- 6. Reforzar NOT NULL + llave foránea + índice
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- 7. Campo para adjuntar CV/propuesta en "Trabajá con nosotros"
ALTER TABLE "JobApplication" ADD COLUMN "resumeUrl" TEXT;
