-- CreateEnum
CREATE TYPE "questionStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Video" (
    "videoid" TEXT NOT NULL,
    "status" "questionStatus" NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("videoid")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "answer" TEXT NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);
