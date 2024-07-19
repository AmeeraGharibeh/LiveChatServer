const LogModel = require("../Models/LogModel");
const UserModel = require("../Models/UserModel");

const CalculateOnlinePrecentage = async (req, res, next) => {
  console.log("calculate user ");
  try {
    const logs = await LogModel.find({ user_id: req.params.id });
    if (logs.length === 0) {
      return res.status(404).json({ error: "No logs found for this user" });
    }

    console.log("logs found ");

    const totalTime = logs.reduce((acc, log) => acc + (log.duration || 0), 0);
    console.log("Total online time (ms):", totalTime);

    const MS_PER_HOUR = 3600000;
    const MS_PER_DAY = 24 * MS_PER_HOUR;

    const onlinePercentage = ((totalTime / MS_PER_DAY) * 100).toFixed(2);
    console.log("Calculated online percentage:", onlinePercentage);

    await UserModel.findByIdAndUpdate(req.params.id, {
      online: onlinePercentage.toString() + "%",
    });
    console.log("Updated user online percentage:", onlinePercentage);

    next();
  } catch (error) {
    console.error("Error calculating online percentage:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = CalculateOnlinePrecentage;
