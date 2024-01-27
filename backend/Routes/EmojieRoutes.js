const router = require("express").Router();
const {
  getEmojies,
  deleteEmojie,
  deleteEmojieByCategory,
  addEmojie,
} = require("../Controllers/EmojieController");
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.get("/", getEmojies);
router.delete("/:id", verifyTokenAndAuthorization, deleteEmojie);
router.delete(
  "/:category",
  verifyTokenAndAuthorization,
  deleteEmojieByCategory
);
router.post("/", verifyTokenAndAuthorization, addEmojie);

module.exports = router;
