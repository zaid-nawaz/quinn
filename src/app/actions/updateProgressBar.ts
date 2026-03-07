"use server"

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server";

export const updateProgressBar = async (playlist_id : string, video_id : string) => {



    const { userId } = await auth();

    if(!userId) return;



    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    const existingCourse = await prisma.course.findUnique({
      where: { playlistId:  playlist_id},
    });

    if(!existingCourse || !existingUser) return;

    const already_watched = await prisma.videoProgress.findUnique({
        where : {
            userId_videoId : {
                userId : existingUser.id,
                videoId : video_id
            }
        }
    })

    if(already_watched) return;

    await prisma.videoProgress.create({
        data : {
            userId : existingUser.id,
            videoId : video_id,
            courseId : existingCourse.id,
            completed : true

        }
    })

    return await prisma.courseProgress.update({
        where : {
            userId_courseId : {
                userId : existingUser.id,
                courseId : existingCourse.id
            }
        },
        data : {
            progress : {
                increment : 1
            }
        }
    })
}