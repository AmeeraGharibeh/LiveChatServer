const mongoose = require("mongoose");

const BlockedSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    room_id: {
      type: String,
    },
    is_ip_blocked: {
      type: Boolean,
    },
    is_device_blocked: {
      type: Boolean,
    },
    master: {
      type: String,
      required: true,
    },
    location: {
      type: String,
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
    date: {
      type: String,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Blocked", BlockedSchema);
