const express = require('express'),
router = express.Router(),
authController = require('../controllers/authController');

// errorwrapper 정의
const wrapAsyncController = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
  }

router.get("/login", wrapAsyncController(authController.loginPage));
router.post("/submit-login", wrapAsyncController(authController.login));
router.get("/logout", wrapAsyncController(authController.logout));

router.get("/account", wrapAsyncController(authController.accountPage));
router.post("/check-email", wrapAsyncController(authController.checkEmailDuplicate));
router.post("/auth-email", wrapAsyncController(authController.emailAuth));
router.post("/submit-account", wrapAsyncController(authController.account));

module.exports = router;