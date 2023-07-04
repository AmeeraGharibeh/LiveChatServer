const router = require('express').Router();
const {verifyTokenAndAuthorization, verifyTokenAndAction} = require('./verifyToken');
const {createRoom, getAllRooms, getAllRoomsByCountry, getRoom,
     updateRoom, deleteRoom, searchRoom, getRoomUsers, getSpecialRooms} = require('../Controllers/RoomController')

router.post('/', verifyTokenAndAuthorization, createRoom );
router.get('/', getAllRooms );
router.get('/special', getSpecialRooms );
router.get('/:id', getAllRoomsByCountry );
router.get('/search', searchRoom );
router.get('/room/:id', getRoom );
router.get('/:id/users', getRoomUsers)
router.put('/:id', verifyTokenAndAction, updateRoom );
router.delete('/:id', verifyTokenAndAuthorization, deleteRoom );

module.exports = router;