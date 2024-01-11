const router = require("express").Router();
const { getImages, deleteImage } = require("../Controllers/ImagesController");
const { verifyTokenAndAuthorization } = require("./verifyToken");

router.get("/", getImages);
router.delete("/:id", verifyTokenAndAuthorization, deleteImage);

module.exports = router;
