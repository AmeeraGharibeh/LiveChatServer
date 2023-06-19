const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
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
    isPrivateChat: { type: Boolean, default: false },
    users: [{ 
      type: mongoose.Schema.Types.ObjectId,
       ref: "User" 
      }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
