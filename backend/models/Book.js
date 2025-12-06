import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    userId: { // Keeping this for the new architecture, but aliasing to added_by for legacy if needed
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, required: true },
    author: { type: String, required: true },
    ibn: { type: String, required: true }, // Legacy field
    language: { type: String },
    cover_img: { type: String },
    description: { type: String },
    buy_url: { type: String },
    year: { type: Number },
    genre: [{ type: String }],
    reviews: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, default: 0 },
        comment: { type: String },
        date: { type: Date, default: Date.now }
      },
    ],
    avg_rating: { type: Number, default: 0 },

    progress: { type: Number, default: 0 },
    pages: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["current", "completed", "to-read"],
      default: "to-read", // Changed default to fit typical flow
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
