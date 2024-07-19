const router = require("express").Router();
const {
  verifyTokenAndAction,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyToken");
const {
  createUser,
  createName,
  createRoot,
  memberLogin,
  visitorLogin,
  nameLogin,
  logOut,
  updateUser,
  changeMasterPassword,
  changeNamePassword,
  updateUserProfile,
  addPhotoToAlbum,
  updateUserAlbum,
  updateNameUser,
  getUserAlbum,
  getPicture,
  deletePicture,
  deleteUser,
  deleteNameUser,
  addComment,
  getUser,
  getUsersByRoom,
  getAllUsers,
  getUsersByType,
  userStats,
  blockUser,
  unblockUser,
} = require("../Controllers/UsersController");
//const { blockedMiddleware } = require("./BlockCheck");
//const { checkMembershipExpiration } = require("./StopCheck");
//const { deviceCheck } = require("./DeviceCheck");
//const checkRoomStatus = require("./roomLockCheck");
const CalculateOnlinePrecentage = require("./CalcOnlinePrecentage");
const {
  deviceCheck,
  blockedMiddleware,
  checkRoomStatus,
  logUserLogin,
  checkMembershipExpiration,
} = require("./LoginMiddlewares");
//const logUserLogin = require("./SetUserLog");

router.post("/", verifyTokenAndAdmin, createUser);
router.post("/root", verifyTokenAndAuthorization, createRoot);
router.post("/name", verifyTokenAndAuthorization, createName);
//router.post("/login", checkMembershipExpiration, blockedMiddleware, login);
router.post(
  "/login/member",
  deviceCheck,
  blockedMiddleware,
  checkRoomStatus,
  memberLogin,
  logUserLogin
);
router.post(
  "/login/visitor",
  blockedMiddleware,
  checkRoomStatus,
  visitorLogin,
  logUserLogin
);
router.post(
  "/login/name",
  deviceCheck,
  blockedMiddleware,
  checkMembershipExpiration,
  checkRoomStatus,
  nameLogin,
  logUserLogin
);
router.post("/logout/:id", logOut);
router.put("/:id", verifyTokenAndAdmin, updateUser);
router.put("/name/:id", verifyTokenAndAuthorization, updateNameUser);
router.put("/update/:id", updateUserProfile);
router.put("/updatepass/:id", changeMasterPassword);
router.put("/namepass/:id", changeNamePassword);
router.post("/album/", addPhotoToAlbum);
router.put("/album/:id", updateUserAlbum);
router.get("/album/:id", getUserAlbum);
router.get("/picture/:id", getPicture);
router.delete("/picture/:id", deletePicture);
router.put("/picture/comment/:id", addComment);
router.delete("/:id", verifyTokenAndAdmin, deleteUser);
router.delete("/name/:id", verifyTokenAndAuthorization, deleteNameUser);
router.get("/get/:id", CalculateOnlinePrecentage, getUser);
router.get("/:id/users", getUsersByRoom);
router.get("/type/", getUsersByType);
router.get("/", getAllUsers);
router.get("/stats", userStats);
router.post("/block", verifyTokenAndAction, blockUser);
router.post("/unblock", verifyTokenAndAction, unblockUser);

module.exports = router;
