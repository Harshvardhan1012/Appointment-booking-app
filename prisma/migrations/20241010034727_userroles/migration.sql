-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'User', 'SuperAdmin');

-- DropIndex
DROP INDEX "Appointment_userId_physician_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User',
ALTER COLUMN "password" DROP DEFAULT;
