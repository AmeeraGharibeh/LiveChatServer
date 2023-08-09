const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("./verifyToken");
const {
  login,
  signup,
  updateAdmin,
  getAllAdmins,
} = require("../Controllers/AuthController");
const { blockedMiddleware } = require("./BlockCheck");

router.post("/login", blockedMiddleware, login);
router.post("/signup", verifyTokenAndAuthorization, signup);
router.put("/updateadmin/:id", verifyTokenAndAuthorization, updateAdmin);
router.get("/getadmins", getAllAdmins);

module.exports = router;
