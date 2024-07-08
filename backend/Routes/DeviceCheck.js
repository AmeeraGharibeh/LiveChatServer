const UserModel = require("../Models/UserModel");

const deviceCheck = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      username: req.body.username,
      rooms: { $in: [req.body.room_id] },
    });

    if (!user) {
      return res.status(404).send({ msg: "المستخدم غير موجود" });
    }

    if (user.device === "-" || user.lock_device === false) {
      user.device = req.body.device;
      await user.save();
      req.user = user; // Save the user to the request object
      console.log("DeviceCheck: User set in req.user:", req.user);
      return next();
    }

    if (user.lock_device && user.device !== req.body.device) {
      return res
        .status(400)
        .send({ msg: "أنت تحاول تسجيل الدخول من جهاز مختلف" });
    }

    req.user = user; // Save the user to the request object
    console.log("DeviceCheck: User set in req.user:", req.user);
    next();
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

module.exports = { deviceCheck };
