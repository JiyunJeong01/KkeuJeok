const express = require('express'),
router = express.Router(),
homeController = require('../controllers/homeController');

router.get("/home", homeController.index);

module.exports = router;