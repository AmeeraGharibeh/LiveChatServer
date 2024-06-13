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
  login,
  memberLogin,
  visitorLogin,
  NameLogin,
  updateUser,
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
const { blockedMiddleware } = require("./BlockCheck");
const { checkMembershipExpiration } = require("./StopCheck");
const { deviceCheck } = require("./DeviceCheck");

router.post("/", verifyTokenAndAdmin, createUser);
router.post("/root", verifyTokenAndAuthorization, createRoot);
router.post("/name", verifyTokenAndAuthorization, createName);
//router.post("/login", checkMembershipExpiration, blockedMiddleware, login);
router.post("/login/member", blockedMiddleware, deviceCheck, memberLogin);
router.post("/login/visitor", blockedMiddleware, visitorLogin);
router.post(
  "/login/name",
  checkMembershipExpiration,
  deviceCheck,
  blockedMiddleware,
  NameLogin
);
router.put("/:id", verifyTokenAndAdmin, updateUser);
router.put("/name/:id", verifyTokenAndAuthorization, updateNameUser);
router.put("/update/:id", updateUserProfile);
router.post("/album/", addPhotoToAlbum);
router.put("/album/:id", updateUserAlbum);
router.get("/album/:id", getUserAlbum);
router.get("/picture/:id", getPicture);
router.delete("/picture/:id", deletePicture);
router.put("/picture/comment/:id", addComment);
router.delete("/:id", verifyTokenAndAdmin, deleteUser);
router.delete("/name/:id", verifyTokenAndAuthorization, deleteNameUser);
router.get("/get/:id", getUser);
router.get("/:id/users", getUsersByRoom);
router.get("/type/", getUsersByType);
router.get("/", getAllUsers);
router.get("/stats", userStats);
router.post("/block", verifyTokenAndAction, blockUser);
router.post("/unblock", verifyTokenAndAction, unblockUser);

module.exports = router;
