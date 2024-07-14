const router = require("express").Router();
const {
  getAllNoticeReports,
  createNoticeReport,
  deleteNoticeReport,
} = require("../Controllers/NoticeController");
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.get("/", verifyTokenAndAuthorization, getAllNoticeReports);
router.post("/", createNoticeReport);
router.delete("/:id", verifyTokenAndAuthorization, deleteNoticeReport);
module.exports = router;
