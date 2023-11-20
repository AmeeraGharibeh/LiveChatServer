const BlockedModel = require("../Models/BlockedModel");

const blockedMiddleware = async (req, res, next) => {
  try {
    const blockedUser = await BlockedModel.findOne({
      $or: [{ ip: req.body.ip }, { device: req.body.device }],
    });

    if (blockedUser) {
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

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { blockedMiddleware };
