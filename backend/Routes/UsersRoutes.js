const router = require("express").Router();
const {
  verifyTokenAndAction,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyToken");
const {
  createUser,
  createName,
  userLogin,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  userStats,
  blockUserIp,
  blockUserDevice,
  unblockUserIp,
  unblockUserDevice,
} = require("../Controllers/UsersController");
const { blockedMiddleware } = require("./BlockCheck");

router.post("/", verifyTokenAndAdmin, createUser);
router.post("/name", verifyTokenAndAuthorization, createName);
router.post("/login", blockedMiddleware, userLogin);
router.put("/:id", verifyTokenAndAdmin, updateUser);
router.delete("/:id", verifyTokenAndAdmin, deleteUser);
router.get("/get/:id", getUser);
router.get("/", getAllUsers);
router.get("/stats", userStats);
router.post("/:id/blockip", verifyTokenAndAction, blockUserIp);
router.post("/:id/blockdevice", verifyTokenAndAction, blockUserDevice);
router.post("/:id/unblockip", verifyTokenAndAction, unblockUserIp);
router.post("/:id/unblockdevice", verifyTokenAndAction, unblockUserDevice);

module.exports = router;
