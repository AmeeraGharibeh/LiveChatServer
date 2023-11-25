const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRoutes");
const UserRouter = require("./Routes/UsersRoutes");
const CountryRouter = require("./Routes/CountryRoutes");
const RoomsRouter = require("./Routes/RoomRoutes");
const ChatRouter = require("./Routes/ChatRoutes");
const UploadRouter = require("./Routes/UploadRoutes");
const ReportsRouter = require("./Routes/ReportsRoutes");
const BlockedRouter = require("./Routes/BlockedRoutes");
const LogsRouter = require("./Routes/LogRoutes");
const Logs = require("./Models/LogModel");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const socketIo = require("socket.io");
const { time } = require("./Config/Helpers/time_helper");
const { generateToken } = require("./Config/Helpers/generate_agora_token");
const Stopped = require("./Models/StopModel");
const { checkStoppedUsers } = require("./Routes/StopCheck");

///////////////////////////////////////////////////////////

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    transports: ["websocket"],
    origin: "https://syriachatserver.onrender.com/",
    methods: ["GET", "POST"],
  },
});
dotenv.config();

///////////////////////////////////////////////////////////
/*app.use(cors(
  {
  origin: ['https://vercel.com/ameeragharibeh/live-chat-server/'],
    methods: ['POST', 'GET'],
    creditntials: true
  }
  ));*/
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

///////////////////////////////////////////////////////////
//------------------SOCKET------------------------------//
const onlineUsers = {};
const clients = {};
let log;
const speakersQueue = [];
const ignoredUsers = new Set();
const stoppedUsers = [];

