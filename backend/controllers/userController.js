import User from "../models/User.js";

// GET /api/user/me
export const getUserProfile = async (req, res) => {
  // In a real app, you'd use req.user.id from auth middleware.
  // For now, we fetch the first user to simulate a logged-in user.
  const user = await User.findOne().select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found. Please seed the database.");
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    readingGoals: user.readingGoals, // Matches what HomePage expects
  });
};
