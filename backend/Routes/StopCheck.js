const StopModel = require("../Models/StopModel");

const checkStoppedUsers = async (device) => {
  try {
    console.log("device is" + device);
    const stoppedUser = await StopModel.findOne({ device: device });

    if (stoppedUser) {
      if (stoppedUser.period === "forever") {
        return stoppedUser; // Return stoppedUser if the period is "forever"
      } else {
        const currentDate = new Date();
        const blockEndDate = new Date(stoppedUser.end_date);

        if (currentDate > blockEndDate) {
          // Remove the user from the stop list if the block end date has passed
          await StopModel.findByIdAndRemove(stoppedUser._id);
          console.log(`User unblocked: ${stoppedUser.username}`);
        } else {
          return stoppedUser; // Return stoppedUser if the user is still blocked
        }
      }
    }

    // If stoppedUser is not found or conditions are not met, it returns undefined
    return stoppedUser;
  } catch (error) {
    console.error(error);
    // Consider handling the error and returning an appropriate response
    throw new Error("Internal server error");
  }
};

module.exports = { checkStoppedUsers };
