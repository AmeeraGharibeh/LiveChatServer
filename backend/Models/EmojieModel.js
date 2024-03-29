const mongoose = require("mongoose");

const EmojieSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Emojie", EmojieSchema);
