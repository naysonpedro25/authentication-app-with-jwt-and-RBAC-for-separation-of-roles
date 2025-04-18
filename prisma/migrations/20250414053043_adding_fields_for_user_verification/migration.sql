-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verification_token" TEXT,
ADD COLUMN     "verification_token_expires_at" TIMESTAMP(3);
