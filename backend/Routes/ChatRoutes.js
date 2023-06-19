const router = require('express').Router();
const {verifyTokenAndAdmin} = require('./verifyToken');
const {getPrivateChat, getRoomChat, deleteChat} = require('../Controllers/ChatController')

router.post('/privatechat/:id',  getPrivateChat);
router.get('/:id', getRoomChat);
router.delete('/:id', deleteChat)


module.exports = router;