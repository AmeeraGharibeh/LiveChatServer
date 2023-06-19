const router = require('express').Router();
const {verifyTokenAndAction} = require('./verifyToken');
const {getAllLogs} = require('../Controllers/LogController')

router.post('/:id', verifyTokenAndAction, getAllLogs );
module.exports = router;