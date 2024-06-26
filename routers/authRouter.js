const express = require('express'),
router = express.Router(),
authController = require('../controllers/authController');

router.get("/login", authController.loginPage);
router.post("/submit-login", authController.login);
router.get("/logout", authController.logout);

router.get("/account", authController.accountPage);
router.post("/check-email", authController.checkEmailDuplicate);
router.post("/auth-email", authController.emailAuth);
router.post("/submit-account", authController.account);

module.exports = router;