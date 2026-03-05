import Link from "next/link";
import axios from "axios";
import {prisma} from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CourseLink } from "@/components/course-link";
// import CourseLink from "@/component/CourseLink";



interface propsParams {
  params: Promise<{ courseid: string; itemcount: string }>;
}

export default async function courseinfo({ params }: propsParams) {
  const resolvedParams = await params;
  const { userId } = await auth();
  let videoCount = Number(resolvedParams.itemcount);
console.log("course id is " ,resolvedParams.courseid , " and maxresult is ", videoCount);
  const response = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&part=snippet&maxResults=${videoCount}&playlistId=${resolvedParams.courseid}&key=${process.env.API_KEY}`
  );

  async function createEntry() { //this is a server action
    "use server";
    if (!userId) return;

    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    const existingCourse = await prisma.course.findUnique({
      where: { playlistId: resolvedParams.courseid },
    });

    if (!existingUser || !existingCourse) return;

    const existing = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: existingUser.id,
          courseId: existingCourse.id,
        },
      },
    });

    if (existing) {
      console.log("Entry already exists");
      return;
    }

    await prisma.courseProgress.create({
      data: {
        userId: existingUser.id,
        courseId: existingCourse.id,
        progress: 0,
      },
    });
  }

  const firstVideo = response.data.items[0];
  const thumbnail = firstVideo.snippet.thumbnails.maxres?.url || "";
  const title = firstVideo.snippet.channelTitle;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://wallpaperaccess.com/full/8109116.jpg')",
      }}
    >
      {/* Dark overlay to keep content readable */}
      <div className="absolute inset-0  backdrop-blur-sm"></div>

      <div className="relative max-w-5xl w-full bg-white/10 shadow-2xl rounded-3xl overflow-hidden border border-white/20 backdrop-blur-md">
        {/* Thumbnail Header */}
        <div className="relative">
          <img
            src={thumbnail}
            alt="Course Thumbnail"
            className="w-full h-72 object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h1 className="text-white text-3xl font-bold drop-shadow-md">
              {title}
            </h1>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-8 space-y-6 text-center">
          {/* <p className="text-gray-100 leading-relaxed text-lg font-light">
            {description}
          </p> */}

          <div className="flex justify-center">
            <CourseLink
              courseId={resolvedParams.courseid}
              itemCount={resolvedParams.itemcount}
              videoId={firstVideo.contentDetails.videoId}
              createEntry={createEntry}
            />
          </div>
        </div>
      </div>
    </div>
  );
}