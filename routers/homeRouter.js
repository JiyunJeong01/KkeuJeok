const express = require('express'),
router = express.Router(),
homeController = require('../controllers/homeController');

router.get("/", homeController.index);

module.exports = router;