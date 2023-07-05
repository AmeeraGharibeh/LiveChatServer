const router = require('express').Router();
const { search } = require('../Controllers/SearchController')

router.get('/', search);


module.exports = router;