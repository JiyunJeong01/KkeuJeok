const express = require('express'),
router = express.Router(),
homeController = require('../controllers/homeController');

// errorwrapper 정의
const wrapAsyncController = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
  }

router.get("/", wrapAsyncController(homeController.index));

module.exports = router;