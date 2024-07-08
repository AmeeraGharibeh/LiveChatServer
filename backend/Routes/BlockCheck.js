const BlockedModel = require("../Models/BlockedModel");

const blockedMiddleware = async (req, res, next) => {
  try {
    console.log("BlockedMiddleware: req.user before processing:", req.user);
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
          console.log(`User unblocked: ${blockedUser.username}`);
        } else {
          return res
            .status(403)
            .json({ msg: `محظور من الدخول \n ${blockedUser.period}` });
        }
      }
    }

    console.log("BlockedMiddleware: req.user after processing:", req.user);
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { blockedMiddleware };
