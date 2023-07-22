const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Reports = require("../Models/ReportsModel");
const Blocked = require("../Models/BlockedModel");

const createUser = async (req, res) => {
  console.log(req.body);
  const body = req.body.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(body.room_password, salt);

    const items = await User.find({ room_id: body.room_id });
    const usernameExists = items.some(
      (item) => item.username === body.username
    );
    if (usernameExists) {
      res.status(400).json({ msg: "اسم المستخدم موجود بالفعل في الغرفة" });
    } else {
      const newUser = new User({
        username: body.username,
        room_password: hashedPass,
        room_id: body.room_id,
        name_type: body.name_type,
        user_type: body.user_type,
        permissions: body.permissions,
      });
      const saved = await newUser.save();

      const report = new Reports({
        master_name: req.body.master,
        room_id: body.room_id,
        action_user: body.username,
        action_name_ar: "اضافة مستخدم",
        action_name_en: "Add user",
      });
      await report.save();
      res.status(200).json({ msg: "تمت اضافة المستخدم بنجاح!", user: saved });
    }
  } catch (err) {
    res.status(500).send({ msg: "something went wrong" });
  }
};

const createName = async (req, res) => {
  console.log(req.body);
  const body = req.body.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedNamePass = await bcrypt.hash(body.name_password, salt);

    const users = await User.find({ username: body.username });
    if (users.length > 0) {
      res.status(400).json({ msg: "هذا الاسم مستخدم بالفعل" });
    } else {
      const newUser = new User({
        username: body.username,
        name_type: body.name_type,
        user_type: "visitor",
        name_password: hashedNamePass,
      });
      const saved = await newUser.save();

      res.status(200).json({ msg: "تمت اضافة المستخدم بنجاح!", user: saved });
    }
  } catch (err) {
    res.status(500).send({ msg: "something went wrong" });
  }
};

// const userLogin = async (req, res) => {
//   console.log(req.body.room_password + req.body.name_password);
//   try {
//     let user;
//     let visitor;

//     if (req.body.room_password && req.body.name_password) {
//       // Member and registered user login
//       user = await User.findOne({
//         username: req.body.username,
//         room_id: req.body.room_id,
//       });
//       if (!user) return res.status(404).send({ msg: "المستخدم غير موجود!" });

//       const validRoomPassword = await bcrypt.compare(
//         req.body.room_password,
//         user.room_password
//       );
//       const validNamePassword = await bcrypt.compare(
//         req.body.name_password,
//         user.name_password
//       );

//       if (!validRoomPassword && !validNamePassword)
//         return res
//           .status(400)
//           .send({ msg: "المستخدم أو كلمة المرور غير صحيحة" });
//     } else if (req.body.room_password) {
//       // Member login
//       user = await User.findOne({
//         username: req.body.username,
//         room_id: req.body.room_id,
//       });
//       if (!user) return res.status(404).send({ msg: "المستخدم غير موجود!" });

//       const valid = await bcrypt.compare(
//         req.body.room_password,
//         user.room_password
//       );
//       if (!valid)
//         return res
//           .status(400)
//           .send({ msg: "المستخدم أو كلمة المرور غير صحيحة" });
//     } else if (req.body.name_password) {
//       // Registered user login
//       user = await User.findOne({ username: req.body.username });
//       if (!user) return res.status(404).send({ msg: "المستخدم غير موجود!" });

//       const validName = await bcrypt.compare(
//         req.body.name_password,
//         user.name_password
//       );

//       if (!validName)
//         return res
//           .status(400)
//           .send({ msg: "المستخدم أو كلمة مرور الاسم غير صحيحة" });
//     } else {
//       const visitorId = uuidv4();
//       visitor = true;
//       user = {
//         username: req.body.username,
//         room_id: req.body.room_id,
//         _id: visitorId,
//         user_type: "visitor",
//         icon: req.body.icon,
//       };
//     }

//     const accessToken = jwt.sign(
//       {
//         id: user._id,
//       },
//       process.env.JWTSECRET,
//       { expiresIn: "1h" }
//     );

//     const { room_password, name_password, ...others } = visitor
//       ? user
//       : user._doc;
//     return res.status(200).send({
//       user: { ...others, icon: req.body.icon },
//       accessToken: accessToken,
//     });
//   } catch (err) {
//     return res.status(500).send({ msg: err.message });
//   }
// };

