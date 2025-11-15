
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const books = new Schema(
  {
    title: { type: String, required: true },
    ibn: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    language: { type: String, required: true },
    cover_img: { type: String },
    description: { type: String },
    buy_url: { type: String },
    year: { type: Number },
    genre: [{ type: String }],
    reviews: [
      {
        user_id: { type: Schema.Types.ObjectId, ref: "users" },
        rating: { type: Number, default: 0 },
        comment: { type: String },
        upvotes: [{ type: Schema.Types.ObjectId, ref: "users" }],
        downvotes: [{ type: Schema.Types.ObjectId, ref: "users" }],
        res_upvotes: { type: Number, default: 0 },
        name: { type: String },
        avatar: { type: String },
        date: Date,
      },
    ],
    avg_rating: { type: Number, required: true, default: 0 },
    added_by: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("books", books);