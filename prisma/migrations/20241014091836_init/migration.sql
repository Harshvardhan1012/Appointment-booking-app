/*
  Warnings:

  - You are about to drop the column `physician` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,physicianId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Appointment_userId_physician_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "physician",
ADD COLUMN     "physicianId" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_userId_physicianId_key" ON "Appointment"("userId", "physicianId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
