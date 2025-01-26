import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MovieList } from "@/components/MovieList";

export default async function MoviesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-[#093545]">
      <MovieList />
    </main>
  );
}
