const mongoose = require("mongoose");

const BlockedSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    master: {
      type: String,
      required: true,
    },

    device: {
      type: String,
    },
    ip: {
      type: String,
    },

    period: {
      type: String,
      default: "forever",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Blocked", BlockedSchema);
