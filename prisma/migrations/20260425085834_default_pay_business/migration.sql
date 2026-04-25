/*
  Warnings:

  - You are about to drop the column `defAccId` on the `userSettings` table. All the data in the column will be lost.
  - You are about to drop the column `defExpenseAccId` on the `userSettings` table. All the data in the column will be lost.
  - You are about to drop the column `defIncomeAccId` on the `userSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "business" ADD COLUMN     "defAccId" TEXT,
ADD COLUMN     "defExpenseAccId" TEXT,
ADD COLUMN     "defIncomeAccId" TEXT;

-- AlterTable
ALTER TABLE "userSettings" DROP COLUMN "defAccId",
DROP COLUMN "defExpenseAccId",
DROP COLUMN "defIncomeAccId";
