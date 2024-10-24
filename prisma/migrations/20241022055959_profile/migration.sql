/*
  Warnings:

  - Made the column `InsuranceId` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `InsuranceProvider` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "identificationDocument" JSONB,
ALTER COLUMN "InsuranceId" SET NOT NULL,
ALTER COLUMN "InsuranceProvider" SET NOT NULL;
