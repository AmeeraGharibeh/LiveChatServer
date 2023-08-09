const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("./verifyToken");
const {
  login,
  signup,
  updateAdmin,
  getAllAdmins,
} = require("../Controllers/AuthController");

router.post("/login", login);
router.post("/signup", verifyTokenAndAuthorization, signup);
router.put("/updateadmin/:id", verifyTokenAndAuthorization, updateAdmin);
router.get("/getadmins", getAllAdmins);

module.exports = router;
