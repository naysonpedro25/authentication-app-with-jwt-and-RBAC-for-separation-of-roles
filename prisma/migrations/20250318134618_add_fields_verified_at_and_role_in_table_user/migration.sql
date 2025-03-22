-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('USER', 'ADM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'USER',
ADD COLUMN     "verified_at" TIMESTAMP(3);
