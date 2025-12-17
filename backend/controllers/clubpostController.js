import ClubPost from "../models/ClubPost.js";
import fs from "fs";
import BookClub from "../models/Bookclub.js";


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
// controllers/clubPostController.js

export const getClubPosts = async (req, res) => {
  const { clubId } = req.params;

  const posts = await ClubPost.find({ club: clubId })
    .populate("user", "name avatar")
    .populate("comments.user", "name avatar")
    .populate("comments.replies.user", "name avatar")
    .sort({ createdAt: -1 });

  res.json(posts);
};

export const likePost = async (req, res) => {
  const post = await ClubPost.findById(req.params.postId);
  const userId = req.user._id;

  if (post.likes.includes(userId)) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  res.json(post.likes.length);
};

export const addComment = async (req, res) => {
  const post = await ClubPost.findById(req.params.postId);
  post.comments.push({ user: req.user._id, text: req.body.text });
  await post.save();
  res.json(post.comments);
};

export const addReply = async (req, res) => {
  const post = await ClubPost.findById(req.params.postId);
  const comment = post.comments.id(req.params.commentId);

  comment.replies.push({ user: req.user._id, text: req.body.text });
  await post.save();

  res.json(comment.replies);
};

/* ================= DELETE POST ================= */
export const deleteClubPost = async (req, res) => {
  try {
    const post = await ClubPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (post.media?.image) {
      const imagePath = post.media.image.replace("/", "");
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // 🧹 Remove post reference from club
    await BookClub.findByIdAndUpdate(post.club, {
      $pull: { posts: post._id },
    });

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
