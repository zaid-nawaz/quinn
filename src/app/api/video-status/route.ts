import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req : NextRequest){
  
    const { videoid } = await req.json();

    const video : any = await prisma.video.findUnique({
      where : {
        videoid : videoid
      }
    })

    if(video.status === "PROCESSING"){
      return NextResponse.json({status : "PROCESSING"})
    }

    const questions : any = await prisma.question.findMany({
      where : {
        videoId : videoid
      }
    })

    return NextResponse.json({
      status : "COMPLETED",
      questions : questions
    })
}