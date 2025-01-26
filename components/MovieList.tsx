"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import type { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { CreateMovieDialog } from "./CreateMovieDialog";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-[3/4] bg-[#224957] rounded-3xl overflow-hidden" />
      <div className="h-[76px] bg-[#224957] mt-2 rounded-b-3xl" />
    </div>
  );
}

export function MovieList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const moviesPerPage = 8;

  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchMovies = useCallback(async () => {
    try {
      const response = await fetch("/api/movies");
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      // Update URL with new page number
      const params = new URLSearchParams(searchParams);
      params.set("page", pageNumber.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Reset to page 1 if current page is invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      handlePageChange(1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <div className="min-h-screen bg-[#093545] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white">My Movies</h1>
            <CreateMovieDialog
              onSuccess={() => {
                fetchMovies();
                // Reset to page 1 when adding new movie
                handlePageChange(1);
              }}
            />
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 text-white hover:text-white/80 transition-colors"
          >
            Logout <LogOut className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <h2 className="text-2xl text-white mb-6">
              Your movie list is empty
            </h2>
            <CreateMovieDialog onSuccess={fetchMovies} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onDelete={fetchMovies}
                  onUpdate={fetchMovies}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
