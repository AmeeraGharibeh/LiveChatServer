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
const ImagesRouter = require("./Routes/ImagesRoutes");
const EmojieRouter = require("./Routes/EmojieRoutes");
const Logs = require("./Models/LogModel");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const socketIo = require("socket.io");
const { time } = require("./Config/Helpers/time_helper");
const Stopped = require("./Models/StopModel");
const { checkStoppedUsers } = require("./Routes/StopCheck");

///////////////////////////////////////////////////////////

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    transports: ["websocket"],
    origin: "wss://syriachatserver.onrender.com/",
    methods: ["GET", "POST"],
  },
});
dotenv.config();

///////////////////////////////////////////////////////////

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
const speakersQueue = {};
const streamData = {};
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
    console.log("room id is " + user.room_id);
    socket.userId = user._id;
    //socket.emit("connected");

    // send notification of user's joining the room
    socket.broadcast.to(user.room_id).emit("notification", {
      sender: user.username,
      senderId: user._id,
      message: user.username + " انضمّ إلى الغرفة",
      color: 0xffc7f9cc,
      type: "notification",
    });
    if (speakersQueue[user.room_id] && speakersQueue[user.room_id].length > 0) {
      io.to(socket.id).emit("audioStreamData", speakersQueue[user.room_id][0]);
      updateOnlineUsersList(user.room_id, socket.id, "audio_status", "unmute");
    }
    addToOnlineUsers(user, socket);
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
    removeFromOnlineUsers(data);

    socket.on("requestUpdateUsersList", (data) => {
      updateOnlineUsersList(
        data.room_id,
        data.socketId,
        data.field,
        data.value
      );
    });

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
      emitOnlineUsers(data);
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
    const device = data.device;
    const icon = data.icon;
    const name_type = data.name_type;
    const user_type = data.user_type;

    io.to(room_id).emit("imageSaved", {
      message: img,
      sender,
      senderId,
      type,
      time,
      device,
      icon,
      name_type,
      user_type,
    });
  });

  // Handle send Emoji
  socket.on("sendEmoji", (data) => {
    const emoji = data.emoji;
    const sender = data.sender;
    const senderId = data.senderId;
    const room_id = data.room_id;
    const time = data.time;
    const type = data.type;
    const device = data.device;
    const icon = data.icon;
    const name_type = data.name_type;
    const user_type = data.user_type;

    io.to(room_id).emit("emojiReceived", {
      message: emoji,
      sender,
      senderId,
      type,
      time,
      device,
      icon,
      name_type,
      user_type,
    });
  });

  // Handle private messages
  const activeConversations = {};

  socket.on("sendPrivateMessage", (data) => {
    const friendId = data.friendId;
    const senderId = data.senderId;

    const stoppedUser = stoppedUsers.find(
      (obj) => obj.device === data["device"]
    );

    if (stoppedUser) {
      if (
        stoppedUser.stop_type == "is_private_stopped" ||
        stoppedUser.stop_type == "stop_all"
      ) {
        io.to(data["senderSocket"]).emit("notification", {
          sender: "system",
          senderId: "system",
          message: "تم ايقافك عن ارسال الرسائل الخاصة",
          color: 0xfffce9f1,
          type: "notification",
        });
      } else {
        sendPrivateMessage(senderId, friendId);
      }
    } else {
      sendPrivateMessage(senderId, friendId);
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

  // Handle kick user out
  socket.on("kickUser", async (data) => {
    const room_id = data.room_id;
    const user_socket = data.user_socket;
    const master = data.master;
    const master_id = data.master_id;
    const username = data.username;

    removeFromOnlineUsers({
      room_id: onlineUsers[room_id],
      socket,
    });

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
  // AUDIO & VIDEO BROADCASTING
  // WEBRTC VER.

  function handleQueueChanges(roomId) {
    if (speakersQueue[roomId].length === 1) {
      startStreaming(speakersQueue[roomId][0]);
    } else if (speakersQueue[roomId].length > 1) {
      updateOnlineUsersList(roomId, socket.id, "mic_status", "mic_wait");
      io.to(roomId).emit("speakersQueue", speakersQueue[roomId]);
    }
  }

  socket.on("startBroadcast", function (room) {
    const roomId = room["roomId"];
    const userId = room["userId"];
    const streamerName = room["streamerName"];

    if (!speakersQueue[roomId]) speakersQueue[roomId] = [];

    const stoppedUser = stoppedUsers.find(
      (obj) => obj.device === room["device"]
    );
    if (
      !stoppedUser ||
      (stoppedUser &&
        stoppedUser.stop_type != "is_msg_stopped" &&
        stoppedUser.stop_type != "stop_all")
    ) {
      const userIndex = speakersQueue[roomId].findIndex(
        (user) => user.userId === userId
      );

      // User already in queue, remove completely
      if (userIndex !== -1) {
        speakersQueue[roomId].splice(userIndex, 1);
      }
      const endTime = new Date(new Date().getTime() + 60 * 1000);
      const speakingEnds = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`;
      speakersQueue[roomId].push({
        userId: userId,
        socketId: socket.id,
        roomId: roomId,
        streamer_name: streamerName,
        count: speakersQueue[roomId].length + 1,
        speakingEnds,
      });
      handleQueueChanges(roomId); // Update queue order if needed
    } else {
      io.to(roomId).emit("notification", {
        sender: "system",
        senderId: "system",
        message: "تم ايقافك عن المايك",
        color: 0xfffce9f1,
        type: "notification",
      });
    }
  });

  socket.on("joinBroadcast", function (data) {
    joinBroadcast(data, socket);
  });

  socket.on("stopAudioStream", (data) => {
    endStreaming(data);
  });
  socket.on("muteAudio", function (data) {
    const roomId = data.roomId;
    updateOnlineUsersList(roomId, socket.id, "audio_status", "mute");
  });

  socket.on("unmuteAudio", function (data) {
    const roomId = data.roomId;
    updateOnlineUsersList(roomId, socket.id, "audio_status", "unmute");
  });

  // // Admin stops a user's audio stream
  // socket.on("adminStopAudioStream", (data) => {
  //   const userIdToStop = data["userId"];
  //   const roomId = data["roomId"];
  //   const userIndex = speakersQueue[roomId].findIndex(
  //     (user) => user.userId === userIdToStop
  //   );

  //   if (userIndex !== -1) {
  //     speakersQueue[roomId].splice(userIndex, 1);
  //     updateOnlineUsersList(roomId, socket.id, "mic_status", "none");
  //     io.to(roomId).emit("speakersQueue", speakersQueue[roomId]);
  //     if (speakersQueue[roomId].length > 0) {
  //       startStreaming(speakersQueue[roomId][0]);
  //     } else {
  //       socket.emit("endStreaming");
  //       onlineUsers[roomId].forEach((user) => {
  //         user.user["audio_status"] = "none";
  //       });
  //     }
  //   } else {
  //     console.log("User not found in the speakersQueue");
  //   }
  // });

  socket.on("offer", (offer) => {
    console.log("offer event emitted " + offer);

    socket.to(offer["peerId"]).emit("offer", {
      offer,
      socket: socket.id,
      streamType: offer["streamType"],
    });
  });

  socket.on("answer", (answer) => {
    console.log("answer event emitted " + answer);
    socket.to(answer["roomId"]).emit("answer", {
      answer,
      socket: socket.id,
      socket: socket.id,
      streamType: answer["streamType"],
    });
  });

  socket.on("icecandidate", (candidate) => {
    console.log("ice candidate event emitted " + candidate);

    socket.to(candidate["peerId"]).emit("icecandidate", {
      candidate,
      socket: socket.id,
      streamType: candidate["streamType"],
    });
  });

  // Add this event to handle admin stopping a user's audio stream
  socket.on("adminStopAudioStream", (data) => {
    const userIdToStop = data["userId"];
    const roomId = data["roomId"];

    const userIndex = speakersQueue[roomId].findIndex(
      (user) => user.userId === userIdToStop
    );

    if (userIndex !== -1) {
      speakersQueue[roomId].splice(userIndex, 1);

      updateOnlineUsersList(roomId, socket.id, "mic_status", "none");
      io.to(roomId).emit("speakersQueue", speakersQueue[roomId]);

      if (speakersQueue[roomId].length > 0) {
        startStreaming(speakersQueue[roomId][0]);
      } else {
        // No users in the queue, end the streaming
        socket.emit("endStreaming");
        onlineUsers[roomId].forEach((user) => {
          user.user["audio_status"] = "none";
        });
      }
    } else {
      // User not found in the speakersQueue[roomId], handle accordingly (e.g., send an error message)
      console.log("User not found in the speakersQueue");
    }
  });
  // Add this event to handle admin granting the microphone role to a specific user
  socket.on("adminGrantMicRole", (data) => {
    // Ensure that the admin has the necessary permissions to grant the mic role

    // Add this event to handle admin granting the mic role to a specific user and revoking it from others
    socket.on("adminGrantMicToUser", (data) => {
      // Ensure that the admin has the necessary permissions to grant the mic role

      const userIdToGrantMic = data["userId"]; // The user ID to whom the admin wants to grant the mic role
      const roomId = data["roomId"];

      // Find the user in the speakersQueue[roomId] and move them to the front
      const userIndex = speakersQueue[roomId].findIndex(
        (user) => user.userId === userIdToGrantMic
      );

      if (userIndex !== -1) {
        // Move the user to the front of the speakersQueue[roomId]
        const userToGrantMic = speakersQueue[roomId].splice(userIndex, 1)[0];
        speakersQueue[roomId].unshift(userToGrantMic);

        // Update online users list and notify clients about the updated speakersQueue[roomId]
        updateOnlineUsersList(roomId, socket.id, "mic_status", "mic");
        io.to(roomId).emit("speakersQueue", speakersQueue[roomId]);

        // Start streaming for the user with the mic role
        startStreaming(speakersQueue[roomId][0]);

        // Notify all other users that their mic status is revoked
        speakersQueue[roomId].slice(1).forEach((otherUser) => {
          io.to(otherUser.socketId).emit("notification", {
            sender: "system",
            senderId: "system",
            message: "تم سحب المايك منك",
            color: 0xfffce9f1,
            type: "notification",
          });
          updateOnlineUsersList(
            roomId,
            otherUser.socketId,
            "mic_status",
            "none"
          );
        });
      } else {
        // User not found in the speakersQueue[roomId], handle accordingly (e.g., send an error message)
        console.log("User not found in the speakersQueue[roomId]");
      }
    });

    const userIdToGrantMic = data["userId"]; // The user ID to whom the admin wants to grant the mic role
    const roomId = data["roomId"];

    // Check if the user to grant the mic role is in the speakersQueue[roomId]
    const userIndex = speakersQueue[roomId].findIndex(
      (user) => user.userId === userIdToGrantMic
    );

    if (userIndex !== -1) {
      // Move the user to the front of the speakersQueue[roomId]
      const userToGrantMic = speakersQueue[roomId].splice(userIndex, 1)[0];
      speakersQueue[roomId].unshift(userToGrantMic);

      // Update online users list and notify clients about the updated speakersQueue[roomId]
      updateOnlineUsersList(roomId, socket.id, "mic_status", "mic");
      io.to(roomId).emit("speakersQueue", speakersQueue[roomId]);

      // Start streaming for the user with the mic role
      startStreaming(speakersQueue[roomId][0]);
    } else {
      // User not found in the speakersQueue[roomId], handle accordingly (e.g., send an error message)
      console.log("User not found in the speakersQueue[roomId]");
    }
  });

  // Handle video streaming

  socket.on("videoStreamRequested", (data) => {
    const stoppedUser = stoppedUsers.find(
      (obj) => obj.device === data["device"]
    );

    if (stoppedUser) {
      if (
        stoppedUser.stop_type == "is_msg_stopped" ||
        stoppedUser.stop_type == "stop_all"
      ) {
        io.to(data["socketId"]).emit("notification", {
          sender: "system",
          senderId: "system",
          message: "تم ايقافك عن الكاميرا",
          color: 0xfffce9f1,
          type: "notification",
        });
      } else {
        startVideoStreaming(data, socket);
      }
    } else {
      startVideoStreaming(data, socket);
    }
  });

  socket.on("stopVideoStream", (data) => {
    io.to(data.roomId).emit("endVideoStreaming", {
      socketId: data["socketId"],
    });
    updateOnlineUsersList(data.roomId, socket.id, "cam_status", "none");
  });

  socket.on("camViewRequest", (data) => {
    const viewerId = data["viewerSocket"];
    const requesterName = data["username"];
    const streamerSocket = data["socketId"];
    io.to(streamerSocket).emit("camViewRequest", {
      viewerId,
      requesterName,
    });
  });

  socket.on("camViewAccept", (data) => {
    const viewerSocket = data["viewerSocket"];
    const streamerSocket = data["streamerSocket"];
    console.log("accepted");
    io.to(streamerSocket).emit("camViewAccepted", {
      viewerId: viewerSocket,
      streamerSocket: streamerSocket,
      roomId: data["roomId"],
    });
    io.to(viewerSocket).emit("camJoined");
  });
  socket.on("camViewReject", (data) => {
    const viewerSocket = data["viewerSocket"];
    console.log("rejected");

    io.to(viewerSocket).emit("camViewRejected", {});
  });

  // Handle Warning
  socket.on("sendWarning", (data) => {
    io.to(data.socketId).emit("notification", {
      sender: data.admin,
      senderId: data.adminId,
      message: `قام المشرف : ${data.admin} بإرسال تحذير لك`,
      color: 0xfffce9f1,
      type: "notification",
    });
  });

  // AGORA VER.
  // socket.on("streamRequested", (data) => {
  //   const userId = data["userId"];
  //   const roomId = data["roomId"];
  //   const streamer = data["streamer_name"];

  //   const stoppedUser = stoppedUsers.find(
  //     (obj) => obj.device === data["device"]
  //   );

  //   if (stoppedUser) {
  //     if (
  //       stoppedUser.stop_type == "is_msg_stopped" ||
  //       stoppedUser.stop_type == "stop_all"
  //     ) {
  //       io.to(data["senderSocket"]).emit("notification", {
  //         sender: "system",
  //         senderId: "system",
  //         message: "تم ايقافك عن المايك",
  //         color: 0xfffce9f1,
  //         type: "notification",
  //       });
  //     } else {
  //       speakersQueue[roomId].push({
  //         userId: userId,
  //         socketId: socket.id,
  //         roomId: roomId,
  //         streamer_name: streamer,
  //         count: speakersQueue[roomId].length + 1,
  //       });
  //       if (speakersQueue[roomId].length === 1) {
  //         startStreaming(speakersQueue[roomId][0]);
  //       } else {
  //         updateOnlineUsersList(roomId, socket.id, "mic_status", "mic_wait");
  //       }
  //       io.to(roomId).emit("speakersQueue[roomId]", speakersQueue[roomId]);
  //     }
  //   } else {
  //     speakersQueue[roomId].push({
  //       userId: userId,
  //       socketId: socket.id,
  //       roomId: roomId,
  //       streamer_name: streamer,
  //       count: speakersQueue[roomId].length + 1,
  //     });
  //     if (speakersQueue[roomId].length === 1) {
  //       startStreaming(speakersQueue[roomId][0]);
  //     } else {
  //       updateOnlineUsersList(roomId, socket.id, "mic_status", "mic_wait");
  //     }
  //     io.to(roomId).emit("speakersQueue[roomId]", speakersQueue[roomId]);
  //   }
  // });

  // socket.on("stopAudioStream", (data) => {
  //   speakersQueue[roomId].shift();
  //   updateOnlineUsersList(data.roomId, socket, "mic_status", "none");

  //   if (speakersQueue[roomId].length > 0) {
  //     startStreaming(speakersQueue[roomId][0]);
  //   } else {
  //     socket.emit("endStreaming");
  //     onlineUsers[data.roomId].forEach((user) => {
  //       user.user["audio_status"] = "none f";
  //     });
  //   }
  // });

  // // Add this event to handle admin stopping a user's audio stream
  // socket.on("adminStopAudioStream", (data) => {
  //   // Ensure that the admin has the necessary permissions to stop a stream
  //   const userIdToStop = data["userId"]; // The user ID whose stream the admin wants to stop
  //   const roomId = data["roomId"];

  //   // Check if the user to stop is in the speakersQueue[roomId]
  //   const userIndex = speakersQueue[roomId].findIndex(
  //     (user) => user.userId === userIdToStop
  //   );

  //   if (userIndex !== -1) {
  //     // Remove the user from the speakersQueue[roomId]
  //     speakersQueue[roomId].splice(userIndex, 1);

  //     // Update online users list and notify clients about the stream being stopped
  //     updateOnlineUsersList(roomId, socket.id, "mic_status", "none");
  //     io.to(roomId).emit("speakersQueue[roomId]", speakersQueue[roomId]);

  //     // Check if there are more users in the queue and start streaming for the next user
  //     if (speakersQueue[roomId].length > 0) {
  //       startStreaming(speakersQueue[roomId][0]);
  //     } else {
  //       // No users in the queue, end the streaming
  //       socket.emit("endStreaming");
  //       onlineUsers[roomId].forEach((user) => {
  //         user.user["audio_status"] = "none f";
  //       });
  //     }
  //   } else {
  //     // User not found in the speakersQueue[roomId], handle accordingly (e.g., send an error message)
  //     console.log("User not found in the speakersQueue[roomId]");
  //   }
  // });
  // // Add this event to handle admin granting the microphone role to a specific user
  // socket.on("adminGrantMicRole", (data) => {
  //   // Ensure that the admin has the necessary permissions to grant the mic role

  //   // Add this event to handle admin granting the mic role to a specific user and revoking it from others
  //   socket.on("adminGrantMicToUser", (data) => {
  //     // Ensure that the admin has the necessary permissions to grant the mic role

  //     const userIdToGrantMic = data["userId"]; // The user ID to whom the admin wants to grant the mic role
  //     const roomId = data["roomId"];

  //     // Find the user in the speakersQueue[roomId] and move them to the front
  //     const userIndex = speakersQueue[roomId].findIndex(
  //       (user) => user.userId === userIdToGrantMic
  //     );

  //     if (userIndex !== -1) {
  //       // Move the user to the front of the speakersQueue[roomId]
  //       const userToGrantMic = speakersQueue[roomId].splice(userIndex, 1)[0];
  //       speakersQueue[roomId].unshift(userToGrantMic);

  //       // Update online users list and notify clients about the updated speakersQueue[roomId]
  //       updateOnlineUsersList(roomId, socket.id, "mic_status", "mic");
  //       io.to(roomId).emit("speakersQueue[roomId]", speakersQueue[roomId]);

  //       // Start streaming for the user with the mic role
  //       startStreaming(speakersQueue[roomId][0]);

  //       // Notify all other users that their mic status is revoked
  //       speakersQueue[roomId].slice(1).forEach((otherUser) => {
  //         io.to(otherUser.socketId).emit("notification", {
  //           sender: "system",
  //           senderId: "system",
  //           message: "تم سحب المايك منك",
  //           color: 0xfffce9f1,
  //           type: "notification",
  //         });
  //         updateOnlineUsersList(
  //           roomId,
  //           otherUser.socketId,
  //           "mic_status",
  //           "none"
  //         );
  //       });
  //     } else {
  //       // User not found in the speakersQueue[roomId], handle accordingly (e.g., send an error message)
  //       console.log("User not found in the speakersQueue[roomId]");
  //     }
  //   });

  //   const userIdToGrantMic = data["userId"]; // The user ID to whom the admin wants to grant the mic role
  //   const roomId = data["roomId"];

  //   // Check if the user to grant the mic role is in the speakersQueue[roomId]
  //   const userIndex = speakersQueue[roomId].findIndex(
  //     (user) => user.userId === userIdToGrantMic
  //   );

  //   if (userIndex !== -1) {
  //     // Move the user to the front of the speakersQueue[roomId]
  //     const userToGrantMic = speakersQueue[roomId].splice(userIndex, 1)[0];
  //     speakersQueue[roomId].unshift(userToGrantMic);

  //     // Update online users list and notify clients about the updated speakersQueue[roomId]
  //     updateOnlineUsersList(roomId, socket.id, "mic_status", "mic");
  //     io.to(roomId).emit("speakersQueue[roomId]", speakersQueue[roomId]);

  //     // Start streaming for the user with the mic role
  //     startStreaming(speakersQueue[roomId][0]);
  //   } else {
  //     // User not found in the speakersQueue[roomId], handle accordingly (e.g., send an error message)
  //     console.log("User not found in the speakersQueue[roomId]");
  //   }
  // });

  // // Handle Warning
  // socket.on("sendWarning", (data) => {
  //   io.to(data.socketId).emit("notification", {
  //     sender: data.admin,
  //     senderId: data.adminId,
  //     message: `قام المشرف : ${data.admin} بإرسال تحذير لك`,
  //     color: 0xfffce9f1,
  //     type: "notification",
  //   });
  // });

  // Handle disconnection event

  socket.on("disconnect", () => {
    delete clients[sessionId];
    console.log("disconnect");
  });
});

let timerId = null;
let currentStreamer = null;
function startStreaming(data) {
  const userId = data["userId"];
  const roomId = data["roomId"];
  const streamer = data["streamer_name"];
  const socketId = data["socketId"];
  const speakingEnds = data["speakingEnds"];

  // Check if user is already streaming
  if (currentStreamer === socketId) {
    endStreaming(data); // End existing stream if user tries to start again
    return;
  }

  console.log("register as broadcaster for room", roomId);

  var data = {
    roomId: roomId,
    socketId: socketId,
    userId: userId,
    streamer_name: streamer,
    speakingEnds,
  };
  io.to(roomId).emit("broadcastStarted", data);
  io.to(roomId).emit("audioStreamData", data);
  updateOnlineUsersList(roomId, socketId, "mic_status", "on_mic");
  currentStreamer = socketId; // Set current streamer
  const endTime = new Date(new Date().getTime() + 60 * 1000);

  const timeDifference = endTime.getTime() - new Date().getTime() + 1000;

  timerId = setTimeout(() => {
    endStreaming(data);
  }, timeDifference);

  if (!streamData[roomId]) streamData[roomId] = {};
  streamData[roomId] = {
    ...data,
    timerId,
  };
}

function endStreaming(data) {
  const timerId = streamData[data["roomId"]]?.timerId; // Check if data exists for the room

  if (timerId) {
    console.log("timer will end");
    clearTimeout(timerId);
  }

  io.to(data["roomId"]).emit("endBroadcast", { socketId: data["socketId"] });
  updateOnlineUsersList(data["roomId"], data["socketId"], "mic_status", "none");

  if (onlineUsers[data["roomId"]]) {
    onlineUsers[data["roomId"]].forEach((user) => {
      if (user.id !== data["socketId"]) {
        user.user["audio_status"] = "none";
      }
    });
    emitOnlineUsers({ room_id: data["roomId"] });
  }
  currentStreamer = null; // Clear current streamer

  if (
    speakersQueue[data["roomId"]] &&
    speakersQueue[data["roomId"]].length > 0
  ) {
    speakersQueue[data["roomId"]].shift();
  }
  if (speakersQueue[data["roomId"]].length > 0) {
    startStreaming(speakersQueue[data["roomId"]][0]);
  }
}

function addToOnlineUsers(data, socket) {
  if (!onlineUsers[data.room_id]) {
    onlineUsers[data.room_id] = [];
  }

  if (!onlineUsers[data.room_id].includes(socket.id)) {
    onlineUsers[data.room_id].push({ id: socket.id, data });
    emitOnlineUsers(data);
  }
}
function removeFromOnlineUsers(data, socket) {
  if (onlineUsers[data.room_id]) {
    onlineUsers[data.room_id] = onlineUsers[data.room_id].filter(
      (user) => user.id !== socket.id
    );
    console.log("user removed");
  }
  // Emit the updated online users list to all users in the room
  emitOnlineUsers(data);
}

function emitOnlineUsers(data) {
  if (!onlineUsers[data.room_id]) {
    onlineUsers[data.room_id] = [];
  }

  io.to(data.room_id).emit("onlineUsers", [
    ...new Set(onlineUsers[data.room_id]),
  ]);
}

function joinBroadcast(data, socket) {
  console.log("register as viewer for room", data["roomId"]);
  var viewerId = socket.id;
  console.log("viewer" + viewerId);
  io.to(data["socketId"]).emit("viewerJoined", {
    viewerId,
    roomId: data["roomId"],
    streamerSocket: data["socketId"],
  });
  updateOnlineUsersList(data["roomId"], socket.id, "audio_status", "unmute");
}

function startVideoStreaming(data, socket) {
  const userId = data["userId"];
  const roomId = data["roomId"];

  io.to(roomId).emit("startVideoStream", {
    roomId: roomId,
    socketId: socket.id,
    userId: userId,
  });
  updateOnlineUsersList(roomId, socket.id, "cam_status", "on_cam");
}

function sendPrivateMessage(senderId, friendId) {
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

function updateOnlineUsersList(roomId, socketId, field, val) {
  if (onlineUsers[roomId] && socketId) {
    const updatedUsers = onlineUsers[roomId].map((user) => {
      if (user.id === socketId) {
        user.user[field] = val;
      }
      return user;
    });

    const micOnUser = updatedUsers.find(
      (user) => user.user.mic_status === "on_mic"
    );

    if (micOnUser) {
      const otherUsers = updatedUsers.filter((user) => user !== micOnUser);
      const reorderedUsers = [micOnUser, ...otherUsers];
      onlineUsers[roomId] = reorderedUsers;
    }

    console.log("value changed in " + field + " with " + val);
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
app.use("/images", ImagesRouter);
app.use("/emojies", EmojieRouter);

/////////////////////////////////////////////////////
server.listen(8002, () => {
  console.log("listening to port....");
});
