import mongoose from "mongoose"

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    publishingYear: {
      type: Number,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema)

