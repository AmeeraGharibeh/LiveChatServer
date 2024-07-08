const bcrypt = require("bcryptjs");
const UserModel = require("../Models/UserModel");
const createMasterUser = async (req, res) => {
  const { room_password, permissions, roomId } = req.body.body;
  console.log("password from create master is " + room_password);
  console.log(
    "body from create master is " + JSON.stringify(req.body, null, 2)
  );

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(room_password, salt);
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
    res.status(200).json({ msg: "Master user created successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Error creating master user" });
  }
};

module.exports = { createMasterUser };
