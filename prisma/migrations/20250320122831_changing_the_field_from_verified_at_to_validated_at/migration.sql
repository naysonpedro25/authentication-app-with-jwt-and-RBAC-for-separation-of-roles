/*
  Warnings:

  - You are about to drop the column `verified_at` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verified_at",
ADD COLUMN     "validated_at" TIMESTAMP(3);
