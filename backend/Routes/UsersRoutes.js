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
  blockUser,
  unblockUser,
} = require("../Controllers/UsersController");

router.post("/", verifyTokenAndAdmin, createUser);
router.post("/name", verifyTokenAndAuthorization, createName);
router.post("/login", userLogin);
router.put("/:id", verifyTokenAndAdmin, updateUser);
router.delete("/:id", verifyTokenAndAdmin, deleteUser);
router.get("/get/:id", getUser);
router.get("/", getAllUsers);
router.get("/stats", userStats);
router.post("/:id/block", verifyTokenAndAction, blockUser);
router.post("/:id/unblock", verifyTokenAndAction, unblockUser);

module.exports = router;
