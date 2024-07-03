const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');

router.get("/", memoController.memosLoadingUser);
router.post("/memo",memoController.createMemo);
router.put("/memo/:memoId",memoController.modifiedMemo);
router.delete("/memo/:memoId",memoController.deleteMemo);

router.get("/bookmark",memoController.bookmarksLoadingUser);
router.put("/bookmark/:memoId",memoController.bookmarkMemo);
router.put("/un-bookmark/:memoId",memoController.unBookmarkMemo);

module.exports = router;