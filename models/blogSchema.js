const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  dateCreated: Date,
  likes: Number,
  comments: [commentSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});


module.exports = mongoose.model("Blog", blogSchema);
