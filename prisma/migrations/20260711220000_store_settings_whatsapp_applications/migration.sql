-- CreateEnum
CREATE TYPE "ApplicationArea" AS ENUM ('MARKETING', 'CATALOGO_FOTOS', 'IMAGENES_IA', 'FLETE_ENVIOS', 'COLABORACIONES', 'EVENTOS', 'PACKAGING', 'OTRO');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "whatsappContacted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "shippingCost" DECIMAL(10,2) NOT NULL DEFAULT 15000,
    "freeShippingThreshold" DECIMAL(10,2) NOT NULL DEFAULT 250000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "area" "ApplicationArea" NOT NULL,
    "message" TEXT NOT NULL,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");