io.on("connection", async (socket) => {
  console.log("A user connected");
  const ip = socket.handshake.query.ip;
  const device = socket.handshake.query.device;
  const location = socket.handshake.query.location;

  const sessionId = uuidv4();

  // Close the previous socket connection, if it exists
  if (clients[sessionId]) {
    clients[sessionId].disconnect(true); // Close the previous connection forcefully
  }

  // Create a new socket session for the user
  clients[sessionId] = socket;
  // room joins to socket
  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.room = room;
    console.log(`User joined room: ${room}`);
  });
  // user joins the room
  socket.on("addUser", async (user) => {
    socket.userId = user._id;
    socket.emit("connected");

    // send notification of user's joining the room
    socket.broadcast.to(user.room_id).emit("notification", {
      sender: user.username,
      senderId: user._id,
      message: user.username + " انضمّ إلى الغرفة",
      color: 0xffc7f9cc,
      type: "notification",
    });

    // update online users list and sent it to the room
    if (!onlineUsers[user.room_id]) {
      onlineUsers[user.room_id] = [];
    }

    if (!onlineUsers[user.room_id].includes(socket.id)) {
      onlineUsers[user.room_id].push({ id: socket.id, user });
      io.to(user.room_id).emit("onlineUsers", [
        ...new Set(onlineUsers[user.room_id]),
      ]);
    }
    const isStopped = await checkStoppedUsers(user["device"]);
    if (isStopped) {
      console.log("finded" + isStopped);
      stoppedUsers.push({
        device: isStopped.device,
        stop_type: isStopped.stop_type,
        period: isStopped.period,
      });
      updateOnlineUsersList(
        user.room_id,
        socket.id,
        "stop_type",
        isStopped.stop_type
      );
    } else {
      if (stoppedUsers[user["device"]]) {
        stoppedUsers.delete(user["device"]);
        updateOnlineUsersList(user.room_id, socket.id, "stop_type", "none");
      }
      console.log(stoppedUsers);
    }

    // update room's log on db
    const newLog = new Logs({
      room_id: user.room_id,
      username: user.username,
      user_id: user._id,
      ip,
      device,
      location,
      time_in: time(),
      icon: user.icon,
    });
    log = await newLog.save();
  });

  socket.on("leaveRoom", async (user) => {
    socket.leave(user.room_id);
    //filter the list to remove left user
    if (onlineUsers[user.room_id]) {
      onlineUsers[user.room_id] = onlineUsers[user.room_id].filter(
        (user) => user.id !== socket.id
      );
      console.log("user removed");
    }
    console.log(user.username + ` left room`);

    // Emit the updated online users list to all users in the room
    io.to(user.room_id).emit("onlineUsers", [
      ...new Set(onlineUsers[user.room_id]),
    ]);

    io.to(user.room_id).emit("notification", {
      sender: user.username,
      senderId: user._id,
      message: user.username + " غادر الغرفة  ",
      color: 0xfffad4d4,
      type: "notification",
    });
    //update room log on db
    await Logs.updateOne({ _id: log._id }, { time_out: time() });
    console.log("A user disconnected at " + time());
  });
  // handle update online users list
  socket.on("updateOnlineUsers", (data) => {
    if (onlineUsers[data.room_id] && socket.id) {
      onlineUsers[data.room_id].forEach((user) => {
        if (user.id === socket.id) {
          user.user = data["user"];
        }
      });

      // Emit updated online users list to all users in the room
      io.to(data.room_id).emit("onlineUsers", [
        ...new Set(onlineUsers[data.room_id]),
      ]);
    }
  });

  // send notification when master edits the room
  socket.on("updateRoom", (master) => {
    io.to(master.room_id).emit("notification", {
      sender: master.username,
      senderId: master._id,
      message: master.username + "  قام بتغيير اعدادات الغرفة  ",
      color: 0xfffce9f1,
      type: "notification",
    });
  });

  // send notification when your profile has been visited
  socket.on("profileVisit", (visitor) => {
    io.to(socket.id).emit("notification", {
      sender: visitor.username,
      senderId: visitor._id,
      message: visitor.username + "  قام بزيارة ملفك الشخصي  ",
      color: 0xffffeebb,
      type: "notification",
    });
  });

  // Handle chat events
  socket.on("message", (data) => {
    const stoppedUser = stoppedUsers.find(
      (obj) => obj.device === data["device"]
    );

    if (stoppedUser) {
      if (
        stoppedUser.stop_type == "is_msg_stopped" ||
        stoppedUser.stop_type == "stop_all"
      ) {
        io.to(data["senderSocket"]).emit("notification", {
          sender: "system",
          senderId: "system",
          message: "تم ايقافك عن ارسال الرسائل",
          color: 0xfffce9f1,
          type: "notification",
        });
      } else {
        io.to(data.room_id).emit("message", data);
      }
    } else {
      io.to(data.room_id).emit("message", data);
    }
  });

  // Handle send images
  socket.on("sendImage", (data) => {
    const img = data.img;
    const sender = data.sender;
    const senderId = data.senderId;
    const room_id = data.room_id;
    const time = data.time;
    const type = data.type;

    // Get the image bytes from the data object.

    const imageBuffer = Buffer.from(img, "base64");
    const filename = Date.now() + ".jpg";

    // Save the image to disk
    fs.writeFile(filename, imageBuffer, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      // Notify the client that the image has been saved.
      io.to(room_id).emit("imageSaved", {
        message: imageBuffer.toString(),
        sender,
        senderId,
        type,
        time,
      });
    });
  });
  // Handle private messages
  const activeConversations = {};

  socket.on("sendPrivateMessage", (data) => {
    const friendId = data.friendId;
    const username = data.sender;
    const senderId = data.senderId;
    const message = data.message;
    const friendName = data.friendName;
    if (
      stoppedUsers.some(
        (obj) =>
          (obj.device === data["device"] &&
            obj.stop_type === "is_private_stopped") ||
          obj.stop_type === "stop_all"
      )
    ) {
      io.to(data["senderSocket"]).emit("notification", {
        sender: "system",
        senderId: "system",
        message: "تم ايقافك عن ارسال الرسائل الخاصة",
        color: 0xfffce9f1,
        type: "notification",
      });
    } else {
      // Generate a unique threadId based on the combination of senderId and friendId
      const threadId = [senderId, friendId].sort().join("_");
      console.log("thread is " + threadId);
      // Send the private message to the recipient socket
      if (!activeConversations[threadId]) {
        activeConversations[threadId] = [friendId, socket.id];
      } else if (!activeConversations[threadId].includes(friendId)) {
        activeConversations[threadId].push(friendId);
      }

      activeConversations[threadId].forEach((socketId) => {
        io.to(socketId).emit("privateMessage", {
          threadId: threadId,
          between: [
            { sender: username, id: senderId },
            { sender: friendName, id: friendId },
          ],
          message: message,
          senderId: senderId,
          sender: username,
        });
      });

      console.log(`${message} sent from ${username} to ${friendId}`);
    }
  });

  // Handle reading the message
  socket.on("messageReceived", (data) => {
    const threadId = data.threadId;
    io.to(socket.id).emit("messageUnread", { threadId: threadId });
  });

  socket.on("messageActive", (data) => {
    const threadId = data.threadId;
    // Check if the conversation exists
    // if (activeConversations[threadId]) {
    //   activeConversations[threadId].participants.forEach((socketId) => {
    //   });
    // }
    io.to(socket.id).emit("messageRead", { threadId: threadId });
  });

  // handle delete text

  socket.on("deleteAllMessages", (data) => {
    const roomId = data["roomId"];
    io.to(roomId).emit("deleteMessages");
  });
  // Handle user kick
  socket.on("kickUser", async (data) => {
    const room_id = data.room_id;
    const user_socket = data.user_socket;
    const master = data.master;
    const master_id = data.master_id;
    const username = data.username;

    // Remove the user from onlineUsers
    if (onlineUsers[room_id]) {
      onlineUsers[room_id] = onlineUsers[room_id].filter(
        (user) => user.id !== user_socket
      );
      console.log("user removed");
    }

    // Emit the updated online users list to all users in the room
    io.to(room_id).emit("onlineUsers", [...new Set(onlineUsers[room_id])]);

    // Emit a notification to the room
    io.to(room_id).emit("notification", {
      sender: master,
      senderId: master_id,
      message: `${username} تم طرد`,
      color: 0xfffaa2a2,
      type: "notification",
    });

    io.to(user_socket).emit("logout", { msg: "تم طردك من الغرفة" });
  });

  // Handle ignore user

  socket.on("ignoreUser", (data) => {
    if (ignoredUsers.has(data["ignoredId"])) {
      ignoredUsers.delete(data["ignoredId"]);
      console.log(`User ${data["ignoredId"]} is no longer ignored.`);
      updateOnlineUsersAfterIgnore(
        data["roomId"],
        data["ignoredId"],
        socket.id,
        "is_ignored",
        "false"
      );
    } else {
      ignoredUsers.add(data["ignoredId"]);
      console.log(`User ${data["ignoredId"]} is now ignored.`);
      updateOnlineUsersAfterIgnore(
        data["roomId"],
        data["ignoredId"],
        socket.id,
        "is_ignored",
        "true"
      );
    }
    socket.emit("ignoredUsers", [...new Set(ignoredUsers)]);
  });

  // Handle Updata online users list
  socket.on("updateUsersList", (data) => {
    updateOnlineUsersList(data.room_id, socket.id, data.field, data.value);
  });

  // Handle stop user
  socket.on("stopUser", async (data) => {
    try {
      const deviceId = data["device"];
      const stoppedData = {
        username: data.username,
        master: data.master,
        period: data.period,
        device: data.device,
        room_id: data.room_id,
        end_date: data.stop_until,
        stop_type: data.stop_type,
      };
      const existingStopped = await Stopped.findOne({ device: deviceId });

      let stopped;

      if (existingStopped) {
        stopped = await Stopped.findByIdAndUpdate(
          existingStopped._id,
          stoppedData,
          { new: true, upsert: true }
        );
      } else {
        stopped = new Stopped(stoppedData);
        await stopped.save();
      }
      updateOnlineUsersList(
        data.room_id,
        data.socket,
        "stop_type",
        data.stop_type
      );
      stoppedUsers.push({
        device: data.device,
        stop_type: data.stop_type,
        period: data.period,
      });

      io.to(data.room_id).emit("notification", {
        sender: data["master"],
        senderId: data["master_id"],
        message: data["master"] + " قام بإيقاف العضو: " + data["username"],
        color: 0xfffce9f1,
        type: "notification",
      });
    } catch (error) {
      console.error("Error in stopUser event:", error.message);
      // Handle the error as needed, e.g., emit an error event or log it
      socket.emit("stopUserError", {
        message: "An error occurred while stopping the user.",
      });
    }
  });

  socket.on("unStopUser", async (data) => {
    const deviceId = data["device"];
    const existingStopped = await Stopped.findOne({ device: deviceId });

    if (existingStopped) {
      await Stopped.findByIdAndDelete(existingStopped._id);
      if (stoppedUsers[data["device"]]) {
        stoppedUsers.delete(data["device"]);
      }
      updateOnlineUsersList(data.room_id, data.socket, "stop_type", "none");
      io.to(existingStopped.room_id).emit("notification", {
        sender: data["master"],
        senderId: data["master_id"],
        message:
          data["master"] + " قام بإلغاء إيقاف العضو: " + data["username"],
        color: 0xfffce9f1,
        type: "notification",
      });
    } else {
      console.log("User is not blocked");
    }
  });

  // Handle audio streaming

  socket.on("streamRequested", (data) => {
    const userId = data["userId"];
    const channelName = data["channelName"];
    const streamer = data["streamer_name"];

    if (
      stoppedUsers.some(
        (obj) =>
          (obj.device === data["device"] &&
            obj.stop_type === "is_mic_stopped") ||
          obj.stop_type === "stop_all"
      )
    ) {
      io.to(data["senderSocket"]).emit("notification", {
        sender: "system",
        senderId: "system",
        message: "تم ايقافك عن المايك",
        color: 0xfffce9f1,
        type: "notification",
      });
    } else {
      speakersQueue.push({
        userId: userId,
        socketId: socket.id,
        channelName: channelName,
        streamer_name: streamer,
        count: speakersQueue.length + 1,
      });
      if (speakersQueue.length === 1) {
        startStreaming(speakersQueue[0]);
      } else {
        updateOnlineUsersList(channelName, socket.id, "mic_status", "mic_wait");
      }
      io.to(channelName).emit("speakersQueue", speakersQueue);
    }
  });

  socket.on("stopAudioStream", (data) => {
    speakersQueue.shift();
    updateOnlineUsersList(data.channelName, socket, "mic_status", "none");

    if (speakersQueue.length > 0) {
      startStreaming(speakersQueue[0]);
    } else {
      socket.emit("endStreaming");
      onlineUsers[data.channelName].forEach((user) => {
        user.user["audio_status"] = "none f";
      });
    }
  });
  // Handle video streaming

  socket.on("videoStreamRequested", (data) => {
    if (
      stoppedUsers.some(
        (obj) =>
          (obj.device === data["device"] &&
            obj.stop_type === "is_cam_stopped") ||
          obj.stop_type === "stop_all"
      )
    ) {
      io.to(data["senderSocket"]).emit("notification", {
        sender: "system",
        senderId: "system",
        message: "تم ايقافك عن الكاميرا",
        color: 0xfffce9f1,
        type: "notification",
      });
    } else {
      startVideoStreaming(data, socket);
    }
  });

  socket.on("stopVideoStream", (data) => {
    socket.emit("endVideoStreaming");
  });

  socket.on("camViewRequest", (data) => {
    const requesterId = data["userId"];
    const requesterName = data["username"];
    const streamerSocket = data["socketId"];
    io.to(streamerSocket).emit("camViewRequest", {
      requesterId,
      requesterName,
    });
  });

  socket.on("camViewAccept", (data) => {
    const viewerSocket = data.socketId;
    console.log("accepted");
    io.to(viewerSocket).emit("camViewAccepted", {});
  });
  socket.on("camViewReject", (data) => {
    const viewerSocket = data.socketId;
    console.log("rejected");

    io.to(viewerSocket).emit("camViewRejected", {});
  });
  // Handle disconnection event

  socket.on("disconnect", () => {
    delete clients[sessionId];
    console.log("disconnect");
  });
});

