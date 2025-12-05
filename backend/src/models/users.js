const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users = new Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    books: {
      added: [{ type: Schema.Types.ObjectId, ref: "books" }],
      liked: [{ type: Schema.Types.ObjectId, ref: "books" }],
      reviewed: [
        {
          book: { type: Schema.Types.ObjectId, ref: "books" },
          review: { type: Schema.Types.ObjectId },
        },
      ],
    },
    genre: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", users);