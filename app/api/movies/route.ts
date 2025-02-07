import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Movie } from "@/models/Movie";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.A_REGION,
  credentials: {
    accessKeyId: process.env.A_ACCESS_KEY_ID!,
    secretAccessKey: process.env.A_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, publishingYear, poster } = await req.json();

    await connectToDatabase();
    const movie = await Movie.create({
      title,
      publishingYear,
      poster,
      userId: session.user.id,
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error("[MOVIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const movies = await Movie.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ movies });
  } catch (error) {
    console.error("[MOVIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
