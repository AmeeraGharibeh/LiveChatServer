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

///////////////////////////////////////////////////////////

const http = require("http");
const socketIo = require("socket.io");
const { time } = require("./Config/Helpers/time_helper");
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

io.on("connection", async (socket) => {
  console.log("A user connected");
  const ip = socket.handshake.query.ip;
  const device = socket.handshake.query.device;
  const location = socket.handshake.query.location;

  // room joins to socket
  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.room = room;
    console.log(`User joined room: ${room}`);
  });
  // user joins the room
  socket.on("addUser", async (user) => {
    socket.join(user._id);
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
    console.log(onlineUsers[user.room_id]);

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

  // Handle chat events
  socket.on("message", (data) => {
    console.log(
      "Received message:",
      data["message"] + "from: " + data["sender"]
    );

    // Broadcast the message to all connected clients in room
    io.to(data.room_id).emit("message", data);
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
  socket.on("userStatus", (data) => {
    // Update the user's status in the onlineUsers list
    if (onlineUsers[data.room_id] && socket.id) {
      onlineUsers[data.room_id].forEach((user) => {
        if (user.id === socket.id) {
          user.user.state = data.status;
        }
      });

      // Emit updated online users list to all users in the room
      io.to(data.room_id).emit("onlineUsers", [
        ...new Set(onlineUsers[data.room_id]),
      ]);
    }
  });
  // Handle audio streaming

  // Store the socket reference for this client
  clients[socket.id] = socket;

  // Signaling: When a client wants to make a call
  socket.on("offer", (data) => {
    const { targetSocketId, offer } = data;
    const targetSocket = clients[targetSocketId];

    if (targetSocket) {
      // Send the offer to the target client
      targetSocket.emit("offer", { sourceSocketId: socket.id, offer });
      console.log("offer sended from server");
    } else {
      // Handle the case when the target client is not found
      socket.emit("error", "Target client not found");
    }
  });

  // Signaling: When a client answers a call
  socket.on("answer", (data) => {
    const { sourceSocketId, answer } = data;
    const sourceSocket = clients[sourceSocketId];

    if (sourceSocket) {
      // Send the answer to the source client
      sourceSocket.emit("answer", { targetSocketId: socket.id, answer });
      console.log("answer sended from server");
    } else {
      // Handle the case when the source client is not found
      socket.emit("error", "Source client not found");
    }
  });

  // Signaling: ICE candidate exchange
  socket.on("ice-candidate", (data) => {
    const { targetSocketId, iceCandidate } = data;
    const targetSocket = clients[targetSocketId];

    if (targetSocket) {
      // Send the ICE candidate to the target client
      targetSocket.emit("ice-candidate", {
        sourceSocketId: socket.id,
        iceCandidate,
      });
    }
  });

  // Handle disconnection event

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

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
