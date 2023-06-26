const router = require('express').Router();
const {verifyTokenAndAction} = require('./verifyToken');
const {getAllLogs, getLogsByRoom} = require('../Controllers/LogController')

router.post('/:id', verifyTokenAndAction, getLogsByRoom );
router.get('/', verifyTokenAndAction, getAllLogs );

module.exports = router;