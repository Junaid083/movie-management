import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Movie } from "@/models/Movie";

export async function PATCH(
  req: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, publishingYear, poster } = await req.json();

    await connectToDatabase();
    const movie = await Movie.findOneAndUpdate(
      { _id: params.movieId, userId: session.user.id },
      { title, publishingYear, poster },
      { new: true }
    );

    if (!movie) {
      return new NextResponse("Movie not found", { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("[MOVIE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const movie = await Movie.findOneAndDelete({
      _id: params.movieId,
      userId: session.user.id,
    });

    if (!movie) {
      return new NextResponse("Movie not found", { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("[MOVIE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
