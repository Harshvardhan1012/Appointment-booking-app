/*
  Warnings:

  - A unique constraint covering the columns `[userId,physician]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_userId_physician_key" ON "Appointment"("userId", "physician");
