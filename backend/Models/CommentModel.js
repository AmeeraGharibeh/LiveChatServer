const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  from_id: {
    type: String,
    required: true,
  },
  post_id: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    default: "-",
  },

  comment: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
