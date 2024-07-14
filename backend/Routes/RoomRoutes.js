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
  getFavoritesRooms,
  getSpecialRooms,
} = require("../Controllers/RoomController");
const { createMasterUser } = require("./CreateMaster");

//router.post("/", verifyTokenAndAuthorization, createRoom);
router.post("/", verifyTokenAndAuthorization, createRoom, createMasterUser);
router.get("/search", searchRoom);
router.get("/favorites", getFavoritesRooms);
router.get("/", getAllRooms);
router.get("/special", getSpecialRooms);
router.get("/:id", getAllRoomsByCountry);
router.get("/room/:id", getRoom);
router.post("/reset/:id", verifyTokenAndAuthorization, resetRoom);
router.put("/:id", verifyTokenAndAction, updateRoom);
router.delete("/:id", verifyTokenAndAuthorization, deleteRoom);

module.exports = router;
