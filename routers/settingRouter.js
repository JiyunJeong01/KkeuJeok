const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

// errorwrapper 정의
const wrapAsyncController = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
  }

router.get("/", wrapAsyncController(settingController.loadSetting));
router.post("/change-password", wrapAsyncController(settingController.changePassword));
router.post("/delete-account", wrapAsyncController(settingController.deleteAccount));

module.exports = router;