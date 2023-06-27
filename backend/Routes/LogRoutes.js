const router = require('express').Router();
const {verifyTokenAndAction, verifyTokenAndAuthorization} = require('./verifyToken');
const {getAllLogs, getLogsByRoom} = require('../Controllers/LogController')

router.post('/:id', verifyTokenAndAction, getLogsByRoom );
router.get('/', verifyTokenAndAuthorization, getAllLogs );

module.exports = router;