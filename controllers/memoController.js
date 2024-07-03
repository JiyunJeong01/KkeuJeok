const MemoModel = require('../models/Memo');
const FileModel = require('../models/File');

module.exports = {
    memosLoading: async (req, res, next) => {
        try {
            const memos = await MemoModel.findAll();
            res.locals.memos = memos
            res.render('index');
        } catch (error) {
            console.error(error);
        }
    },

    memosLoadingUser: async (req, res, next) => {
        try {
            if (req.session.user) {
                const userId = req.session.user.id;
                const memos = await MemoModel.findByUserId(userId);
                res.locals.memos = memos
                res.render('index');
            } else {
                res.redirect('/home')
            }
        } catch (error) {
            console.error(error);
        }
    },

    createMemo: async (req, res, next) => {
        try {
            const userId = req.session.user ? req.session.user.id : 0;
            let { content, imgSources } = req.body;
            let memoId = await MemoModel.createMemo(userId, content);
            await FileModel.uploadFile(userId, memoId, imgSources);
            res.status(200).json({ message: "메모가 성공적으로 생성되었습니다." });
        } catch (error) {
            console.error(error);
        }
    },

    modifiedMemo: async (req, res, next) => {
        try {
            let memoId = req.params.memoId;
            let { content } = req.body;

            await MemoModel.modifiedMemo(memoId, content);

            res.status(200).json({ message: "메모가 성공적으로 수정되었습니다." });
        } catch (error) {
            console.error(error);
        }
    },

    deleteMemo: async (req, res, next) => {
        try {
            let memoId = req.params.memoId;
            await MemoModel.deleteMemo(memoId);
            res.status(200).json({ message: "메모가 성공적으로 삭제되었습니다." });
        } catch (error) {
            console.error(error);
        }
    },

    bookmarkMemo: async (req, res, next) => {
        try {
            let memoId = req.params.memoId;
            await MemoModel.bookmarkMemo(memoId);
            res.status(200).json({ message: "북마크 되었습니다." });
        } catch (error) {
            console.error(error);
        }
    },

    unBookmarkMemo: async (req, res, next) => {
        try {
            let memoId = req.params.memoId;
            await MemoModel.unBookmarkMemo(memoId);
            res.status(200).json({ message: "언북마크 되었습니다." });
        } catch (error) {
            console.error(error);
        }
    },

    bookmarksLoadingUser: async (req, res, next) => {
        try {
            if (req.session.user) {
                const userId = req.session.user.id;
                const memos = await MemoModel.findByUserIdAndBookmark(userId);
                res.locals.memos = memos
                res.render('bookmark');
            } else {
                res.redirect('/home')
            }
        } catch (error) {
            console.error(error);
        }
    },
}
