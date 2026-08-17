-- CreateEnum
CREATE TYPE "UserDocumentType" AS ENUM ('aadhar_card', 'pan_card', 'election_card', 'other');

-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'banned';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "description" TEXT,
ADD COLUMN     "occupation" TEXT;

-- CreateTable
CREATE TABLE "userDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "documentRelativePath" TEXT NOT NULL,
    "documentType" "UserDocumentType" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "userDocument_userId_idx" ON "userDocument"("userId");

-- AddForeignKey
ALTER TABLE "userDocument" ADD CONSTRAINT "userDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
