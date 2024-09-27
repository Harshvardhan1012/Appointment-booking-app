-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "Address" TEXT NOT NULL,
    "Occupation" TEXT NOT NULL,
    "physician" TEXT NOT NULL,
    "identificationDocument" JSONB,
    "InsuranceId" TEXT NOT NULL,
    "InsuranceProvider" TEXT NOT NULL,
    "Allergies" TEXT,
    "CurrentMedications" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
