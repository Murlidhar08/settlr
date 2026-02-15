/*
  Warnings:

  - A unique constraint covering the columns `[businessId,name]` on the table `financialAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessId,name]` on the table `party` will be added. If there are existing duplicate values, this will fail.
  - Made the column `businessId` on table `party` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "party" DROP CONSTRAINT "party_businessId_fkey";

-- AlterTable
ALTER TABLE "party" ALTER COLUMN "businessId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "financialAccount_businessId_name_key" ON "financialAccount"("businessId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "party_businessId_name_key" ON "party"("businessId", "name");

-- CreateIndex
CREATE INDEX "transaction_partyId_date_idx" ON "transaction"("partyId", "date");

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
