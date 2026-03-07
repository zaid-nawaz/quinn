-- DropForeignKey
ALTER TABLE "CourseProgress" DROP CONSTRAINT "CourseProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "VideoProgress" DROP CONSTRAINT "VideoProgress_userId_fkey";

-- AlterTable
ALTER TABLE "VideoProgress" ALTER COLUMN "completed" SET DEFAULT false,
ADD CONSTRAINT "VideoProgress_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoProgress" ADD CONSTRAINT "VideoProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
