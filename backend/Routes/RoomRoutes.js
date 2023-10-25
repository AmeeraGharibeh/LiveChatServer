const router = require("express").Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAction,
} = require("./verifyToken");
const {
  createRoom,
  getAllRooms,
  getAllRoomsByCountry,
  getRoom,
  updateRoom,
  deleteRoom,
  resetRoom,
  searchRoom,
  getSpecialRooms,
} = require("../Controllers/RoomController");

router.post("/", verifyTokenAndAuthorization, createRoom);
router.get("/search", searchRoom);
router.get("/", getAllRooms);
router.get("/special", getSpecialRooms);
router.get("/:id", getAllRoomsByCountry);
router.get("/room/:id", getRoom);
router.post("/reset/:id", resetRoom);
router.put("/:id", verifyTokenAndAction, updateRoom);
router.delete("/:id", verifyTokenAndAuthorization, deleteRoom);

module.exports = router;
