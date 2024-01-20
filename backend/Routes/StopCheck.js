const { time } = require("../Config/Helpers/time_helper");
const StopModel = require("../Models/StopModel");
const Users = require("../Models/UserModel");

const checkStoppedUsers = async (device) => {
  try {
    const stoppedUser = await StopModel.findOne({ device: device });

    if (stoppedUser) {
      if (stoppedUser.period === "forever") {
        return stoppedUser;
      } else {
        const currentDate = new Date();
        const blockEndDate = new Date(stoppedUser.end_date);

        if (currentDate > blockEndDate) {
          await StopModel.findByIdAndRemove(stoppedUser._id);
          console.log(`User unblocked: ${stoppedUser.username}`);
        } else {
          return stoppedUser;
        }
      }
    }
    return stoppedUser;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

const checkMembershipExpiration = async (req, res, next) => {
  const query = { username: req.body.username, user_type: { $ne: "-" } };
  const result = await Users.find(query);

  if (result && result.length > 0) {
    const user = result[0];
    const parts = user.name_end_date.split(/[\s,\/:]+/); // Split by spaces, commas, slashes, and colons
    const month = parseInt(parts[0], 10) - 1; // Months are zero-based in JavaScript Dates
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const hours = parseInt(parts[3], 10) + (parts[6] === "PM" ? 12 : 0); // Adjust for PM
    const minutes = parseInt(parts[4], 10);
    const seconds = parseInt(parts[5], 10);
    const formatted = new Date(year, month, day, hours, minutes, seconds);

    const expirationDate = time(formatted);
    const currentDate = time(new Date());

    const remining = formatted - new Date();

    const differenceInDays = remining / (1000 * 60 * 60 * 24);

    if (expirationDate < currentDate) {
      return res.status(401).json({
        msg: `نأسف لقد انتهت صلاحية عضويتك, يمكنك التجديد خلال ${differenceInDays} أيام أو سيتم حذف العضوية`,
      });
    }

    const week = new Date(expirationDate.getTime() + 7);
    console.log("week is " + week);
    if (currentDate > time(week)) {
      // Delete the user from the database
      await Users.findByIdAndDelete(user._id);
      console.log("User deleted from the database");
    }
  }

  next();
};

module.exports = { checkStoppedUsers, checkMembershipExpiration };
