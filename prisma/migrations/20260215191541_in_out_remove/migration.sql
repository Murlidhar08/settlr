/*
  Warnings:

  - You are about to drop the column `type` on the `party` table. All the data in the column will be lost.
  - You are about to drop the column `direction` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the `transactionDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactionDocument" DROP CONSTRAINT "transactionDocument_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "transactionDocument" DROP CONSTRAINT "transactionDocument_userId_fkey";

-- DropIndex
DROP INDEX "transaction_partyId_date_idx";

-- AlterTable
ALTER TABLE "financialAccount" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "party" DROP COLUMN "type",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "direction",
DROP COLUMN "mode";

-- DropTable
DROP TABLE "transactionDocument";

-- DropEnum
DROP TYPE "TransactionDirection";

-- CreateIndex
CREATE INDEX "transaction_businessId_fromAccountId_idx" ON "transaction"("businessId", "fromAccountId");

-- CreateIndex
CREATE INDEX "transaction_businessId_toAccountId_idx" ON "transaction"("businessId", "toAccountId");
