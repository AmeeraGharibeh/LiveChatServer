const mongoose = require("mongoose");

const StopSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    room_id: {
      type: String,
      required: true,
    },
    stop_type: {
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
    period: {
      type: String,
      default: "forever",
    },
    end_date: {
      type: String,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Stoped", StopSchema);