function startStreaming(data) {
  const userId = data["userId"];
  const channelName = data["channelName"];
  const streamer = data["streamer_name"];
  const socketId = data["socketId"];

  const token = generateToken(channelName);
  io.to(channelName).emit("startAudioStream", {
    streamToken: token,
    streamerId: userId,
    streamer_name: streamer,
    streamer_socket: socketId,
    speakingTime: 50,
  });
  updateOnlineUsersList(channelName, socketId, "mic_status", "on_mic");
  if (onlineUsers[channelName]) {
    onlineUsers[channelName].forEach((user) => {
      if (user.id !== socketId) {
        user.user["audio_status"] = "unmute";
      }
    });
    io.to(channelName).emit("onlineUsers", [
      ...new Set(onlineUsers[channelName]),
    ]);
  }
}

function startVideoStreaming(data, socket) {
  const userId = data["userId"];
  const channelName = data["channelName"];

  const token = generateToken(channelName);
  io.to(channelName).emit("startVideoStream", {
    streamToken: token,
    streamerId: userId,
  });
  updateOnlineUsersList(channelName, socket.id, "cam_status", "on_cam");
}

function updateOnlineUsersList(roomId, socketId, field, val) {
  if (onlineUsers[roomId] && socketId) {
    onlineUsers[roomId].forEach((user) => {
      if (user.id === socketId) {
        user.user[field] = val;
      }
    });
    console.log("value changed in" + field + " with " + val);
    io.to(roomId).emit("onlineUsers", [...new Set(onlineUsers[roomId])]);
  }
}

function updateOnlineUsersAfterIgnore(roomId, ignoredId, socketId, field, val) {
  if (onlineUsers[roomId]) {
    onlineUsers[roomId].forEach((user) => {
      if (user.id === ignoredId) {
        user.user[field] = val;
      }
    });
    io.to(socketId).emit("onlineUsers", [...new Set(onlineUsers[roomId])]);
  }
}
///////////////////////////////////////////////////
app.use(cors());
app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/country", CountryRouter);
app.use("/rooms", RoomsRouter);
app.use("/chat", ChatRouter);
app.use("/img", UploadRouter);
app.use("/reports", ReportsRouter);
app.use("/blocked", BlockedRouter);
app.use("/logs", LogsRouter);

/////////////////////////////////////////////////////
server.listen(8002, () => {
  console.log("listening to port....");
});
