const mongoose = require("mongoose");

const AppImageSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    directory: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppImage", AppImageSchema);
