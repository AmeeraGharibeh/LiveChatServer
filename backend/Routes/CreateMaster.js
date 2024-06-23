const bcrypt = require("bcryptjs");
const UserModel = require("../Models/UserModel");

const createMasterUser = async (req, res, next) => {
  const { password, permissions, roomId } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const rooms = [roomId];
    const newUser = new UserModel({
      username: "MASTER",
      room_password: hashedPass,
      rooms: rooms,
      user_type: "master",
      is_owner: true,
      permissions,
    });
    await newUser.save();
    next();
  } catch (err) {
    res.status(500).send({ msg: "Error creating master user" });
  }
};
module.exports = { createMasterUser };
