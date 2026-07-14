-- CreateTable
CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "RateLimitBucket_expiresAt_idx" ON "RateLimitBucket"("expiresAt");

-- Las tablas nuevas no heredan RLS de las existentes: se cierra también
-- la API pública para esta tabla (ver migración enable_row_level_security).
ALTER TABLE "RateLimitBucket" ENABLE ROW LEVEL SECURITY;
