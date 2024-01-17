const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Reports = require("../Models/ReportsModel");
const Blocked = require("../Models/BlockedModel");
const { time } = require("../Config/Helpers/time_helper");
const ImageModel = require("../Models/ImageModel");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const createUser = async (req, res) => {
  console.log(req.body);
  const body = req.body.body;
  try {
    const hashedPass = await hashPassword(body.room_password);

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

// const createUser = async (req, res) => {
//   console.log(req.body);
//   const body = req.body.body;
//   try {
//     const items = await User.find({
//       username: body.username,
//     });
//     if (items.length > 0 && items[0].room_id === req.body.room_id) {
//       // User already exists in the room, check the name_type
//       if (items[0].name_type === "-") {
//         res.status(400).json({
//           msg: "اسم المستخدم موجود بالفعل في الغرفة.",
//         });
//       } else {
//         // Update the existing user document
//         items[0].user_type = body.user_type;
//         items[0].room_password = await hashPassword(body.room_password);
//         items[0].room_id = body.room_id;
//         items[0].permissions = body.permissions;
//         const updatedUser = await items[0].save();

//         const report = new Reports({
//           master_name: req.body.master,
//           room_id: body.room_id,
//           action_user: body.username,
//           action_name_ar: "اضافة مستخدم",
//           action_name_en: "add user",
//         });
//         await report.save();

//         res
//           .status(200)
//           .json({ msg: "تمت اضافة المستخدم بنجاح!", user: updatedUser });
//       }
//     } else {
//       // User doesn't exist in the room, create a new user
//       const hashedPass = await hashPassword(body.room_password);

//       const newUser = new User({
//         username: body.username,
//         room_password: hashedPass,
//         room_id: body.room_id,
//         user_type: body.user_type,
//         permissions: body.permissions,
//       });
//       const saved = await newUser.save();

//       const report = new Reports({
//         master_name: req.body.master,
//         room_id: body.room_id,
//         action_user: body.username,
//         action_name_ar: "اضافة مستخدم",
//         action_name_en: "Add user",
//       });
//       await report.save();
//       res.status(200).json({ msg: "تمت اضافة المستخدم بنجاح!", user: saved });
//     }
//   } catch (err) {
//     res.status(500).send({ msg: "حدث خطأ ما" });
//   }
// };

const createName = async (req, res) => {
  console.log(req.body);
  const body = req.body.body;
  try {
    const hashedNamePass = await hashPassword(body.name_password);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(body.name_end_date));
    console.log("end date is " + endDate);
    const users = await User.find({ username: body.username });
    if (users.length > 0) {
      res.status(400).json({ msg: "هذا الاسم مستخدم بالفعل" });
    } else {
      const newUser = new User({
        username: body.username,
        name_type: body.name_type,
        user_type: "visitor",
        name_password: hashedNamePass,
        name_end_date: time(endDate),
      });
      const saved = await newUser.save();

      res.status(200).json({ msg: "تمت اضافة المستخدم بنجاح!", user: saved });
    }
  } catch (err) {
    res.status(500).send({ msg: "something went wrong" });
  }
};

const login = async (req, res) => {
  let user;
  if (req.body.room_password && req.body.name_password) {
    user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send({ msg: "User not found!" });
    }
    const validNamePassword = verifyPassword(
      req.body.name_password,
      user.name_password
    );
    const validRoomPassword = verifyPassword(
      req.body.room_password,
      user.room_password
    );
    if (validNamePassword && validRoomPassword) {
      const accessToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWTSECRET,
        { expiresIn: "1h" }
      );

      const { room_password, name_password, ...others } = user._doc;

      return res.status(200).send({
        user: { ...others, icon: req.body.icon },
        accessToken: accessToken,
      });
    } else if (!validNamePassword && validRoomPassword) {
      const accessToken = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
        expiresIn: "1h",
      });

      const { room_password, ...others } = user._doc;

      return res.status(200).send({
        user: { ...others, icon: req.body.icon },
        accessToken: accessToken,
      });
    } else if (!validRoomPassword && validNamePassword) {
      const accessToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWTSECRET,
        { expiresIn: "1h" }
      );

      const { room_password, name_password, ...others } = user._doc;

      return res.status(200).send({
        user: { ...others, icon: req.body.icon },
        accessToken: accessToken,
      });
    } else if (
      (!validNamePassword && !validRoomPassword) ||
      (!req.body.name_password && !req.body.room_password)
    ) {
      const visitorId = uuidv4();
      const user = {
        username: req.body.username,
        room_id: req.body.room_id,
        _id: visitorId,
        user_type: "visitor",
        state: "Available",
        icon: req.body.icon,
      };

      const accessToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWTSECRET,
        { expiresIn: "1h" }
      );
      const { room_password, name_password, ...others } = user;

      return res.status(200).send({
        user: { ...others, icon: req.body.icon },
        accessToken: accessToken,
      });
    }
  }
};
const memberLogin = async (req, res) => {
  console.log("member login fired");
  let user;
  try {
    // Require room password to be present
    if (!req.body.room_password) {
      return res
        .status(400)
        .send({ msg: "كلمة مرور الغرفة مطلوبة للأعضاء المسجلين في الغرفة" });
    }

    user = await User.findOne({
      username: req.body.username,
      room_id: req.body.room_id,
    });

    if (!user) {
      return res.status(404).send({ msg: "المستخدم غير موجود" });
    }

    // Verify room password before proceeding
    const validRoomPassword = await bcrypt.compare(
      req.body.room_password,
      user.room_password
    );

    if (!validRoomPassword) {
      return res.status(400).send({ msg: "كلمة مرور الغرفة غير صحيحة" });
    }

    // Generate access token only after successful password verification
    const accessToken = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
      expiresIn: "1h",
    });

    const { room_password, ...others } = user._doc;

    return res.status(200).send({
      user: { ...others, icon: req.body.icon },
      accessToken: accessToken,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

const visitorLogin = async (req, res) => {
  try {
    const visitorId = uuidv4();
    const user = {
      username: req.body.username,
      room_id: req.body.room_id,
      _id: visitorId,
      user_type: "visitor",
      state: "Available",
      icon: req.body.icon,
    };

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWTSECRET,
      { expiresIn: "1h" }
    );
    const { room_password, name_password, ...others } = user;

    return res.status(200).send({
      user: { ...others, icon: req.body.icon },
      accessToken: accessToken,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

const NameLogin = async (req, res) => {
  try {
    let user;
    let member;

    // Step 1: Check if the user exists by username
    user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).send({ msg: "المستخدم غير موجود" });
    }

    // Step 2: Verify the name password for the user
    const validNamePassword = await bcrypt.compare(
      req.body.name_password,
      user.name_password
    );

    // If name password is correct, check for room password
    if (validNamePassword) {
      // Step 3: If room password is provided, check if the user follows the room

      if (req.body.room_password) {
        member = await User.findOne({
          username: req.body.username,
          room_id: req.body.room_id,
        });

        if (!member) {
          return res.status(404).send({ msg: "المستخدم غير موجود" });
        }
        const validRoomPassword = await verifyPassword(
          req.body.room_password,
          member.room_password
        );

        if (validRoomPassword) {
          // Both name and room passwords are correct, return the member user
          const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWTSECRET,
            { expiresIn: "1h" }
          );

          const { room_password, name_password, ...others } = user._doc;

          return res.status(200).send({
            user: {
              ...others,
              icon: req.body.icon,
              user_type: member.user_type,
              permissions: member.permissions,
            },
            accessToken: accessToken,
          });
        } else {
          // If the room password is incorrect, return an error
          return res.status(400).send({ msg: "كلمة مرور الغرفة غير صحيحة" });
        }
      } else {
        // Room password not provided, login as a name user only
        const accessToken = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
          expiresIn: "1h",
        });

        const { room_password, name_password, ...others } = user._doc;

        return res.status(200).send({
          user: { ...others, icon: req.body.icon },
          accessToken: accessToken,
        });
      }
    }

    // Step 4: If name password is incorrect and room password is not provided, login as a visitor
    const visitorId = uuidv4();
    const visitorUser = {
      username: req.body.username,
      _id: visitorId,
      user_type: "visitor",
      state: "Available",
      icon: req.body.icon,
    };

    const accessToken = jwt.sign(
      { id: visitorUser._id },
      process.env.JWTSECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).send({
      user: { ...visitorUser, icon: req.body.icon },
      accessToken: accessToken,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

// const NameLogin = async (req, res) => {
//   try {
//     let user;

//     user = await User.findOne({
//       username: req.body.username,
//       room_id: req.body.room_id,
//     });
//     if (user) {
//       const validRoomPassword = verifyPassword(
//         req.body.room_password,
//         user.room_password
//       );
//       if (!validRoomPassword) {
//         return res.status(400).send({ msg: "Invalid room password" });
//       }
//       const validNamePassword = verifyPassword(
//         req.body.name_password,
//         user.name_password
//       );
//       if (!validNamePassword) {
//         return res.status(400).send({ msg: "Invalid name password" });
//       }

//     } else {
//       user = await User.findOne({ username: req.body.username });
//       if (!user) {
//         return res.status(404).send({ msg: "User not found!" });
//       }

//       const validNamePassword = verifyPassword(
//         req.body.name_password,
//         user.name_password
//       );

//       if (!validNamePassword) {
//         return res.status(400).send({ msg: "Invalid name password" });
//       }
//     }
//     const accessToken = jwt.sign(
//       {
//         id: user._id,
//       },
//       process.env.JWTSECRET,
//       { expiresIn: "1h" }
//     );

//     const { room_password, name_password, ...others } = user._doc;

//     return res.status(200).send({
//       user: { ...others, icon: req.body.icon },
//       accessToken: accessToken,
//     });
//   } catch (err) {
//     return res.status(500).send({ msg: err.message });
//   }
// };

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

      if (!updated) {
        return res.status(404).json({ msg: "User not found" });
      }

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
        .send({ msg: "عذراً لا تملك الصلاحية للقيام بهذا الإجراء" });
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const updateNameUser = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const body = req.body.body;
    const updatedFields = {};

    if (body.room_password) {
      const salt = await bcrypt.genSalt(10);
      body.room_password = await bcrypt.hash(body.room_password, salt);
    }
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        updatedFields[key] = body[key];
      }
    }

    const updatedUser = Object.assign(existingUser, updatedFields);

    const result = await updatedUser.save();

    res.status(200).json({ msg: "User updated successfully!", user: result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
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

const deleteNameUser = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.params.id);
    await User.findByIdAndDelete(user._id);
    res.status(200).json({ msg: "تم حذف المستخدم بنجاح!" });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ msg: "تم تعديل المستخدم بنجاح!", user: updated });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const addPhotoToAlbum = async (req, res) => {
  const newImg = new ImageModel(req.body);
  try {
    const saved = await newImg.save();
    res.status(200).json({ msg: "تمت إضافة الصورة بنجاح", pic: saved });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const updateUserAlbum = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      throw new Error("User not found");
    }
    if (!user.album) {
      user.album = [];
    }
    user.album.push(req.body.pic);

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { album: user.album },
      },
      { new: true }
    );

    res.status(200).json({ msg: "تم تعديل المستخدم بنجاح!", user: updated });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const getUserAlbum = async (req, res) => {
  try {
    const userId = req.params.id;
    const album = await ImageModel.find({ user_id: userId });

    if (!album) {
      return res.status(200).json({ album: [] });
    }

    res.json({ album: album });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const getPicture = async (req, res) => {
  try {
    const picId = req.params.id;
    const pic = await ImageModel.findOne({ _id: picId });

    res.status(200).json(pic);
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const deletePicture = async (req, res) => {
  try {
    const picId = req.params.id;
    await ImageModel.deleteOne({ _id: picId });

    res.status(200).json({ msg: "تم حذف الصورة بنجاح" });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const pic = await ImageModel.findOne({ _id: req.params.id });

    if (!pic) {
      throw new Error("pic not found");
    }

    if (!pic.comments) {
      pic.comments = [];
    }

    pic.comments.push(req.body.comment);

    await pic.save();

    res.status(200).json({ msg: "تمت اضافة تعليقك بنجاح!", pic });
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

const getUsersByRoom = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const roomId = req.params.id;

  try {
    const totalItems = await User.countDocuments({ room_id: roomId });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await User.find({ room_id: roomId }).skip(skip).limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      users: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsersByType = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const type = req.query.type;

  try {
    const totalItems = await User.countDocuments({ name_type: type });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const skip = Math.max((currentPage - 1) * limit, 0);

    const items = await User.find({ name_type: type }).skip(skip).limit(limit);

    const response = {
      current_page: currentPage,
      per_page: limit,
      last_page: totalPages,
      total: totalItems,
      users: items,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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
  console.log("block body " + JSON.stringify(req.body));
  const body = req.body.body;
  const now = new Date();
  try {
    const userId = req.params.id;
    let blocked;
    const blockedData = {
      username: body.username,
      master: req.body.master,
      period: body.period,
      ip: body.ip,
      device: body.device,
      user_id: userId,
      room_id: body.room_id,
      location: body.location,
      is_ip_blocked: body.is_ip_blocked,
      is_device_blocked: body.is_device_blocked,
      date: time(now),
    };

    const existingBlocked = await Blocked.findOne({ user_id: userId });

    if (existingBlocked) {
      blocked = await Blocked.findByIdAndUpdate(
        existingBlocked._id,
        blockedData,
        { new: true, upsert: true }
      );
    } else {
      blocked = new Blocked(blockedData);
      await blocked.save();
    }

    const report = new Reports({
      master_name: req.body.master,
      action_user: body.username,
      room_id: body.room_id,
      action_name_ar: "حظر مستخدم",
      action_name_en: "Block user",
    });
    await report.save();

    res.status(200).json(blocked);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const unblockUser = async (req, res) => {
  const body = req.body.body;

  try {
    const userId = req.params.id;

    const unblockConditions = {
      user_id: userId,
    };
    const existingBlocked = await Blocked.findOne({ user_id: userId });

    if (existingBlocked) {
      unblockConditions.is_ip_blocked = body.is_ip_blocked;
      await Blocked.findByIdAndUpdate(
        existingBlocked._id,
        {
          is_ip_blocked: body.is_ip_blocked,
          is_device_blocked: body.is_device_blocked,
        },
        { new: true, upsert: true }
      );
    } else {
      await Blocked.deleteOne(unblockConditions);
    }

    const report = new Reports({
      master_name: req.body.master,
      action_user: body.username,
      room_id: body.room_id,
      action_name_ar: "إلغاء حظر مستخدم",
      action_name_en: "Unblock user",
    });
    await report.save();

    res.status(200).json({ user_id: userId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createUser,
  createName,
  login,
  memberLogin,
  visitorLogin,
  NameLogin,
  updateUser,
  updateNameUser,
  updateUserProfile,
  addPhotoToAlbum,
  updateUserAlbum,
  getUserAlbum,
  getPicture,
  deletePicture,
  addComment,
  deleteUser,
  deleteNameUser,
  getUser,
  getUsersByRoom,
  getAllUsers,
  getUsersByType,
  userStats,
  blockUser,
  unblockUser,
};
