const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

router.get("/", settingController.loadSetting);
router.post("/change-password",settingController.changePassword);
router.post("/delete-account",settingController.deleteAccount);

module.exports = router;