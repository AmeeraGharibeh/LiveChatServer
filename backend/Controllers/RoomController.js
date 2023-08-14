const Rooms = require("../Models/RoomModel");
const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");

const createRoom = async function (req, res) {
  console.log(req.body);
  const password = req.body.body.room_password;
  const permissions = req.body.body.permissions;
  const newRoom = new Rooms(req.body.body);
  try {
    await newRoom.save().then(async (val) => {
      try {
        console.log("first" + password);
        console.log(val._id.toHexString());
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = new User({
          username: "master",
          room_password: hashedPass,
          room_id: val._id.toHexString(),
          user_type: "master",
          permissions,
        });
        await newUser.save();
        res.status(200).json(val);
      } catch (err) {
        res.status(500).send({ msg: "something went wrong" });
      }
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

const deleteRoom = async (req, res) => {
  try {
    await Rooms.findByIdAndDelete(req.params.id);
    const users = await User.find({
      room_id: req.params.id,
    });

    if (users.length === 0) {
      res.status(404).json({ msg: "no users found" });
      return;
    }
    const deletedCount = await User.deleteMany({ room_id: req.params.id });

    res.status(200).json({
      msg: `${deletedCount} users deleted`,
    });
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
  updateRoom,
  searchRoom,
};
