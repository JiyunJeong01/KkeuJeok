const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');
const multer  = require('multer');
const upload = multer();

// errorwrapper 정의
const wrapAsyncController = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
  }

router.get("/", wrapAsyncController(memoController.memosLoadingUser));
router.post("/memo",upload.array('files', 5), wrapAsyncController(memoController.createMemo));
router.put("/memo/:memoId", wrapAsyncController(memoController.modifiedMemo));
router.delete("/memo/:memoId", wrapAsyncController(memoController.deleteMemo));
router.delete("/memo/:id/:index", wrapAsyncController(memoController.deleteImage));

router.get("/search", wrapAsyncController(memoController.searchMemo));

router.get("/bookmark", wrapAsyncController(memoController.bookmarksLoadingUser));
router.put("/bookmark/:memoId", wrapAsyncController(memoController.bookmarkMemo));
router.put("/un-bookmark/:memoId", wrapAsyncController(memoController.unBookmarkMemo));

module.exports = router;