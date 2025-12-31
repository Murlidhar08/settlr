/*
  Warnings:

  - The primary key for the `userSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `userSettings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "userSettings_userId_key";

-- AlterTable
ALTER TABLE "userSettings" DROP CONSTRAINT "userSettings_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "userSettings_pkey" PRIMARY KEY ("userId");
