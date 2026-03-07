
import axios from "axios";

import {prisma} from "@/lib/db";

import { VideoPlayer } from "@/components/video-player";
import { MCQSection } from "@/components/mcq-section";
import { Progressbar } from "@/components/progress-bar";
import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";

interface parameters {
  params: Promise<{
    courseid: string;
    videoid: string;
    itemcount: string;
  }>;
}

interface item {
  snippet: {
    title: string;
    playlistId: string;
  };
  contentDetails: {
    videoId: string;
  };
}

export default async function videos({ params }: parameters) {
  const resolved = await params;
  const videoid = resolved.videoid;
  let videoindex = 0;
  const itemCount = Number(resolved.itemcount);
  const {userId} = await auth();
  if(!userId) return;
  const response = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&part=snippet&maxResults=${itemCount}&playlistId=${resolved.courseid}&key=${process.env.API_KEY}`
  );

  const data = response.data;
  data.items.forEach((element: any, index: number) => {
    if (videoid === element.contentDetails.videoId) videoindex = index;
  });


  const videoinfo = await prisma.video.upsert({
    where: { videoid },
    update: {},
    create: {
      videoid,
      status: "PROCESSING",
    },
  });

  if(videoinfo.status === "PROCESSING"){
    console.log("inside processing");
    await inngest.send({
      name : "genai.backend/run",
      data : {
        video_id : videoid
      }
    })
  }

    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    const existingCourse = await prisma.course.findUnique({
      where: { playlistId: resolved.courseid },
    });

    

    if (!existingCourse || !existingUser) return;

    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: existingUser.id,
          courseId: existingCourse.id,
        },
      },
    });

    if(!courseProgress) return;

    let progressVal = (courseProgress?.progress / itemCount) * 100;

  const nextVideoHref =
    videoindex + 1 >= itemCount
      ? `/`
      : `/courses/${data.items[videoindex].snippet.playlistId}/${itemCount}/${data.items[videoindex + 1].contentDetails.videoId}`;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
     
      <div className="flex-1 flex flex-col items-center p-6">
        <div
          id="videoplayercard"
          className=" bg-white rounded-2xl shadow-md overflow-hidden mb-6"
        >
          <VideoPlayer videoid={videoid}  />
        </div>

    
        <div
          id="genaiblock"
          style={{ display: "none" }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 mt-4"
        >
          <MCQSection
            playlist_id = {resolved.courseid}
            video_id={videoid}
            nextVideoHref={nextVideoHref}
          />
        </div>
      </div>

      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Progress Section */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Course Progress
          </h3>
          <Progressbar value={progressVal} />
        </div>

        {/* Playlist Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Playlist Content
          </h3>
          {data.items.map((playlist: item, index: number) => (
            <a
              href={`/courses/${playlist.snippet.playlistId}/${itemCount}/${playlist.contentDetails.videoId}`}
              key={index}
              className={`block rounded-xl p-3 transition ${
                playlist.contentDetails.videoId === videoid
                  ? "bg-blue-100 border border-blue-400"
                  : "hover:bg-gray-100 border border-transparent"
              }`}
            >
              <h4 className="text-sm font-medium leading-tight line-clamp-2">
                {playlist.snippet.title}
              </h4>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}