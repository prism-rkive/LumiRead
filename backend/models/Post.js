import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["review", "progress", "comment"],
      required: true,
    }, // Added type for styling in frontend
    // bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Optional: Link to a specific book
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
