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
  console.log("result is " + result);

  if (
    result &&
    result.name_end_date &&
    new Date(result.name_end_date) < time(new Date())
  ) {
    console.log("user found");

    return res.status(401).json({
      msg: "نأسف لقد انتهت صلاحية عضويتك, يمكنك التجديد خلال أسبوع أو سيتم حذف العضوية",
    });
  }

  next();
};

module.exports = { checkStoppedUsers, checkMembershipExpiration };
