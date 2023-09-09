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
  updateUserProfile,
  addPhotoToAlbum,
  updateUserAlbum,
  getUserAlbum,
  getPicture,
  deletePicture,
  deleteUser,
  addComment,
  getUser,
  getUsersByRoom,
  getAllUsers,
  userStats,
  blockUser,
  unblockUser,
} = require("../Controllers/UsersController");
const { blockedMiddleware } = require("./BlockCheck");

router.post("/", verifyTokenAndAdmin, createUser);
router.post("/name", verifyTokenAndAuthorization, createName);
router.post("/login", blockedMiddleware, userLogin);
router.put("/:id", verifyTokenAndAdmin, updateUser);
router.put("/update/:id", updateUserProfile);
router.post("/album/", addPhotoToAlbum);
router.put("/album/:id", updateUserAlbum);
router.get("/album/:id", getUserAlbum);
router.get("/picture/:id", getPicture);
router.delete("/picture/:id", deletePicture);
router.put("/picture/comment/:id", addComment);
router.delete("/:id", verifyTokenAndAdmin, deleteUser);
router.get("/get/:id", getUser);
router.get("/:id/users", getUsersByRoom);
router.get("/", getAllUsers);
router.get("/stats", userStats);
router.post("/:id/block", verifyTokenAndAction, blockUser);
router.post("/:id/unblock", verifyTokenAndAction, unblockUser);

module.exports = router;
