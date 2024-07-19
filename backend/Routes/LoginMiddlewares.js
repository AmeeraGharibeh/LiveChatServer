const { time } = require("../Config/Helpers/time_helper");
const BlockedModel = require("../Models/BlockedModel");
const LogModel = require("../Models/LogModel");
const RoomModel = require("../Models/RoomModel");
const UserModel = require("../Models/UserModel");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const deviceCheck = asyncHandler(async (req, res, next) => {
  if (!req.body.room_password) return next();

  const user = await UserModel.findOne({
    username: req.body.username,
    rooms: { $in: [req.body.room_id] },
  });
  if (!user) return res.status(404).send({ msg: "المستخدم غير موجود" });

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

  req.user = user;
  next();
});

const blockedMiddleware = asyncHandler(async (req, res, next) => {
  const blockedUser = await BlockedModel.findOne({
    room_id: req.body.room_id,
    $or: [{ ip: req.body.ip }, { device: req.body.device }],
  });
  if (blockedUser) {
    if (blockedUser.period === "forever") {
      return res
        .status(403)
        .json({ msg: `محظور من الدخول \n ${blockedUser.period}` });
    } else {
      const currentDate = new Date();
      const blockEndDate = new Date(blockedUser.end_date);

      if (currentDate > blockEndDate) {
        await BlockedModel.findByIdAndRemove(blockedUser._id);
      } else {
        return res
          .status(403)
          .json({ msg: `محظور من الدخول \n ${blockedUser.period}` });
      }
    }
  }
  next();
});

const checkRoomStatus = asyncHandler(async (req, res, next) => {
  const room = await RoomModel.findById(req.body.room_id);
  if (!room) return res.status(404).send({ msg: "Room not found" });

  if (room.room_lock_status === "open") {
    return next();
  } else if (room.room_lock_status === "limit") {
    const allowedUserTypes = [
      "master",
      "member",
      "admin",
      "super_admin",
      "root",
    ];
    const userType = req.user ? req.user.user_type : req.body.user_type;
    if (allowedUserTypes.includes(userType)) {
      return next();
    } else {
      return res.status(403).send({ msg: "الغرفة مغلقة" });
    }
  } else {
    return res
      .status(403)
      .send({ msg: "الغرفة مغلقة", lock_reason: room.lock_reason });
  }
});

const logUserLogin = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const timeIn = time(now);

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
});

const checkMembershipExpiration = asyncHandler(async (req, res, next) => {
  const query = { username: req.body.username, user_type: { $ne: "-" } };
  const result = await UserModel.find(query);

  if (result && result.length > 0) {
    const user = result[0];
    const [month, day, year, hours, minutes, seconds, period] =
      user.name_end_date.split(/[\s,\/:]+/);
    const formatted = new Date(
      year,
      month - 1,
      day,
      period === "PM" ? +hours + 12 : +hours,
      +minutes,
      +seconds
    );
    const afterWeek = new Date(formatted.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (new Date() > afterWeek) {
      await UserModel.findByIdAndDelete(user._id);
      return res
        .status(401)
        .json({ msg: `نأسف لقد انتهت صلاحية عضويتك، وتم حذف العضوية بنجاح.` });
    } else if (time(formatted) < time(new Date())) {
      const remainingDays = Math.ceil(
        (afterWeek - new Date()) / (1000 * 60 * 60 * 24)
      );
      return res.status(401).json({
        msg: `نأسف لقد انتهت صلاحية عضويتك، يمكنك التجديد خلال ${remainingDays} أيام أو سيتم حذف العضوية.`,
      });
    }
    req.user = user;
  }
  next();
});

module.exports = {
  deviceCheck,
  blockedMiddleware,
  checkRoomStatus,
  logUserLogin,
  checkMembershipExpiration,
};
