const RoomModel = require("../Models/RoomModel");

const checkRoomStatus = async (req, res, next) => {
  try {
    console.log("CheckRoomStatus: req.user before processing:", req.user);
    const room = await RoomModel.findById(req.body.room_id);

    if (!room) {
      return res.status(404).send({ msg: "Room not found" });
    }

    if (room.room_lock_status === "open") {
      next();
    } else if (room.room_lock_status === "limit") {
      const allowedUserTypes = [
        "master",
        "member",
        "admin",
        "super_admin",
        "root",
      ];
      const userType = req.user ? req.user.user_type : req.body.user_type;
      console.log("CheckRoomStatus: user type is " + userType);

      if (allowedUserTypes.includes(userType)) {
        next();
      } else {
        return res.status(403).send({
          msg: "الغرفة مغلقة",
        });
      }
    } else {
      return res.status(403).send({
        msg: "الغرفة مغلقة",
        lock_reason: room.lock_reason,
      });
    }

    console.log("CheckRoomStatus: req.user after processing:", req.user);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

module.exports = checkRoomStatus;
