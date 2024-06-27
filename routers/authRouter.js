const express = require('express'),
router = express.Router(),
authController = require('../controllers/authController');

router.get("/login", authController.loginPage);
router.get("/account", authController.accountPage);

module.exports = router;