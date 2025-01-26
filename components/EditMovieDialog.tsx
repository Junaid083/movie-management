"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, ArrowDown, X } from "lucide-react";
import { toast } from "sonner";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EditMovieDialogProps {
  movie: Movie;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function EditMovieDialog({
  movie,
  onSuccess,
  trigger,
}: EditMovieDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(movie.title);
  const [publishingYear, setPublishingYear] = useState(
    String(movie.publishingYear)
  );
  const [poster, setPoster] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(movie.poster);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPoster(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPoster(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let posterUrl = movie.poster;
      if (poster) {
        const formData = new FormData();
        formData.append("file", poster);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        if (!uploadData.success) throw new Error("Failed to upload image");
        posterUrl = `/uploads/${uploadData.filename}`;
      }

      const response = await fetch(`/api/movies/${movie._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          publishingYear: Number.parseInt(publishingYear),
          poster: posterUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to update movie");

      toast.success("Movie updated successfully");
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Failed to update movie");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 bg-white/10 hover:bg-white/20 rounded-full"
          >
            <Pencil className="h-3.5 w-3.5 text-white" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[1000px] p-0 bg-[#093545] border-none rounded-3xl overflow-hidden">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-4xl font-semibold text-white">
            Edit movie
          </DialogTitle>
        </DialogHeader>

        <div className="relative p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div
              className={cn(
                "relative aspect-[3/4] rounded-2xl border-2 border-dashed border-white/20",
                "flex flex-col items-center justify-center gap-4",
                "hover:border-white/40 transition-colors cursor-pointer group"
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
            >
              {previewUrl ? (
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Image
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">Change image</p>
                  </div>
                </div>
              ) : (
                <>
                  <ArrowDown className="w-8 h-8 text-white/60" />
                  <p className="text-white/60 text-base">Drop image here</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-white/80 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter movie title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-12 px-4 bg-[#224957] text-white rounded-lg placeholder:text-white/60 border-none focus:ring-2 focus:ring-[#20df7f] transition-all"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-white/80 mb-1"
                >
                  Publishing year
                </label>
                <input
                  id="year"
                  type="number"
                  placeholder="Enter publishing year"
                  value={publishingYear}
                  onChange={(e) => setPublishingYear(e.target.value)}
                  className="w-full h-12 px-4 bg-[#224957] text-white rounded-lg placeholder:text-white/60 border-none focus:ring-2 focus:ring-[#20df7f] transition-all"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 text-black border-white/20 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#20df7f] text-black hover:bg-[#20df7f]/90 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
