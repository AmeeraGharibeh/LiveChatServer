const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    sender: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User" 
        },
    content: { 
        type: String, 
        trim: true
     },
    msg_type: {
        type: String,
        default: 'text'
    },
    chat: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Chat" },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
