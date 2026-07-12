-- CreateTable
CREATE TABLE "CustomOrderRequest" (
    "id" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "petName" TEXT NOT NULL,
    "petAge" TEXT NOT NULL,
    "petBreed" TEXT NOT NULL,
    "neckCm" DECIMAL(5,1) NOT NULL,
    "chestCm" DECIMAL(5,1) NOT NULL,
    "backLengthCm" DECIMAL(5,1) NOT NULL,
    "eventName" TEXT,
    "notes" TEXT,
    "fabricMediaUrls" TEXT[],
    "petMediaUrls" TEXT[],
    "contacted" BOOLEAN NOT NULL DEFAULT false,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomOrderRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomOrderRequest_createdAt_idx" ON "CustomOrderRequest"("createdAt");
