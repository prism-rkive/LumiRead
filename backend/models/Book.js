import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    author: { type: String, required: true }, // Added author for realism
    progress: { type: Number, default: 0 }, // Percentage or current page
    pages: { type: Number, default: 0 }, // Total pages
    status: {
      type: String,
      enum: ["current", "completed", "to-read"],
      default: "current",
    }, // Added status
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
