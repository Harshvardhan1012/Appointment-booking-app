/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "Date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone";
