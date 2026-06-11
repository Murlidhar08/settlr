/*
  Warnings:

  - Made the column `role` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "FinancialAccountType" AS ENUM ('MONEY', 'PARTY', 'CATEGORY');

-- CreateEnum
CREATE TYPE "MoneyType" AS ENUM ('CASH', 'ONLINE', 'CHEQUE');

-- CreateEnum
CREATE TYPE "PartyType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'OTHER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE', 'ASSET', 'EQUITY', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "activeBusinessId" TEXT,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateTable
CREATE TABLE "business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "defAccId" TEXT,
    "defIncomeAccId" TEXT,
    "defExpenseAccId" TEXT,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

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
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "financialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "party" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactNo" TEXT,
    "profileUrl" TEXT,
    "businessId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromAccountId" TEXT NOT NULL,
    "toAccountId" TEXT NOT NULL,
    "partyId" TEXT,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_ownerId_idx" ON "business"("ownerId");

-- CreateIndex
CREATE INDEX "financialAccount_businessId_idx" ON "financialAccount"("businessId");

-- CreateIndex
CREATE INDEX "financialAccount_partyId_idx" ON "financialAccount"("partyId");

-- CreateIndex
CREATE UNIQUE INDEX "financialAccount_businessId_name_key" ON "financialAccount"("businessId", "name");

-- CreateIndex
CREATE INDEX "party_businessId_idx" ON "party"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "party_businessId_name_key" ON "party"("businessId", "name");

-- CreateIndex
CREATE INDEX "transaction_businessId_idx" ON "transaction"("businessId");

-- CreateIndex
CREATE INDEX "transaction_businessId_date_idx" ON "transaction"("businessId", "date");

-- CreateIndex
CREATE INDEX "transaction_businessId_fromAccountId_idx" ON "transaction"("businessId", "fromAccountId");

-- CreateIndex
CREATE INDEX "transaction_businessId_toAccountId_idx" ON "transaction"("businessId", "toAccountId");

-- CreateIndex
CREATE INDEX "transaction_fromAccountId_date_idx" ON "transaction"("fromAccountId", "date");

-- CreateIndex
CREATE INDEX "transaction_toAccountId_date_idx" ON "transaction"("toAccountId", "date");

-- CreateIndex
CREATE INDEX "transaction_userId_idx" ON "transaction"("userId");

-- CreateIndex
CREATE INDEX "transaction_partyId_date_idx" ON "transaction"("partyId", "date");

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financialAccount" ADD CONSTRAINT "financialAccount_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financialAccount" ADD CONSTRAINT "financialAccount_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "financialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "financialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
