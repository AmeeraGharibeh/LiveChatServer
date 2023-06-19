
const Chat = require('../Models/ChatModel');
const socketIo = require('socket.io');

const getPrivateChat = async (req, res) => {
  const  userId  = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isPrivateChat: true,
    $and: [
      { users: { $elemMatch: { $eq: req.body.user } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      isPrivateChat: true,
      users: [req.body.user, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const getRoomChat = async (req, res) => {

};

const deleteChat = async (req, res) => {
 
   try {
         await Chat.findByIdAndDelete(req.params.id);
            res.status(200).json({msg: 'chat has been deleted.. '});

} catch (err) {
    res.status(500).send({msg: err.message});
}
};
module.exports = {getPrivateChat, getRoomChat, deleteChat}