import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Keeping email as a standard field
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    number: { type: String }, // From legacy schema
    avatar: { type: String, default: "" },
    // Legacy fields for compatibility
    books: {
      added: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
      liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
      reviewed: [
        {
          book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
          review: { type: mongoose.Schema.Types.ObjectId },
        },
      ],
    },
    genre: [{ type: String }],
    // Example for frontend stat display:
    readingGoals: {
      year: { type: Number, default: 5 },
      completed: { type: Number, default: 0 },
      pagesRead: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
