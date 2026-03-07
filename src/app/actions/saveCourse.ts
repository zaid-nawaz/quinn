"use server"

import { prisma } from "@/lib/db";
import axios from "axios";

export const saveCourse = async (link : string) => {

    const params = new URL(link).searchParams;
    const playlistid = params.get("list");

  if (!playlistid) {
    throw new Error("Invalid playlist URL")
  }

    const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/playlists?part=contentDetails&part=snippet&id=${playlistid}&key=${process.env.API_KEY}`
    );

    const playlist = response.data.items[0];

    const title = playlist.snippet.title;
    const description = playlist.snippet.description;
    const videoCount = playlist.contentDetails.itemCount;
    const playlistId = playlist.id;

    const courseinfo = await prisma.course.upsert({
        where : {playlistId},
        update : {},
        create : {
            title : title,
            description : description,
            videoCount : videoCount,
            playlistId : playlistId
        }
    })

    return courseinfo;
    
}