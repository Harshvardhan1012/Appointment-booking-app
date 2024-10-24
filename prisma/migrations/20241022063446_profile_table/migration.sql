/*
  Warnings:

  - You are about to drop the column `identificationDocument` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "identificationDocument",
ALTER COLUMN "Occupation" DROP NOT NULL,
ALTER COLUMN "InsuranceId" DROP NOT NULL,
ALTER COLUMN "InsuranceProvider" DROP NOT NULL;
