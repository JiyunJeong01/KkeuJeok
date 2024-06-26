const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');

router.get("/", memoController.memosLoading);

module.exports = router;