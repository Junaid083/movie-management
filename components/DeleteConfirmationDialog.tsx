"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
  movieId: string;
  movieTitle: string;
  onDelete: () => void;
  trigger?: any;
}

export function DeleteConfirmationDialog({
  movieId,
  movieTitle,
  onDelete,
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete movie");

      toast.success("Movie deleted successfully");
      setIsOpen(false);
      onDelete();
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-[#ff6b6b] text-white hover:bg-[#ff6b6b]/90 rounded-full"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#093545] border-[#092c39] text-white">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-[#ff6b6b]" />
          </div>
          <DialogTitle className="text-xl text-center">
            Delete movie
          </DialogTitle>
          <DialogDescription className="text-white/80 text-center">
            Are you sure you want to delete "{movieTitle}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-white/20 text-black hover:bg-white/10 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-[#ff6b6b] hover:bg-[#ff6b6b]/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
