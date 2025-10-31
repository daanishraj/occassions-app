-- CreateEnum
CREATE TYPE "OccasionType" AS ENUM ('Birthday', 'Anniversary');

-- CreateEnum
CREATE TYPE "Month" AS ENUM ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

-- CreateTable
CREATE TABLE "Occasion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "occasionType" "OccasionType" NOT NULL,
    "month" "Month" NOT NULL,
    "day" INTEGER NOT NULL,

    CONSTRAINT "Occasion_pkey" PRIMARY KEY ("id")
);
