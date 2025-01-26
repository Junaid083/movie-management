import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Movie } from "@/models/Movie";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string }> }
) {
  try {
    const { movieId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, publishingYear, poster } = await request.json();

    await connectToDatabase();
    const oldMovie = await Movie.findOne({
      _id: movieId,
      userId: session.user.id,
    });

    if (!oldMovie) {
      return new NextResponse("Movie not found", { status: 404 });
    }

    // Delete old poster from S3 if it's different from the new one
    if (oldMovie.poster && oldMovie.poster !== poster) {
      const oldPosterKey = oldMovie.poster.split("/").pop();
      if (oldPosterKey) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: oldPosterKey,
        });
        await s3Client.send(deleteCommand);
      }
    }

    const movie = await Movie.findOneAndUpdate(
      { _id: movieId, userId: session.user.id },
      { title, publishingYear, poster },
      { new: true }
    );

    return NextResponse.json(movie);
  } catch (error) {
    console.error("[MOVIE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string }> }
) {
  try {
    const { movieId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const movie = await Movie.findOneAndDelete({
      _id: movieId,
      userId: session.user.id,
    });

    if (!movie) {
      return new NextResponse("Movie not found", { status: 404 });
    }

    // Delete poster from S3
    if (movie.poster) {
      const posterKey = movie.poster.split("/").pop();
      if (posterKey) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: posterKey,
        });
        await s3Client.send(deleteCommand);
      }
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("[MOVIE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
