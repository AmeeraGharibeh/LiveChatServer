const { time } = require("../Config/Helpers/time_helper");
const LogModel = require("../Models/LogModel");

const logUserLogin = async (req, res, next) => {
  const now = new Date();

  try {
    console.log("user from log middle " + JSON.stringify(req.userDetails));
    const timeIn = time(now); // current time

    const newLog = new LogModel({
      room_id: req.userDetails.user.room_id,
      username: req.userDetails.user.username,
      user_id: req.userDetails.user._id,
      ip: req.userDetails.user.ip,
      device: req.userDetails.user.device,
      location: req.userDetails.user.location,
      time_in: timeIn,
      icon: req.userDetails.user.icon,
    });

    await newLog.save();
    res.status(200).send(req.userDetails);
  } catch (error) {
    next(error);
  }
};

module.exports = logUserLogin;
