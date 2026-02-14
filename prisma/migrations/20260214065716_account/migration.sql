/*
  Warnings:

  - Added the required column `fromAccountId` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAccountId` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FinancialAccountType" AS ENUM ('MONEY', 'PARTY', 'CATEGORY');

-- CreateEnum
CREATE TYPE "MoneyType" AS ENUM ('CASH', 'ONLINE', 'CHEQUE');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE', 'ASSET', 'EQUITY', 'ADJUSTMENT');

-- DropIndex
DROP INDEX "transaction_businessId_mode_idx";

-- DropIndex
DROP INDEX "transaction_date_idx";

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "fromAccountId" TEXT NOT NULL,
ADD COLUMN     "toAccountId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "financialAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" "FinancialAccountType" NOT NULL,
    "moneyType" "MoneyType",
    "partyType" "PartyType",
    "categoryType" "CategoryType",
    "partyId" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "financialAccount_businessId_idx" ON "financialAccount"("businessId");

-- CreateIndex
CREATE INDEX "financialAccount_partyId_idx" ON "financialAccount"("partyId");

-- CreateIndex
CREATE INDEX "business_ownerId_idx" ON "business"("ownerId");

-- CreateIndex
CREATE INDEX "transaction_businessId_date_idx" ON "transaction"("businessId", "date");

-- CreateIndex
CREATE INDEX "transaction_fromAccountId_date_idx" ON "transaction"("fromAccountId", "date");

-- CreateIndex
CREATE INDEX "transaction_toAccountId_date_idx" ON "transaction"("toAccountId", "date");

-- CreateIndex
CREATE INDEX "transaction_partyId_date_idx" ON "transaction"("partyId", "date");

-- CreateIndex
CREATE INDEX "transaction_userId_idx" ON "transaction"("userId");

-- AddForeignKey
ALTER TABLE "financialAccount" ADD CONSTRAINT "financialAccount_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financialAccount" ADD CONSTRAINT "financialAccount_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "financialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "financialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
