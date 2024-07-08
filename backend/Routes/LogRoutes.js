const router = require("express").Router();
const {
  verifyTokenAndAction,
  verifyTokenAndAuthorization,
} = require("./verifyToken");
const {
  getAllLogs,
  getLogsByRoom,
  getLogsByUserID,
  deleteAllLogs,
} = require("../Controllers/LogController");

router.post("/:id", getLogsByRoom);
router.get("/:id", getLogsByUserID);
router.get("/", verifyTokenAndAuthorization, getAllLogs);
router.delete("/:id", deleteAllLogs);

module.exports = router;
