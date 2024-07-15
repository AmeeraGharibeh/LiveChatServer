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
  updatePanelRoom,
  deleteRoom,
  resetRoom,
  searchRoom,
  getFavoritesRooms,
  getSpecialRooms,
  getSalesRoom,
  createSalesRoom,
} = require("../Controllers/RoomController");
const { createMasterUser } = require("./CreateMaster");

//router.post("/", verifyTokenAndAuthorization, createRoom);
router.post("/", verifyTokenAndAuthorization, createRoom, createMasterUser);
router.get("/search", searchRoom);
router.get("/favorites", getFavoritesRooms);
router.get("/", getAllRooms);
router.get("/sales", verifyTokenAndAuthorization, getSalesRoom);
router.post(
  "/sales",
  verifyTokenAndAuthorization,
  createSalesRoom,
  createMasterUser
);
router.get("/special", getSpecialRooms);
router.get("/:id", getAllRoomsByCountry);
router.get("/room/:id", getRoom);
router.post("/reset/:id", verifyTokenAndAuthorization, resetRoom);
router.put("/:id", verifyTokenAndAction, updateRoom);
router.put("/update/:id", verifyTokenAndAuthorization, updatePanelRoom);
router.delete("/:id", verifyTokenAndAuthorization, deleteRoom);

module.exports = router;
