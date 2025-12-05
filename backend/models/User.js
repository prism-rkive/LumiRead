import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
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
