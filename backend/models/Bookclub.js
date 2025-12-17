import mongoose from "mongoose";

const bookClubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Users who are members of the club
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    // Users who are invited but not yet joined
    invitedMembers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    // Club profile photo
    avatar: { type: String, default: "" },

    // Club description
    description: { type: String, default: "" },

    // Privacy: public or private
    privacy: { type: String, enum: ["public", "private"], default: "public" },

    // Posts in the club
    posts: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("BookClub", bookClubSchema);
