import Image from "next/image";
import { EditMovieDialog } from "./EditMovieDialog";
import type { Movie } from "@/types/movie";
import { Trash2, Pencil } from "lucide-react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  movie: Movie;
  onDelete: () => void;
  onUpdate: () => void;
}

export function MovieCard({ movie, onDelete, onUpdate }: MovieCardProps) {
  return (
    <div className="group flex flex-col bg-[#092c39] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#0d3a4f]">
      {/* Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={movie.poster || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <EditMovieDialog
              movie={movie}
              onSuccess={onUpdate}
              trigger={
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <Pencil className="h-4 w-4 text-white" />
                </Button>
              }
            />
            <DeleteConfirmationDialog
              movieId={movie._id}
              movieTitle={movie.title}
              onDelete={onDelete}
              trigger={
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-[#ff6b6b] text-white hover:bg-[#ff6b6b]/90 rounded-full transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 border-t border-white/[0.08] transition-colors duration-300 group-hover:bg-[#0d3a4f]">
        <h3 className="text-sm sm:text-base font-medium text-white mb-1 truncate group-hover:text-[#20df7f]">
          {movie.title}
        </h3>
        <p className="text-xs sm:text-sm text-white/60 group-hover:text-white/80">
          {movie.publishingYear}
        </p>
      </div>
    </div>
  );
}
