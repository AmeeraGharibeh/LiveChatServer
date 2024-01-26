const router = require("express").Router();
const {
  getEmojies,
  deleteEmojie,
  addEmojie,
} = require("../Controllers/ImagesController");
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.get("/", getEmojies);
router.delete("/:id", verifyTokenAndAuthorization, deleteEmojie);
router.post("/", verifyTokenAndAuthorization, addEmojie);

module.exports = router;
