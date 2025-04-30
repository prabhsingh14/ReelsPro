import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDatabase();
        const videos = await Video.find({}).sort({createdAt: -1}).lean();

        if (!videos || videos.length === 0) {
            return NextResponse.json([], {status: 200});
        }

        return NextResponse.json(videos, {status: 200});
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({message: "Failed to fetch videos"}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = getServerSession(authOptions);

        if(!session){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        await connectToDatabase();
        
        const body:IVideo = await request.json();
        if(!body.title || !body.description || !body.videoUrl || body.thumbnailUrl){
            return NextResponse.json({message: "Missing required fields"}, {status: 400});
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo, {status: 201});
    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({message: "Failed to create video"}, {status: 500});
    }
}