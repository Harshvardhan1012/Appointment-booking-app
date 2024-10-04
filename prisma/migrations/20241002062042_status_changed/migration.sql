-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "AppointmentStatus" "Status" NOT NULL DEFAULT 'Pending';
