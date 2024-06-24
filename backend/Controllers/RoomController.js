const Rooms = require("../Models/RoomModel");
const User = require("../Models/UserModel");
const Logs = require("../Models/LogModel");
const Reports = require("../Models/ReportsModel");
const {
  calculateDateAfterDays,
  time,
} = require("../Config/Helpers/time_helper");

const createRoom = async (req, res) => {
  console.log(req.body);
  let roomData = req.body.body;
  const password = req.body.body.room_password;
  const permissions = req.body.body.permissions;
  roomData.end_date = time(calculateDateAfterDays(roomData.room_duration));
  const newRoom = new Rooms(roomData);
  try {
    await newRoom.save().then((val) => {
      req.body.password = password;
      req.body.permissions = permissions;
      req.body.roomId = val._id.toHexString();

      // Response will be handled in the middleware chain
      res.status(200).json(val);
    });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const getAllRooms = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const totalItems = await Rooms.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await Rooms.find().skip(skip).limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      Rooms: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllRoomsByCountry = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const countryId = req.params.id;

  try {
    const totalItems = await Rooms.countDocuments({ room_country: countryId });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await Rooms.find({ room_country: countryId })
      .skip(skip)
      .limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      Rooms: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSpecialRooms = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const totalItems = await Rooms.countDocuments({ room_type: "special" });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await Rooms.find({ room_type: "special" })
      .skip(skip)
      .limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      Rooms: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchRoom = async (req, res) => {
  try {
    const keyword = req.query.q
      ? {
          $or: [{ room_name: { $regex: req.query.q, $options: "i" } }],
        }
      : {};

    const rooms = await Rooms.find(keyword);
    res.status(200).json({ rooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Rooms.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const updateRoom = async (req, res) => {
  console.log(req.body);

  try {
    // Find the room to be updated
    const room = await Rooms.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    // Check if updating room settings is allowed
    if (!room.change_room_settings) {
      return res.status(400).json({ msg: "تعديل إعدادات الغرفة غير مسموح" });
    }

    // Proceed with the update
    const updated = await Rooms.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ msg: "تم تعديل الغرفة بنجاح!", room: updated });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const resetRoom = async (req, res) => {
  const roomId = req.params.id;

  try {
    await User.deleteMany({ room_id: roomId });

    await Reports.deleteMany({ room_id: roomId });

    await Logs.deleteMany({ room_id: roomId });

    const room = await Rooms.findById(req.params.id);

    res.status(200).json({ msg: "تمت اعادة تهيئة الغرفة بنجاح!", room: room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "حدث خطأ اثناء محاولة إعادة تهيئة الغرفة" });
  }
};
const deleteRoom = async (req, res) => {
  try {
    await Rooms.findByIdAndDelete(req.params.id);
    const users = await User.find({ rooms: { $in: req.params.id } });

    if (users.length > 0) {
      const deletedCount = await User.deleteMany({
        rooms: { $in: req.params.id },
      });

      res.status(200).json({
        msg: `${deletedCount} users deleted`,
      });
    }

    res.status(200).json({ msg: "room has been deleted.. " });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
module.exports = {
  createRoom,
  getAllRooms,
  getAllRoomsByCountry,
  getSpecialRooms,
  getRoom,
  deleteRoom,
  resetRoom,
  updateRoom,
  searchRoom,
};
