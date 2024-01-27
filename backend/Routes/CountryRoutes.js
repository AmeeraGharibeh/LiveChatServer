const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("./verifyToken");
const {
  createCountry,
  getAllCountries,
  updateCountry,
  deleteCountry,
} = require("../Controllers/CountryController");

router.post("/", verifyTokenAndAuthorization, createCountry);
router.get("/", getAllCountries);
router.put("/:id", verifyTokenAndAuthorization, updateCountry);
router.delete("/:id", verifyTokenAndAuthorization, deleteCountry);

module.exports = router;
