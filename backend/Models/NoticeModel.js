const mongoose = require("mongoose");

const NoticeSchema = mongoose.Schema(
  {
    room_id: {
      type: String,
      required: true,
    },
    noticed_username: {
      type: String,
      required: true,
    },
    noticed_device: {
      type: String,
      required: true,
    },
    noticed_ip: {
      type: String,
      required: true,
    },
    report_date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", NoticeSchema);
