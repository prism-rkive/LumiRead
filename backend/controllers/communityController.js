import Post from "../models/Post.js";
import mongoose from "mongoose";

// GET /api/community/feed
export const getCommunityFeed = async (req, res) => {
  // Fetch posts and populate the user details needed by the frontend (name, avatar)
  const feed = await Post.find()
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 }) // Sort by most recent
    .limit(10); // Limit results for efficiency

  // Format the feed to match the structure the frontend expects: {id, user, action, time, type}
  // The frontend component expects a simpler object, so we'll map the database result:
  const formattedFeed = feed.map((item) => ({
    id: item._id,
    user: item.userId?.name || "Anonymous", // Use user's name
    action: item.content, // Use the post content as the action for simplicity
    time: item.createdAt.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      month: "short",
    }),
    type: item.type || "comment",
    avatar: item.userId?.avatar,
  }));

  res.json(formattedFeed);
};
