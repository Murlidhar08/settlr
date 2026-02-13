/*
  Warnings:

  - You are about to drop the column `direction` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `fromAccountId` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAccountId` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CASH', 'BANK', 'PARTY', 'EXPENSE', 'INCOME', 'CAPITAL', 'LOAN', 'FUND', 'OTHER');

-- DropIndex
DROP INDEX "transaction_businessId_mode_idx";

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "direction",
DROP COLUMN "mode",
ADD COLUMN     "fromAccountId" TEXT NOT NULL,
ADD COLUMN     "toAccountId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "TransactionDirection";

-- CreateTable
CREATE TABLE "financialAccount" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "partyId" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "financialAccount_businessId_idx" ON "financialAccount"("businessId");

-- CreateIndex
CREATE INDEX "transaction_fromAccountId_idx" ON "transaction"("fromAccountId");

-- CreateIndex
CREATE INDEX "transaction_toAccountId_idx" ON "transaction"("toAccountId");

-- AddForeignKey
ALTER TABLE "financialAccount" ADD CONSTRAINT "financialAccount_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financialAccount" ADD CONSTRAINT "financialAccount_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "financialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "financialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
