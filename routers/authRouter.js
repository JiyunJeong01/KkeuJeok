const express = require('express'),
router = express.Router(),
authController = require('../controllers/authController');

router.get("/login", authController.loginPage);
router.post("/submit-login", authController.login);
router.get("/account", authController.accountPage);
router.post("/submit-account", authController.account);

module.exports = router;