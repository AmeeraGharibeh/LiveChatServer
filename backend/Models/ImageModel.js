const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    default: "-",
  },

  comments: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Image", ImageSchema);
