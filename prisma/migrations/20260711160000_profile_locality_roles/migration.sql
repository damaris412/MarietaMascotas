-- CreateEnum
CREATE TYPE "Locality" AS ENUM ('VILLA_MARIA', 'VILLA_NUEVA', 'OTRA');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CLIENT', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "locality" "Locality";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "locality" "Locality",
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "role" SET DEFAULT 'CLIENT';
