// controllers/clubpostController.js
import ClubPost from "../models/ClubPost.js";
import BookClub from "../models/Bookclub.js";
import fs from "fs";

// =====================
// CREATE CLUB POST
// =====================
export const createClubPost = async (req, res) => {
  try {
    const { content, tags } = req.body;

    const post = await ClubPost.create({
      club: req.params.clubId,
      user: req.user._id,
      content,
      tags: tags ? tags.split(",") : [],
      media: {
        image: req.file ? `/${req.file.path}` : null,
      },
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// GET ALL POSTS OF A CLUB
// =====================
export const getClubPosts = async (req, res) => {
  const { clubId } = req.params;

  try {
    const posts = await ClubPost.find({ club: clubId })
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar")
      .populate("comments.replies.user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// LIKE / UNLIKE POST
// =====================
export const likePost = async (req, res) => {
  try {
    const post = await ClubPost.findById(req.params.postId);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post.likes.length);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// ADD COMMENT
// =====================
export const addComment = async (req, res) => {
  try {
    const post = await ClubPost.findById(req.params.postId);
    post.comments.push({ user: req.user._id, text: req.body.text });
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// ADD REPLY
// =====================
export const addReply = async (req, res) => {
  try {
    const post = await ClubPost.findById(req.params.postId);
    const comment = post.comments.id(req.params.commentId);

    comment.replies.push({ user: req.user._id, text: req.body.text });
    await post.save();

    res.json(comment.replies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// DELETE CLUB POST
// =====================
export const deleteClubPost = async (req, res) => {
  try {
    const post = await ClubPost.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (post.media?.image) {
      const imagePath = post.media.image.replace("/", "");
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Remove post reference from club
    await BookClub.findByIdAndUpdate(post.club, { $pull: { posts: post._id } });

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// HOMEPAGE FEED: GET USER'S CLUB POSTS (short preview)
// =====================
export const getUserClubsFeed = async (req, res) => {
  try {
    // 1️⃣ Get all clubs the user is a member of
    const clubs = await BookClub.find({ members: req.user._id }).select(
      "_id name"
    );

    const clubIds = clubs.map((c) => c._id);

    if (!clubIds.length) {
      return res.json({
        status: true,
        data: [],
      });
    }

    // 2️⃣ Get latest posts from these clubs
    const posts = await ClubPost.find({ club: { $in: clubIds } })
      .populate("user", "name avatar")
      .populate("club", "name")
      .sort({ createdAt: -1 })
      .limit(5); // ✅ Changed to 5 to match your request

    // 3️⃣ Return in consistent format
    res.json({
      status: true,
      data: posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
