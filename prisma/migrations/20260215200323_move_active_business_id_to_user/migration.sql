/*
  Warnings:

  - You are about to drop the column `activeBusinessId` on the `session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "session" DROP COLUMN "activeBusinessId";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "activeBusinessId" TEXT;
