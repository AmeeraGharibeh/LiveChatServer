const mongoose = require("mongoose");

const LogSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
    },
    device: {
      type: String,
    },

    location: {
      type: String,
      default: "-",
    },

    time_in: {
      type: String,
      default: "-",
    },

    time_out: {
      type: String,
      default: "-",
    },
    room_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
