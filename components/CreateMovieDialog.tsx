"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ArrowDown, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface CreateMovieDialogProps {
  onSuccess: () => void;
}

interface FormData {
  title: string;
  publishingYear: string;
  poster: File | null;
  previewUrl: string;
}

const initialFormData: FormData = {
  title: "",
  publishingYear: "",
  poster: null,
  previewUrl: "",
};

export function CreateMovieDialog({ onSuccess }: CreateMovieDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, files } = e.target;
      if (name === "poster" && files && files[0]) {
        setFormData((prev) => ({
          ...prev,
          poster: files[0],
          previewUrl: URL.createObjectURL(files[0]),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,
        poster: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.poster) {
        toast.error("Please upload an image");
        return;
      }
      setIsLoading(true);

      try {
        const data = new FormData();
        data.append("file", formData.poster);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
        const uploadData = await uploadResponse.json();
        if (!uploadData.success) throw new Error("Failed to upload image");

        const response = await fetch("/api/movies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            publishingYear: Number.parseInt(formData.publishingYear),
            poster: `/uploads/${uploadData.filename}`,
          }),
        });

        if (!response.ok) throw new Error("Failed to create movie");

        toast.success("Movie created successfully");
        setOpen(false);
        onSuccess();
        setFormData(initialFormData);
      } catch (error) {
        console.error("Error creating movie:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to create movie"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onSuccess]
  );

  const inputFields = useMemo(
    () => [
      {
        id: "title",
        name: "title",
        type: "text",
        placeholder: "Enter movie title",
        label: "Title",
      },
      {
        id: "year",
        name: "publishingYear",
        type: "number",
        placeholder: "Enter publishing year",
        label: "Publishing year",
      },
    ],
    []
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-12 h-12 rounded-full bg-[#20df7f] text-white hover:bg-[#20df7f]/90 p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[90%] xl:max-w-[1000px] p-0 bg-[#093545] border-none rounded-lg overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-semibold text-white">
            Create a new movie
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="lg:flex lg:gap-6">
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <div
                className={cn(
                  "relative w-full aspect-video lg:aspect-[3/4] rounded-lg border-2 border-dashed border-white/20",
                  "flex flex-col items-center justify-center gap-4",
                  "hover:border-white/40 transition-colors cursor-pointer group"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
              >
                {formData.previewUrl ? (
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <Image
                      src={formData.previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 425px) 100vw, (max-width: 1000px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm">Change image</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ArrowDown className="w-8 h-8 text-white/60" />
                    <p className="text-white/60 text-base text-center px-4">
                      Drop an image here or click to upload
                    </p>
                  </>
                )}
                <input
                  type="file"
                  name="poster"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:w-1/2 space-y-6">
              {inputFields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-white/80 mb-1"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof FormData] as string}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-[#224957] text-white rounded-lg placeholder:text-white/60 border-none focus:ring-2 focus:ring-[#20df7f] transition-all"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-4 pt-4">
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
                  {isLoading ? "Creating..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
