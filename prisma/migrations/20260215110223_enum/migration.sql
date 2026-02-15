/*
  Warnings:

  - The values [BOTH] on the enum `PartyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PartyType_new" AS ENUM ('CUSTOMER', 'SUPPLIER', 'OTHER');
ALTER TABLE "financialAccount" ALTER COLUMN "partyType" TYPE "PartyType_new" USING ("partyType"::text::"PartyType_new");
ALTER TABLE "party" ALTER COLUMN "type" TYPE "PartyType_new" USING ("type"::text::"PartyType_new");
ALTER TYPE "PartyType" RENAME TO "PartyType_old";
ALTER TYPE "PartyType_new" RENAME TO "PartyType";
DROP TYPE "public"."PartyType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "party" DROP CONSTRAINT "party_businessId_fkey";

-- AlterTable
ALTER TABLE "party" ALTER COLUMN "businessId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "party" ADD CONSTRAINT "party_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
