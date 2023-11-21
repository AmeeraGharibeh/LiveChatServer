const StopModel = require("../Models/StopModel");

const checkStoppedUsers = async (device) => {
  try {
    console.log("device is" + device);
    const stoppedUser = await StopModel.findOne({ device: device });

    if (stoppedUser) {
      console.log();
      if (stoppedUser.period === "forever") {
        return;
      } else {
        const currentDate = new Date();
        const blockEndDate = new Date(stoppedUser.end_date);

        if (currentDate > blockEndDate) {
          await StopModel.findByIdAndRemove(stoppedUser._id);
          console.log(`User unblocked: ${stoppedUser.username}`);
        } else {
          return;
        }
      }
      return stoppedUser;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { checkStoppedUsers };
