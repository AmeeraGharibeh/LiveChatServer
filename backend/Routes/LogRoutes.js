const router = require('express').Router();
const {verifyTokenAndAction, verifyTokenAndAuthorization} = require('./verifyToken');
const {getAllLogs, getLogsByRoom, deleteAllLogs} = require('../Controllers/LogController')

router.post('/:id', verifyTokenAndAction, getLogsByRoom );
router.get('/', verifyTokenAndAuthorization, getAllLogs );
router.delete('/', verifyTokenAndAuthorization, deleteAllLogs );


module.exports = router;