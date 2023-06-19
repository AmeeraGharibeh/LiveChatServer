const router = require('express').Router();
const {verifyTokenAndAuthorization} = require('./verifyToken');
const {getBlockedUsers} = require('../Controllers/BlockedController')

router.get('/', getBlockedUsers );


module.exports = router;