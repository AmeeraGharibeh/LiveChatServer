const BlockedModel = require("../Models/BlockedModel");
const blockedMiddleware = async (req, res, next) => {
  console.log("middleware  " + req.body);
  try {
    const blockedUser = await BlockedModel.findOne({
      $or: [{ ip: req.body.ip }, { device: req.body.device }],
    });

    if (blockedUser) {
      return res
        .status(403)
        .json({ msg: `محظور من الدخول \n ${blockedUser.period}` });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
module.exports = { blockedMiddleware };
