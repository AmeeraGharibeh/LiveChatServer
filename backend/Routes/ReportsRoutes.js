const router = require("express").Router();
const { verifyTokenAndAction } = require("./verifyToken");
const { getAllReports } = require("../Controllers/ReportsController");

router.post("/:id", getAllReports);
module.exports = router;