const userLogin = async (req, res) => {
  let user;
  let visitor;
  try {
    if (req.body.room_password && req.body.name_password) {
      // Registered member
      const name = await User.findOne({
        username: req.body.username,
      });

      const member = await User.findOne({
        username: req.body.username,
        room_id: req.body.room_id,
      });

      if (!member || !name) {
        return res.status(404).send({ msg: "User not found!" });
      }
      console.log("name " + name + "member " + member);

      const validNamePassword = await bcrypt.compare(
        req.body.name_password,
        name.name_password
      );
      const validRoomPassword = await bcrypt.compare(
        req.body.room_password,
        member.room_password
      );

      if (!validNamePassword && !validRoomPassword) {
        return res
          .status(400)
          .send({ msg: "المستخدم أو كلمة المرور غير صحيحة" });
      }

      user = { ...name, room_id: member.room_id, user_type: member.user_type };
    } else if (req.body.room_password) {
      // Member
      user = await User.findOne({
        username: req.body.username,
        room_id: req.body.room_id,
      });
      if (!user) {
        return res.status(404).send({ msg: "User not found!" });
      }
      const validRoomPassword = await bcrypt.compare(
        req.body.room_password,
        user.room_password
      );

      if (!validRoomPassword)
        return res
          .status(400)
          .send({ msg: "Invalid username or name password" });
    } else if (req.body.name_password && !req.body.room_password) {
      // Registered visitor
      user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).send({ msg: "User not found!" });
      }

      const validName = await bcrypt.compare(
        req.body.name_password,
        user.name_password
      );

      if (!validName)
        return res
          .status(400)
          .send({ msg: "Invalid username or name password" });
    } else {
      // Visitor
      const visitorId = uuidv4();
      visitor = true;
      user = {
        username: req.body.username,
        room_id: req.body.room_id,
        _id: visitorId,
        user_type: "visitor",
        icon: req.body.icon,
      };
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWTSECRET,
      { expiresIn: "1h" }
    );
    const { room_password, name_password, ...others } = visitor
      ? user
      : user._doc;
    return res.status(200).send({
      user: { ...others, icon: req.body.icon },
      accessToken: accessToken,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

const updateUser = async (req, res) => {
  console.log(req.body);
  const body = req.body.body;
  if (body.room_password) {
    const salt = await bcrypt.genSalt(10);
    body.room_password = await bcrypt.hash(body.room_password, salt);
  }
  try {
    if (body.username !== "master") {
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: body,
        },
        { new: true }
      );
      const report = new Reports({
        master_name: req.body.master,
        room_id: updated.room_id,
        action_user: updated.username,
        action_name_ar: "تعديل حساب",
        action_name_en: "Update user",
      });
      await report.save();
      res.status(200).json({ msg: "تم تعديل المستخدم بنجاح!", user: updated });
    } else {
      res
        .status(403)
        .send({ msg: " عذراً لا تملك الصلاحية للقيام بهذا الاجراء" });
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const deleteUser = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.params.id);
    const report = new Reports({
      master_name: req.body.master,
      action_user: req.body.username,
      room_id: user.room_id,
      action_name_ar: "حذف مستخدم",
      action_name_en: "Delete user",
    });
    await report.save();
    await User.findByIdAndDelete(user._id);
    res.status(200).json({ msg: "تم حذف المستخدم بنجاح!" });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const totalItems = await User.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const items = await User.find()
      .skip((currentPage <= 0 ? 1 : currentPage - 1) * limit)
      .limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      users: items,
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
const userStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await User.updateOne({ _id: userId }, { is_blocked: true });
    const blocked = new Blocked({
      username: req.body.username,
      master: req.body.master,
      device: req.body.device,
      period: req.body.period,
      ip: req.body.ip,
    });
    await blocked.save();
    const report = new Reports({
      master_name: req.body.master,
      action_user: req.body.username,
      room_id: req.body.room_id,
      action_name_ar: "حظر مستخدم",
      action_name_en: "Block user",
    });
    await report.save();
    res.status(200).json({ msg: "تم حظر المستخدم بنجاح!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await Blocked.findByIdAndDelete(req.params.id);

    await User.updateOne({ _id: userId }, { is_blocked: false });
    const report = new Reports({
      master_name: req.body.master,
      action_user: req.body.username,
      room_id: req.body.room_id,
      action_name_ar: "فك الحظر عن المستخدم",
      action_name_en: "Unblock user",
    });
    await report.save();
    res.status(200).json({ msg: "تم فك الحظر عن المستخدم بنجاح!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
module.exports = {
  createUser,
  createName,
  userLogin,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  userStats,
  blockUser,
  unblockUser,
};
