const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');

router.get("/", memoController.memosLoading);
router.post("/memo",memoController.createMemo);
router.put("/memo/:memoId",memoController.modifiedMemo);
router.delete("/memo/:memoId",memoController.deleteMemo);

module.exports = router;