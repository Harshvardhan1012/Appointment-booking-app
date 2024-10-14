/*
  Warnings:

  - You are about to drop the column `isProfileCreated` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isProfileCreated",
ADD COLUMN     "FullName" TEXT,
ADD COLUMN     "ProfilePhoto" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "phone" DROP NOT NULL;
