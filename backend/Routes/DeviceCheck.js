const UserModel = require("../Models/UserModel");

const deviceCheck = async (req, res, next) => {
  try {
    const username = req.body.username;
    const room_id = req.body.room_id;

    let query = { username };
    if (room_id) {
      query.rooms = { $in: [room_id] };
    }

    const user = await UserModel.findOne(query);

    if (!user) {
      return res.status(404).send({ msg: "المستخدم غير موجود" });
    }

    if (user.device === "-" || user.lock_device === false) {
      user.device = req.body.device;
      await user.save();
      req.user = user;
      return next();
    }

    if (user.lock_device && user.device !== req.body.device) {
      return res
        .status(400)
        .send({ msg: "أنت تحاول تسجيل الدخول من جهاز مختلف" });
    }

    //req.user = user;
    next();
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

module.exports = { deviceCheck };
