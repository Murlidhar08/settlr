/*
  Warnings:

  - You are about to drop the `businessSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Currency" ADD VALUE 'EUR';

-- DropForeignKey
ALTER TABLE "businessSettings" DROP CONSTRAINT "businessSettings_businessId_fkey";

-- AlterTable
ALTER TABLE "userSettings" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';

-- DropTable
DROP TABLE "businessSettings";
