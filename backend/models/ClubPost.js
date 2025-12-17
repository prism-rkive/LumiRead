// models/clubPostModel.js
import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    replies: [replySchema],
  },
  { timestamps: true }
);

const clubPostSchema = new mongoose.Schema(
  {
    club: { type: mongoose.Schema.Types.ObjectId, ref: "BookClub", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    content: { type: String, required: true },
    tags: [{ type: String }],

    media: {
      image: String, // stores file PATH or URL
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("ClubPost", clubPostSchema);
