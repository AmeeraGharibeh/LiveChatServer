const mongoose = require("mongoose");

const StopSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    room_id: {
      type: String,
    },
    is_mic_stopped: {
      type: Boolean,
    },
    is_cam_stopped: {
      type: Boolean,
    },
    is_msg_stopped: {
      type: Boolean,
    },
    is_private_stopped: {
      type: Boolean,
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
